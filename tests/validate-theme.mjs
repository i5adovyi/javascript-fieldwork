import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const source=await readFile(new URL('../dist/theme.js',import.meta.url),'utf8');
const key='fieldwork.theme.v1';
function browser({saved,systemDark=false,blocked=false}={}){
 const values=new Map([['fieldwork.progress.v1','private study fixture']]);
 if(saved!==undefined)values.set(key,saved);
 const reads=[],writes=[],windowEvents={},documentEvents={},mediaEvents={};
 const controls=[{value:''},{value:''}],status={hidden:true,textContent:''};
 const root={dataset:{}},meta={content:''};
 const media={matches:systemDark,addEventListener:(name,fn)=>{mediaEvents[name]=fn;}};
 const storage={
  getItem(name){reads.push(name);if(blocked)throw Error('Storage blocked');return values.get(name)??null;},
  setItem(name,value){if(blocked)throw Error('Storage blocked');writes.push(name);values.set(name,value);}
 };
 const context=vm.createContext({
  window:{localStorage:storage,matchMedia:()=>media,addEventListener:(name,fn)=>{windowEvents[name]=fn;}},
  document:{
   documentElement:root,
   querySelector:()=>meta,
   querySelectorAll:selector=>selector==='[data-theme-select]'?controls:[status],
   addEventListener:(name,fn)=>{documentEvents[name]=fn;}
  }
 });
 vm.runInContext(source,context);
 return {root,meta,values,reads,writes,controls,status,
  choose(value){documentEvents.change({target:{value,matches:selector=>selector==='[data-theme-select]'}});},
  system(value){media.matches=value;mediaEvents.change();},
  otherTab(value,eventKey=key){windowEvents.storage({key:eventKey,newValue:value});}
 };
}

let b=browser({systemDark:true});
assert.equal(b.root.dataset.theme,'dark','System preference applies before page rendering');
assert.equal(b.root.dataset.themePreference,'system');
assert.equal(b.meta.content,'#181d19');
b.system(false);assert.equal(b.root.dataset.theme,'light');

b=browser({saved:'dark'});
assert.equal(b.root.dataset.theme,'dark','Explicit saved choice overrides a light system');
b.system(true);b.system(false);assert.equal(b.root.dataset.theme,'dark');
b.choose('light');assert.equal(b.root.dataset.theme,'light');assert.equal(b.values.get(key),'light');
assert(b.controls.every(control=>control.value==='light'));
assert.equal(browser({saved:b.values.get(key),systemDark:true}).root.dataset.theme,'light','Choice survives a new page load');
b.choose('system');b.system(true);assert.equal(b.root.dataset.theme,'dark');

const writeCount=b.writes.length;
b.otherTab('light');assert.equal(b.root.dataset.theme,'light');
assert.equal(b.writes.length,writeCount,'Other-tab changes do not cause a write loop');
b.otherTab('dark','unrelated.preference');assert.equal(b.root.dataset.theme,'light');
b.otherTab(null,null);assert.equal(b.root.dataset.themePreference,'system');
assert.equal(b.root.dataset.theme,'dark','Clearing browser preferences returns to system mode');
b.choose('unexpected');assert.equal(b.root.dataset.themePreference,'system');
assert.equal(browser({saved:'corrupt',systemDark:true}).root.dataset.theme,'dark');

b=browser({blocked:true});
b.choose('dark');assert.equal(b.root.dataset.theme,'dark');
assert.equal(b.status.hidden,false,'Unavailable persistence is reported instead of claiming a saved preference');
assert.match(b.status.textContent,/session/);
assert.deepEqual(b.reads,[key]);
assert.deepEqual(b.writes,[]);
assert.equal(b.values.get('fieldwork.progress.v1'),'private study fixture','Changing appearance never touches learner records');

const index=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
assert(index.indexOf('src="theme.js"')<index.indexOf('href="styles.css"'),'Restore appearance before the first stylesheet');
assert(index.indexOf('href="theme.css"')>index.indexOf('href="book-reader.css"'),'Theme styles cover the reader');
const sw=await readFile(new URL('../dist/sw.js',import.meta.url),'utf8');
for(const file of ['theme.js','theme.css'])assert(sw.includes("'./"+file+"'"),'Offline shell includes '+file);

// WCAG normal-text contrast for the shared dark palette and action/status colors.
function luminance(hex){
 const rgb=hex.match(/\w\w/g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);
 return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
}
for(const [text,background] of [
 ['edf0e6','181d19'],['c3ccbc','222923'],['a7b2a1','263128'],
 ['211c17','f48b66'],['202a20','d5e1c3'],['b7d596','293c2a'],
 ['f0ca8b','3b3022'],['ffb29b','402a27']
]){
 const a=luminance(text),b=luminance(background);
 assert((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5,'Insufficient contrast: '+text+' on '+background);
}
console.log('Theme checks passed: first paint, system changes, explicit/reloaded choice, cross-tab updates, invalid/blocked storage, study-data isolation, offline assets, and dark palette contrast.');
