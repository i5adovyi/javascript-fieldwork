import assert from 'node:assert/strict';
import {readFile,mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {runInNewContext} from 'node:vm';
import {createWiki,matchesQuery,relatedForLesson} from '../dist/wiki.js';
const read=async name=>JSON.parse(await readFile(new URL('../dist/data/'+name+'.json',import.meta.url),'utf8'));
const [{wiki},curriculum,labs,library]=await Promise.all(['wiki','curriculum','labs','library'].map(read));
const ids=new Set(wiki.map(a=>a.id));
assert.equal(ids.size,wiki.length);
const byId=id=>wiki.find(a=>a.id===id);
let examples=0;
for(const a of wiki){
 assert.match(a.id,/^[a-z][a-z0-9-]+$/);
 for(const key of ['title','summary','rule'])assert.ok(a[key]?.trim(),`${a.id}: ${key}`);
 for(const key of ['details','useWhen','pitfalls','sections','related'])assert.ok(a[key]?.length,`${a.id}: ${key}`);
 for(const s of a.sections){assert.match(s.ref,/^\d+(\.\d+)+$/);assert.ok(Number.isInteger(s.pdfPage)&&s.pdfPage>35&&s.pdfPage<=1245);}
 for(const id of a.related)assert.ok(ids.has(id),`${a.id}: broken related link ${id}`);
 for(const n of a.lessonNumbers)assert.ok(curriculum.lessons.some(l=>l.number===n),`${a.id}: missing lesson ${n}`);
 assert.ok(a.example.code&&a.example.output&&a.example.explanation);
 if(a.example.runtime==='universal'){
  const output=[];
  await runInNewContext(`(async()=>{${a.example.code}\n})()`,{console:{log:(...values)=>output.push(values.map(String).join(' '))},setTimeout,clearTimeout},{timeout:1000});
  assert.equal(output.join('\n'),a.example.output,a.id+' example output');examples++;
 }else if(['node','module'].includes(a.example.runtime)){
  const dir=await mkdtemp(join(tmpdir(),'fieldwork-wiki-'));
  try{
   const files=a.example.files||{'app.mjs':a.example.code};
   for(const [name,code] of Object.entries(files))await writeFile(join(dir,name),code);
   const output=execFileSync(process.execPath,[join(dir,'app.mjs')],{encoding:'utf8',timeout:5000});
   assert.equal(output.trimEnd(),a.example.output,a.id+' module output');examples++;
  }finally{await rm(dir,{recursive:true,force:true});}
 }
 assert.ok((await readFile(new URL(`../docs/wiki/${a.id}.md`,import.meta.url),'utf8')).includes(a.title));
}
for(const l of curriculum.lessons)assert.ok(relatedForLesson(wiki,l).length,`Lesson ${l.number} has no wiki link`);
assert.ok(matchesQuery(byId('operators'),'??'));
assert.ok(matchesQuery(byId('scope'),'TEMPORAL dead'));
assert.ok(matchesQuery(byId('promise-concurrency'),'allSettled'));
assert.ok(!wiki.some(a=>matchesQuery(a,'zzzxmissing')));
// Render the real view functions and verify every generated internal destination resolves.
const data={...curriculum,...labs,...library,wiki};
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const ui=createWiki({data,shell:s=>s,esc,link:(to,label)=>`<a href="#/${to}">${label}</a>`,codeBlock:code=>`<pre>${esc(code)}</pre>`});
const types={wiki:wiki,lesson:data.lessons,lab:data.labs,project:data.projects};
for(const a of wiki){
 const html=ui.page(a.id);
 assert.ok(html.includes(esc(a.example.code)));
 assert.ok(!html.includes('<script>'),a.id+' unescaped content');
 for(const [,type,id] of html.matchAll(/href="#\/(wiki|lesson|lab|project)\/([^"/]+)"/g))assert.ok(types[type].some(x=>x.id===id),`${a.id}: unresolved ${type}/${id}`);
}
assert.ok(ui.page('unknown').includes('Topic not found'));
const sw=await readFile(new URL('../dist/sw.js',import.meta.url),'utf8');
for(const [,file] of sw.matchAll(/'\.\/([^']*)'/g))await readFile(new URL('../dist/'+(file||'index.html'),import.meta.url));
console.log(`Wiki passed: ${wiki.length} pages, ${curriculum.lessons.length} linked lessons, ${examples} executable Node examples, internal links, search, escaping, and offline assets. Browser examples: run tests/serve-wiki-qa.mjs.`);
