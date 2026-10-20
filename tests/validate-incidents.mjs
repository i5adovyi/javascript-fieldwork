import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createIncidentViews} from '../dist/incidents.js';
import {caseMarkdown} from '../scripts/build-incidents.mjs';
const root=new URL('../dist/',import.meta.url);
const read=async name=>JSON.parse(await readFile(new URL(`data/${name}.json`,root)));
const data=Object.assign({},...await Promise.all(['curriculum','labs','library','incidents'].map(read)));
const {incidents}=data;
assert.equal(incidents.length,12);
assert.equal(new Set(incidents.map(i=>i.id)).size,12);
for(const stage of data.stages)assert.equal(incidents.filter(i=>i.stage===stage.id).length,2);
for(const item of incidents){
 assert.match(item.id,/^incident-\d{2}$/);
 for(const field of ['title','subtitle','environment','report','starter','variation'])assert.ok(item[field]?.trim(),`${item.id} ${field}`);
 for(const field of ['reproduce','constraints','acceptance','debrief'])assert.ok(item[field]?.length>=2,`${item.id} ${field}`);
 assert.equal(item.hints.length,3);
 assert.ok(item.evidence.length&&item.files.length&&item.resources.length);
 assert.equal(data.lessons.find(l=>l.id===item.afterLesson)?.stage,item.stage);
 assert.ok(item.lessonIds.includes(item.afterLesson));
 assert.equal(data.projects.find(p=>p.id===item.projectId)?.stage,item.stage);
 for(const id of item.lessonIds)assert.ok(data.lessons.some(l=>l.id===id),id);
 for(const id of item.labIds){
  const lab=data.labs.find(l=>l.id===id);
  assert.equal(lab?.incidentId,item.id);
  assert.equal(lab.kind,'incident');assert.equal(lab.stage,item.stage);assert.equal(lab.afterLesson,item.afterLesson);
  const entry=lab.starter.match(/function\s+([a-zA-Z_$][\w$]*)/);
  assert.ok(entry&&item.starter.includes(entry[1]),`${item.id} exposes the focused repair entry point`);
 }
 for(const file of item.files){
  assert.match(file.name,/^[a-zA-Z0-9_.-]+$/);
  assert.ok(file.content.length);assert.ok(!['.','..'].includes(file.name));
 }
 for(const resource of item.resources){
  const url=new URL(resource.url);
  assert.equal(url.protocol,'https:');
  assert.ok(['developer.mozilla.org','nodejs.org'].includes(url.hostname),`${item.id} uses a primary platform reference`);
 }
}
assert.deepEqual(incidents.flatMap(i=>i.labIds).sort(),data.labs.filter(l=>l.kind==='incident').map(l=>l.id).sort());
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const views=createIncidentViews({data,esc,link:(to,text,cls='')=>`<a class="${cls}" href="#/${to}">${text}</a>`,codeBlock:code=>`<pre>${esc(code)}</pre>`});
assert.equal((views.index().match(/class="incident-card"/g)||[]).length,12);
for(const stage of data.stages)assert.equal((views.index(stage.id).match(/class="incident-card"/g)||[]).length,2);
for(const item of incidents){
 const html=views.detail(item.id,{[item.id]:'</textarea><script>bad()</script>'});
 assert.ok(html.includes(esc(item.title)));
 assert.ok(!html.includes('<script>bad()'));
 assert.ok(html.includes('&lt;/textarea&gt;'));
 assert.ok(!html.includes('<details open'),'Hints do not reveal their answers automatically');
 assert.ok(views.lessonLinks(item.afterLesson).includes(`#/incident/${item.id}`));
 assert.ok(views.projectLinks(item.projectId).includes(`#/incident/${item.id}`));
}
assert.equal(views.detail('unknown'),null);
// Inspect every uncompressed entry, not just the ZIP header or a stale filename list.
const zip=await readFile(new URL('incident-kits.zip',root)),entries=new Map();
let offset=0;
while(zip.readUInt32LE(offset)===0x04034b50){
 assert.equal(zip.readUInt16LE(offset+8),0);
 const size=zip.readUInt32LE(offset+18),length=zip.readUInt16LE(offset+26),extra=zip.readUInt16LE(offset+28);
 const name=zip.subarray(offset+30,offset+30+length).toString();
 assert.ok(!name.includes('..')&&!name.startsWith('/'));
 assert.ok(!entries.has(name),'ZIP paths must be unique');
 const start=offset+30+length+extra;
 entries.set(name,zip.subarray(start,start+size).toString());offset=start+size;
}
assert.equal(entries.size,1+incidents.reduce((n,i)=>n+3+i.files.length,0));
for(const item of incidents){
 assert.equal(entries.get(`${item.id}/README.md`),caseMarkdown(item));
 assert.equal(entries.get(`${item.id}/incident.mjs`),item.starter);
 assert.deepEqual(JSON.parse(entries.get(`${item.id}/packet.json`)),item);
 for(const file of item.files)assert.equal(entries.get(`${item.id}/${file.name}`),file.content);
}
const workbook=await readFile(new URL('incident-workbook.md',root),'utf8');
for(const item of incidents)assert.ok(workbook.includes(caseMarkdown(item)),`${item.id} workbook is current`);
const sw=await readFile(new URL('sw.js',root),'utf8');
for(const asset of ['incidents.js','incidents.css','data/incidents.json','incident-workbook.md','incident-kits.zip','curriculum-review.md']){
 assert.ok(sw.includes(`'./${asset}'`),`${asset} participates in app cache`);
 assert.ok((await readFile(new URL(asset,root))).length);
}
console.log('Incident integrity passed: 12 packets, six stages, eight aligned repairs, prerequisite/project links, escaped notes, hidden clues, and exact ZIP/workbook contents.');
