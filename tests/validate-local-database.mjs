import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createServer,request} from 'node:http';
import {once} from 'node:events';
import {mkdtemp,readFile,stat,writeFile,mkdir,rm,symlink,realpath} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {defaultDataDirectory,openLocalDatabase,MAX_RECORD_BYTES,MAX_REQUEST_BYTES} from '../scripts/local-database.mjs';

const root=resolve(import.meta.dirname,'..');
const temporary=await mkdtemp(join(tmpdir(),'fieldwork-sqlite-test-'));
const dataDirectory=join(temporary,'data');
const live=new Set();
const key='fieldwork.progress.v1',wikiKey='fieldwork.wiki-code.v1';
const readerKey='fieldwork.book-reader-open.v1',bookKey='fieldwork.book-notes.v1.'+'a'.repeat(64);
assert.equal(defaultDataDirectory({platform:'darwin',home:'/user',env:{}}),join('/user','Library','Application Support','JavaScript Fieldwork'));
assert.equal(defaultDataDirectory({platform:'linux',home:'/user',env:{}}),join('/user','.local','share','javascript-fieldwork'));
assert.equal(defaultDataDirectory({platform:'linux',home:'/user',env:{XDG_DATA_HOME:'/data'}}),join('/data','javascript-fieldwork'));
assert.equal(defaultDataDirectory({platform:'win32',home:'/user',env:{LOCALAPPDATA:'/windows-local'}}),join('/windows-local','JavaScript Fieldwork'));
assert.equal(defaultDataDirectory({env:{FIELDWORK_DATA_DIR:'./private-data'}}),resolve('private-data'));
async function availablePort(){
 const probe=createServer();probe.listen(0,'127.0.0.1');await once(probe,'listening');
 const port=probe.address().port;await new Promise(done=>probe.close(done));return port;
}
async function start({directory=dataDirectory,staticOnly=false,expectFailure=false,port}={}){
 port??=await availablePort();
 const child=spawn(process.execPath,['scripts/serve.mjs',...(staticOnly?['--static']:[])],{cwd:root,env:{...process.env,PORT:String(port),FIELDWORK_DATA_DIR:directory},stdio:['ignore','pipe','pipe']});
 const result={child,port,base:`http://127.0.0.1:${port}`,output:'',exit:null};
 result.exit=new Promise(done=>child.once('exit',code=>{live.delete(result);done(code);}));
 live.add(result);child.stdout.on('data',data=>result.output+=data);child.stderr.on('data',data=>result.output+=data);
 if(expectFailure){assert.equal(await result.exit,1,result.output);assert.ok(!result.output.includes('JavaScript Fieldwork:'),result.output);return result;}
 const deadline=Date.now()+10000;
 while(!result.output.includes('JavaScript Fieldwork:')){
  if(Date.now()>deadline||child.exitCode!==null)throw Error(result.output||'Local database server failed to start.');
  await new Promise(done=>setTimeout(done,20));
 }
 return result;
}
async function stop(server){
 assert.ok(server.child.kill('SIGTERM'),server.output);
 const code=await server.exit;
 // Windows terminates the child directly; the persistence check then covers abrupt shutdown.
 if(process.platform==='win32'){
  assert.equal(code,null,server.output);
  assert.equal(server.child.signalCode,'SIGTERM',server.output);
 }else assert.equal(code,0,server.output);
}
async function api(server,path='/api/local/status',{method='GET',headers={},body}={}){
 const payload=body===undefined?undefined:typeof body==='string'?body:JSON.stringify(body);
 const result=await new Promise((resolve,reject)=>{
  const req=request(server.base+path,{method,headers:{...(payload!==undefined?{'Content-Length':Buffer.byteLength(payload)}:{}),...headers}},res=>{
   const chunks=[];res.on('data',data=>chunks.push(data));res.on('end',()=>{
    try{resolve({status:res.statusCode,headers:new Headers(res.headers),data:JSON.parse(Buffer.concat(chunks).toString('utf8'))});}catch(error){reject(error);}
   });
  });req.on('error',reject);req.end(payload);
 });
 assert.match(result.headers.get('content-type')||'',/application\/json/,path);
 assert.equal(result.headers.get('cache-control'),'no-store',path);
 assert.equal(result.headers.get('access-control-allow-origin'),null,path);
 return result;
}
function put(server,token,input,headers={}){
 return api(server,'/api/local/record',{method:'PUT',headers:{Origin:server.base,'Content-Type':'application/json','x-fieldwork-token':token,...headers},body:input});
}
try{
 let server=await start();let initial=await api(server);
 assert.equal(initial.status,200);assert.equal(initial.data.format,'fieldwork-local-v1');assert.deepEqual(initial.data.records,{});
 assert.ok(/^[0-9a-f-]{36}$/.test(initial.data.databaseId));assert.match(initial.data.token,/^[a-f0-9]{64}$/);
 assert.equal(initial.data.databasePath,join(await realpath(dataDirectory),'fieldwork.sqlite'));
 const databaseId=initial.data.databaseId;let token=initial.data.token;
 assert.equal((await readFile(initial.data.databasePath)).subarray(0,16).toString(),'SQLite format 3\u0000');
 if(process.platform!=='win32'){
  assert.equal((await stat(dataDirectory)).mode&0o777,0o700);
  for(const suffix of ['','-wal','-shm'])assert.equal((await stat(initial.data.databasePath+suffix)).mode&0o777,0o600);
 }
 assert.equal((await fetch(server.base+'/')).status,200);
 for(const worker of ['/runner.js','/wiki-worker.js']){
  const response=await fetch(server.base+worker);assert.equal(response.status,200);
  assert.match(response.headers.get('content-security-policy'),/connect-src 'none'/);
  assert.match(response.headers.get('content-security-policy'),/worker-src 'none'/);
  assert.match(response.headers.get('content-security-policy'),/script-src 'self' blob: 'unsafe-eval'/);
 }
 assert.equal((await fetch(server.base+'/vendor/pdfjs/pdf.worker.mjs')).headers.get('content-security-policy'),null);
 assert.equal((await fetch(server.base+'/fieldwork.sqlite')).status,404);
 assert.equal((await fetch(server.base+'/../.env')).status,404);
 assert.equal((await api(server,'/api/local/unknown')).status,404);
 assert.equal((await api(server,'/api/local/status',{method:'POST'})).status,405);
 for(const headers of [{Origin:'https://evil.example'},{Origin:'null'},{Origin:'http://localhost:'+server.port},{'Sec-Fetch-Site':'cross-site'},{'Sec-Fetch-Site':'same-site'},{Host:`evil.example:${server.port}`},{Host:'localhost'},{Host:`localhost:${server.port}.evil.example`}]){
  assert.equal((await api(server,'/api/local/status',{headers})).status,403,JSON.stringify(headers));
 }
 assert.equal((await api(server,'/',{headers:{Host:`evil.example:${server.port}`}})).status,403);
 assert.equal((await api(server,'/api/local/status',{headers:{Origin:server.base,'Sec-Fetch-Site':'same-origin','Sec-Fetch-Dest':'empty'}})).status,200);
 for(const destination of ['script','worker','document','iframe','image','object','']){
  assert.equal((await api(server,'/api/local/status',{headers:{'Sec-Fetch-Dest':destination}})).status,403,destination);
  assert.equal((await api(server,'/api/local/backup',{headers:{'Sec-Fetch-Dest':destination,'x-fieldwork-token':token}})).status,403,destination);
  assert.equal((await put(server,token,{key,value:'{}',revision:0},{'Sec-Fetch-Dest':destination})).status,403,destination);
 }
 assert.equal((await put(server,token,{key,value:'{}',revision:0},{Origin:'null'})).status,403);
 assert.equal((await put(server,token,{key,value:'{}',revision:0},{Origin:'https://evil.example'})).status,403);
 assert.equal((await api(server,'/api/local/record',{method:'PUT',headers:{'Content-Type':'application/json','x-fieldwork-token':token},body:{key,value:'{}',revision:0}})).status,403);
 assert.equal((await put(server,'wrong-token',{key,value:'{}',revision:0})).status,403);
 assert.equal((await put(server,token,{key,value:'{}',revision:0},{'Content-Type':'text/plain'})).status,415);
 for(const input of [null,[],{}, {key:'fieldwork.pdf',value:'{}',revision:0},{key:'__proto__',value:'{}',revision:0},{key,value:'{}',revision:-1},{key,value:'{}',revision:0.5},{key,value:'{}',revision:Number.MAX_SAFE_INTEGER},{key,value:'{}',revision:'0'},{key,value:12,revision:0},{key,value:'not json',revision:0},{key,value:'[]',revision:0},{key,value:'null',revision:0},{key,value:'true',revision:0},{key,value:'{}',revision:0,unexpected:true},{key:readerKey,value:'yes',revision:0}]){
  assert.equal((await put(server,token,input)).status,400,JSON.stringify(input));
 }
 assert.equal((await api(server,'/api/local/record',{method:'PUT',headers:{Origin:server.base,'Content-Type':'application/json','x-fieldwork-token':token},body:'{"broken'})).status,400);
 assert.deepEqual((await api(server)).data.records,{},'Invalid requests must not modify data');
 const progress=JSON.stringify({version:1,lessons:['lesson-01'],notes:{lesson:'Unicode ✓ survives'},code:{lab:'const answer = 42;'}});
 assert.deepEqual(await put(server,token,{key,value:progress,revision:0}).then(result=>[result.status,result.data]),[200,{revision:1}]);
 const conflict=await put(server,token,{key,value:'{}',revision:0});
 assert.equal(conflict.status,409);assert.deepEqual(conflict.data.record,{value:progress,revision:1});
 assert.equal((await put(server,token,{key:wikiKey,value:JSON.stringify({draft:'console.log("saved")'}),revision:0})).status,200);
 assert.equal((await put(server,token,{key:readerKey,value:'closed',revision:0})).status,200);
 const notes=JSON.stringify({page:18,annotations:[]});
 assert.equal((await put(server,token,{key:bookKey,value:notes,revision:0})).status,200);
 assert.equal((await api(server,'/api/local/backup')).status,403);
 const backup=await api(server,'/api/local/backup',{headers:{'x-fieldwork-token':token}});
 assert.equal(backup.status,200);assert.equal(backup.data.format,'fieldwork-local-backup');assert.equal(backup.data.version,1);
 assert.deepEqual(backup.data.records,{[bookKey]:notes,[readerKey]:'closed',[key]:progress,[wikiKey]:JSON.stringify({draft:'console.log("saved")'})});
 assert.ok(backup.headers.get('content-disposition').includes('attachment'));assert.ok(!JSON.stringify(backup.data).includes('SQLite'));
 assert.equal((await api(server,'/api/local/backup',{headers:{'x-fieldwork-token':token,Origin:'null'}})).status,403);
 assert.equal((await put(server,token,{key:wikiKey,value:null,revision:1})).data.revision,2);
 const tombstone=(await api(server)).data.records[wikiKey];assert.deepEqual(tombstone,{value:null,revision:2});
 assert.equal((await put(server,token,{key:wikiKey,value:'{}',revision:0})).status,409,'Deletion must not reset the revision');
 assert.equal(Object.hasOwn((await api(server,'/api/local/backup',{headers:{'x-fieldwork-token':token}})).data.records,wikiKey),false);
 assert.equal((await put(server,token,{key:wikiKey,value:'{}',revision:2})).data.revision,3);
 const oldToken=token;await stop(server);
 server=await start();initial=await api(server);token=initial.data.token;
 assert.equal(initial.data.databaseId,databaseId);assert.notEqual(token,oldToken);assert.equal(initial.data.records[key].value,progress);
 assert.equal((await put(server,oldToken,{key,value:'{}',revision:1})).status,403,'A prior server token expires');
 // A separate running process, browser, address and port all share the same DB.
 const second=await start();const secondStatus=await api(second);assert.equal(secondStatus.data.databaseId,databaseId);
 assert.equal((await api({...second,base:`http://localhost:${second.port}`})).data.records[key].value,progress);
 const concurrent=await Promise.all([put(server,token,{key,value:JSON.stringify({session:'first'}),revision:1}),put(second,secondStatus.data.token,{key,value:JSON.stringify({session:'second'}),revision:1})]);
 assert.deepEqual(concurrent.map(result=>result.status).sort(),[200,409]);
 const committed=(await api(server)).data.records[key];assert.equal(committed.revision,2);assert.deepEqual((await api(second)).data.records[key],committed);
 await stop(second);
 // Stored-record and HTTP-body limits are independent and must leave data intact.
 const tooLarge=JSON.stringify({text:'x'.repeat(MAX_RECORD_BYTES)});
 assert.equal((await put(server,token,{key:wikiKey,value:tooLarge,revision:3})).status,413);
 assert.equal((await api(server)).data.records[wikiKey].revision,3);
 const largeBody='x'.repeat(MAX_REQUEST_BYTES+1);
 assert.equal((await api(server,'/api/local/record',{method:'PUT',headers:{Origin:server.base,'Content-Type':'application/json','x-fieldwork-token':token},body:largeBody})).status,413);
 // A chunked request cannot bypass Content-Length-based request limits.
 const chunked=await new Promise((resolve,reject)=>{
  const req=request(server.base+'/api/local/record',{method:'PUT',headers:{Origin:server.base,'Content-Type':'application/json','x-fieldwork-token':token,'Transfer-Encoding':'chunked'}},res=>{
   let text='';res.on('data',bytes=>text+=bytes);res.on('end',()=>resolve({status:res.statusCode,data:JSON.parse(text)}));
  });req.on('error',reject);req.write(largeBody.slice(0,MAX_REQUEST_BYTES));req.end(largeBody.slice(MAX_REQUEST_BYTES));
 });assert.equal(chunked.status,413);assert.match(chunked.data.error,/too large/);
 assert.equal((await api(server)).data.records[wikiKey].revision,3);
 await stop(server);
 const blockedFile=join(temporary,'not-a-directory');await writeFile(blockedFile,'x');
 const failed=await start({directory:blockedFile,expectFailure:true});assert.match(failed.output,/No server was started/);
 const published=await start({directory:join(root,'dist'),expectFailure:true});assert.match(published.output,/outside the published dist/);
 const linkedDirectory=join(temporary,'published-link');await symlink(join(root,'dist'),linkedDirectory,process.platform==='win32'?'junction':'dir');
 assert.match((await start({directory:linkedDirectory,expectFailure:true})).output,/resolves inside the published dist/);
 const badDatabaseDirectory=join(temporary,'invalid-db');await mkdir(badDatabaseDirectory);await writeFile(join(badDatabaseDirectory,'fieldwork.sqlite'),'not a database');
 assert.match((await start({directory:badDatabaseDirectory,expectFailure:true})).output,/No server was started/);
 const staticServer=await start({directory:blockedFile,staticOnly:true});
 assert.equal((await fetch(staticServer.base+'/')).status,200);assert.equal((await api(staticServer)).status,404);
 assert.match(staticServer.output,/Static preview/);await stop(staticServer);
 // Verify the logical database ceiling inside a transaction without shipping
 // dozens of large HTTP bodies. The rejected operation rolls back completely.
 const limitDatabase=await openLocalDatabase({dataDirectory:join(temporary,'limit-data'),staticDirectory:join(root,'dist')});
 try{
  const value=JSON.stringify({draft:'x'.repeat(MAX_RECORD_BYTES-100)});
  for(let i=0;i<8;i++)limitDatabase.put({key:'fieldwork.book-notes.v1.'+i.toString(16).padStart(64,'0'),value,revision:0});
  assert.throws(()=>limitDatabase.put({key,value:JSON.stringify({text:'x'.repeat(1024)}),revision:0}),/64 MiB/);
  assert.equal(limitDatabase.status().records[key],undefined);
  // Shrinking/deleting a record frees logical capacity without removing its CAS tombstone.
  limitDatabase.put({key:'fieldwork.book-notes.v1.'+'0'.repeat(64),value:null,revision:1});
  assert.deepEqual(limitDatabase.put({key,value:'{}',revision:0}),{revision:1});
 }finally{limitDatabase.close();}
 console.log('Local SQLite checks passed: real database, private permissions, restart/browser/port persistence, atomic conflicts and tombstones, origin/Host/token isolation, validated records and size limits, backups, startup failures, and static preview.');
}finally{
 for(const server of live){server.child.kill('SIGTERM');await server.exit;}
 await rm(temporary,{recursive:true,force:true});
}
