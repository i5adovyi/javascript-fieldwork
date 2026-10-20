import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {loadContent,ContentLoadError} from '../dist/content-loader.js';
const valid={stages:[],lessons:[]};
let request;
assert.deepEqual(await loadContent('curriculum',{baseURL:'https://example.com/studio/content-loader.js',fetcher:async(url,options)=>{request={url:String(url),options};return new Response(JSON.stringify(valid),{headers:{'content-type':'application/json'}});}}),valid);
assert.equal(request.url,'https://example.com/studio/data/curriculum.json');assert.equal(request.options.credentials,'same-origin');
const cases=[
 [200,'text/html','<!DOCTYPE html><title>Sign in required</title><a href="/signin-with-chatgpt">Sign in</a>','auth'],
 [401,'text/plain','Unauthorized','auth'],
 [403,'text/html','Forbidden','auth'],
 [200,'text/html','<!DOCTYPE html><h1>Fallback page</h1>','content'],
 [200,'application/json','<!DOCTYPE html><h1>Unexpected HTML</h1>','content'],
 [200,'application/json','{broken','content'],
 [200,'application/json','{"lessons":[]}','content'],
 [200,'text/plain',JSON.stringify(valid),'content'],
 [404,'text/html','Missing','content']
];
for(const [status,type,body,kind]of cases)await assert.rejects(loadContent('curriculum',{fetcher:async()=>new Response(body,{status,headers:{'content-type':type}})}),e=>e instanceof ContentLoadError&&e.kind===kind&&!e.message.includes('Unexpected token'));
const listeners={};const context=vm.createContext({self:{location:{href:'https://example.com/sw.js',origin:'https://example.com'},addEventListener:(type,fn)=>listeners[type]=fn},URL,Response,Error,JSON});
vm.runInContext(await readFile(new URL('../dist/sw.js',import.meta.url),'utf8'),context);
for(const [path,type,body,expected] of [
 ['./data/wiki.json','application/json','{"wiki":[]}',true],
 ['./data/wiki.json','text/html','<!DOCTYPE html>',false],
 ['./data/wiki.json','application/json','<!DOCTYPE html>',false],
 ['./app.js','text/html','<!DOCTYPE html>',false],
 ['./styles.css','text/html','<!DOCTYPE html>',false],
 ['./','text/html','<title>Sign in required</title>',false],
 ['./','text/html','<title>JavaScript Fieldwork</title>',true]
])assert.equal(await context.validAsset(path,new Response(body,{headers:{'content-type':type}})),expected,path);
let cacheWrites=0;const cache={put:async()=>{cacheWrites++},match:async()=>new Response('{"wiki":[]}',{headers:{'content-type':'application/json'}})};
context.caches={open:async()=>cache};context.fetch=async()=>new Response('<title>Sign in required</title>',{headers:{'content-type':'text/html'}});
let returned;listeners.fetch({request:new Request('https://example.com/data/wiki.json'),respondWith:p=>{returned=p;},waitUntil:()=>{}});assert.match(await(await returned).text(),/Sign in required/);assert.equal(cacheWrites,0,'Do not cache HTML in a JSON request');
context.fetch=async()=>{throw new TypeError('Offline')};listeners.fetch({request:new Request('https://example.com/data/wiki.json'),respondWith:p=>{returned=p;},waitUntil:()=>{}});assert.deepEqual(await(await returned).json(),{wiki:[]},'Valid offline data remains available');
console.log('Content loading passed: valid data, module-relative URLs, sign-in/403 HTML, malformed data, cache poisoning prevention, and offline fallback.');
