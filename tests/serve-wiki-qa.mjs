// Development-only browser QA: run with Node, then open the printed URL.
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const dist=resolve(import.meta.dirname,'../dist');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.md':'text/markdown'};
createServer(async(req,res)=>{
 try{
  const name=new URL(req.url,'http://localhost').pathname;
  const path=name==='/__editor-qa'?resolve(import.meta.dirname,'editor-browser.html'):name==='/__lesson-qa'?resolve(import.meta.dirname,'lesson-playground-browser.html'):name==='/__playground-qa'?resolve(import.meta.dirname,'playground-browser.html'):name==='/__wiki-qa'?resolve(import.meta.dirname,'wiki-browser.html'):resolve(dist,'.'+(name==='/'?'/index.html':name));
  if(!['/__wiki-qa','/__playground-qa','/__lesson-qa','/__editor-qa'].includes(name)&&!path.startsWith(dist+sep))throw Error('Invalid path');
  const body=await readFile(path);
  res.writeHead(200,{'Content-Type':types[extname(path)]||'text/plain','Cache-Control':'no-store'}).end(body);
 }catch{res.writeHead(404).end('Not found');}
}).listen(Number(process.env.PORT)||4182,'127.0.0.1',()=>console.log(`Wiki browser QA: http://127.0.0.1:${process.env.PORT||4182}/__playground-qa`));
