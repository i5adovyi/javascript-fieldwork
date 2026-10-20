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
for(const file of ['app.js','styles.css','runner.js','sw.js','index.html','handbook.md'])assert.ok((await readFile(new URL('../dist/'+file,import.meta.url))).length>100);
console.log(`Content integrity passed: ${lessons.length} lessons, ${lessons.reduce((n,l)=>n+l.quiz.length,0)} quizzes, ${lessons.reduce((n,l)=>n+l.practice.length,0)} practice prompts, ${labs.length} labs, ${articles.length} articles, ${resources.length} resources, ${projects.length} projects.`);
