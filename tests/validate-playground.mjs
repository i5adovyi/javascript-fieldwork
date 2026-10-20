import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {guardLoops,buildModules} from '../dist/wiki-code.js';
import {playgroundExample,playgroundMarkup} from '../dist/wiki-playground.js';

const {wiki}=JSON.parse(await readFile(new URL('../dist/data/wiki.json',import.meta.url)));
for(const code of [
  'let n=0;for(let i=0;i<3;i++)n++;return n;',
  'let n=0;for(let i=0;i<2;i++)for(let j=0;j<3;j++)n++;return n;',
  'let n=0;while(n<3)n++;return n;',
  'let n=0;do n++;while(n<3);return n;',
  'let n=0;for(const v of [1,2]){n+=v;}for(const k in {a:1})n++;return n;',
  'const text="while(true){}"; /* for(;;); */ return text;'
]){
  let calls=0;
  const actual=runInNewContext(`(()=>{${guardLoops(code,'check')}})()`,{check(){calls++;}});
  const expected=runInNewContext(`(()=>{${code}})()`);
  assert.equal(actual,expected);
  if(!code.includes('const text'))assert.ok(calls>0);
}
assert.throws(()=>guardLoops('const =;', 'check'),SyntaxError);
assert.throws(()=>runInNewContext(guardLoops('while(true);','check'),{check(){throw Error('Stopped');}}),/Stopped/);
assert.throws(()=>buildModules({'app.mjs':'import "./missing.mjs"'}),/not found/);
assert.throws(()=>buildModules({'app.mjs':'import "node:fs"'}),/literal local import/);
assert.throws(()=>buildModules({'app.mjs':'import "./other.mjs"','other.mjs':'import "./app.mjs"'}),/Circular/);
const graph=buildModules({'app.mjs':'import {n} from "./n.mjs"; console.log(n)','n.mjs':'export const n=3;'});
assert.match(await (await fetch(graph.url)).text(),/from "blob:/);
graph.dispose();
assert.equal(new Set(wiki.map(a=>a.id)).size,35);
for(const article of wiki){
  const example=playgroundExample(article);
  assert.ok(Object.values(example.files).every(code=>typeof code==='string'&&code.length));
  const markup=playgroundMarkup(article,s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'),()=>'<pre>Original source</pre>');
  assert.ok(markup.includes('data-example-run')&&markup.includes('textarea'));
  assert.ok(!markup.includes('<script>'));
  if(article.example.runtime==='node')assert.match(example.note,/Browser version/);
}
console.log('Playground passed: all 35 editable examples, browser alternatives, loop guards, module graph errors, and escaping.');
