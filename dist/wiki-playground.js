import {runWikiExample} from './wiki-runner.js';
import {createCodeEditor} from './code-editor.js';

const DRAFT_KEY='fieldwork.wiki-code.v1';
const browserVersions={
  'node-files': {
    note:'Browser version: read a File in memory using .text(). The original below uses Node’s filesystem; this playground cannot read disk paths.',
    code:`// A browser File contains bytes, a name, and metadata.
const file = new File(
  ['import { readFile } from "node:fs/promises";'],
  "inspect-file.mjs", { type: "text/javascript" }
);
const sourceText = await file.text();
console.log(typeof sourceText);
console.log(sourceText.includes("node:fs/promises"));`
  },
  'node-streams': {
    note:'Browser version: Web Streams use ReadableStream, WritableStream, and pipeTo(). The original below uses Node streams and pipeline().',
    code:`const encoder = new TextEncoder();
const source = new ReadableStream({
  start(controller) {
    controller.enqueue(encoder.encode("QA"));
    controller.enqueue(encoder.encode(" ready"));
    controller.close();
  }
});
let totalBytes = 0;
const sink = new WritableStream({
  write(chunk) { totalBytes += chunk.byteLength; }
});
await source.pipeTo(sink);
console.log(totalBytes);`
  },
  'testing-tools': {
    note:'Browser version: small explicit assertion helpers run the same three checks. The original below uses Node’s assert module.',
    code:`function equal(actual, expected) {
  if (!Object.is(actual, expected)) {
    throw new Error(\`Expected \${expected}, received \${actual}\`);
  }
}
async function rejects(action, pattern) {
  try { await action(); }
  catch (error) {
    if (pattern.test(error.message)) return;
    throw error;
  }
  throw new Error("Expected the action to reject");
}
async function cartTotal(loadItems) {
  const items = await loadItems();
  return items.reduce((sum, item) => sum + item.priceCents, 0);
}
equal(await cartTotal(async () => [
  { priceCents: 250 }, { priceCents: 500 }
]), 750);
equal(await cartTotal(async () => []), 0);
await rejects(
  () => cartTotal(async () => { throw new Error("offline"); }),
  /offline/
);
console.log("3 checks passed");`
  }
};

export function playgroundExample(article) {
  if (article.playground) return article.playground;
  const version=browserVersions[article.id];
  return {
    files:article.example.files || {'example.js':version?.code || article.example.code},
    module:article.example.runtime==='module',
    dom:['dom','events','browser-storage'].includes(article.id),
    note:version?.note || (article.id==='browser-storage'
      ? 'Storage methods use fresh in-memory storage for each run. Your saved project data is separate.'
      : article.example.runtime==='module'
        ? 'Edit either file, then Run example to load app.mjs with real ES module imports. Local files only; circular imports are not supported.'
        : ['dom','events'].includes(article.id)
          ? 'Runs in an isolated document. Append elements to document.body to see and interact with them in the preview.'
          : 'Runs in a fresh Web Worker. Top-level await is supported. Use a DOM topic for document and window APIs.'),
    original:!!version || article.example.runtime==='module'
  };
}

export function playgroundMarkup(article,esc,codeBlock) {
  const example=playgroundExample(article),names=Object.keys(example.files),name=names[0];
  const editorId=`example-${article.id}-code`,helpId=`example-${article.id}-help`;
  return `<div class="wiki-playground" data-playground="${esc(article.id)}" data-playground-kind="${article.kind==='lesson'?'lesson':'wiki'}" role="group" aria-label="${esc(article.title)} example">
    <div class="wiki-playground-heading"><span class="tiny-label">TRY IT YOURSELF</span><span class="wiki-save-state" data-draft-status>Original example</span></div>
    <p class="wiki-playground-note">${esc(example.note)}</p>
    <div class="wiki-file-tabs" role="group" aria-label="Example files">${names.map((file,i)=>`<button type="button" data-example-file="${esc(file)}" aria-pressed="${i===0}">${esc(file)}</button>`).join('')}</div>
    <label class="sr-only" data-example-label for="${esc(editorId)}">Code editor for ${esc(name)}</label>
    <div data-example-editor data-editor-id="${esc(editorId)}" data-editor-help="${esc(helpId)}" class="wiki-code-editor"><pre>${esc(example.files[name])}</pre></div>
    <div class="wiki-run-toolbar"><div><button type="button" class="button orange small" data-example-run>Run example <span aria-hidden="true">▶</span></button><button type="button" class="button outline small" data-example-stop disabled>Stop</button></div><div><button type="button" class="text-button" data-example-suggest>Suggest code</button><button type="button" class="text-button" data-example-copy>Copy code</button><button type="button" class="text-button" data-example-reset>Reset example</button></div></div>
    <div class="wiki-run-meta"><span id="${esc(helpId)}">⌘ / Ctrl + Enter to run · Ctrl + Space for suggestions · Tab to accept · Esc to dismiss · 3 second limit</span><span role="status" data-run-status>Ready to experiment</span></div>
    <div class="wiki-console"><div class="wiki-console-heading"><span class="tiny-label">YOUR OUTPUT</span><button type="button" class="text-button" data-example-clear>Clear</button></div><pre data-example-output aria-label="Example console output">Run the example to see its output.</pre></div>
    ${example.dom?'<div class="wiki-preview"><span class="tiny-label">BROWSER PREVIEW</span><div data-example-preview><p>Run the example to open its isolated document.</p></div></div>':''}
    <details class="wiki-expected"><summary>Expected output of the original example</summary><pre>${esc(article.example.output)}</pre></details>
    ${example.original?`<details class="wiki-original"><summary>${esc(example.originalLabel||(article.example.runtime==='node'?'Original Node example':'Original module files'))}</summary>${codeBlock(article.example.code)}</details>`:''}
  </div>`;
}

