import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {BOOK_MAP} from '../dist/book-map.js';

const curriculum=JSON.parse(await readFile(new URL('../dist/data/curriculum.json',import.meta.url),'utf8'));
const {wiki}=JSON.parse(await readFile(new URL('../dist/data/wiki.json',import.meta.url),'utf8'));
const numericRange=(first,last=first)=>{
 const a=first.split('.'),b=last.split('.');
 assert.equal(a.length,b.length,'Range endpoints must have the same section depth');
 assert.deepEqual(a.slice(0,-1),b.slice(0,-1),'A section range cannot cross a parent boundary');
 assert.ok(+b.at(-1)>=+a.at(-1),'Range endpoints must be ordered');
 return Array.from({length:+b.at(-1)-+a.at(-1)+1},(_,i)=>[...a.slice(0,-1),+a.at(-1)+i].join('.'));
};
function assignedReferences(label){
 const refs=[];
 for(const match of label.matchAll(/(\d+(?:\.\d+)+)(?:[–-](\d+(?:\.\d+)+))?/g))refs.push(...numericRange(match[1],match[2]).map(ref=>'S:'+ref));
 for(const match of label.matchAll(/(?:Ch\.|Chapters?)\s+(\d+)(?:[–-](\d+))?/g))refs.push(...numericRange(match[1],match[2]).map(ref=>'C:'+ref));
 return refs;
}
function parseRangeLabel(label){
 const section=/^§§?(\d+(?:\.\d+)+)(?:–(\d+(?:\.\d+)+))?\s+(.+)$/.exec(label);
 if(section)return {kind:'section',first:section[1],last:section[2]||section[1],titles:section[3].split(' — ')};
 const chapter=/^Chapters? (\d+)(?:–(\d+))? · (.+)$/.exec(label);
 assert.ok(chapter,'Every range label must identify real sections or chapters: '+label);
 return {kind:'chapter',first:chapter[1],last:chapter[2]||chapter[1],titles:chapter[3].split(' — ')};
}
function validateMetadata(map){
 assert.deepEqual(Object.keys(map).sort(),['edition','expectedPageCount','lessons']);
 assert.match(map.edition,/Seventh Edition \(2020\)/);
 assert.equal(map.expectedPageCount,1245);
 assert.equal(curriculum.lessons.length,36);
 assert.deepEqual(Object.keys(map.lessons).sort(),curriculum.lessons.map(l=>l.id).sort(),'Every published lesson must have exactly one reading assignment');
 for(const lesson of curriculum.lessons){
  const entry=map.lessons[lesson.id];
  assert.deepEqual(Object.keys(entry).sort(),['label','ranges']);
  assert.equal(entry.label,lesson.sections,lesson.id+' reading label matches the curriculum');
  assert.ok(entry.ranges.length>=1&&entry.ranges.length<=5,lesson.id+' has one to five reading ranges');
  assert.equal(new Set(entry.ranges.map(r=>r.label)).size,entry.ranges.length,lesson.id+' has no duplicate ranges');
  const actual=[];
  for(const range of entry.ranges){
   assert.deepEqual(Object.keys(range).sort(),['end','label','start']);
   assert.ok(Number.isInteger(range.start)&&Number.isInteger(range.end));
   assert.ok(range.start>=38&&range.end>=range.start&&range.end<=map.expectedPageCount,lesson.id+' uses inclusive physical-page bounds');
   const parsed=parseRangeLabel(range.label);
   assert.equal(parsed.titles.length,parsed.first===parsed.last?1:2,'Labels contain only endpoint section/chapter titles');
   actual.push(...assignedReferences(range.label));
   // Cross-check the independently authored wiki against assignments that include its sections.
   if(parsed.kind==='section'){
    const assigned=numericRange(parsed.first,parsed.last);
    for(const topic of wiki)for(const section of topic.sections){
     if(assigned.some(ref=>section.ref===ref||section.ref.startsWith(ref+'.'))){
      assert.ok(section.pdfPage>=range.start&&section.pdfPage<=range.end,`${lesson.id}: wiki §${section.ref} must be inside its assigned pages`);
      if(section.ref===parsed.first)assert.equal(range.start,section.pdfPage,`${lesson.id}: starting section matches the wiki`);
     }
    }
   }
  }
  assert.equal(new Set(actual).size,actual.length,lesson.id+' does not assign a section/chapter twice');
  assert.deepEqual([...actual].sort(),assignedReferences(lesson.sections).sort(),lesson.id+' ranges exactly cover the curriculum sections');
 }
}
validateMetadata(BOOK_MAP);
// Guard against validators that merely accept any in-bounds range or a missing assignment.
const incomplete=structuredClone(BOOK_MAP);delete incomplete.lessons['lesson-36'];
assert.throws(()=>validateMetadata(incomplete),/Every published lesson/);
const mismatched=structuredClone(BOOK_MAP);mismatched.lessons['lesson-01'].ranges[0].label='§1.4 Example: Character Frequency Histograms';
assert.throws(()=>validateMetadata(mismatched),/exactly cover/);

