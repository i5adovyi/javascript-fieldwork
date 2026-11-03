import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createServer} from 'node:net';
import {once} from 'node:events';
import {readFile} from 'node:fs/promises';
import {runtimeInfo,runAnywherePage,HOSTED_URL,LOCAL_URL} from '../dist/run-anywhere.js';
import {browserCommand} from '../scripts/open-browser.mjs';

for(const href of ['http://localhost:4173/#/run','http://127.0.0.1:4187/','http://[::1]:4173/']){
 const mode=runtimeInfo(href);assert.equal(mode.local,true);assert.equal(mode.localURL,new URL(href).origin+'/');
}
assert.equal(runtimeInfo(HOSTED_URL).label,'OpenAI Sites');
assert.equal(runtimeInfo('https://localhost.evil.example/').local,false);
assert.equal(runtimeInfo('https://example.org/').label,'Another web host');
assert.equal(runtimeInfo('https://different.other.chatgpt.site/').hostedURL,'https://different.other.chatgpt.site/');
const pages='https://i5adovyi.github.io/javascript-fieldwork/';
assert.equal(runtimeInfo(pages+'#/run').label,'GitHub Pages');
assert.equal(runtimeInfo(pages+'index.html#/run').hostedURL,pages);
assert.ok(runAnywherePage({href:pages+'#/run',esc:String,link:()=>''}).includes('href="'+pages+'#/dashboard"'));
assert.deepEqual(browserCommand(LOCAL_URL,'darwin'),['open',[LOCAL_URL]]);
assert.deepEqual(browserCommand(LOCAL_URL,'win32'),['rundll32.exe',['url.dll,FileProtocolHandler',LOCAL_URL]]);
assert.deepEqual(browserCommand(LOCAL_URL,'linux'),['xdg-open',[LOCAL_URL]]);
assert.throws(()=>browserCommand('file:///etc/passwd'),TypeError);
const html=runAnywherePage({href:HOSTED_URL,esc:String,link:(path,text)=>`<a href="#/${path}">${text}</a>`});
assert.ok(html.includes('does not sync or move it'));
assert.ok(html.includes(LOCAL_URL)&&html.includes(HOSTED_URL));
assert.equal((await readFile(new URL('../docs/RUNNING.md',import.meta.url),'utf8')).replaceAll('(NEW-ACCOUNT.md)','(new-account.md)').replaceAll('(RUNNING.md)','(running.md)'),await readFile(new URL('../dist/running.md',import.meta.url),'utf8'));

// Reserve a free loopback port for an isolated real-server integration check.
const probe=createServer();probe.listen(0,'127.0.0.1');await once(probe,'listening');
const port=probe.address().port;await new Promise(resolve=>probe.close(resolve));
const root=new URL('../',import.meta.url);
function start(value){
 const child=spawn(process.execPath,['scripts/serve.mjs','--static'],{cwd:root,env:{...process.env,PORT:String(value)},stdio:['ignore','pipe','pipe']});
 let output='';child.stdout.on('data',bytes=>output+=bytes);child.stderr.on('data',bytes=>output+=bytes);
 return {child,get output(){return output;}};
}
const server=start(port);
try{
 const deadline=Date.now()+5000;
 while(!server.output.includes('JavaScript Fieldwork:')){
  if(Date.now()>deadline||server.child.exitCode!==null)throw Error(server.output||'Server did not start');
  await new Promise(resolve=>setTimeout(resolve,20));
 }
 const base=`http://127.0.0.1:${port}`;
 for(const [path,type] of [['/','text/html'],['/data/incidents.json','application/json'],['/run-anywhere.js','text/javascript'],['/vendor/pdfjs/pdf.mjs','text/javascript'],['/running.md','text/markdown']]){
  const response=await fetch(base+path);assert.equal(response.status,200,path);assert.ok(response.headers.get('content-type').includes(type),path);
 }
 assert.equal((await fetch(base+'/missing-file')).status,404);
 const occupied=start(port);const [code]=await once(occupied.child,'exit');
 assert.equal(code,1);assert.match(occupied.output,/already in use/);
 const invalid=start('abc');const [badCode]=await once(invalid.child,'exit');
 assert.equal(badCode,1);assert.match(invalid.output,/PORT must be/);
}finally{server.child.kill('SIGTERM');await once(server.child,'exit');}
console.log('Launch checks passed: host detection, local address preservation, launch commands, real HTTP assets, port errors, and setup guide.');
