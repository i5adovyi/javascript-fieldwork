import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

export function hostedURL(value){
 let url;try{url=new URL(value);}catch{throw new Error('Pass the exact HTTPS URL returned by Sites after publication.');}
 if(url.protocol!=='https:'||!url.hostname.endsWith('.chatgpt.site')||url.username||url.password||url.port||url.search||url.hash||url.pathname!=='/')throw new Error('Expected a plain https://<your-site>.chatgpt.site/ URL without credentials, path, query, or fragment.');
 return url.href;
}
export async function configureHosted(value,{root=resolve(import.meta.dirname,'..')}={}){
 const url=hostedURL(value),path=resolve(root,'dist/site-config.js');
 const source=await readFile(path,'utf8');
 if(!/^export const CONFIGURED_HOSTED_URL=.*;$/m.test(source))throw new Error('Could not find CONFIGURED_HOSTED_URL in dist/site-config.js.');
 await writeFile(path,source.replace(/^export const CONFIGURED_HOSTED_URL=.*;$/m,`export const CONFIGURED_HOSTED_URL=${JSON.stringify(url)};`));
 return url;
}
async function main(){
 const args=process.argv.slice(2);
 if(args.length!==2||args[0]!=='--url')throw new Error('Usage: npm run configure:hosted -- --url https://your-site.chatgpt.site/');
 console.log(`Hosted launch link updated: ${await configureHosted(args[1])}\nThis changes only the public link, not Site ownership or hosting.json. Run checks, commit, and publish the source update when ready.`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)main().catch(error=>{console.error(error.message);process.exitCode=1;});
