import {guardLoops} from './wiki-code.js';
import {executeSnippet} from './wiki-execution.js';

// Every run gets a fresh execution context. The caller owns its lifetime.
export function runWikiExample({code,files,dom=false,preview,onEvent,timeout=3000}) {
  let worker, frame, timer, ended=false, listener;
  function dispose() {
    clearTimeout(timer);worker?.terminate();
    if(listener)window.removeEventListener('message',listener);
    frame?.remove();
  }
  function receive(event) {
    if(ended)return;
    if(event.type==='busy'&&!timer)armTimer();
    if(event.type==='done'){
      ended=!(dom&&!event.error);clearTimeout(timer);timer=null;worker?.terminate();
      if(ended&&listener)window.removeEventListener('message',listener);
    }
    onEvent(event);
  }
  const cancel = () => {ended=true;dispose();};
  function armTimer(){
    timer=setTimeout(()=>{
      receive({type:'log',level:'error',text:'Time limit reached (3 seconds). Check loops, timers, and unfinished work.'});
      receive({type:'done',error:true});dispose();
    },timeout);
  }
  armTimer();
  try {
    if(dom){
      const token=crypto.randomUUID(),guardName='__wikiGuard_'+token.replaceAll('-','');
      const guarded=guardLoops(code,guardName);
      frame=document.createElement('iframe');
      frame.title='Isolated example preview';
      // Allow local submit events for form lessons; CSP blocks navigation/submission.
      frame.setAttribute('sandbox','allow-scripts allow-forms');
      const setup = `const run=${executeSnippet.toString()};addEventListener('message',function start(e){if(e.source!==parent||e.data.token!==${JSON.stringify(token)})return;removeEventListener('message',start);run(e.data.config,event=>parent.postMessage({token:${JSON.stringify(token)},event},'*'));});parent.postMessage({token:${JSON.stringify(token)},ready:true},'*');`;
      frame.srcdoc=`<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; form-action 'none'; script-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline'; img-src data: blob:"><style>body{font:15px system-ui;color:#263326;padding:14px}button{padding:8px 14px}body:not(:has(> :not(script))):before{content:'Append an element to document.body to see it here.';color:#6c7567;font-size:13px}</style><body><script>${setup.replaceAll('</script','<\\/script')}<\/script>`;
      listener=event=>{
        if(event.source!==frame.contentWindow||event.data?.token!==token)return;
        if(event.data.ready)frame.contentWindow.postMessage({token,config:{dom:true,code:guarded,guardName}},'*');
        else if(event.data.event)receive(event.data.event);
      };
      window.addEventListener('message',listener);
      preview.replaceChildren(frame);
    }else{
      worker=new Worker(new URL('./wiki-worker.js',import.meta.url),{type:'module'});
      worker.onmessage=event=>receive(event.data);
      worker.onerror=event=>{
        receive({type:'log',level:'error',text:event.message||'The example runner could not start. Reload and try again.'});
        receive({type:'done',error:true});event.preventDefault();
      };
      worker.postMessage({code,files});
    }
  }catch(error){
    // Defer so callers have installed their cancellation handle before completion.
    queueMicrotask(()=>{receive({type:'log',level:'error',text:`${error.name}: ${error.message}`});receive({type:'done',error:true});dispose();});
  }
  return cancel;
}
