import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {openBrowser} from './open-browser.mjs';
const root=resolve(import.meta.dirname,'../dist');
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.wasm':'application/wasm','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.json':'application/json','.md':'text/markdown','.svg':'image/svg+xml'};
const port=Number(process.env.PORT||4187);
if(!Number.isInteger(port)||port<1||port>65535){
 console.error('PORT must be an integer between 1 and 65535. Default: 4187.');process.exit(1);
}
const server=createServer(async(req,res)=>{
 try{
 const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 let file=resolve(root,'.'+name);
 if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403).end();return;}
 if((await stat(file)).isDirectory())file=resolve(file,'index.html');
 const body=await readFile(file),type=types[extname(file)]||'application/octet-stream';
 res.writeHead(200,{'Content-Type':type+(type.startsWith('text/')||type==='application/json'?'; charset=utf-8':''),'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'}).end(body);
 }catch{res.writeHead(404,{'Content-Type':'text/plain'}).end('Not found');}
});
server.on('error',error=>{
 console.error(error.code==='EADDRINUSE'
  ? `Port ${port} is already in use. If Fieldwork is already running, open http://localhost:${port}. Otherwise use PORT=4197 npm start (PowerShell: $env:PORT=4197; npm start). Keep using the same address for saved progress.`
  : `Local server could not start (${error.code||error.message}).`);
 process.exitCode=1;
});
server.listen(port,'127.0.0.1',()=>{
 const url=`http://localhost:${port}`;
 console.log(`JavaScript Fieldwork: ${url}\nLocal mode — keep this terminal open. Press Control-C to stop.`);
 if(process.argv.includes('--open'))openBrowser(url);
});
