import {studyStorage} from './study-storage.js';
const names=key=>key==='fieldwork.progress.v1'?'Course progress and notebook':key==='fieldwork.wiki-code.v1'?'Lesson and wiki drafts':key==='fieldwork.book-reader-open.v1'?'Reader preference':'Book notes · '+key.slice(-8);
export function dataSettingsPage({esc}){
 const s=studyStorage.status();
 return `<div class="page-intro"><div><span class="eyebrow">A PLACE FOR YOUR PROGRESS</span><h1>Your work stays with you.</h1><p>Keep studying across sessions, keep a backup, and choose where your data lives.</p></div></div>
 <section class="data-summary"><span class="eyebrow">${s.mode==='local'?'DESKTOP DATABASE':'BROWSER STORAGE'}</span><h2 data-storage-summary>${esc(studyStorage.label())}</h2>
 <p>${s.mode==='local'?'Your local server writes progress, notes, answers, lab code, playground drafts, and book annotations to SQLite on this computer. The database stays outside Git and published files.':'This copy saves in the current browser. To keep data independently of the browser, run the desktop project with npm start.'}</p>
 ${s.databasePath?`<p><strong>Database file</strong><br><code class="data-path">${esc(s.databasePath)}</code></p>`:''}
 <p data-storage-detail role="status"></p><button class="button outline small" data-data-action="retry">Check saves / retry</button>
 ${s.mode==='local'?'<small>Wait for “Saved to local database” before closing. PDF bytes remain in this browser’s private file storage; the database stores annotations only.</small>':'<small>Clearing browser data removes this copy’s progress. Export before changing browsers or accounts.</small>'}</section>
 <section class="run-options data-backups"><div class="run-card"><span class="eyebrow">ONE BACKUP FOR YOUR STUDY DATA</span><h2>Take a complete copy.</h2><p>Includes course progress, notebook, code drafts, quiz answers, reading position, and book notes. Never includes the PDF.</p><button class="button dark" data-data-action="export-window">Export this window ↓</button>${s.mode==='local'?'<button class="button outline" data-data-action="export-database">Export database ↓</button>':''}<small>This-window export includes pending edits. Database export contains committed records only.</small></div>
 <div class="run-card"><span class="eyebrow">RESTORE ON ANOTHER COPY</span><h2>Bring your work back.</h2><p>Import an all-data backup here. Matching records are replaced; other records stay. A recovery copy of this window is kept before import.</p><button class="button orange" data-data-action="import">Import all-data backup ↑</button><input type="file" data-data-file accept=".json,application/json" hidden><small>Older progress backups still import through My notebook; older book-note backups import in the reader.</small></div></section>
 <section class="run-instructions" data-conflicts></section><section class="run-instructions" data-recoveries></section>
 <section class="run-transfer"><span class="eyebrow">YOUR ACCOUNT IS NOT YOUR DATA</span><h2>Open the project in another Codex account.</h2><p>Keep this project folder or clone your private GitHub repository. Open the folder in Codex after signing into the other account. The desktop database stays in your operating-system user folder.</p><p>To publish a new Site owned by that account, run <code>npm run prepare:new-account</code> and open the generated folder. The guide includes a ready-to-use Codex prompt. A new hosted address starts with its own browser data; import a backup to continue there.</p><a class="button outline small" href="new-account.md" download>Download new-account guide ↓</a><p>Local SQLite does not sync to a hosted Site. No OpenAI API key is needed to use the local app.</p></section>`;
}
function download(value,prefix='fieldwork-local-backup'){
 const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));
 const link=document.createElement('a');link.href=url;link.download=`${prefix}-${new Date().toISOString().replace(/[:.]/g,'-')}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function bindDataSettings(root,{esc,toast,reload}){
 const $=selector=>root.querySelector(selector);
 if(!$('[data-storage-summary]'))return;
 function update(){
  const s=studyStorage.status();
  $('[data-storage-summary]').textContent=studyStorage.label();
  $('[data-storage-detail]').textContent=s.error||(s.pending?`${s.pending} record(s) waiting to save. ${s.journalUnavailable?'Browser recovery is unavailable; keep this window open until saved.':'Pending edits have a browser recovery copy.'}`:'');
  $('[data-conflicts]').hidden=!s.conflicts.length&&!s.blocked;
  $('[data-conflicts]').innerHTML=`<h2>Choose which version to keep.</h2><p>Another window changed the same record, or this server opened a different database. Export this window first if you need both versions.</p>${s.blocked?'<button class="button outline small" data-use-database>Use this server’s database</button>':''}${s.conflicts.map(key=>`<div class="data-conflict"><strong>${esc(names(key))}</strong><button class="button outline small" data-conflict-key="${esc(key)}" data-choice="database">Use database version</button><button class="button outline small" data-conflict-key="${esc(key)}" data-choice="window">Keep this window’s version</button></div>`).join('')}`;
  $('[data-recoveries]').hidden=!s.recoveries.length;
  $('[data-recoveries]').innerHTML=`<h2>Recovery copies</h2><p>These are pending changes from another window, or snapshots made before an import or database switch. Export one, inspect it, then use Import all-data backup if needed. Another open window may still be using its copy.</p>${s.recoveries.map(r=>`<div class="data-conflict"><span>${esc(r.updatedAt)} · ${r.count} record(s)${r.sameDatabase?'':' · other database'}</span><button class="button outline small" data-recovery="${esc(r.id)}">Export recovery ↓</button></div>`).join('')}`;
 }
 const unsubscribe=studyStorage.subscribe(update);update();
 root.addEventListener('click',async function handler(e){
  const button=e.target.closest('[data-data-action],[data-conflict-key],[data-use-database],[data-recovery]');if(!button)return;
  try{
   if(button.dataset.dataAction==='export-window')download(studyStorage.exportWindow());
   if(button.dataset.dataAction==='export-database')download(await studyStorage.exportDatabase());
   if(button.dataset.dataAction==='import')$('[data-data-file]').click();
   if(button.dataset.dataAction==='retry'){await studyStorage.flush();update();const s=studyStorage.status();if(s.needsReload)reload();}
   if(button.dataset.recovery)download(studyStorage.recovery(button.dataset.recovery),'fieldwork-local-recovery');
   if(button.hasAttribute('data-use-database')&&confirm('Switch to this server’s saved data? A recovery copy of this window will be kept.')){await studyStorage.useDatabase();reload();}
   if(button.dataset.conflictKey&&confirm(button.dataset.choice==='window'?'Replace this record in the database with this window’s version?':'Use the database version of this record? Export this window first if you need its changes.')){
    await studyStorage.resolveConflict(button.dataset.conflictKey,button.dataset.choice);
    reload();
   }
  }catch(error){toast(error.message);}
 });
 $('[data-data-file]').onchange=async event=>{
  const input=event.target;
  try{
   const file=input.files[0];if(!file)return;
   if(file.size>64*1024*1024)throw Error('Backup is too large (64 MiB maximum).');
   const backup=JSON.parse(await file.text());
   if(!confirm('Import this all-data backup? Matching records will be replaced. A recovery copy will be kept.'))return;
   studyStorage.importRecords(backup);await studyStorage.flush();
   reload();
  }catch(error){toast(error.message);}finally{input.value='';}
 };
 return unsubscribe;
}
