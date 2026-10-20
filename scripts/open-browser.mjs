import {spawn} from 'node:child_process';
export function browserCommand(url,platform=process.platform){
 const parsed=new URL(url);
 if(!['http:','https:'].includes(parsed.protocol))throw new TypeError('Expected an HTTP URL');
 if(platform==='darwin')return ['open',[url]];
 if(platform==='win32')return ['rundll32.exe',['url.dll,FileProtocolHandler',url]];
 return ['xdg-open',[url]];
}
export function openBrowser(url){
 const [command,args]=browserCommand(url);
 const child=spawn(command,args,{stdio:'ignore',shell:false});
 child.on('error',()=>console.error(`Could not open your browser automatically. Open ${url} yourself.`));
 child.on('exit',code=>{if(code)console.error(`Browser launcher exited with ${code}. Open ${url} yourself.`);});
}
