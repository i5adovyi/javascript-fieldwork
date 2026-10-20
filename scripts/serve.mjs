import {createServer} from 'node:http';
import {readFile,stat,realpath} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {openBrowser} from './open-browser.mjs';
import {openLocalDatabase,LocalDataError,MAX_REQUEST_BYTES} from './local-database.mjs';
const root=fileURLToPath(new URL('../dist',import.meta.url));
const learnerWorkerPolicy="default-src 'none'; connect-src 'none'; worker-src 'none'; script-src 'self' blob: 'unsafe-eval'";
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.wasm':'application/wasm','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.json':'application/json','.md':'text/markdown','.svg':'image/svg+xml'};
const port=Number(process.env.PORT||4187);
if(!Number.isInteger(port)||port<1||port>65535){
 console.error('PORT must be an integer between 1 and 65535. Default: 4187.');process.exit(1);
}
const staticOnly=process.argv.includes('--static');
const allowedHosts=new Set([`localhost:${port}`,`127.0.0.1:${port}`]);
if(port===80){allowedHosts.add('localhost');allowedHosts.add('127.0.0.1');}
const token=randomBytes(32).toString('hex');
let database;
function json(res,status,body,extra={}){
 res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...extra}).end(JSON.stringify(body));
}
function reject(res,status,error){json(res,status,{error});}
function sameOrigin(req){return req.headers.origin===`http://${req.headers.host}`;}
function hasToken(req){
 const supplied=req.headers['x-fieldwork-token'];
 if(typeof supplied!=='string')return false;
 const a=Buffer.from(supplied),b=Buffer.from(token);
 return a.length===b.length&&timingSafeEqual(a,b);
}
async function readJSON(req){
 if(req.headers['content-length']&&Number(req.headers['content-length'])>MAX_REQUEST_BYTES){req.resume();throw new LocalDataError('The request body is too large.',413);}
 return new Promise((resolve,reject)=>{
  const chunks=[];let bytes=0,settled=false;
  req.on('data',chunk=>{
   if(settled)return;
   bytes+=chunk.length;
   if(bytes>MAX_REQUEST_BYTES){settled=true;chunks.length=0;reject(new LocalDataError('The request body is too large.',413));return;}
   chunks.push(chunk);
  });
  req.once('end',()=>{
   if(settled)return;settled=true;
   try{resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));}catch{reject(new LocalDataError('The request body must be valid JSON.'));}
  });
  req.once('error',()=>{if(!settled){settled=true;reject(new LocalDataError('The request body could not be read.'));}});
 });
}
async function localAPI(req,res,path){
 const origin=req.headers.origin,fetchSite=req.headers['sec-fetch-site'],fetchDestination=req.headers['sec-fetch-dest'];
 // A same-origin JSON module import has a script destination and can bypass a
 // worker's connect-src policy. Only ordinary fetch/XHR may read local data.
 if(fetchDestination!==undefined&&fetchDestination!=='empty'){reject(res,403,'Local data must be requested through the Fieldwork application.');return;}
 if((origin!==undefined&&!sameOrigin(req))||(fetchSite!==undefined&&!['same-origin','none'].includes(fetchSite))){reject(res,403,'Local data is accessible only from this Fieldwork address.');return;}
 if(!database){reject(res,404,'Local database is disabled in static preview mode.');return;}
 if(req.method==='GET'&&path==='/api/local/status'){json(res,200,{...database.status(),token});return;}
 if(req.method==='GET'&&path==='/api/local/backup'){
  if(!hasToken(req)){reject(res,403,'A local session token is required.');return;}
  json(res,200,database.backup(),{'Content-Disposition':`attachment; filename="fieldwork-local-backup-${new Date().toISOString().slice(0,10)}.json"`});return;
 }
 if(path==='/api/local/record'&&req.method==='PUT'){
  if(!sameOrigin(req)||!hasToken(req)){reject(res,403,'A matching Origin and local session token are required.');return;}
  if(!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type']||'')){reject(res,415,'Use Content-Type: application/json.');return;}
  const result=database.put(await readJSON(req));
  if(result.conflict){json(res,409,{error:'This record changed in another session. Reload or resolve the conflict before saving.',record:result.record});return;}
  json(res,200,result);return;
 }
 if(['/api/local/status','/api/local/backup','/api/local/record'].includes(path)){reject(res,405,'This API route does not support that method.');return;}
 reject(res,404,'Unknown local API route.');
}
const server=createServer(async(req,res)=>{
 // Validate Host on every route before rendering a page that can read the API.
 // This blocks DNS rebinding; the server never listens on a network interface.
 if(!allowedHosts.has(req.headers.host)){reject(res,403,'Use the localhost or 127.0.0.1 address printed by Fieldwork.');return;}
 let name;
 try{name=decodeURIComponent(new URL(req.url,`http://${req.headers.host}`).pathname);}catch{reject(res,400,'The request URL is invalid.');return;}
 if(name==='/api'||name.startsWith('/api/')){
  try{await localAPI(req,res,name);}catch(error){
   if(error instanceof LocalDataError)reject(res,error.status,error.message);
   else{console.error(`Local data request failed: ${error.code||error.message}`);reject(res,500,'Local data could not be saved or read. Your earlier committed data has been kept. Check the terminal and export a backup.');}
  }
  return;
 }
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD','Content-Type':'text/plain','Cache-Control':'no-store'}).end('Method not allowed');return;}
 try{
  let file=resolve(root,'.'+name);
  if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403).end();return;}
  if((await stat(file)).isDirectory())file=resolve(file,'index.html');
  // realpath prevents a symlink in dist from exposing private local files.
  file=await realpath(file);
  if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403).end();return;}
  const body=await readFile(file),type=types[extname(file)]||'application/octet-stream';
  res.writeHead(200,{'Content-Type':type+(type.startsWith('text/')||type==='application/json'?'; charset=utf-8':''),'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff',...(['/runner.js','/wiki-worker.js'].includes(name)?{'Content-Security-Policy':learnerWorkerPolicy}:{})}).end(req.method==='HEAD'?undefined:body);
 }catch{res.writeHead(404,{'Content-Type':'text/plain','Cache-Control':'no-store'}).end('Not found');}
});
server.on('error',error=>{
 console.error(error.code==='EADDRINUSE'
  ? `Port ${port} is already in use. If Fieldwork is already running, open http://localhost:${port}. Otherwise use PORT=4197 npm start (PowerShell: $env:PORT=4197; npm start). Local database progress follows the same data directory across ports.`
  : `Local server could not start (${error.code||error.message}).`);
 database?.close();process.exitCode=1;
});
let shuttingDown=false;
function shutdown(){
 if(shuttingDown)return;shuttingDown=true;
 server.close(()=>{database?.close();process.exitCode=0;});
 server.closeIdleConnections();
}
process.once('SIGINT',shutdown);process.once('SIGTERM',shutdown);
try{
 if(!staticOnly)database=await openLocalDatabase({staticDirectory:root});
 server.listen(port,'127.0.0.1',()=>{
  const url=`http://localhost:${port}`;
  console.log(`JavaScript Fieldwork: ${url}\n${staticOnly?'Static preview — data stays in this browser.':`Local SQLite database: ${database.databasePath}`}\nKeep this terminal open. Press Control-C to stop.`);
  if(process.argv.includes('--open'))openBrowser(url);
 });
}catch(error){
 console.error(`Fieldwork could not open its local database: ${error.message}\nNo server was started. Fix the data directory or runtime, then try again.`);
 process.exitCode=1;
}
