const CACHE='fieldwork-v4-wiki-playground';
const FILES=['./','./index.html','./styles.css','./app.js','./content-loader.js','./wiki.js','./wiki-playground.js','./wiki-runner.js','./wiki-worker.js','./wiki-execution.js','./wiki-code.js','./vendor/acorn.js','./wiki.css','./wiki-playground.css','./data/wiki.json','./wiki-reference.md','./runner.js','./data/curriculum.json','./data/labs.json','./data/library.json','./handbook.md'];
async function validAsset(request,response){
 if(!response?.ok||response.redirected)return false;
 const path=new URL(typeof request==='string'?request:request.url,self.location.href).pathname;
 const type=(response.headers.get('content-type')||'').toLowerCase();
 if(path.endsWith('.json')){
  if(!/(?:application|text)\/(?:[a-z0-9.+-]*\+)?json\b/.test(type))return false;
  try{JSON.parse(await response.clone().text());return true;}catch{return false;}
 }
 if(path.endsWith('.js'))return /(?:java|ecma)script/.test(type);
 if(path.endsWith('.css'))return type.includes('text/css');
 if(!path.endsWith('/')&&!path.endsWith('.html')&&type.includes('text/html'))return false;
 if(type.includes('text/html')&&/signin-with-chatgpt|<title>Sign in required/i.test(await response.clone().text()))return false;
 return true;
}
self.addEventListener('install',event=>event.waitUntil((async()=>{
 // Never cache a sign-in page under a JSON, JavaScript, or stylesheet URL.
 const responses=await Promise.all(FILES.map(async path=>{
  const response=await fetch(new URL(path,self.location.href),{credentials:'same-origin',cache:'reload'});
  if(!await validAsset(path,response))throw Error(`Cannot cache ${path}`);
  return [path,response];
 }));
 const cache=await caches.open(CACHE);
 await Promise.all(responses.map(([path,response])=>cache.put(path,response)));
 await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('fieldwork-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/signin-')||url.pathname.startsWith('/auth'))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  let response;
  try{response=await fetch(event.request);}catch{
   const cached=await cache.match(event.request);
   if(await validAsset(event.request,cached))return cached;
   return new Response('Offline: this file is not available in your saved studio.',{status:503,headers:{'Content-Type':'text/plain'}});
  }
  if(await validAsset(event.request,response))event.waitUntil(cache.put(event.request,response.clone()).catch(()=>{}));
  // Auth failures go to the loader. Cached data does not mask an expired session.
  return response;
 })());
});
