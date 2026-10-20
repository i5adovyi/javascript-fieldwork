import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=async file=>JSON.parse(await readFile(new URL('../dist/data/'+file+'.json',import.meta.url),'utf8'));
const {stages,lessons}=await read('curriculum');
const {labs}=await read('labs');
const {articles,resources,projects}=await read('library');
assert.equal(stages.length,6);assert.equal(lessons.length,36);assert.equal(labs.length,48);assert.equal(articles.length,8);assert.equal(projects.length,6);
for(const items of [stages,lessons,labs,articles,resources,projects])assert.equal(new Set(items.map(x=>x.id)).size,items.length,'Unique identifiers');
for(const stage of stages){assert.equal(lessons.filter(x=>x.stage===stage.id).length,6);assert.equal(labs.filter(x=>x.stage===stage.id).length,8);}
for(const l of lessons){assert.ok(l.body.length>=3);assert.ok(l.objectives.length>=3);assert.equal(l.quiz.length,2);assert.equal(l.practice.length,3);for(const q of l.quiz){assert.equal(q.options.length,4);assert.ok(q.answer>=0&&q.answer<4);assert.ok(q.explanation.length>30);}for(const s of l.body){assert.ok(s.heading&&s.paragraphs.length);}}
for(const p of projects){assert.equal(p.rubric.reduce((n,x)=>n+x.points,0),100);assert.ok(p.milestones.length>=3);}
for(const r of resources){assert.equal(new URL(r.url).protocol,'https:');assert.ok(r.description.length>30);}
for(const file of ['app.js','styles.css','runner.js','sw.js','index.html','handbook.md','CURRICULUM-MAP.md','study-pack.zip'])assert.ok((await readFile(new URL('../dist/'+file,import.meta.url))).length>100);
for(const [source,download] of [['LEARNER-HANDBOOK.md','handbook.md'],['CURRICULUM-MAP.md','CURRICULUM-MAP.md']]){
  const text=await readFile(new URL('../dist/'+download,import.meta.url),'utf8');
  assert.equal(text,await readFile(new URL('../docs/'+source,import.meta.url),'utf8'),`${download} matches its source; run npm run materials after editing manuals`);
  for(const [,href] of text.matchAll(/\]\(([^)]+)\)/g)){
    if(/^[a-z][a-z0-9+.-]*:|^#/i.test(href))continue;
    const target=new URL(href,new URL('../dist/'+download,import.meta.url));
    assert.ok((await readFile(target)).length,`${download} links to a shipped local file: ${href}`);
  }
}
const pack=await readFile(new URL('../dist/study-pack.zip',import.meta.url));
const packedNames=[];
let packOffset=0;
while(pack.readUInt32LE(packOffset)===0x04034b50){
  assert.equal(pack.readUInt16LE(packOffset+8),0,'Study pack uses stored ZIP entries');
  const size=pack.readUInt32LE(packOffset+18),nameLength=pack.readUInt16LE(packOffset+26),extraLength=pack.readUInt16LE(packOffset+28);
  const name=pack.subarray(packOffset+30,packOffset+30+nameLength).toString('utf8');
  const start=packOffset+30+nameLength+extraLength;
  assert.deepEqual(pack.subarray(start,start+size),await readFile(new URL('../dist/'+name,import.meta.url)),`Study pack contains the exact current ${name}`);
  packedNames.push(name);
  packOffset=start+size;
}
assert.deepEqual(packedNames,['field-guide.html','handbook.md','CURRICULUM-MAP.md','wiki-reference.md'],'Study pack contains exactly the four intended files');
assert.equal(pack.readUInt32LE(packOffset),0x02014b50,'Study pack includes a central directory');
assert.equal(pack.readUInt32LE(pack.length-22),0x06054b50,'Study pack includes an end-of-directory record');
console.log(`Content integrity passed: ${lessons.length} lessons, ${lessons.reduce((n,l)=>n+l.quiz.length,0)} quizzes, ${lessons.reduce((n,l)=>n+l.practice.length,0)} practice prompts, ${labs.length} labs, ${articles.length} articles, ${resources.length} resources, ${projects.length} projects.`);
