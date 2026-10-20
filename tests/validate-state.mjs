import vm from 'node:vm';
import assert from 'node:assert/strict';
import {lessonExamples} from '../dist/lesson-playgrounds.js';
import {readFile} from 'node:fs/promises';
const app=await readFile(new URL('../dist/app.js',import.meta.url),'utf8');
const boot=app.slice(app.indexOf('const KEY='),app.indexOf('let wikiUI,data,'));
const saveSource=app.slice(app.indexOf('const save='),app.indexOf('const activity='));
const activitySource=app.slice(app.indexOf('const activity='),app.indexOf('function toast('));
const backupSource=app.slice(app.indexOf('function filterWikiDrafts('),app.indexOf('\nfunction modal('));
assert.ok(boot.includes('let state='),'Locate the live persistence initializer');
for(const stored of ['{broken','null',JSON.stringify({version:1,lessons:null,labs:'bad',notes:{valid:'kept',invalid:42},quiz:{a:100},days:[42]})]){
 const context=vm.createContext({localStorage:{getItem:()=>stored}});vm.runInContext(boot,context);const state=vm.runInContext('state',context);assert.ok(Array.isArray(state.lessons));assert.ok(Array.isArray(state.labs));assert.ok(Array.isArray(state.days));assert.ok(Object.values(state.notes).every(x=>typeof x==='string'));assert.equal(Object.keys(state.quiz).length,0);
}
const KEY='fieldwork.progress.v1',DRAFT_KEY='fieldwork.wiki-code.v1';
const data={
 lessons:[{id:'lesson-01',quiz:[{},{}],body:[{heading:'Example',code:'console.log(1)',playground:{id:'example',runtime:'worker',output:'1'}}]},{id:'lesson-02',quiz:[{},{}]}],
 labs:[{id:'lab-01',difficulty:'Easy',tests:[{name:'Works'}]}],
 projects:[{id:'project-one',milestones:[{tasks:['Build']}]}],
 wiki:[{id:'runtime',example:{code:'original'}},{id:'modules',example:{files:{'app.mjs':'original app','counter.mjs':'original counter'}}}]
};
const original={version:1,lessons:[],labs:[],days:[],notes:{general:'old'},code:{},projects:{},quiz:{},lastLesson:'lesson-01',goal:4};
const malicious='lesson-01"><img src=x onerror=alert(1)>';
const backup={version:1,lessons:['lesson-02','nonexistent'],labs:['lab-01','bad'],days:['2026-10-20',42],lastLesson:'lesson-02',notes:{general:'new',[malicious]:'payload'},code:{'lab-01':'function f(){}','unknown':'bad'},projects:{'project-one-0-0':true,'bad':true},quiz:{'lesson-01-0':2,'bad':2}};
function harness({stored=JSON.stringify(original),drafts='{"runtime":{"example.js":"prior draft"}}',failWrite=()=>false,failRead=()=>false}={}){
 const storage=new Map();if(stored!==null)storage.set(KEY,stored);if(drafts!==null)storage.set(DRAFT_KEY,drafts);
 const messages=[],downloads=[];let renders=0;
 const context=vm.createContext({data,lessonExamples,localStorage:{
  getItem:key=>{if(failRead(key))throw Error('Read blocked');return storage.get(key)??null;},
  setItem:(key,value)=>{if(failWrite(key,value))throw Error('Quota exceeded');storage.set(key,value);},
  removeItem:key=>{if(failWrite(key,null))throw Error('Storage blocked');storage.delete(key);}
 },toast:message=>messages.push(message),render:()=>{renders++;},download:(name,content)=>downloads.push({name,value:JSON.parse(content)}),today:()=> '2026-10-20'});
 vm.runInContext(boot+'\n'+saveSource+'\n'+backupSource,context);
 return {context,storage,messages,downloads,get renders(){return renders;},get state(){return JSON.parse(vm.runInContext('JSON.stringify(state)',context));}};
}
const fileInput=(value,size=1000)=>({value:'C:\\fakepath\\backup.json',files:[{size,text:async()=>JSON.stringify(value)}]});
const importInto=async(h,b,size)=>{const input=fileInput(b,size);await h.context.importBackup({target:input});assert.equal(input.value,'','The input resets so choosing the same file can fire change again');return input;};
const h=harness();
await importInto(h,backup);
assert.equal(h.state.notes.general,'new');assert.equal(Object.hasOwn(h.state.notes,malicious),false);assert.equal(h.state.lessons.length,1);assert.equal(h.state.labs.length,1);assert.equal(Object.keys(h.state.projects).length,1);assert.equal(Object.keys(h.state.quiz).length,1);assert.equal(Object.keys(h.state.code).length,1);assert.equal(h.state.lastLesson,'lesson-02');
assert.equal(JSON.parse(h.storage.get(KEY)).lastLesson,'lesson-02');
assert.equal(h.storage.get(DRAFT_KEY),'{"runtime":{"example.js":"prior draft"}}','Old backups leave wiki drafts untouched');
await importInto(h,{...backup,lastLesson:'unknown'});assert.equal(h.state.lastLesson,'lesson-02','An unknown last lesson cannot replace a valid one');
await importInto(h,backup,6e6);assert.match(h.messages.at(-1),/too large/);
const canceled={value:'old',files:[]};await h.context.importBackup({target:canceled});assert.equal(canceled.value,'');
const broken={value:'old',files:[{size:10,text:async()=>'{broken'}]};await h.context.importBackup({target:broken});assert.equal(broken.value,'');
// Only existing article IDs and their real file names may enter draft storage.
const wikiDrafts=JSON.parse('{"runtime":{"example.js":"edited","unexpected.js":"bad","__proto__":"bad","constructor":"bad"},"modules":{"app.mjs":"edited app","counter.mjs":42,"../escape.js":"bad"},"unknown":{"example.js":"bad"},"__proto__":{"polluted":"bad"},"constructor":{"example.js":"bad"}}');
const d=harness({drafts:JSON.stringify({runtime:{'example.js':'prior'},modules:{'counter.mjs':'preserved'}})});
await importInto(d,{...backup,wikiDrafts});
assert.deepEqual(JSON.parse(d.storage.get(DRAFT_KEY)),{runtime:{'example.js':'edited'},modules:{'counter.mjs':'preserved','app.mjs':'edited app'}});
assert.equal({}.polluted,undefined);
await importInto(d,{...backup,wikiDrafts:{runtime:{'example.js':'x'.repeat(100001)},modules:{'counter.mjs':'x'.repeat(100000)}}});
assert.equal(JSON.parse(d.storage.get(DRAFT_KEY)).runtime['example.js'],'edited','Oversized drafts are filtered, not truncated or imported');
assert.equal(JSON.parse(d.storage.get(DRAFT_KEY)).modules['counter.mjs'].length,100000);
for(const invalid of [null,[],42,'bad']){
 const before=JSON.stringify(d.state);await importInto(d,{...backup,wikiDrafts:invalid});assert.match(d.messages.at(-1),/Invalid example draft/);assert.equal(JSON.stringify(d.state),before);
}
d.context.exportBackup();assert.deepEqual(d.downloads.at(-1).value.wikiDrafts,JSON.parse(d.storage.get(DRAFT_KEY)));assert.equal(d.downloads.at(-1).value.lastLesson,'lesson-02');
// Lesson examples share the versioned draft field; legacy wiki-only backups still work.
await importInto(d,{...backup,wikiDrafts:{'lesson-01-example':{'example.js':'console.log("restored lesson")','unknown.js':'ignored'},'lesson-01-missing':{'example.js':'ignored'}}});
assert.deepEqual(JSON.parse(d.storage.get(DRAFT_KEY))['lesson-01-example'],{'example.js':'console.log("restored lesson")'});
assert.equal(JSON.parse(d.storage.get(DRAFT_KEY))['lesson-01-missing'],undefined);
d.context.exportBackup();
assert.deepEqual(d.downloads.at(-1).value.wikiDrafts['lesson-01-example'],{'example.js':'console.log("restored lesson")'});
assert.equal(JSON.parse(d.storage.get(DRAFT_KEY)).runtime['example.js'],'edited','Importing lesson drafts preserves wiki drafts');
// New incident notes round-trip through the existing v1 backup, without widening valid IDs.
data.incidents=[{id:'incident-01'}];
await importInto(d,{...backup,notes:{general:'new','incident-01':'Observed zero becoming three','incident-unknown':'discard'}});
assert.equal(d.state.notes['incident-01'],'Observed zero becoming three');
assert.equal(d.state.notes['incident-unknown'],undefined);
d.context.exportBackup();
const restoredIncident=harness();
await importInto(restoredIncident,d.downloads.at(-1).value);
assert.equal(restoredIncident.state.notes['incident-01'],'Observed zero becoming three');
delete data.incidents;
// A failed progress write must not mutate the live session, drafts, or persisted progress.
let blocked=true;
const f=harness({failWrite:key=>blocked&&key===KEY});const beforeState=f.state,beforeProgress=f.storage.get(KEY),beforeDrafts=f.storage.get(DRAFT_KEY);
const retryInput=await importInto(f,{...backup,wikiDrafts});
assert.deepEqual(f.state,beforeState);assert.equal(f.storage.get(KEY),beforeProgress);assert.equal(f.storage.get(DRAFT_KEY),beforeDrafts);assert.equal(f.renders,0);assert.match(f.messages.at(-1),/Storage is unavailable/);assert.ok(!f.messages.some(m=>m.startsWith('Backup imported')));
blocked=false;retryInput.value='C:\\fakepath\\backup.json';await f.context.importBackup({target:retryInput});assert.equal(retryInput.value,'');assert.equal(f.state.lastLesson,'lesson-02');assert.match(f.messages.at(-1),/Backup imported/);
// A second-key failure rolls back the first persisted write, including an absent original key.
for(const stored of [JSON.stringify(original),null]){
 const t=harness({stored,failWrite:key=>key===DRAFT_KEY});const previous=t.state,oldDraft=t.storage.get(DRAFT_KEY);
 await importInto(t,{...backup,wikiDrafts});assert.deepEqual(t.state,previous);assert.equal(t.storage.get(KEY)??null,stored);assert.equal(t.storage.get(DRAFT_KEY),oldDraft);assert.equal(t.renders,0);assert.match(t.messages.at(-1),/previous progress was restored/);assert.ok(!t.messages.some(m=>m.startsWith('Backup imported')));
}
// If the browser also refuses rollback, keep the prior session and report partial persistence honestly.
let progressWrites=0;
const partial=harness({failWrite:key=>key===DRAFT_KEY||(key===KEY&&++progressWrites>1)});
await importInto(partial,{...backup,wikiDrafts});assert.deepEqual(partial.state,original);assert.match(partial.messages.at(-1),/stored progress could not be restored/);assert.ok(!partial.messages.some(m=>m.startsWith('Backup imported')));
const unreadable=harness({failRead:key=>key===DRAFT_KEY});unreadable.context.exportBackup();assert.deepEqual(unreadable.downloads[0].value,original);assert.match(unreadable.messages.at(-1),/example draft storage could not be read/);
// Exercise the actual click-handler completion path: its save failure must remain visible.
const completion=harness({failWrite:()=>true});let click;
Object.assign(completion.context,{document:{addEventListener:(name,handler)=>{if(name==='click')click=handler;}},scrollY:0,window:{scrollTo:()=>{}}});
vm.runInContext(activitySource,completion.context);
vm.runInContext(app.slice(app.indexOf("document.addEventListener('click',async"),app.indexOf("document.addEventListener('keydown'")),completion.context);
await click({target:{closest:selector=>selector==='[data-action]'?{dataset:{action:'complete-lesson',id:'lesson-01'}}:null}});
assert.match(completion.messages.at(-1),/Storage is unavailable/);assert.ok(!completion.messages.some(m=>m.startsWith('Lesson complete')));
// Exercise lab completion with the real result handler and a blocked storage backend.
const lab=harness({failWrite:()=>true});const elements=new Map();let createdWorker;
Object.assign(lab.context,{$:selector=>{if(!elements.has(selector))elements.set(selector,{value:'function solution(){}',textContent:'',innerHTML:'',disabled:false});return elements.get(selector);},Worker:class{constructor(){createdWorker=this;}terminate(){}postMessage(){}},setTimeout:()=>1,clearTimeout:()=>{},tag:()=>'',icon:()=>'',esc:String});
vm.runInContext('let worker,timer;const route=["lab","lab-01"];\n'+activitySource+'\n'+app.slice(app.indexOf('async function runLab('),app.indexOf('\nfunction download(')),lab.context);
await lab.context.runLab();createdWorker.onmessage({data:{results:[{name:'Works',passed:true}],logs:[]}});
assert.match(lab.messages.at(-1),/Storage is unavailable/);assert.ok(!lab.messages.some(m=>m.startsWith('All tests passed')));
console.log('Persistence passed: validated merges, last-lesson restore, legacy backups, wiki draft filtering/export, retry reset, failed-write rollback, partial-failure reporting, and completion warnings.');
