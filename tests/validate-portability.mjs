import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtemp,mkdir,readFile,writeFile,rm,lstat,symlink,realpath,chmod} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {prepareNewAccount,excludedPath,archiveFiles} from '../scripts/prepare-new-account.mjs';
import {hostedURL,configureHosted} from '../scripts/configure-hosted.mjs';

const temp=await realpath(await mkdtemp(join(tmpdir(),'fieldwork-portability-')));
function git(root,...args){
 const result=spawnSync('git',args,{cwd:root,encoding:'utf8',windowsHide:true});
 assert.equal(result.status,0,`Git fixture command failed: ${args[0]}: ${result.stderr}`);return result.stdout.trim();
}
async function file(root,path,text){await mkdir(join(root,path,'..'),{recursive:true});await writeFile(join(root,path),text);}
async function absent(path){await assert.rejects(lstat(path),{code:'ENOENT'});}
try{
 const root=join(temp,'javascript-fieldwork');await mkdir(root);
 git(root,'init','--quiet');git(root,'config','user.name','Portability test');git(root,'config','user.email','test@example.invalid');
 const originalManifest=JSON.stringify({project_id:'original-account-fixture',static:{directory:'dist'}});
 await file(root,'.openai/hosting.json',originalManifest);
 await file(root,'dist/index.html','<!doctype html><title>Fixture</title>');
 await file(root,'dist/site-config.js',"export const CONFIGURED_HOSTED_URL='https://original.chatgpt.site/';\nexport const SOURCE_URL='https://github.com/example/fixture';\n");
 await file(root,'docs/NEW-ACCOUNT.md','# New account fixture');
 await file(root,'AGENTS.md','# Fixture instructions');
 await file(root,'dist/study-pack.zip','fixture public learning materials');
 const longPath='docs/'+('reading-'.repeat(20))+'notes-ž.md';
 await file(root,longPath,'long UTF-8 path');
 await file(root,'Start Fieldwork.command','#!/bin/sh\n# Fixture only\n');await chmod(join(root,'Start Fieldwork.command'),0o755);
 const privatePaths=['book.pdf','secrets/.env','private.key','data/fieldwork.sqlite','data/fieldwork.sqlite-wal','data/fieldwork.sqlite-shm','saved.db','notes/fieldwork-backup-fixture.json','notes/fieldwork-book-notes-fixture.json','notes/fieldwork-local-backup-fixture.json','notes/fieldwork-local-recovery-fixture.json','Fieldwork-private-backups/private.json','node_modules/example/index.js','tmp/private.txt','.openai/token.local.json'];
 for(const path of privatePaths)await file(root,path,'synthetic fixture, not personal data');
 git(root,'add','.');git(root,'commit','--quiet','-m','Fixture');
 await file(root,'untracked-private.json','never export untracked data');
 await file(root,'dist/index.html','uncommitted source change');
 const result=await prepareNewAccount({source:root});
 const dest=join(temp,'javascript-fieldwork-new-account');
 assert.equal(result.destination,dest);assert.equal(result.uncommittedChangesExcluded,true);
 assert.equal(await readFile(join(dest,'dist/index.html'),'utf8'),'<!doctype html><title>Fixture</title>');
 assert.deepEqual(JSON.parse(await readFile(join(dest,'.openai/hosting.json'),'utf8')),{static:{directory:'dist'}});
 const config=await readFile(join(dest,'dist/site-config.js'),'utf8');
 assert.match(config,/CONFIGURED_HOSTED_URL='';/);assert.ok(!config.includes('original.chatgpt.site'));
 assert.match(config,/SOURCE_URL='https:\/\/github.com\/example\/fixture'/);
 assert.match(await readFile(join(dest,'NEW-ACCOUNT-START-HERE.md'),'utf8'),new RegExp(result.commit));
 for(const path of [...privatePaths.filter(path=>path!=='.openai/hosting.json'),'.git','untracked-private.json'])await absent(join(dest,path));
 assert.equal(await readFile(join(dest,'dist/study-pack.zip'),'utf8'),'fixture public learning materials');
 assert.equal(await readFile(join(dest,longPath),'utf8'),'long UTF-8 path');
 if(process.platform!=='win32')assert.ok((await lstat(join(dest,'Start Fieldwork.command'))).mode&0o111);
 assert.equal(await readFile(join(root,'.openai/hosting.json'),'utf8'),originalManifest);
 assert.equal(await readFile(join(root,'dist/index.html'),'utf8'),'uncommitted source change');
 await assert.rejects(prepareNewAccount({source:root}),/already exists/);
 await assert.rejects(prepareNewAccount({source:root,destination:join(root,'new-account')}),/outside the original/);
 await assert.rejects(prepareNewAccount({source:root,destination:temp}),/outside the original/);
 const empty=join(temp,'existing-empty');await mkdir(empty);
 await assert.rejects(prepareNewAccount({source:root,destination:empty}),/already exists/);
 assert.ok((await lstat(empty)).isDirectory());
 const explicit=await prepareNewAccount({source:root,destination:join(temp,'custom-copy')});assert.equal(explicit.destination,join(temp,'custom-copy'));
 for(const path of ['nested/BOOK.PDF','.ENV.production','folder/test.sqlite3-journal','x/fieldwork-local-backup-2026-01-01.json'])assert.equal(excludedPath(path),true,path);
 for(const path of ['dist/book-storage.js','docs/PRIVATE-READER-QA.md','dist/data/curriculum.json'])assert.equal(excludedPath(path),false,path);
 const unsafe=Buffer.alloc(1024);unsafe.write('../escape',0);unsafe.write('00000000000\0',124);unsafe.write('0',156);
 assert.throws(()=>archiveFiles(unsafe),/Unsafe path/);
 if(process.platform!=='win32'){
  await symlink('/outside/fixture',join(root,'unsafe-link'));git(root,'add','unsafe-link');git(root,'commit','--quiet','-m','Symlink fixture');
  await assert.rejects(prepareNewAccount({source:root,destination:join(temp,'blocked-symlink')}),/non-regular tracked file/);
  await absent(join(temp,'blocked-symlink'));
 }
 assert.equal(hostedURL('https://a-new-site.chatgpt.site'),'https://a-new-site.chatgpt.site/');
 for(const url of ['http://a.chatgpt.site/','https://evil.invalid/','https://chatgpt.site.evil.invalid/','https://user:pass@a.chatgpt.site/','https://a.chatgpt.site/path','https://a.chatgpt.site/?token=private','https://a.chatgpt.site/#/dashboard'])assert.throws(()=>hostedURL(url),/Expected|Pass/);
 await configureHosted('https://new-fixture.chatgpt.site/',{root:dest});
 assert.match(await readFile(join(dest,'dist/site-config.js'),'utf8'),/CONFIGURED_HOSTED_URL="https:\/\/new-fixture.chatgpt.site\/";/);
 assert.deepEqual(JSON.parse(await readFile(join(dest,'.openai/hosting.json'),'utf8')),{static:{directory:'dist'}});
 console.log('Account portability: committed-only export, identity reset, private-file filters, no-overwrite protection, original preservation, safe paths, and hosted-link configuration pass.');
}finally{await rm(temp,{recursive:true,force:true});}
