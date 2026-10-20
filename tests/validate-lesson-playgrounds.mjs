import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parse} from '../dist/vendor/acorn.js';
import {lessonExamples,lessonBody} from '../dist/lesson-playgrounds.js';
const {lessons}=JSON.parse(await readFile(new URL('../dist/data/curriculum.json',import.meta.url)));
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const examples=lessons.flatMap(lessonExamples);
assert.equal(examples.length,38);
assert.equal(new Set(examples.map(e=>e.id)).size,38);
for(const lesson of lessons){
  const rendered=lessonBody(lesson,esc,code=>`<pre>${esc(code)}</pre>`);
  const ids=[...rendered.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,`${lesson.id}: duplicate editor/help IDs`);
  assert.equal([...rendered.matchAll(/data-playground-kind="lesson"/g)].length,lesson.body.filter(s=>s.code).length);
  assert.ok(!rendered.includes('<script>'),`${lesson.id}: unescaped code`);
  for(const section of lesson.body.filter(s=>s.code)){
    const p=section.playground;
    assert.match(p.id,/^[a-z][a-z0-9-]+$/);
    assert.ok(['worker','dom','module'].includes(p.runtime));
    assert.equal(typeof p.output,'string');
    assert.ok(p.output.length);
    assert.ok(rendered.includes(esc(section.code)),`${lesson.id}: original excerpt remains available`);
  }
}
for(const e of examples){
  for(const code of Object.values(e.playground.files)){
    parse(code,{ecmaVersion:'latest',sourceType:e.playground.module?'module':'script',allowAwaitOutsideFunction:true});
  }
  if(e.playground.module)assert.ok(e.playground.files['app.mjs']);
}
for(const number of [31,32,33])assert.match(examples.find(e=>e.id.startsWith(`lesson-${number}-`)).playground.note,/Browser version/);
assert.match(examples.find(e=>e.id==='lesson-35-tests').playground.note,/does not execute shell commands/);
assert.equal(examples.filter(e=>e.playground.dom).length,2);
assert.equal(examples.filter(e=>e.playground.module).length,2);
console.log('Lesson playgrounds passed: 38 complete examples, unique IDs, valid syntax, explicit runtimes, original excerpts, and escaped markup.');
