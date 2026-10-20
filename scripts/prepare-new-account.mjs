import {spawnSync} from 'node:child_process';
import {lstat, mkdir, realpath, rm, writeFile} from 'node:fs/promises';
import {basename, dirname, isAbsolute, join, relative, resolve, sep} from 'node:path';
import {pathToFileURL} from 'node:url';

// Source export only. This script never registers a Site or reads personal saves.
export function excludedPath(path){
 const parts=path.toLowerCase().split('/');
 const name=parts.at(-1);
 return parts.some(part=>['.git','.openai','node_modules','tmp','.cache','fieldwork-private-backups','private-backups','backups'].includes(part))
  || /^\.env(?:\.|$)/.test(name)
  || /\.(?:pdf|pem|key|p12|pfx|db|sqlite|sqlite3)(?:-(?:wal|shm|journal))?$/.test(name)
  || /^(?:fieldwork-backup-|fieldwork-book-notes-|fieldwork-local-backup-|fieldwork-local-recovery-)/.test(name)
  || name==='new-account-start-here.md'
  || /\.(?:tar\.gz|zip|bundle)$/.test(name) && !path.startsWith('dist/');
}
function git(cwd,args,{binary=false}={}){
 const result=spawnSync('git',args,{cwd,encoding:binary?null:'utf8',maxBuffer:128*1024*1024,windowsHide:true});
 if(result.error)throw new Error(`Git is required to export committed source: ${result.error.message}`);
 if(result.status!==0)throw new Error(`Git ${args[0]} failed. Check that this is a Git checkout with a committed HEAD.`);
 return result.stdout;
}
function tarString(block,start,length){return block.subarray(start,start+length).toString('utf8').replace(/\0.*$/s,'');}
function paxFields(data){
 const fields={};let offset=0;
 while(offset<data.length){
  const space=data.indexOf(32,offset);
  const size=Number(data.subarray(offset,space).toString('ascii'));
  if(space<0||!Number.isInteger(size)||size<=space-offset+1||offset+size>data.length)throw new Error('Invalid Git archive metadata.');
  const record=data.subarray(space+1,offset+size-1).toString('utf8');
  const eq=record.indexOf('=');
  if(eq>0)fields[record.slice(0,eq)]=record.slice(eq+1);
  offset+=size;
 }
 return fields;
}
export function archiveFiles(archive){
 const files=[];let next={};
 for(let offset=0;offset+512<=archive.length;){
  const block=archive.subarray(offset,offset+512);offset+=512;
  if(block.every(byte=>byte===0))break;
  const size=parseInt(tarString(block,124,12).trim(),8);
  if(!Number.isSafeInteger(size)||size<0||offset+size>archive.length)throw new Error('Invalid Git archive size.');
  const body=archive.subarray(offset,offset+size);offset+=Math.ceil(size/512)*512;
  const type=tarString(block,156,1)||'0';
  if(type==='g'){paxFields(body);continue;}
  if(type==='x'){next=paxFields(body);continue;}
  const prefix=tarString(block,345,155);
  const path=next.path||(prefix?prefix+'/':'')+tarString(block,0,100);next={};
  if(!path||path.includes('\\')||path.includes('\0')||isAbsolute(path)||/^[a-z]:/i.test(path)||path.split('/').some(part=>part==='.'||part==='..'))throw new Error('Unsafe path in Git archive.');
  if(excludedPath(path)||type==='5')continue;
  if(type!=='0')throw new Error(`Cannot export non-regular tracked file: ${path}. Remove symlinks/submodules from the export first.`);
  const mode=parseInt(tarString(block,100,8).trim(),8);
  files.push({path,body,mode:mode&0o111?0o755:0o644});
 }
 return files;
}
export async function prepareNewAccount({source=resolve(import.meta.dirname,'..'),destination}={}){
 const root=await realpath(resolve(source));
 if(resolve(git(root,['rev-parse','--show-toplevel']).trim())!==root)throw new Error('Run this script from the Fieldwork repository, not a nested or unrelated checkout.');
 const requested=resolve(destination||join(dirname(root),basename(root)+'-new-account'));
 const dest=join(await realpath(dirname(requested)),basename(requested));
 const within=(parent,child)=>{const path=relative(parent,child);return !path||path!=='..'&&!path.startsWith('..'+sep)&&!isAbsolute(path);};
 if(within(root,dest)||within(dest,root))throw new Error('Choose a separate destination outside the original project.');
 try{await lstat(dest);throw new Error(`Destination already exists; nothing was changed: ${dest}`);}catch(error){if(error.code!=='ENOENT')throw error;}
 const commit=git(root,['rev-parse','HEAD']).trim();
 const dirty=Boolean(git(root,['status','--porcelain']).trim());
 const files=archiveFiles(git(root,['archive','--format=tar','HEAD'],{binary:true}));
 if(!files.some(file=>file.path==='dist/index.html')||!files.some(file=>file.path==='docs/NEW-ACCOUNT.md'))throw new Error('Committed source is missing the app or new-account guide. Commit the portability changes before exporting.');
 const config=files.find(file=>file.path==='dist/site-config.js');
 if(!config||!/^export const CONFIGURED_HOSTED_URL=.*;$/m.test(config.body.toString('utf8')))throw new Error('Committed source has no supported Site configuration. Commit the portability changes before exporting.');
 config.body=Buffer.from(config.body.toString('utf8').replace(/^export const CONFIGURED_HOSTED_URL=.*;$/m,"export const CONFIGURED_HOSTED_URL='';"));
 // mkdir is the no-overwrite gate, including an empty existing destination.
 await mkdir(dest,{recursive:false});
 try{
  for(const file of files){
   const output=join(dest,file.path);await mkdir(dirname(output),{recursive:true});
   await writeFile(output,file.body,{flag:'wx',mode:file.mode});
  }
  await mkdir(join(dest,'.openai'),{recursive:true});
  await writeFile(join(dest,'.openai','hosting.json'),JSON.stringify({static:{directory:'dist'}},null,2)+'\n',{flag:'wx'});
  await writeFile(join(dest,'NEW-ACCOUNT-START-HERE.md'),`# Continue Fieldwork in a new account\n\nExported from commit \`${commit}\`. This folder contains committed source only.\n\nOpen this folder as a local project in Codex while signed in to your new account. Read **AGENTS.md** and **docs/NEW-ACCOUNT.md**.\n\nRun \`npm start\` to study locally. Publishing a new Site is a separate step that requires Sites access in the new account. This copy has no Site identity and no configured hosted URL. The original Site and checkout were not changed.\n\nNo private PDF, learner exports, local database, or Git credentials were copied. Learner data remains in its existing browser or application-data directory; see the guide before importing or moving it.\n`,{flag:'wx'});
 }catch(error){await rm(dest,{recursive:true,force:true});throw error;}
 return {destination:dest,commit,uncommittedChangesExcluded:dirty,files:files.length};
}
async function main(){
 const args=process.argv.slice(2);
 if(args.length===1&&args[0]==='--help'){
  console.log('Usage: npm run prepare:new-account -- [--dest /path/to/new-folder]\nExports committed HEAD into a new folder, strips the old Site identity, and preserves the original checkout. Commit intended changes first.');return;
 }
 if(args.length&&!(args.length===2&&args[0]==='--dest'&&args[1]))throw new Error('Usage: npm run prepare:new-account -- [--dest /path/to/new-folder]');
 const result=await prepareNewAccount({destination:args[1]});
 console.log(`New-account source ready: ${result.destination}\nSource commit: ${result.commit}\nOpen docs/NEW-ACCOUNT.md in that folder. Nothing was published; the original Site is unchanged.`);
 if(result.uncommittedChangesExcluded)console.warn('Notice: uncommitted and untracked changes were excluded. Commit intended source changes and export to another new folder if needed.');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)main().catch(error=>{console.error(`New-account export failed: ${error.message}`);process.exitCode=1;});
