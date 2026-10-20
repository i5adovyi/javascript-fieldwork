import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
const root=resolve(import.meta.dirname,'..');
const {wiki}=JSON.parse(await readFile(resolve(root,'dist/data/wiki.json'),'utf8'));
const {lessons}=JSON.parse(await readFile(resolve(root,'dist/data/curriculum.json'),'utf8'));
const destination=resolve(root,'docs/wiki');
await mkdir(destination,{recursive:true});
function page(a,combined=false){
 const lines=[`# ${a.title}`,'',a.summary,'','## Essential rule','',a.rule,'',...a.details.flatMap(p=>[p,'']),'## When to use it','',...a.useWhen.map(p=>`- ${p}`),'','## Practical example','',`Runtime: ${a.example.runtime==='module'?'Two separate ES module files':a.example.runtime==='node'?'Node 20+, saved as .mjs':a.example.runtime==='browser'?'Browser console on the project page':'Browser or Node (wrap await in an async function if needed)'}.`,'','```javascript',a.example.code,'```','','Expected output:','','```text',a.example.output,'```','',a.example.explanation,'','## Common pitfalls','',...a.pitfalls.map(p=>`- ${p}`),'','## Related topics','',...a.related.map(id=>{const topic=wiki.find(x=>x.id===id);return combined?`- ${topic.title}`:`- [${topic.title}](${id}.md)`;}),'','## Linked lessons','',...lessons.filter(l=>a.lessonNumbers.includes(l.number)).map(l=>`- Lesson ${l.number}: ${l.title}`),'','## Source','',"David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.",'',...a.sections.map(s=>`- §${s.ref} — PDF page ${s.pdfPage} (file page index, not printed numbering).`),'',...(a.modernNote?[`Edition note: ${a.modernNote}`,'']:[]),...(a.references||[]).map(r=>`- [${r.title}](${r.url})`),''];
 return lines.join('\n');
}
for(const a of wiki)await writeFile(resolve(destination,a.id+'.md'),page(a));
const intro='# JavaScript working wiki\n\n35 practical references distilled from the book, with original examples. Selected essentials across chapters 1–17; specialized graphics, audio, binary data, and tool installation remain in the full book.\n\nOpen the site’s **JavaScript wiki** for searchable topics and direct links to lessons, labs, and projects. These Markdown pages are also readable in your editor.\n\n';
await writeFile(resolve(destination,'README.md'),intro+wiki.map(a=>`- [${a.title}](${a.id}.md) — ${a.summary}`).join('\n')+'\n');
await writeFile(resolve(root,'dist/wiki-reference.md'),intro+wiki.map(a=>page(a,true)).join('\n---\n\n'));
console.log(`Exported ${wiki.length} wiki pages and a downloadable reference.`);
