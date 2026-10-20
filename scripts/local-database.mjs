import {homedir} from 'node:os';
import {resolve,join,sep} from 'node:path';
import {mkdir,chmod,realpath,lstat} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';

export const DATABASE_FORMAT='fieldwork-local-v1';
export const MAX_RECORD_BYTES=8*1024*1024;
export const MAX_DATABASE_BYTES=64*1024*1024;
export const MAX_REQUEST_BYTES=16*1024*1024+65536;
const MAX_RECORDS=10000;
const APPLICATION_ID=0x46574b31;
const SIMPLE_KEYS=new Set(['fieldwork.progress.v1','fieldwork.wiki-code.v1','fieldwork.book-reader-open.v1']);
const BOOK_KEY=/^fieldwork\.book-notes\.v1\.[a-fA-F0-9]{64}$/;

export class LocalDataError extends Error{
 constructor(message,status=400){super(message);this.name='LocalDataError';this.status=status;}
}

export function defaultDataDirectory({env=process.env,platform=process.platform,home=homedir()}={}){
 if(env.FIELDWORK_DATA_DIR)return resolve(env.FIELDWORK_DATA_DIR);
 if(platform==='darwin')return join(home,'Library','Application Support','JavaScript Fieldwork');
 if(platform==='win32')return join(env.LOCALAPPDATA||join(home,'AppData','Local'),'JavaScript Fieldwork');
 return join(env.XDG_DATA_HOME||join(home,'.local','share'),'javascript-fieldwork');
}

export function isRecordKey(key){return typeof key==='string'&&(SIMPLE_KEYS.has(key)||BOOK_KEY.test(key));}
export function validateRecordInput(input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw new LocalDataError('The request must be a JSON object.');
 if(Object.keys(input).some(key=>!['key','value','revision'].includes(key)))throw new LocalDataError('The request contains an unknown field.');
 const {key,value,revision}=input;
 if(!isRecordKey(key))throw new LocalDataError('Unknown local data key.');
 if(!Number.isSafeInteger(revision)||revision<0||revision===Number.MAX_SAFE_INTEGER)throw new LocalDataError('revision must be a non-negative safe integer.');
 if(value!==null&&typeof value!=='string')throw new LocalDataError('value must be text or null.');
 if(value!==null){
  if(Buffer.byteLength(value,'utf8')>MAX_RECORD_BYTES)throw new LocalDataError('A local record cannot exceed 8 MiB.',413);
  if(key==='fieldwork.book-reader-open.v1'){
   if(value!=='open'&&value!=='closed')throw new LocalDataError('The reader preference must be open or closed.');
  }else{
   let parsed;try{parsed=JSON.parse(value);}catch{throw new LocalDataError('The record value must contain valid JSON.');}
   if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))throw new LocalDataError('The record value must contain a JSON object.');
  }
 }
 return {key,value,revision};
}

function inside(path,directory){return path===directory||path.startsWith(directory+sep);}
async function securePermissions(path,mode){
 try{await chmod(path,mode);}catch(error){if(process.platform!=='win32'||!['EPERM','ENOSYS','ENOTSUP'].includes(error.code))throw error;}
}

