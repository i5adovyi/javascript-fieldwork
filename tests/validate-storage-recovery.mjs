import assert from 'node:assert/strict';
import {createStudyStorage} from '../dist/study-storage.js';

const KEY='fieldwork.progress.v1';
const DRAFTS='fieldwork.wiki-code.v1';
const value=note=>JSON.stringify({version:1,lessons:[],labs:[],projects:{},notes:{general:note},code:{},quiz:{},lastLesson:'lesson-01',days:[],goal:4});
function memoryStorage(initial={}){
 const values=new Map(Object.entries(initial));
 return {
  get length(){return values.size;},
  key:index=>[...values.keys()][index]??null,
  getItem:key=>values.get(key)??null,
  setItem:(key,value)=>values.set(key,String(value)),
  removeItem:key=>values.delete(key),
  entries:()=>Object.fromEntries(values)
 };
}
function server(records={}){
 const state={databaseId:'test-db',token:'test-token',records:structuredClone(records),online:true,loseNextReply:false,puts:0};
 const response=(status,body)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json'}});
 state.fetch=async(path,options={})=>{
  if(!state.online)throw Error('Server stopped');
  if(path.endsWith('/status'))return response(200,{format:'fieldwork-local-v1',databaseId:state.databaseId,databasePath:'/private/test/fieldwork.sqlite',token:state.token,records:structuredClone(state.records)});
  if(path.endsWith('/record')){
   if(options.headers?.['x-fieldwork-token']!==state.token)return response(403,{error:'Expired local token'});
   const {key,value,revision}=JSON.parse(options.body),prior=state.records[key]||{value:null,revision:0};
   state.puts++;
   if(prior.revision!==revision)return response(409,{record:prior});
   state.records[key]={value,revision:revision+1};
   if(state.loseNextReply){state.loseNextReply=false;throw Error('Save reply was lost');}
   return response(200,{revision:revision+1});
  }
  throw Error('Unexpected test request: '+path);
 };
 return state;
}
function client(backend,{storage=memoryStorage(),session=memoryStorage(),id='window-a',href='http://localhost:4187/'}={}){
 const app=createStudyStorage({storage,session,id,href,fetcher:backend.fetch});
 return {app,storage,session};
}

