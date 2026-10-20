import {studyStorage as localStorage} from './study-storage.js';
import {getDocument,GlobalWorkerOptions,TextLayer} from './vendor/pdfjs/pdf.mjs';
import {createBookStore,validateBookNotes,mergeBookAnnotations} from './book-storage.js';
import {BOOK_MAP} from './book-map.js';
import {createBookFileStore,MAX_BOOK_FILE_BYTES} from './book-file-storage.js';

GlobalWorkerOptions.workerSrc=new URL('./vendor/pdfjs/pdf.worker.mjs',import.meta.url).href;
const asset=name=>new URL(`./vendor/pdfjs/${name}/`,import.meta.url).href;
const COLORS=['yellow','green','pink'];
const MAX_PDF_BYTES=MAX_BOOK_FILE_BYTES;
const READER_OPEN_KEY='fieldwork.book-reader-open.v1';
const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
const copy=value=>structuredClone(value);

export function createBookReader({toast=()=>{}}={}){
  const pane=document.createElement('aside');
  pane.id='book-reader';pane.className='book-reader';pane.hidden=true;
  pane.setAttribute('aria-label','Your private book reader');
  pane.innerHTML=`
    <header class="br-header"><div><span class="br-eyebrow">READ ALONG / YOUR PRIVATE COPY</span><h2>The reading room.</h2></div><button type="button" class="br-icon-button" data-br="close" aria-label="Close book reader" title="Close reader · Escape">×</button></header>
    <div class="br-book-bar"><div class="br-book-identity"><strong data-br-filename>No book selected</strong><span data-br-privacy>Your PDF and notes stay on this device.</span></div><button type="button" class="br-button br-primary" data-br="choose">Choose PDF</button><input type="file" data-br-file accept="application/pdf,.pdf" hidden></div>
    <div class="br-memory"><span data-br-memory-status role="status">Optional: remember a private copy in this browser.</span><div><button type="button" class="br-text-button" data-br="remember" disabled>Remember PDF</button><button type="button" class="br-text-button" data-br="forget" hidden>Forget PDF</button></div></div>
    <details class="br-assignment" data-br-assignment open><summary aria-label="Expand or collapse current reading assignment"><span class="br-eyebrow">ALONGSIDE YOUR LESSON</span><strong data-br-assignment-title>Choose a lesson or explore your book</strong><span class="br-edition-indicator" data-br-edition-indicator hidden>Check edition</span></summary><div class="br-reading-links" data-br-ranges></div><p data-br-edition hidden></p></details>
    <div class="br-notice" data-br-notice role="status" aria-live="polite">Choose your own PDF to read and annotate alongside the lesson.</div>
    <div class="br-loading" data-br-loading hidden><span data-br-loading-label>Opening your PDF locally…</span><button type="button" class="br-button" data-br="cancel-load">Cancel</button></div>
    <div class="br-controls" data-br-controls><div class="br-page-navigation"><button type="button" class="br-icon-button" data-br="previous" aria-label="Previous PDF page" disabled>←</button><label for="br-page-number">PDF page</label><input id="br-page-number" type="number" min="1" value="1" inputmode="numeric" disabled><span data-br-page-count>/ —</span><button type="button" class="br-icon-button" data-br="next" aria-label="Next PDF page" disabled>→</button></div><div class="br-zoom"><button type="button" class="br-icon-button" data-br="zoom-out" aria-label="Zoom out" disabled>−</button><span data-br-zoom-value>Fit</span><button type="button" class="br-icon-button" data-br="zoom-in" aria-label="Zoom in" disabled>+</button><button type="button" class="br-button br-compact" data-br="fit" disabled>Fit width</button></div></div>
    <div class="br-annotation-tools"><div class="br-colors" role="group" aria-label="Highlight color">${COLORS.map((color,index)=>`<button type="button" class="br-color br-color-${color}" data-br-color="${color}" aria-label="${color[0].toUpperCase()+color.slice(1)} highlight" aria-pressed="${index===0}"><span aria-hidden="true">${index===0?'✓':''}</span></button>`).join('')}</div><button type="button" class="br-button br-compact" data-br="highlight" disabled>Highlight selection</button><button type="button" class="br-button br-compact" data-br="note" disabled>Add note</button><button type="button" class="br-button br-compact br-undo" data-br="undo" disabled>Undo</button></div>
    <div class="br-selection-status" data-br-selection role="status">Select a passage to highlight, or add a note to a page.</div>
    <div class="br-page-scroll" data-br-scroll tabindex="-1"><div class="br-empty" data-br-empty><span class="br-empty-symbol">{ read → try }</span><h3>Keep the source close.</h3><p>Open the book you own. Read the assigned pages, highlight a useful idea, and return to the code.</p><button type="button" class="br-button br-primary" data-br="choose">Choose your PDF</button><small>Local file only · up to 200 MB<br>Use Remember PDF to reopen it automatically after reload.</small></div><div class="br-page-wrap" data-br-page-wrap hidden></div></div>
    <details class="br-marks" data-br-marks><summary><span>Your book notes <b data-br-mark-count>0</b></span><span data-br-saved-state>Device only</span></summary><div class="br-marks-body"><div class="br-marks-toolbar"><label for="br-mark-filter">Show</label><select id="br-mark-filter"><option value="page">This page</option><option value="all">All pages</option></select><button type="button" class="br-button br-compact" data-br="export" disabled>Export notes ↓</button><button type="button" class="br-button br-compact" data-br="import" disabled>Import notes ↑</button><input type="file" data-br-import accept="application/json,.json" hidden></div>
    <form class="br-note-editor" data-br-editor hidden><label for="br-note-text" data-br-editor-title>Note for this page</label><blockquote data-br-editor-quote hidden></blockquote><textarea id="br-note-text" rows="4" maxlength="20000" placeholder="What does this help you understand?" aria-describedby="br-note-help"></textarea><small id="br-note-help">Your note and any selected quote stay on this device. Export notes to keep a backup.</small><div><button type="submit" class="br-button br-primary">Save note</button><button type="button" class="br-button" data-br="cancel-note">Cancel</button></div></form>
    <div class="br-marks-list" data-br-mark-list><p class="br-marks-empty">Your highlights and notes will appear here.</p></div><p class="br-backup-help">Notes exports contain your notes and selected quotes, never the PDF. They are separate from the studio progress backup.</p></div></details>
    <footer class="br-footer"><span data-br-footer>Read locally. Think for yourself.</span><button type="button" class="br-text-button" data-br="release" disabled>Release PDF</button></footer>`;
  document.body.append(pane);
  const $=selector=>pane.querySelector(selector);
  const action=name=>$(`[data-br="${name}"]`);
  const viewport=$('[data-br-scroll]'),pageWrap=$('[data-br-page-wrap]');
  let store,storageWarning='';
  try{store=createBookStore(localStorage);}catch(error){storageWarning=error.message||'Browser storage is unavailable.';}
  let pdf=null,bookId=null,fileName='',record={page:1,annotations:[]},pageNumber=1;
  let currentLesson=null,currentAssignment=null,pendingPage=null,opened=false,opener;
  let loadingTask=null,activeLoadingTask=null,loading=false,loadVersion=0,renderVersion=0,renderTask=null,textTask=null;
  let fitWidth=true,zoomScale=1,renderedScale=1,selected=null,currentColor='yellow',editing=null;
  let undoStack=[],sessionOnly=!store,allowStorageWrite=true,resizeTimer,lastViewportWidth=0;
  let currentTextLayer=null,currentOverlay=null,currentPageElement=null,focusedMark=null;
  let fileStore,localFile=null,rememberedId=null,rememberedName='',memoryBusy=false,memoryError='',memoryUnreadable=false;
  let restorePromise=null,restoreGeneration=0,memoryVersion=0;
  try{fileStore=createBookFileStore();}catch(error){memoryError=error.message;}

  function readerPreference(value){
    try{if(value!==undefined)localStorage.setItem(READER_OPEN_KEY,value?'open':'closed');return localStorage.getItem(READER_OPEN_KEY)!=='closed';}catch{return true;}
  }
  function memoryControls(){
    const remembered=!!bookId&&rememberedId===bookId;
    action('remember').hidden=remembered;
    action('remember').disabled=!fileStore||!pdf||!localFile||loading||memoryBusy||!!restorePromise;
    action('forget').hidden=!rememberedId&&!memoryUnreadable;
    action('forget').disabled=memoryBusy||!!restorePromise;
    action('release').disabled=action('release').disabled||memoryBusy;
    pane.querySelectorAll('[data-br="choose"]').forEach(button=>button.disabled=memoryBusy);
    const status=$('[data-br-memory-status]');
    status.dataset.warning=String(!!memoryError);
    status.textContent=memoryBusy?'Updating the private copy on this device…':memoryError||
      (remembered?'Remembered on this device · reopens after reload.':rememberedId?
       `Remembered: ${rememberedName}. Remember PDF replaces that local copy.`:
       pdf?'Session only. Remember PDF keeps a private copy in this browser.':'Optional: remember a private copy in this browser.');
  }
  async function rememberFile(){
    if(!pdf||!localFile||!fileStore||memoryBusy||restorePromise)return;
    const entry={bookId,name:fileName,blob:localFile};
    memoryBusy=true;memoryError='';memoryVersion++;controls();
    try{
      await fileStore.remember(entry);
      rememberedId=entry.bookId;rememberedName=entry.name;memoryUnreadable=false;
      notice('PDF remembered on this device. It will reopen after reload; nothing was uploaded.');
    }catch(error){
      memoryError=error.name==='QuotaExceededError'?'Not remembered: this browser has no space for another PDF. Free site storage and try again.':
        'Not remembered: local storage is unavailable. You can keep reading in this session and try again.';
      notice(memoryError,'warning');
    }finally{memoryBusy=false;controls();}
  }
  async function forgetFile(){
    if(!fileStore||memoryBusy||restorePromise)return;
    memoryBusy=true;memoryError='';memoryVersion++;restoreGeneration++;controls();
    try{
      await fileStore.forget();rememberedId=null;rememberedName='';memoryUnreadable=false;
      notice('Remembered copy removed. Your original file, highlights, and notes are unchanged. The open PDF lasts for this session.');
    }catch{
      memoryError='The remembered copy could not be removed. Try Forget PDF again; it may still reopen after reload.';
      notice(memoryError,'warning');
    }finally{memoryBusy=false;controls();}
  }
  function restoreRemembered({startup=false}={}){
    if(!fileStore||restorePromise||memoryBusy)return restorePromise;
    const generation=restoreGeneration,revision=memoryVersion;
    restorePromise=(async()=>{
      try{
        const saved=await fileStore.read();
        if(revision!==memoryVersion)return;
        rememberedId=saved?.bookId||null;rememberedName=saved?.name||'';memoryUnreadable=false;
        controls();
        if(!saved||pdf||generation!==restoreGeneration||(startup&&!readerPreference()))return;
        if(!opened)open({restore:false});
        await chooseFile(new File([saved.blob],saved.name,{type:'application/pdf'}),{restoring:true,expectedId:saved.bookId});
      }catch{
        if(revision!==memoryVersion)return;
        memoryUnreadable=true;memoryError='Could not read the remembered PDF. Choose your original file for this session, or use Forget PDF and try again.';
      }
    })().finally(()=>{restorePromise=null;controls();});
    return restorePromise;
  }

  function notice(text,kind='info'){
    const element=$('[data-br-notice]');element.textContent=text;element.dataset.kind=kind;
  }
  function destroyTask(task){
    // PDF.js 6 owns worker and document cleanup on the loading task.
    try{void Promise.resolve(task?.destroy()).catch(()=>{});}catch{}
  }
  function setColor(color){
    if(!COLORS.includes(color))return;
    currentColor=color;
    pane.querySelectorAll('[data-br-color]').forEach(button=>{
      const active=button.dataset.brColor===color;
      button.setAttribute('aria-pressed',String(active));button.firstElementChild.textContent=active?'✓':'';
    });
  }
  function controls(){
    const ready=!!pdf&&!loading;
    for(const name of ['previous','next','zoom-out','zoom-in','fit','note','export','import','release'])action(name).disabled=!ready;
    action('previous').disabled=!ready||pageNumber<=1;
    action('next').disabled=!ready||pageNumber>=pdf.numPages;
    action('highlight').disabled=!ready||!selected?.rects.length;
    action('undo').disabled=!ready||!undoStack.length;
    $('#br-page-number').disabled=!ready;
    $('#br-page-number').value=String(pageNumber);
    $('#br-page-number').max=String(pdf?.numPages||1);
    $('[data-br-page-count]').textContent=pdf?`/ ${pdf.numPages.toLocaleString()}`:'/ —';
    $('[data-br-loading]').hidden=!loading;
    $('[data-br-filename]').textContent=fileName||'No book selected';
    $('[data-br-mark-count]').textContent=String(record.annotations.length);
    $('[data-br-saved-state]').textContent=sessionOnly?'Session only · export notes':'Saved on this device';
    $('[data-br-saved-state]').dataset.unsaved=String(sessionOnly);
    $('[data-br-footer]').textContent=pdf?`PDF page ${pageNumber} · ${record.annotations.filter(mark=>mark.page===pageNumber).length} marks on this page`:'Read locally. Think for yourself.';
    memoryControls();
  }
  function persist(next,{quiet=false}={}){
    record=copy(next);
    if(store&&allowStorageWrite){
      try{record=store.save(bookId,record,pdf.numPages);sessionOnly=false;controls();return true;}
      catch(error){storageWarning=error.message||'Your browser could not save the notes.';}
    }
    sessionOnly=true;controls();
    notice(`${storageWarning||'Saved notes could not be read safely.'} Changes remain in this tab; export notes before closing or reloading.`,'warning');
    if(!quiet)toast('Book notes are in this tab only. Export them to keep your work.');
    return false;
  }
  function pushUndo(entry){undoStack.push(entry);if(undoStack.length>20)undoStack.shift();controls();}
  function clearSelection(){selected=null;action('highlight').disabled=true;$('[data-br-selection]').textContent='Select a passage to highlight, or add a note to a page.';}
  function captureSelection(){
    if(!opened||!pdf||loading||!currentTextLayer)return;
    const selection=window.getSelection();
    if(!selection||selection.isCollapsed||!selection.rangeCount){clearSelection();return;}
    const range=selection.getRangeAt(0);
    if(!currentTextLayer.contains(range.startContainer)||!currentTextLayer.contains(range.endContainer)){
      if(!pane.contains(selection.anchorNode))clearSelection();
      return;
    }
    const quote=selection.toString().trim();
    if(!quote)return;
    const bounds=currentPageElement.getBoundingClientRect(),rects=[],seen=new Set();
    for(const rect of range.getClientRects()){
      const left=Math.max(bounds.left,rect.left),right=Math.min(bounds.right,rect.right);
      const top=Math.max(bounds.top,rect.top),bottom=Math.min(bounds.bottom,rect.bottom);
      if(right-left<1||bottom-top<1)continue;
      const normalized={x:clamp((left-bounds.left)/bounds.width,0,1),y:clamp((top-bounds.top)/bounds.height,0,1),width:clamp((right-left)/bounds.width,0,1),height:clamp((bottom-top)/bounds.height,0,1)};
      normalized.width=Math.min(normalized.width,1-normalized.x);normalized.height=Math.min(normalized.height,1-normalized.y);
      const key=Object.values(normalized).map(n=>n.toFixed(5)).join(',');
      if(!seen.has(key)){seen.add(key);rects.push(normalized);}
    }
    if(rects.length>100||quote.length>10000){clearSelection();$('[data-br-selection]').textContent='Select a shorter passage: up to 100 lines and 10,000 characters per mark.';return;}
    selected=rects.length?{page:pageNumber,rects,quote}:null;
    $('[data-br-selection]').textContent=selected?`${quote.length.toLocaleString()} characters selected · choose a color, then highlight or add a note.`:'Select text in the PDF to create a highlight.';
    controls();
  }
  function drawMarks(){
    if(!currentOverlay)return;
    currentOverlay.replaceChildren();
    for(const mark of record.annotations.filter(mark=>mark.page===pageNumber)){
      for(const rect of mark.rects){
        const element=document.createElement('span');
        element.className=`br-highlight br-highlight-${mark.color}${mark.id===focusedMark?' br-highlight-focused':''}`;
        element.dataset.markId=mark.id;
        Object.assign(element.style,{left:`${rect.x*100}%`,top:`${rect.y*100}%`,width:`${rect.width*100}%`,height:`${rect.height*100}%`});
        currentOverlay.append(element);
      }
    }
  }
  function renderMarks(){
    const list=$('[data-br-mark-list]');list.replaceChildren();
    const all=$('#br-mark-filter').value==='all';
    const marks=record.annotations.filter(mark=>all||mark.page===pageNumber).sort((a,b)=>a.page-b.page||a.createdAt.localeCompare(b.createdAt));
    if(!marks.length){const message=document.createElement('p');message.className='br-marks-empty';message.textContent=all?'No notes yet. Select text to highlight or add a page note.':'No marks on this page. Choose All pages to see your other notes.';list.append(message);}
    for(const mark of marks){
      const card=document.createElement('article');card.className=`br-mark-card br-mark-${mark.color}`;card.dataset.markId=mark.id;
      const heading=document.createElement('button');heading.type='button';heading.className='br-mark-jump';heading.dataset.brMarkJump=mark.id;
      heading.textContent=`${mark.rects.length?'Highlight':'Page note'} · PDF page ${mark.page}`;
      card.append(heading);
      if(mark.quote){const quote=document.createElement('blockquote');quote.textContent=mark.quote;card.append(quote);}
      if(mark.note){const note=document.createElement('p');note.textContent=mark.note;card.append(note);}
      const tools=document.createElement('div');tools.className='br-mark-actions';
      for(const [name,label] of [['edit','Edit note'],['delete','Delete']]){
        const button=document.createElement('button');button.type='button';button.className='br-text-button';button.dataset.brMarkAction=name;button.dataset.markId=mark.id;button.textContent=label;button.setAttribute('aria-label',`${label} on PDF page ${mark.page}`);tools.append(button);
      }
      card.append(tools);list.append(card);
    }
    controls();drawMarks();
  }
  function updateAssignment(){
    const ranges=currentAssignment?.ranges||[];
    $('[data-br-assignment-title]').textContent=currentAssignment?.label||currentLesson?.title||'Choose a lesson or explore your book';
    const holder=$('[data-br-ranges]');holder.replaceChildren();
    for(const range of ranges){
      const button=document.createElement('button');button.type='button';button.className='br-range';button.dataset.brPage=String(range.start);
      const label=document.createElement('strong');label.textContent=range.label;
      const pages=document.createElement('span');pages.textContent=`PDF ${range.start}${range.end!==range.start?'–'+range.end:''} ↗`;
      button.append(label,pages);holder.append(button);
    }
    const warning=$('[data-br-edition]');
    const mismatch=pdf&&BOOK_MAP.expectedPageCount&&pdf.numPages!==BOOK_MAP.expectedPageCount;
    warning.hidden=!mismatch;
    $('[data-br-edition-indicator]').hidden=!mismatch;
    warning.textContent=mismatch?`This PDF has ${pdf.numPages.toLocaleString()} pages. Lesson links use the ${BOOK_MAP.expectedPageCount.toLocaleString()}-page reference copy; verify section headings in your edition.`:'';
  }
  function cancelRendering(){
    renderVersion++;
    try{renderTask?.cancel();}catch{}
    try{textTask?.cancel();}catch{}
    renderTask=null;textTask=null;
  }
  async function renderPage({scrollTop=true,markId=null}={}){
    cancelRendering();clearSelection();
    if(!pdf||!opened)return;
    const version=renderVersion,documentRef=pdf,requestedPage=pageNumber;
    currentTextLayer=null;currentOverlay=null;currentPageElement=null;
    pageWrap.replaceChildren();pageWrap.hidden=false;$('[data-br-empty]').hidden=true;
    const status=document.createElement('p');status.className='br-rendering';status.textContent=`Rendering PDF page ${requestedPage}…`;pageWrap.append(status);
    controls();
    try{
      const page=await documentRef.getPage(requestedPage);
      if(version!==renderVersion||pdf!==documentRef||!opened)return;
      const base=page.getViewport({scale:1});
      const availableWidth=Math.max(180,viewport.clientWidth-32);
      const fitScale=availableWidth/base.width;
      const scale=fitWidth?clamp(fitScale,.15,3):clamp(zoomScale,.15,4);
      renderedScale=scale;
      $('[data-br-zoom-value]').textContent=`${Math.round(scale*100)}%`;
      action('fit').setAttribute('aria-pressed',String(fitWidth));
      const view=page.getViewport({scale});
      const pageElement=document.createElement('div');pageElement.className='br-pdf-page';
      pageElement.style.width=`${view.width}px`;pageElement.style.height=`${view.height}px`;
      pageElement.style.setProperty('--total-scale-factor',String(scale));
      pageElement.style.setProperty('--scale-round-x','1px');pageElement.style.setProperty('--scale-round-y','1px');
      const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');
      const ratio=Math.min(window.devicePixelRatio||1,2,Math.sqrt(16000000/(view.width*view.height)));
      canvas.width=Math.ceil(view.width*ratio);canvas.height=Math.ceil(view.height*ratio);canvas.style.width=`${view.width}px`;canvas.style.height=`${view.height}px`;
      const overlay=document.createElement('div');overlay.className='br-highlight-layer';overlay.setAttribute('aria-hidden','true');
      const text=document.createElement('div');text.className='br-text-layer textLayer';text.tabIndex=0;
      text.setAttribute('role','textbox');text.setAttribute('aria-readonly','true');text.setAttribute('aria-multiline','true');text.setAttribute('aria-label',`Text of PDF page ${requestedPage}. Use Shift and arrow keys to select text. Typing is disabled.`);
      text.contentEditable='true';text.spellcheck=false;
      text.addEventListener('beforeinput',event=>event.preventDefault());text.addEventListener('paste',event=>event.preventDefault());text.addEventListener('drop',event=>event.preventDefault());
      text.addEventListener('mouseup',captureSelection);text.addEventListener('keyup',captureSelection);
      pageElement.append(canvas,overlay,text);pageWrap.replaceChildren(pageElement);
      currentPageElement=pageElement;currentTextLayer=text;currentOverlay=overlay;
      if(scrollTop){viewport.scrollTop=0;viewport.scrollLeft=0;}
      const canvasRender=page.render({canvasContext:canvas.getContext('2d',{alpha:false}),viewport:view,transform:ratio!==1?[ratio,0,0,ratio,0,0]:null});
      renderTask=canvasRender;
      await canvasRender.promise;
      if(version!==renderVersion||pdf!==documentRef||!opened)return;
      const textContent=await page.getTextContent();
      if(version!==renderVersion||pdf!==documentRef||!opened)return;
      const textRender=new TextLayer({textContentSource:textContent,container:text,viewport:view});textTask=textRender;
      // Explicit dimensions also support browsers without CSS round() in PDF.js layer sizing.
      text.style.width=`${view.rawDims.pageWidth*scale}px`;text.style.height=`${view.rawDims.pageHeight*scale}px`;
      await textRender.render();
      if(version!==renderVersion||pdf!==documentRef||!opened)return;
      renderTask=null;textTask=null;focusedMark=markId;drawMarks();
      if(markId)scrollToMark(markId);
      if(!textContent.items.some(item=>item.str?.trim()))notice('This page has no selectable text. You can still add a page note.','info');
      else if(!sessionOnly)notice('Select text to highlight. Focus the page text and use Shift + Arrow for keyboard selection.');
    }catch(error){
      if(version!==renderVersion||!opened||error.name==='RenderingCancelledException'||error.name==='AbortException')return;
      pageWrap.replaceChildren();const failure=document.createElement('div');failure.className='br-page-error';
      const title=document.createElement('strong');title.textContent='This page could not be rendered.';
      const message=document.createElement('p');message.textContent=error.message||'Try another page or reopen your PDF.';
      const retry=document.createElement('button');retry.type='button';retry.className='br-button';retry.dataset.br='retry-page';retry.textContent='Try this page again';failure.append(title,message,retry);pageWrap.append(failure);
      notice('Page rendering failed. Your saved notes are unchanged.','error');
    }
  }
  function scrollToMark(id){
    const mark=record.annotations.find(item=>item.id===id);
    if(mark?.rects.length&&currentPageElement)viewport.scrollTop=Math.max(0,mark.rects[0].y*currentPageElement.offsetHeight-viewport.clientHeight/3);
  }
  function goPage(value,{markId=null}={}){
    const number=Number(value);
    if(!Number.isInteger(number)||number<1){notice('Enter a whole PDF page number of 1 or greater.','warning');controls();return;}
    if(loading){pendingPage=number;notice(`PDF page ${number} will open when your selected document is ready.`);return;}
    if(!pdf){pendingPage=number;notice(`PDF page ${number} is ready. Choose your local copy to open it.`);return;}
    const requested=clamp(number,1,pdf.numPages);
    if(requested!==number)notice(`This document ends at PDF page ${pdf.numPages}.`,'warning');
    pageNumber=requested;focusedMark=markId;
    persist({...record,page:pageNumber},{quiet:true});renderMarks();void renderPage({markId});
  }
  function editorHasChanges(){return editing&&$('#br-note-text').value!==(editing.note||'');}
  function dismissEditor({ask=false}={}){
    if(ask&&editorHasChanges()&&!window.confirm('Discard the unsaved note draft?'))return false;
    editing=null;$('[data-br-editor]').hidden=true;return true;
  }
  function editNote(annotation=null){
    if(!pdf||loading||!dismissEditor({ask:true}))return;
    const context=selected?copy(selected):{page:pageNumber,quote:'',rects:[]};
    editing=annotation?copy(annotation):{...context,note:'',color:currentColor,type:context.rects.length?'highlight':'note'};
    setColor(editing.color);
    $('[data-br-editor-title]').textContent=`${annotation?'Edit':'New'} note · PDF page ${editing.page}`;
    const quote=$('[data-br-editor-quote]');quote.textContent=editing.quote;quote.hidden=!editing.quote;
    $('#br-note-text').value=editing.note||'';$('[data-br-editor]').hidden=false;$('[data-br-marks]').open=true;
    $('#br-note-text').focus();$('#br-note-text').scrollIntoView({block:'nearest'});
  }
  function saveAnnotation(annotation){
    if(record.annotations.length>=2000&&!record.annotations.some(item=>item.id===annotation.id)){notice('This book has reached 2,000 marks. Export your notes before removing any marks.','warning');return false;}
    const index=record.annotations.findIndex(item=>item.id===annotation.id),annotations=copy(record.annotations);
    if(index>=0)annotations[index]=annotation;
    else annotations.push(annotation);
    // Keep every in-memory state exportable even when browser storage is full.
    try{validateBookNotes({format:'fieldwork-book-notes',version:1,bookId,pageCount:pdf.numPages,page:pageNumber,annotations,exportedAt:new Date().toISOString()},bookId,pdf.numPages);}
    catch(error){notice(`This note could not be saved: ${error.message} Your existing notes are unchanged.`,'error');return false;}
    if(index>=0)pushUndo({kind:'edit',annotation:copy(record.annotations[index])});
    else pushUndo({kind:'add',id:annotation.id});
    const saved=persist({...record,annotations});renderMarks();
    if(saved)notice('Saved in this browser. Export your book notes to keep a backup.');
    return true;
  }
  function newAnnotation(context){const now=new Date().toISOString();return {id:crypto.randomUUID(),type:context.rects.length?'highlight':'note',page:context.page,color:currentColor,quote:context.quote||'',note:'',rects:copy(context.rects),createdAt:now,updatedAt:now};}
  function highlight(){
    captureSelection();if(!selected||!pdf)return;
    if(saveAnnotation(newAnnotation(selected))){clearSelection();window.getSelection()?.removeAllRanges();}
  }
  function undo(){
    if(!dismissEditor({ask:true}))return;
    const entry=undoStack.pop();if(!entry||!pdf)return;
    let annotations=copy(record.annotations);
    if(entry.kind==='add')annotations=annotations.filter(item=>item.id!==entry.id);
    if(entry.kind==='delete')annotations.splice(Math.min(entry.index,annotations.length),0,entry.annotation);
    if(entry.kind==='edit')annotations=annotations.map(item=>item.id===entry.annotation.id?entry.annotation:item);
    if(entry.kind==='import')annotations=annotations.filter(item=>!entry.ids.includes(item.id));
    persist({...record,annotations});dismissEditor();renderMarks();notice(sessionOnly?'Undone in this tab. Export notes to keep the change.':'Last note change undone.');
  }
  function cancelLoad(){
    loadVersion++;loading=false;
    const cancelled=loadingTask;loadingTask=null;destroyTask(cancelled);
    controls();notice(pdf?'Opening cancelled. Your previous PDF is still available.':'Opening cancelled. Choose a PDF when you are ready.');
  }
  async function chooseFile(file,{restoring=false,expectedId=null}={}){
    if(!file||memoryBusy)return;
    if(!restoring)restoreGeneration++;
    if(file.size>MAX_PDF_BYTES){notice('Choose a PDF smaller than 200 MB.','error');return;}
    if(file.type!=='application/pdf'&&!file.name.toLowerCase().endsWith('.pdf')){notice('Choose a PDF file.','error');return;}
    if(!dismissEditor({ask:true}))return;
    const version=++loadVersion;
    const previousLoad=loadingTask;loadingTask=null;destroyTask(previousLoad);
    loading=true;controls();$('[data-br-loading-label]').textContent='Reading your file locally…';notice('Opening your PDF on this device. No file upload takes place.');
    let candidate=null;
    try{
      if(!crypto.subtle)throw new Error('This browser needs a secure HTTPS or localhost page to identify your PDF privately.');
      const buffer=await file.arrayBuffer();if(version!==loadVersion)return;
      const digest=await crypto.subtle.digest('SHA-256',buffer);if(version!==loadVersion)return;
      const identity=Array.from(new Uint8Array(digest),byte=>byte.toString(16).padStart(2,'0')).join('');
      if(expectedId&&identity!==expectedId)throw new Error('The remembered PDF did not match its saved fingerprint. Forget it and choose your original file again.');
      if(bookId&&identity!==bookId&&sessionOnly&&record.annotations.length&&!window.confirm('Your current book has notes saved only in this tab. Cancel and export them before switching PDFs. Switch anyway?')){
        loading=false;controls();notice('Your current PDF and session notes are still available. Export notes before switching books.','warning');return;
      }
      $('[data-br-loading-label]').textContent='Preparing pages and text…';
      candidate=getDocument({data:new Uint8Array(buffer),cMapUrl:asset('cmaps'),cMapPacked:true,standardFontDataUrl:asset('standard_fonts'),wasmUrl:asset('wasm'),isEvalSupported:false,enableXfa:false});
      loadingTask=candidate;
      candidate.onPassword=()=>{if(version!==loadVersion)return;cancelLoad();notice('Password-protected PDFs are not supported here. Choose a copy you can open without a password.','error');};
      const documentRef=await candidate.promise;
      if(version!==loadVersion){destroyTask(candidate);return;}
      let restored={page:1,annotations:[]};allowStorageWrite=true;sessionOnly=!store;
      if(store){try{restored=store.load(identity,documentRef.numPages);}catch(error){allowStorageWrite=false;sessionOnly=true;storageWarning=error.message||'Saved notes could not be read.';}}
      // Reselecting the same file in this session also preserves any unsaved in-memory notes.
      if(identity===bookId)restored=copy(record);
      cancelRendering();const oldTask=activeLoadingTask;activeLoadingTask=candidate;pdf=documentRef;bookId=identity;fileName=file.name;record=restored;localFile=new Blob([file],{type:'application/pdf'});
      pageNumber=clamp(pendingPage||record.page||1,1,pdf.numPages);pendingPage=null;record.page=pageNumber;
      loading=false;loadingTask=null;undoStack=[];selected=null;fitWidth=true;focusedMark=null;
      pane.classList.add('has-book');$('[data-br-assignment]').open=false;
      destroyTask(oldTask);
      updateAssignment();controls();renderMarks();
      if(sessionOnly)notice(`${storageWarning||'Browser storage is unavailable.'} Keep a notes export before leaving this tab.`,'warning');
      else notice('Your PDF is open locally. Select a passage to highlight or add a page note.');
      persist(record,{quiet:true});void renderPage();
    }catch(error){
      if(version!==loadVersion)return;
      loading=false;loadingTask=null;destroyTask(candidate);controls();
      notice(`Could not open this PDF: ${error.message||'The file may be damaged or unsupported.'}${pdf?' Your previous PDF is still available.':''}`,'error');
    }
  }
  function exportNotes(){
    if(!pdf)return;
    try{
      const notes=validateBookNotes({format:'fieldwork-book-notes',version:1,bookId,pageCount:pdf.numPages,page:pageNumber,annotations:copy(record.annotations),exportedAt:new Date().toISOString()},bookId,pdf.numPages);
      const url=URL.createObjectURL(new Blob([JSON.stringify(notes,null,2)],{type:'application/json'}));
      const anchor=document.createElement('a');anchor.href=url;anchor.download=`fieldwork-book-notes-${bookId.slice(0,12)}-${new Date().toISOString().slice(0,10)}.json`;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
      notice('Notes export prepared. It includes your notes and selected quotes, never the PDF.');
    }catch(error){notice(`Notes could not be exported: ${error.message}`,'error');}
  }
  async function importNotes(file){
    if(!file||!pdf)return;
    const identity=bookId,pageCount=pdf.numPages;
    try{
      if(file.size>2*1024*1024)throw new Error('Notes backups must be 2 MB or smaller.');
      const incoming=validateBookNotes(await file.text(),identity,pageCount);
      if(bookId!==identity)return;
      const annotations=mergeBookAnnotations(record.annotations,incoming.annotations,pageCount);
      validateBookNotes({format:'fieldwork-book-notes',version:1,bookId,pageCount,page:pageNumber,annotations,exportedAt:new Date().toISOString()},bookId,pageCount);
      const ids=annotations.filter(item=>!record.annotations.some(existing=>existing.id===item.id)).map(item=>item.id);
      if(ids.length)pushUndo({kind:'import',ids});
      const saved=persist({...record,annotations});renderMarks();$('[data-br-marks]').open=true;
      if(saved)notice(`${ids.length} book notes imported. Existing notes with the same ID were preserved.`);
    }catch(error){notice(`Import rejected: ${error.message} Your current notes are unchanged.`,'error');}
  }
  function release(){
    if(memoryBusy)return;
    restoreGeneration++;
    if(!dismissEditor({ask:true}))return;
    if(sessionOnly&&record.annotations.length&&!window.confirm('These notes are only in this tab. Export them before releasing the PDF. Release anyway?'))return;
    if(loading)cancelLoad();cancelRendering();
    const previousTask=activeLoadingTask;activeLoadingTask=null;pdf=null;bookId=null;fileName='';localFile=null;record={page:1,annotations:[]};pageNumber=1;pendingPage=null;undoStack=[];selected=null;
    pane.classList.remove('has-book');$('[data-br-assignment]').open=true;
    currentTextLayer=null;currentOverlay=null;currentPageElement=null;pageWrap.replaceChildren();pageWrap.hidden=true;$('[data-br-empty]').hidden=false;
    destroyTask(previousTask);renderMarks();updateAssignment();controls();notice(rememberedId?'PDF released from this tab. The remembered copy remains on this device; use Forget PDF to remove it.':'PDF released from this tab. Saved book notes remain in this browser.');
  }
  function syncLesson(lesson,assignment){
    currentLesson=typeof lesson==='string'?{id:lesson}:lesson||null;
    currentAssignment=assignment||BOOK_MAP.lessons?.[currentLesson?.id]||null;
    updateAssignment();
  }
  function open(options={}){
    if(Object.hasOwn(options,'lesson')||Object.hasOwn(options,'assignment'))syncLesson(options.lesson,options.assignment);
    opener=document.activeElement;opened=true;readerPreference(true);pane.hidden=false;document.body.classList.add('book-reading');
    const requested=Number(options.page);
    if(Number.isInteger(requested)&&requested>0){if(pdf)goPage(requested);else{pendingPage=requested;notice(`Choose your local PDF to open at PDF page ${requested}.`);}}
    else if(pdf)void renderPage({scrollTop:false});
    controls();updateAssignment();
    if(!pdf&&options.restore!==false)void restoreRemembered();
    requestAnimationFrame(()=>{lastViewportWidth=viewport.clientWidth;if(!pdf)action('choose').focus({preventScroll:true});});
  }
  function close(){
    restoreGeneration++;readerPreference(false);
    if(loading)cancelLoad();cancelRendering();opened=false;pane.hidden=true;document.body.classList.remove('book-reading');
    if(opener?.isConnected)opener.focus({preventScroll:true});
  }
  pane.addEventListener('mousedown',event=>{
    if(event.target.closest('[data-br="highlight"],[data-br="note"],[data-br-color]')){captureSelection();event.preventDefault();}
  });
  pane.addEventListener('click',event=>{
    const color=event.target.closest('[data-br-color]');if(color){setColor(color.dataset.brColor);return;}
    const jump=event.target.closest('[data-br-page]');if(jump){goPage(jump.dataset.brPage);return;}
    const markJump=event.target.closest('[data-br-mark-jump]');
    if(markJump){const mark=record.annotations.find(item=>item.id===markJump.dataset.brMarkJump);if(mark){goPage(mark.page,{markId:mark.id});}return;}
    const markAction=event.target.closest('[data-br-mark-action]');
    if(markAction){if(loading)return;const mark=record.annotations.find(item=>item.id===markAction.dataset.markId);if(!mark)return;
      if(markAction.dataset.brMarkAction==='edit'){goPage(mark.page,{markId:mark.id});editNote(mark);}
      if(markAction.dataset.brMarkAction==='delete'){const index=record.annotations.findIndex(item=>item.id===mark.id);pushUndo({kind:'delete',annotation:copy(mark),index});persist({...record,annotations:record.annotations.filter(item=>item.id!==mark.id)});if(editing?.id===mark.id)dismissEditor();renderMarks();notice('Note deleted. Use Undo to restore it.');}return;
    }
    const button=event.target.closest('[data-br]');if(!button||button.disabled)return;
    switch(button.dataset.br){
      case 'remember':void rememberFile();break;case 'forget':void forgetFile();break;
      case 'close':close();break;case 'choose':$('[data-br-file]').click();break;case 'cancel-load':cancelLoad();break;
      case 'previous':goPage(pageNumber-1);break;case 'next':goPage(pageNumber+1);break;
      case 'zoom-in':fitWidth=false;zoomScale=clamp(renderedScale*1.2,.15,4);void renderPage({scrollTop:false});break;
      case 'zoom-out':fitWidth=false;zoomScale=clamp(renderedScale/1.2,.15,4);void renderPage({scrollTop:false});break;
      case 'fit':fitWidth=true;void renderPage({scrollTop:false});break;
      case 'highlight':highlight();break;case 'note':editNote();break;case 'undo':undo();break;
      case 'cancel-note':dismissEditor({ask:true});break;case 'export':exportNotes();break;
      case 'import':$('[data-br-import]').click();break;case 'release':release();break;case 'retry-page':void renderPage();break;
    }
  });
  $('[data-br-file]').addEventListener('change',event=>{const file=event.target.files[0];event.target.value='';void chooseFile(file);});
  $('[data-br-import]').addEventListener('change',event=>{const file=event.target.files[0];event.target.value='';void importNotes(file);});
  $('#br-page-number').addEventListener('change',event=>goPage(event.target.value));
  $('#br-page-number').addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();goPage(event.target.value);}});
  $('#br-mark-filter').addEventListener('change',renderMarks);
  $('[data-br-editor]').addEventListener('submit',event=>{
    event.preventDefault();if(!editing||!pdf)return;
    const note=$('#br-note-text').value.trim();
    if(!note&&!editing.rects.length){notice('Write a note before saving it.','warning');$('#br-note-text').focus();return;}
    const annotation=editing.id?copy(editing):newAnnotation(editing);
    annotation.note=note;annotation.color=currentColor;annotation.updatedAt=new Date().toISOString();
    if(saveAnnotation(annotation)){dismissEditor();clearSelection();window.getSelection()?.removeAllRanges();}
  });
  pane.addEventListener('keydown',event=>{
    if(event.key==='Escape'){event.preventDefault();if(editing)dismissEditor({ask:true});else close();}
    if(event.altKey&&event.key==='ArrowRight'&&pdf){event.preventDefault();goPage(Math.min(pdf.numPages,pageNumber+1));}
    if(event.altKey&&event.key==='ArrowLeft'&&pdf){event.preventDefault();goPage(Math.max(1,pageNumber-1));}
  });
  document.addEventListener('selectionchange',captureSelection);
  const observer=new ResizeObserver(()=>{
    const width=viewport.clientWidth;
    if(!opened||!pdf||!fitWidth||Math.abs(width-lastViewportWidth)<2)return;
    lastViewportWidth=width;clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>void renderPage({scrollTop:false}),140);
  });
  observer.observe(viewport);
  controls();
  void restoreRemembered({startup:true});
  return {open,syncLesson,close};
}
