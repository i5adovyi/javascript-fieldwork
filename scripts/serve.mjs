import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve(import.meta.dirname,'../dist');
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.wasm':'application/wasm','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.json':'application/json','.md':'text/markdown','.svg':'image/svg+xml'};
const port=Number(process.env.PORT||4173);
createServer(async(req,res)=>{
 try{
 const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 let file=resolve(root,'.'+name);
 if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403).end();return;}
 if((await stat(file)).isDirectory())file=resolve(file,'index.html');
 const body=await readFile(file),type=types[extname(file)]||'application/octet-stream';
 res.writeHead(200,{'Content-Type':type+(type.startsWith('text/')||type==='application/json'?'; charset=utf-8':''),'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'}).end(body);
 }catch{res.writeHead(404,{'Content-Type':'text/plain'}).end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`JavaScript Fieldwork: http://localhost:${port}`));
