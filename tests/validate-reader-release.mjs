// Release boundary: learner files must never become deployable application assets.
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {relative} from 'node:path';
import vm from 'node:vm';
const root=new URL('../dist/',import.meta.url);
async function* files(directory){
 for(const entry of await readdir(directory,{withFileTypes:true})){
  const url=new URL(entry.name+(entry.isDirectory()?'/':''),directory);
  if(entry.isDirectory())yield* files(url);else yield url;
 }
}
let count=0;
for await(const file of files(root)){
 const name=relative(root.pathname,file.pathname);
 assert(!/\.(pdf|epub)$/i.test(name),`A book file must not be deployed: ${name}`);
 assert(!/(^|\/)(tmp|book-backups|reader-qa|pages\.json)(\/|$)/.test(name),`Private QA data in deployment: ${name}`);
 const bytes=await readFile(file);
 assert(!bytes.subarray(0,5).equals(Buffer.from('%PDF-')),`PDF bytes in deployment: ${name}`);
 count++;
}
const handlers={};
const context=vm.createContext({
 self:{location:{href:'https://fieldwork.example/sw.js',origin:'https://fieldwork.example'},addEventListener:(name,fn)=>handlers[name]=fn},
 URL,Response,Error,JSON
});
vm.runInContext(await readFile(new URL('sw.js',root),'utf8'),context);
let intercepted=0;
for(const url of [
 'https://fieldwork.example/book.pdf',
 'https://fieldwork.example/private-notes.json',
 'blob:https://fieldwork.example/private-book',
 'https://other.example/book.pdf'
]){
 handlers.fetch({request:new Request(url),respondWith(){intercepted++;},waitUntil(){}});
}
assert.equal(intercepted,0,'The service worker must ignore books, private backups, blobs, and external requests');
for(const path of ['vendor/pdfjs/pdf.mjs','vendor/pdfjs/pdf.worker.mjs']){
 assert.equal(await context.validAsset('./'+path,new Response('<html>sign in</html>',{headers:{'Content-Type':'text/html'}})),false);
 assert.equal(await context.validAsset('./'+path,new Response('export {};',{headers:{'Content-Type':'text/javascript'}})),true);
}
const cacheFiles=vm.runInContext('FILES',context);
for(const name of ['book-reader.js','book-reader.css','book-storage.js','book-map.js','vendor/pdfjs/pdf.mjs','vendor/pdfjs/pdf.worker.mjs']){
 assert(cacheFiles.includes('./'+name),`Offline reader is missing ${name}`);
}
for(const path of cacheFiles){
 if(path!=='./')await readFile(new URL(path,root));
}
const reader=await readFile(new URL('book-reader.js',root),'utf8');
assert(!/\b(?:fetch|XMLHttpRequest|WebSocket|sendBeacon)\s*\(/.test(reader),'The reader must not send document or annotation content over the network');
assert(!/https?:\/\//.test(reader),'Reader assets must come from the local application, without runtime CDNs');
console.log(`Reader release boundary passed: ${count} assets contain no PDFs; private files bypass caching; offline runtime is present; reader has no network-send API.`);