export async function openLocalDatabase({dataDirectory=defaultDataDirectory(),staticDirectory}={}){
 const version=process.versions.node.split('.').map(Number);
 if(version[0]<22||(version[0]===22&&version[1]<13))throw new Error('Local SQLite storage requires Node.js 22.13 or newer. Upgrade Node.js, or use npm run start:static for a browser-storage-only preview.');
 let DatabaseSync;
 try{({DatabaseSync}=await import('node:sqlite'));}catch{throw new Error('This Node.js runtime does not provide SQLite. Install Node.js 22.13 or newer, or use npm run start:static for a browser-storage-only preview.');}
 const requestedDirectory=resolve(dataDirectory);
 const staticPath=staticDirectory?await realpath(resolve(staticDirectory)):null;
 if(staticPath&&inside(requestedDirectory,staticPath))throw new Error('FIELDWORK_DATA_DIR must be outside the published dist directory. Choose a private folder.');
 await mkdir(requestedDirectory,{recursive:true,mode:0o700});
 const directory=await realpath(requestedDirectory);
 if(staticPath&&inside(directory,staticPath))throw new Error('FIELDWORK_DATA_DIR resolves inside the published dist directory. Choose a private folder.');
 await securePermissions(directory,0o700);
 const databasePath=join(directory,'fieldwork.sqlite');
 try{
  const fileInfo=await lstat(databasePath);
  if(fileInfo.isSymbolicLink()||!fileInfo.isFile())throw new Error('The local database path must be a regular file, not a symbolic link or directory.');
 }catch(error){if(error.code!=='ENOENT')throw error;}
 let db;
 try{
  // SQLite's journal files contain private data too. A restrictive umask protects
  // creation before chmod and all WAL/SHM files created by this connection.
  const previousMask=process.umask(0o077);
  try{db=new DatabaseSync(databasePath);}finally{process.umask(previousMask);}
  await securePermissions(databasePath,0o600);
  db.exec('PRAGMA busy_timeout=5000;');
  const applicationId=db.prepare('PRAGMA application_id').get().application_id;
  const tableCount=db.prepare("SELECT count(*) AS count FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").get().count;
  if(applicationId!==APPLICATION_ID&&(applicationId!==0||tableCount>0))throw new Error('The selected database is not a JavaScript Fieldwork database. Choose another FIELDWORK_DATA_DIR.');
  const schemaVersion=db.prepare('PRAGMA user_version').get().user_version;
  if(schemaVersion>1)throw new Error(`This database uses schema version ${schemaVersion}. Update Fieldwork before opening it.`);
  db.exec('PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; BEGIN IMMEDIATE;');
  try{
   db.exec(`CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS records (key TEXT PRIMARY KEY, value TEXT, revision INTEGER NOT NULL CHECK(revision > 0), updated_at TEXT NOT NULL);
    PRAGMA application_id=${APPLICATION_ID}; PRAGMA user_version=1;`);
   const insertMeta=db.prepare('INSERT OR IGNORE INTO metadata(key,value) VALUES(?,?)');
   insertMeta.run('database_id',randomUUID());insertMeta.run('schema_version','1');
   db.exec('COMMIT;');
  }catch(error){db.exec('ROLLBACK;');throw error;}
  // SQLite usually inherits permissions from the main database, but explicitly
  // tighten existing journal files as well (including databases moved by hand).
  for(const suffix of ['-wal','-shm'])try{await securePermissions(databasePath+suffix,0o600);}catch(error){if(error.code!=='ENOENT')throw error;}
  const databaseId=db.prepare("SELECT value FROM metadata WHERE key='database_id'").get()?.value;
  if(typeof databaseId!=='string'||!databaseId)throw new Error('The local database has no identity. Restore a trusted backup or choose another FIELDWORK_DATA_DIR.');
  const select=db.prepare('SELECT value,revision FROM records WHERE key=?');
  const list=db.prepare('SELECT key,value,revision FROM records ORDER BY key');
  const totals=db.prepare('SELECT count(*) AS count,coalesce(sum(length(CAST(key AS BLOB))+coalesce(length(CAST(value AS BLOB)),0)),0) AS bytes FROM records');
  const upsert=db.prepare('INSERT INTO records(key,value,revision,updated_at) VALUES(?,?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,revision=excluded.revision,updated_at=excluded.updated_at');
  function records(){return Object.fromEntries(list.all().map(({key,value,revision})=>[key,{value,revision}]));}
  return {
   databaseId,databasePath,
   status(){return {format:DATABASE_FORMAT,databaseId,databasePath,records:records()};},
   put(input){
    const {key,value,revision}=validateRecordInput(input);
    db.exec('BEGIN IMMEDIATE;');
    try{
     const existing=select.get(key),record=existing?{value:existing.value,revision:existing.revision}:{value:null,revision:0};
     if(record.revision!==revision){db.exec('ROLLBACK;');return {conflict:true,record};}
     const usage=totals.get();
     if(!existing&&usage.count>=MAX_RECORDS)throw new LocalDataError('The local database contains too many records. Export a backup before starting a new data directory.',413);
     const oldBytes=existing?(existing.value===null?0:Buffer.byteLength(existing.value,'utf8')):0;
     const newBytes=value===null?0:Buffer.byteLength(value,'utf8');
     if(usage.bytes-oldBytes+newBytes+(existing?0:Buffer.byteLength(key,'utf8'))>MAX_DATABASE_BYTES)throw new LocalDataError('Local saved data cannot exceed 64 MiB. Export a backup and reduce saved drafts or notes.',413);
     const nextRevision=revision+1;
     upsert.run(key,value,nextRevision,new Date().toISOString());db.exec('COMMIT;');
     return {revision:nextRevision};
    }catch(error){try{db.exec('ROLLBACK;');}catch{}throw error;}
   },
   backup(){return {format:'fieldwork-local-backup',version:1,records:Object.fromEntries(list.all().filter(record=>record.value!==null).map(({key,value})=>[key,value])),exportedAt:new Date().toISOString()};},
   close(){if(db){db.close();db=null;}}
  };
 }catch(error){try{db?.close();}catch{}throw error;}
}