export function bindPlayground(root,article) {
  const example=playgroundExample(article);
  let files={...example.files},active=Object.keys(files)[0],cancel,runNumber=0;
  const $=selector=>root.querySelector(selector);
  const editorHost=$('[data-example-editor]'),output=$('[data-example-output]'),status=$('[data-run-status]');
  const run=$('[data-example-run]'),stop=$('[data-example-stop]'),saved=$('[data-draft-status]');
  function readDrafts() {
    const value=JSON.parse(localStorage.getItem(DRAFT_KEY)||'{}');
    return value&&typeof value==='object'&&!Array.isArray(value)?value:{};
  }
  try {
    const draft=readDrafts()[article.id];
    for(const name of Object.keys(files))if(typeof draft?.[name]==='string'&&draft[name].length<=100000)files[name]=draft[name];
    if(draft)saved.textContent='Draft restored from this device';
  }catch{saved.textContent='Draft storage unavailable';}
  function save() {
    try {
      const drafts=readDrafts();
      if(Object.keys(files).every(name=>files[name]===example.files[name]))delete drafts[article.id];
      else drafts[article.id]=files;
      localStorage.setItem(DRAFT_KEY,JSON.stringify(drafts));
      saved.textContent=Object.keys(files).every(name=>files[name]===example.files[name])?'Original example':'Draft saved on this device';
    }catch{saved.textContent='Session only · copy code to keep it';}
  }
  const editor=createCodeEditor({parent:editorHost,files,active,id:editorHost.dataset.editorId,describedBy:editorHost.dataset.editorHelp,dom:example.dom,
    onChange:(name,code)=>{files[name]=code;save();},onRun:start});
  function showFile() {
    editor.showFile(active);
    $('[data-example-label]').textContent=`Code editor for ${active}`;
    root.querySelectorAll('[data-example-file]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.exampleFile===active)));
  }
  showFile();
  root.querySelectorAll('[data-example-file]').forEach(button=>button.addEventListener('click',()=>{active=button.dataset.exampleFile;showFile();}));
  function cleanup() {runNumber++;cancel?.();cancel=null;run.disabled=false;stop.disabled=true;}
  function start() {
    cleanup();
    const number=runNumber;
    output.replaceChildren();output.dataset.empty='false';status.textContent='Running…';run.disabled=true;stop.disabled=false;
    cancel=runWikiExample({
      code:files[active],files:example.module?{...files}:undefined,dom:example.dom,preview:$('[data-example-preview]'),
      onEvent:event=>{
        if(number!==runNumber)return;
        if(event.type==='clear'){output.replaceChildren();output.dataset.empty='false';}
        if(event.type==='log'){
          if(output.dataset.empty==='true'){output.replaceChildren();output.dataset.empty='false';}
          const line=document.createElement('span');line.className=`wiki-log-${event.level}`;
          line.textContent=event.text+'\n';output.append(line);output.scrollTop=output.scrollHeight;
        }
        if(event.type==='done'){
          status.textContent=event.error?'Check the error below':example.dom?'Finished · preview is interactive':'Finished';
          run.disabled=false;stop.disabled=!(example.dom&&!event.error);
          if(!output.textContent){output.textContent='Finished without console output.';output.dataset.empty='true';}
        }
      }
    });
  }
  run.addEventListener('click',start);
  $('[data-example-suggest]').addEventListener('click',()=>editor.suggest());
  stop.addEventListener('click',()=>{cleanup();status.textContent='Stopped';});
  $('[data-example-reset]').addEventListener('click',()=>{
    cleanup();files={...example.files};editor.reset(files);showFile();save();
    output.textContent='Run the example to see its output.';status.textContent='Original example restored';
  });
  $('[data-example-clear]').addEventListener('click',()=>output.replaceChildren());
  $('[data-example-copy]').addEventListener('click',async event=>{
    try{await navigator.clipboard.writeText(editor.getValue());event.target.textContent='Copied';}
    catch{editor.select();event.target.textContent='Select and copy the code';}
  });
  return ()=>{cleanup();editor.destroy();};
}