let pages;
try{pages=JSON.parse(await readFile(new URL('../tmp/pdfs/pages.json',import.meta.url),'utf8'));}
catch(error){if(error.code!=='ENOENT')throw error;}
let physicalChecks=0;
if(pages){
 assert.ok(Array.isArray(pages)&&pages.every(p=>typeof p==='string'));
 assert.equal(pages.length,BOOK_MAP.expectedPageCount,'Map targets the supplied PDF edition and pagination');
 const escape=text=>text.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const phrase=text=>text.split(/\s+/).map(escape).join('\\s+');
 const chapters=new Map();
 pages.forEach((text,index)=>{const match=/^Chapter (\d+)\.\s/.exec(text);if(match)chapters.set(match[1],index+1);});
 assert.equal(chapters.size,17);
 const indexPage=pages.findIndex((text,i)=>i>chapters.get('17')&&/^Index\n/.test(text))+1;
 assert.equal(indexPage,1144,'The final chapter ends before the index');
 // The front matter contains titles, not the body. Match full titles to avoid
 // confusing decimal literals and prose references with numbered headings.
 const toc=pages.slice(1,25).join('\n').replace(/^(?:\d+|[a-z]|[ivx]+)\n\.\s*\n/gm,'');
 const titles=new Map();let current;
 for(const line of toc.split('\n')){
  const match=/^(\d+\.\d+(?:\.\d+)*) (.*)/.exec(line);
  if(match){current=match[1];titles.set(current,match[2]);}
  else if(current&&line.trim())titles.set(current,titles.get(current)+' '+line.trim());
 }
 for(const [ref,title] of titles)if(title.startsWith('Summary')&&ref!=='15.15')titles.set(ref,ref==='5.8'?'Summary of JavaScript Statements':'Summary');
 const headingCache=new Map();
 function heading(ref){
  if(headingCache.has(ref))return headingCache.get(ref);
  assert.ok(titles.has(ref),'Section exists in the supplied table of contents: '+ref);
  const re=new RegExp('^'+escape(ref)+'\\s+'+phrase(titles.get(ref)),'m');
  const chapter=+ref.split('.')[0],first=chapters.get(String(chapter)),last=(chapters.get(String(chapter+1))||indexPage)-1;
  const matches=[];
  for(let page=first;page<=last;page++){const match=re.exec(pages[page-1]);if(match)matches.push({page,offset:match.index});}
  assert.equal(matches.length,1,'Unambiguous full section heading: '+ref);
  headingCache.set(ref,matches[0]);return matches[0];
 }
 function sectionEnd(ref){
  const parts=ref.split('.');parts[parts.length-1]=String(+parts.at(-1)+1);let next=parts.join('.');
  if(!titles.has(next)){
   if(parts.length===2)return (chapters.get(String(+parts[0]+1))||indexPage)-1;
   next=parts[0]+'.'+String(+parts[1]+1);
  }
  const boundary=heading(next);
  // A section continues onto the boundary page when text precedes the next heading.
  return boundary.page-(pages[boundary.page-1].slice(0,boundary.offset).trim()?0:1);
 }
 for(const [id,entry] of Object.entries(BOOK_MAP.lessons))for(const range of entry.ranges){
  const parsed=parseRangeLabel(range.label);
  if(parsed.kind==='section'){
   assert.equal(parsed.titles[0],titles.get(parsed.first),id+' first section title');
   assert.equal(parsed.titles.at(-1),titles.get(parsed.last),id+' last section title');
   assert.equal(range.start,heading(parsed.first).page,id+' exact heading start');
   assert.equal(range.end,sectionEnd(parsed.last),id+' exact section ending');
  }else{
   assert.equal(range.start,chapters.get(parsed.first),id+' exact chapter start');
   assert.equal(range.end,(chapters.get(String(+parsed.last+1))||indexPage)-1,id+' exact chapter ending');
   for(const [ref,title] of [[parsed.first,parsed.titles[0]],[parsed.last,parsed.titles.at(-1)]])assert.match(pages[chapters.get(ref)-1],new RegExp('^Chapter '+ref+'\\.\\s+'+phrase(title)),id+' chapter heading');
  }
  physicalChecks++;
 }
}
console.log(`Book map passed: ${Object.keys(BOOK_MAP.lessons).length} lessons, exact curriculum coverage, valid bounds, and wiki cross-references. ${pages?`${physicalChecks} physical-page ranges verified against the local extracted PDF.`:'Local PDF extraction absent; source-page checks skipped (no PDF is bundled).'}`);
