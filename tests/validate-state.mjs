import vm from 'node:vm';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const app=await readFile(new URL('../dist/app.js',import.meta.url),'utf8');
const boot=app.slice(app.indexOf('const KEY='),app.indexOf('let wikiUI,data,'));
assert.ok(boot.includes('let state='),'Locate the live persistence initializer');
for(const stored of ['{broken','null',JSON.stringify({version:1,lessons:null,labs:'bad',notes:{valid:'kept',invalid:42},quiz:{a:100},days:[42]})]){
 const context=vm.createContext({localStorage:{getItem:()=>stored}});vm.runInContext(boot,context);const state=vm.runInContext('state',context);assert.ok(Array.isArray(state.lessons));assert.ok(Array.isArray(state.labs));assert.ok(Array.isArray(state.days));assert.ok(Object.values(state.notes).every(x=>typeof x==='string'));assert.equal(Object.keys(state.quiz).length,0);
}
const importer=app.slice(app.indexOf('async function importBackup('),app.indexOf('\nfunction modal('));
const lesson={id:'lesson-01',quiz:[{},{}]},project={id:'project-one',milestones:[{tasks:['Build']} ]};
let message;
const context=vm.createContext({state:{version:1,lessons:[],labs:[],days:[],notes:{general:'old'},code:{},projects:{},quiz:{}},data:{lessons:[lesson],labs:[{id:'lab-01'}],projects:[project]},save:()=>true,render:()=>{},toast:m=>{message=m;}});
vm.runInContext(importer,context);
const malicious='lesson-01\"><img src=x onerror=alert(1)>';
const backup={version:1,lessons:['lesson-01','nonexistent'],labs:['lab-01','bad'],days:['2026-10-20',42],notes:{general:'new',[malicious]:'payload'},code:{'lab-01':'function f(){}','unknown':'bad'},projects:{'project-one-0-0':true,'bad':true},quiz:{'lesson-01-0':2,'bad':2}};
await context.importBackup({target:{files:[{size:1000,text:async()=>JSON.stringify(backup)}]}});
assert.equal(context.state.notes.general,'new');assert.equal(Object.hasOwn(context.state.notes,malicious),false);assert.equal(context.state.lessons.length,1);assert.equal(context.state.labs.length,1);assert.equal(Object.keys(context.state.projects).length,1);assert.equal(Object.keys(context.state.quiz).length,1);assert.equal(Object.keys(context.state.code).length,1);
await context.importBackup({target:{files:[{size:6e6,text:async()=>''}]}});assert.match(message,/too large/);
console.log('Persistence regressions passed: corrupt storage, typed imports, unknown IDs, malicious note keys, and oversized backups.');
