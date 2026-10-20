import {validateBookRecord} from './book-storage.js';
// Browser storage on hosted Sites; SQLite through the loopback server locally.
// PDF bytes never enter this adapter. Every database write uses a revision.
export const DATA_KEYS=['fieldwork.progress.v1','fieldwork.wiki-code.v1','fieldwork.book-reader-open.v1'];
export const isStudyKey=key=>DATA_KEYS.includes(key)||/^fieldwork\.book-notes\.v1\.[a-f0-9]{64}$/.test(key);
const META='fieldwork.local-meta.v1', JOURNAL='fieldwork.local-pending.v1.', SESSION='fieldwork.local-window.v1';
const plain=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const safeParse=text=>{try{return JSON.parse(text);}catch{return null;}};
export function validateStudyValue(key,value){
 if(!isStudyKey(key))throw Error('Unknown study-data key.');
 if(value===null)return;
 if(typeof value!=='string'||new TextEncoder().encode(value).length>8*1024*1024)throw Error('Study record is too large.');
 if(key==='fieldwork.book-reader-open.v1'){
  if(!['open','closed'].includes(value))throw Error('Invalid reader preference.');
 }else{
  const record=safeParse(value);
  if(!plain(record))throw Error('Study records must contain JSON objects.');
  const safeKeys=object=>!Object.keys(object).some(key=>['__proto__','constructor','prototype'].includes(key));
  if(key==='fieldwork.progress.v1'){
   if(record.version!==1||!['lessons','labs','days'].every(name=>Array.isArray(record[name])&&record[name].every(x=>typeof x==='string'))||
      !['projects','notes','code','quiz'].every(name=>plain(record[name])&&safeKeys(record[name])&&Object.values(record[name]).every(value=>name==='projects'?typeof value==='boolean':name==='quiz'?Number.isInteger(value)&&value>=0&&value<=3:typeof value==='string')))throw Error('Invalid course-progress record.');
  }else if(key==='fieldwork.wiki-code.v1'){
   if(!safeKeys(record)||!Object.values(record).every(files=>plain(files)&&safeKeys(files)&&Object.values(files).every(code=>typeof code==='string'&&code.length<=100000)))throw Error('Invalid playground drafts.');
  }else{
   if(record.version!==1||key!=='fieldwork.book-notes.v1.'+record.bookId)throw Error('Invalid private book-note record.');
   validateBookRecord(record);
  }
 }
}