const checks=[];
function check(name,fn){checks.push([name,fn]);}
check('first edit after empty database initialization is committed',async()=>{
 const backend=server(),{app}=client(backend);
 await app.initialize();
 app.setItem(KEY,value('first edit'));await app.flush();
 assert.equal(backend.records[KEY]?.value,value('first edit'));
 assert.equal(app.status().pending,0);
});
check('queued edits survive reload while the local server is stopped',async()=>{
 const backend=server({[KEY]:{value:value('old'),revision:1}}),first=client(backend);
 await first.app.initialize();backend.online=false;
 first.app.setItem(KEY,value('offline edit'));await first.app.flush();
 assert.equal(first.app.status().pending,1);
 const restarted=client(backend,{storage:first.storage,session:first.session,id:'new-document'});
 await restarted.app.initialize();
 assert.equal(restarted.app.getItem(KEY),value('offline edit'));
 backend.online=true;assert.equal(await restarted.app.flush(),true);
 assert.equal(backend.records[KEY].value,value('offline edit'));
});
check('queued edits survive repeated reloads while the server stays stopped',async()=>{
 const backend=server({[KEY]:{value:value('old'),revision:1}}),first=client(backend);
 await first.app.initialize();backend.online=false;
 first.app.setItem(KEY,value('offline through two reloads'));await first.app.flush();
 const second=client(backend,{storage:first.storage,session:first.session,id:'window-b'});
 await second.app.initialize();
 const third=client(backend,{storage:first.storage,session:first.session,id:'window-c'});
 await third.app.initialize();
 assert.equal(third.app.status().pending,1);
 assert.equal(third.app.getItem(KEY),value('offline through two reloads'));
 backend.online=true;await third.app.flush();
 assert.equal(backend.records[KEY].value,value('offline through two reloads'));
});
check('duplicated browser tabs keep separate pending journals',async()=>{
 const backend=server({[KEY]:{value:value('old'),revision:1}}),first=client(backend);
 await first.app.initialize();
 const duplicate=client(backend,{storage:first.storage,session:memoryStorage(first.session.entries()),id:'duplicate-window'});
 await duplicate.app.initialize();backend.online=false;
 first.app.setItem(KEY,value('original tab draft'));await first.app.flush();
 duplicate.app.setItem(KEY,value('duplicated tab draft'));await duplicate.app.flush();
 const originalReloaded=client(backend,{storage:first.storage,session:first.session,id:'original-reloaded'});
 await originalReloaded.app.initialize();
 const duplicateReloaded=client(backend,{storage:first.storage,session:duplicate.session,id:'duplicate-reloaded'});
 await duplicateReloaded.app.initialize();
 assert.equal(originalReloaded.app.getItem(KEY),value('original tab draft'));
 assert.equal(duplicateReloaded.app.getItem(KEY),value('duplicated tab draft'));
});
check('lost save acknowledgements do not overwrite a successful commit on reload',async()=>{
 const backend=server({[KEY]:{value:value('old'),revision:1}}),first=client(backend);
 await first.app.initialize();backend.loseNextReply=true;
 first.app.setItem(KEY,value('saved without reply'));await first.app.flush();
 assert.equal(first.app.status().pending,1);
 const restarted=client(backend,{storage:first.storage,session:first.session,id:'new-document'});
 await restarted.app.initialize();
 assert.equal(restarted.app.status().pending,0);
 assert.equal(restarted.app.getItem(KEY),value('saved without reply'));
 assert.equal(backend.records[KEY].revision,2);
});
check('stale windows retain their edits and require an explicit conflict decision',async()=>{
 const backend=server({[KEY]:{value:value('original'),revision:1}});
 const a=client(backend),b=client(backend,{id:'window-b'});
 await a.app.initialize();await b.app.initialize();
 a.app.setItem(KEY,value('window A'));await a.app.flush();
 b.app.setItem(KEY,value('window B'));await b.app.flush();
 assert.equal(backend.records[KEY].value,value('window A'));
 assert.equal(b.app.getItem(KEY),value('window B'));
 assert.deepEqual(b.app.status().conflicts,[KEY]);
 const restarted=client(backend,{storage:b.storage,session:b.session,id:'new-document'});
 await restarted.app.initialize();assert.deepEqual(restarted.app.status().conflicts,[KEY]);
 await restarted.app.resolveConflict(KEY,'database');
 assert.equal(restarted.app.getItem(KEY),value('window A'));
 assert.equal(restarted.app.status().pending,0);
});
check('changing the data directory blocks queued writes without erasing them',async()=>{
 const backend=server({[KEY]:{value:value('original'),revision:1}}),first=client(backend);
 await first.app.initialize();backend.online=false;
 first.app.setItem(KEY,value('pending'));await first.app.flush();
 backend.databaseId='different-db';backend.records={};backend.online=true;
 const restarted=client(backend,{storage:first.storage,session:first.session,id:'new-document'});
 await restarted.app.initialize();
 assert.equal(restarted.app.status().blocked,true);
 assert.equal(restarted.app.getItem(KEY),value('pending'));
 assert.equal(await restarted.app.flush(),false);
 assert.deepEqual(backend.records,{});
});
check('hosted draft reads preserve another tab’s unrelated examples',async()=>{
 const backend=server(),storage=memoryStorage({[DRAFTS]:JSON.stringify({first:{'example.js':'initial'}})});
 const {app}=client(backend,{storage,href:'https://learning.example/'});
 await app.initialize();
 storage.setItem(DRAFTS,JSON.stringify({first:{'example.js':'initial'},second:{'example.js':'another tab'}}));
 const drafts=JSON.parse(app.getItem(DRAFTS));drafts.first={'example.js':'this tab'};
 app.setItem(DRAFTS,JSON.stringify(drafts));
 assert.equal(JSON.parse(storage.getItem(DRAFTS)).second?.['example.js'],'another tab');
});
check('invalid all-data backup cannot partially change the window',async()=>{
 const backend=server({[KEY]:{value:value('original'),revision:1}}),{app}=client(backend);
 await app.initialize();
 assert.throws(()=>app.importRecords({format:'fieldwork-local-backup',version:1,records:{[KEY]:value('changed'),'unrecognized.private.key':'{}'}}));
 assert.equal(app.getItem(KEY),value('original'));
 assert.equal(backend.records[KEY].value,value('original'));
});
check('offline all-data imports survive the reload needed to refresh application state',async()=>{
 const backend=server({[KEY]:{value:value('original'),revision:1}}),first=client(backend);
 await first.app.initialize();backend.online=false;
 const importedDrafts=JSON.stringify({topic:{'example.js':'console.log("restored")'}});
 first.app.importRecords({format:'fieldwork-local-backup',version:1,records:{[KEY]:value('imported'),[DRAFTS]:importedDrafts}});
 await first.app.flush();
 const restarted=client(backend,{storage:first.storage,session:first.session,id:'after-import'});
 await restarted.app.initialize();
 assert.equal(restarted.app.getItem(KEY),value('imported'));
 assert.equal(restarted.app.getItem(DRAFTS),importedDrafts);
 backend.online=true;await restarted.app.flush();
 assert.equal(backend.records[KEY].value,value('imported'));
 assert.equal(backend.records[DRAFTS].value,importedDrafts);
});
check('all-data import refuses to replace memory if its recovery journal cannot persist',async()=>{
 const backend=server({[KEY]:{value:value('original'),revision:1}});
 const storage=memoryStorage(),nativeSet=storage.setItem;
 let blockJournal=false;
 storage.setItem=(key,value)=>{
  if(blockJournal&&key==='fieldwork.local-pending.v1.window-a')throw Error('Quota exceeded');
  nativeSet(key,value);
 };
 const {app}=client(backend,{storage});await app.initialize();blockJournal=true;
 assert.throws(()=>app.importRecords({format:'fieldwork-local-backup',version:1,records:{[KEY]:value('imported')}}),/Quota/);
 assert.equal(app.getItem(KEY),value('original'));
 assert.equal(backend.records[KEY].value,value('original'));
 assert.equal(app.status().pending,0);
});
check('retry after a failed initial connection requests hydration before claiming saved data',async()=>{
 const backend=server({[KEY]:{value:value('saved in database'),revision:1}});backend.online=false;
 const {app}=client(backend);await app.initialize();
 backend.online=true;await app.flush();
 assert.equal(app.status().needsReload,true);
 assert.match(app.label(),/reload/i);
});

let failures=0;
for(const [name,fn] of checks){
 try{await fn();console.log('PASS '+name);}
 catch(error){failures++;console.error('FAIL '+name+'\n'+error.stack);}
}
if(failures)process.exitCode=1;
else console.log(`Storage recovery checks passed: ${checks.length} restart, conflict, identity, and backup scenarios.`);