export function createStudyStorage({storage,session,href,fetcher=globalThis.fetch?.bind(globalThis),id=globalThis.crypto?.randomUUID?.()||String(Date.now()),onChange=()=>{}}={}){
 const local=['localhost','127.0.0.1','[::1]'].includes(new URL(href||'https://example.invalid').hostname);
 const memory=new Map(),revisions=new Map(),pending=new Map(),conflicts=new Map();
 let mode='browser',databaseId=null,databasePath='',token='',error='',busy=null,initialized=false,blocked=false,journalUnavailable=false,hydrated=false;
 const listeners=new Set([onChange]);
 // A duplicated tab inherits sessionStorage. Give every loaded document a new
 // outbox, retaining its predecessor as recovery rather than sharing a writer.
 let previousWindow;
 try{previousWindow=session?.getItem(SESSION);session?.setItem(SESSION,id);}catch{}
 const journalKey=JOURNAL+id;
 function emit(){for(const fn of listeners){try{fn(status());}catch{}}}
 function keys(){try{return Array.from({length:storage?.length||0},(_,i)=>storage.key(i)).filter(Boolean);}catch{return [];}}
 for(const key of keys())if(isStudyKey(key)){try{memory.set(key,storage.getItem(key));}catch{}}
 function read(key){try{return storage?.getItem(key)??null;}catch{return null;}}
 function write(key,value){if(!storage)throw Error('Browser storage unavailable');if(value===null)storage.removeItem(key);else storage.setItem(key,value);}
 function cache(key,value){if(value===null)memory.delete(key);else memory.set(key,value);try{write(key,value);}catch{}}
 function rememberMeta(){try{write(META,JSON.stringify({databaseId,revisions:Object.fromEntries(revisions)}));}catch{}}
 function journal(){
  try{
   write(journalKey,pending.size?JSON.stringify({databaseId,updatedAt:new Date().toISOString(),pending:Object.fromEntries(pending)}):null);
   journalUnavailable=false;
  }catch{journalUnavailable=true;}
 }
 function otherRecoveries(){
  return keys().filter(key=>key.startsWith(JOURNAL)&&key!==journalKey).flatMap(key=>{
   const data=safeParse(read(key));
   if(!plain(data?.pending)||!Object.keys(data.pending).length)return [];
   return [{id:key,updatedAt:data.updatedAt||'',sameDatabase:data.databaseId===databaseId,count:Object.keys(data.pending).length}];
  });
 }
 function status(){
  return {mode,local,databaseId,databasePath,pending:pending.size,conflicts:[...conflicts.keys()],blocked,error,journalUnavailable,needsReload:mode==='local'&&!hydrated&&!error&&!blocked,recoveries:otherRecoveries()};
 }
 function label(){
  if(mode==='browser')return local?'Browser storage · static preview':'Saved in this browser';
  if(blocked)return 'Choose a database before saving';
  if(conflicts.size)return 'Save conflict · your changes are kept in this window';
  if(error)return 'Database unavailable · changes waiting to save';
  if(pending.size)return journalUnavailable?'Saving · keep this window open':'Saving to local database…';
  if(!hydrated)return 'Database connected · reload to restore all saved data';
  return 'Saved to local database';
 }
 async function request(path,options={}){
  const response=await fetcher('/api/local/'+path,{...options,cache:'no-store',credentials:'same-origin',signal:AbortSignal.timeout(6000),headers:{...(options.body?{'Content-Type':'application/json'}:{}),'x-fieldwork-token':token,...options.headers}});
  if(!(response.headers.get('content-type')||'').includes('application/json'))throw Error('The local database did not return JSON. Check the Fieldwork server.');
  const result=await response.json();
  return {response,result};
 }
 function validSnapshot(snapshot){
  if(snapshot?.format!=='fieldwork-local-v1'||typeof snapshot.databaseId!=='string'||typeof snapshot.token!=='string'||!plain(snapshot.records))throw Error('Unsupported local database response.');
  for(const [key,record] of Object.entries(snapshot.records)){
   validateStudyValue(key,record.value);
   if(!Number.isSafeInteger(record.revision)||record.revision<1)throw Error('Invalid database revision.');
  }
  return snapshot;
 }
 async function snapshot(){
  const {response,result}=await request('status');
  if(!response.ok)throw Error(result.error||'The local database could not open.');
  return validSnapshot(result);
 }
 async function initialize(){
  if(initialized)return status();initialized=true;
  if(!local){emit();return status();}
  mode='local';
  const meta=safeParse(read(META));
  databaseId=meta?.databaseId||null;
  for(const [key,revision] of Object.entries(meta?.revisions||{}))if(isStudyKey(key)&&Number.isSafeInteger(revision))revisions.set(key,revision);
  const saved=safeParse(read(previousWindow?JOURNAL+previousWindow:journalKey));
  if(plain(saved?.pending)){
   databaseId=saved.databaseId||databaseId;
   for(const [key,entry] of Object.entries(saved.pending)){
    try{validateStudyValue(key,entry.value);if(!Number.isSafeInteger(entry.revision)||entry.revision<0)continue;pending.set(key,entry);cache(key,entry.value);}catch{}
   }
  }
  // Preserve the outbox under this document's ID even if bootstrap is offline.
  if(pending.size)journal();
  try{
   const response=await fetcher('/api/local/status',{cache:'no-store',credentials:'same-origin',signal:AbortSignal.timeout(6000)});
   if(response.status===404){
    if(databaseId||pending.size)throw Error('Start the database server with npm start to resume saving.');
    mode='browser';emit();return status();
   }
   if(!response.ok)throw Error('The local database could not open.');
   const server=validSnapshot(await response.json());
   token=server.token;databasePath=server.databasePath;
   if(databaseId&&databaseId!==server.databaseId){
    blocked=true;error='This server uses a different database. Export this window before switching data folders.';emit();return status();
   }
   databaseId=server.databaseId;
   for(const key of new Set([...memory.keys(),...Object.keys(server.records),...pending.keys()])){
    const record=server.records[key]||{value:null,revision:0};
    revisions.set(key,record.revision);
    if(pending.has(key)){
     const entry=pending.get(key);
     if(entry.value===record.value){pending.delete(key);cache(key,record.value);}
     else if(entry.revision!==record.revision)conflicts.set(key,record);
    }else if(record.revision){
     // Browser data predating SQLite gets a visible choice if the DB has data too.
     if(!meta?.databaseId&&memory.has(key)&&memory.get(key)!==record.value){
      pending.set(key,{value:memory.get(key),revision:0});conflicts.set(key,record);
     }else cache(key,record.value);
    }else if(memory.has(key)){
     validateStudyValue(key,memory.get(key));
     pending.set(key,{value:memory.get(key),revision:0});
    }
   }
   hydrated=true;rememberMeta();journal();emit();await flush();
  }catch(e){error=e.message;emit();}
  return status();
 }
 function setItem(key,value){
  value=String(value);validateStudyValue(key,value);
  if(mode==='browser'){write(key,value);memory.set(key,value);emit();return;}
  if(blocked)throw Error('The data folder changed. Export this window and choose the database first.');
  const revision=pending.get(key)?.revision??revisions.get(key)??0;
  pending.set(key,{value,revision});cache(key,value);journal();emit();
  void flush();
 }
 function removeItem(key){
  validateStudyValue(key,null);
  if(mode==='browser'){write(key,null);memory.delete(key);emit();return;}
  if(blocked)throw Error('Choose the database before changing saved data.');
  pending.set(key,{value:null,revision:pending.get(key)?.revision??revisions.get(key)??0});cache(key,null);journal();emit();void flush();
 }
 async function flush(){
  if(mode!=='local'||blocked)return false;
  if(busy)return busy;
  busy=(async()=>{
   try{
    if(!token||error){
     const server=await snapshot();
     if(databaseId&&databaseId!==server.databaseId){blocked=true;throw Error('The server data folder changed. Export this window before switching.');}
     databaseId=server.databaseId;databasePath=server.databasePath;token=server.token;
    }
    error='';
    for(const [key] of pending){
     if(conflicts.has(key))continue;
     const sent=pending.get(key);
     const {response,result}=await request('record',{method:'PUT',body:JSON.stringify({key,...sent})});
     if(response.status===409){
      const record=result.record;
      if(record?.value===sent.value){
       revisions.set(key,record.revision);
       if(pending.get(key)===sent)pending.delete(key);else pending.get(key).revision=record.revision;
      }else conflicts.set(key,record);
     }else{
      if(!response.ok)throw Error(result.error||'The database could not save your change.');
      if(!Number.isSafeInteger(result.revision))throw Error('The database did not confirm the save.');
      revisions.set(key,result.revision);
      if(pending.get(key)===sent)pending.delete(key);else pending.get(key).revision=result.revision;
     }
     rememberMeta();journal();emit();
    }
   }catch(e){error=e.message;}
   finally{emit();}
   return !pending.size&&!error;
  })();
  let result;
  try{result=await busy;}finally{busy=null;}
  // A newer edit can arrive while the previous value is being committed.
  if(!error&&!blocked&&[...pending.keys()].some(key=>!conflicts.has(key)))return flush();
  return result;
 }
 async function resolveConflict(key,choice){
  if(!conflicts.has(key))return;
  const server=await snapshot();
  if(server.databaseId!==databaseId)throw Error('The database changed. Reload after exporting this window.');
  token=server.token;
  const record=server.records[key]||{value:null,revision:0};
  if(choice==='database'){cache(key,record.value);pending.delete(key);}
  else if(choice==='window')pending.get(key).revision=record.revision;
  else throw Error('Choose this window or the database.');
  revisions.set(key,record.revision);conflicts.delete(key);rememberMeta();journal();emit();
  if(choice==='window')await flush();
 }
 function exportWindow(){
  return {format:'fieldwork-local-backup',version:1,exportedAt:new Date().toISOString(),records:Object.fromEntries(memory)};
 }
 function recovery(id){
  const data=safeParse(read(id));if(!id.startsWith(JOURNAL)||!plain(data?.pending))throw Error('Recovery copy is unavailable.');
  const records={};
  for(const [key,entry] of Object.entries(data.pending)){validateStudyValue(key,entry.value);records[key]=entry.value;}
  return {format:'fieldwork-local-backup',version:1,exportedAt:data.updatedAt,records};
 }
 function importRecords(backup){
  if(backup?.format!=='fieldwork-local-backup'||backup.version!==1||!plain(backup.records))throw Error('Choose a Fieldwork all-data backup.');
  const entries=Object.entries(backup.records);
  if(entries.length>1000||new TextEncoder().encode(JSON.stringify(backup)).length>64*1024*1024)throw Error('Backup is too large.');
  for(const [key,value] of entries)validateStudyValue(key,value);
  if(mode==='local'&&blocked)throw Error('Choose the database first.');
  // Preserve the prior window in a separate recovery copy before replacing entries.
  write(JOURNAL+'before-import-'+id,JSON.stringify({databaseId,updatedAt:new Date().toISOString(),pending:Object.fromEntries([...memory].map(([key,value])=>[key,{value,revision:revisions.get(key)||0}]))}));
  if(mode==='local'){
   const next=new Map(pending);
   for(const [key,value] of entries)next.set(key,{value,revision:pending.get(key)?.revision??revisions.get(key)??0});
   // Import must be recoverable before replacing the live state or reloading.
   write(journalKey,JSON.stringify({databaseId,updatedAt:new Date().toISOString(),pending:Object.fromEntries(next)}));
   for(const [key,entry] of next)pending.set(key,entry);
   for(const [key,value] of entries)cache(key,value);
   journalUnavailable=false;emit();void flush();
  }else{
   const previous=new Map(entries.map(([key])=>[key,read(key)]));
   try{for(const [key,value] of entries){write(key,value);if(value===null)memory.delete(key);else memory.set(key,value);}}
   catch{
    let failed=false;for(const [key,value] of previous){try{write(key,value);if(value===null)memory.delete(key);else memory.set(key,value);}catch{failed=true;}}
    throw Error(failed?'Import partly failed. Export the before-import recovery copy; browser storage is full.':'Import could not fit in browser storage. Previous records were restored.');
   }
   emit();
  }
 }
 return {
  initialize,getItem:key=>{
   if(!initialized||mode==='browser'){
    const value=read(key);if(value===null)memory.delete(key);else memory.set(key,value);
    return value;
   }
   return memory.get(key)??null;
  },setItem,removeItem,
  status,label,flush,resolveConflict,exportWindow,importRecords,recovery,
  subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);},
  async useDatabase(){
   const server=await snapshot();
   // Keep the old window recoverable even after a deliberate folder switch.
   write(JOURNAL+'before-switch-'+id,JSON.stringify({databaseId,updatedAt:new Date().toISOString(),pending:Object.fromEntries([...memory].map(([key,value])=>[key,{value,revision:revisions.get(key)||0}]))}));
   for(const key of memory.keys())cache(key,null);
   pending.clear();conflicts.clear();revisions.clear();
   databaseId=server.databaseId;databasePath=server.databasePath;token=server.token;
   for(const [key,record] of Object.entries(server.records)){cache(key,record.value);revisions.set(key,record.revision);}
   blocked=false;error='';hydrated=true;rememberMeta();journal();emit();
  },
  async exportDatabase(){
   if(mode!=='local')return exportWindow();
   await flush();const {response,result}=await request('backup');
   if(!response.ok)throw Error(result.error||'Could not export the database.');
   return result;
  }
 };
}
const browserStorage=()=>{try{return globalThis.localStorage;}catch{return undefined;}};
const tabStorage=()=>{try{return globalThis.sessionStorage;}catch{return undefined;}};
export const studyStorage=createStudyStorage({storage:browserStorage(),session:tabStorage(),href:globalThis.location?.href});
