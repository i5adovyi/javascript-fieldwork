// Self-contained so the same runtime can run in a Worker or an opaque DOM frame.
export async function executeSnippet(config, send) {
  const nativeTimeout = globalThis.setTimeout.bind(globalThis);
  const nativeClear = globalThis.clearTimeout.bind(globalThis);
  const timers = new Map(), children = new Set();
  let pending = 0, topDone = false, ended = false, settling, count = 0, size = 0, limited=false;
  const format = value => {
    if (typeof value === 'string') return value;
    if (value instanceof Error) return `${value.name}: ${value.message}`;
    if (typeof value === 'bigint') return `${value}n`;
    if (typeof value === 'function') return `[Function ${value.name || 'anonymous'}]`;
    if (typeof value === 'symbol' || value === undefined) return String(value);
    const seen = new WeakSet();
    try {
      return JSON.stringify(value, (_, item) => {
        if (typeof item === 'bigint') return `${item}n`;
        if (item && typeof item === 'object') {
          if (seen.has(item)) return '[Circular]';
          seen.add(item);
        }
        return item;
      }, 2) ?? String(value);
    } catch { return '[Unprintable value]'; }
  };
  function log(level, values) {
    if (ended) return;
    if (count >= 100 || size >= 16000) {
      if (!limited) { send({type:'log',level:'warn',text:'Output limit reached (100 entries / 16 KB).'}); limited=true; }
      return;
    }
    let text = values.map(format).join(' ');
    text = text.slice(0, Math.min(4000,16000-size));
    size += text.length; count++;
    send({type:'log',level,text});
  }
  const output = {};
  for (const level of ['log','info','warn','error','debug','table']) output[level] = (...args) => log(level,args);
  output.assert = (test,...args) => { if (!test) log('error',['Assertion failed:',...args]); };
  output.clear = () => { if (!ended) {count=0;size=0;limited=false;send({type:'clear'});} };
  globalThis.console = output;
  function finish(error, failed=false) {
    if (ended) return;
    if (failed) log('error',[error instanceof Error ? error : Error(String(error))]);
    if (config.dom && !failed) {
      // Keep real DOM event handlers and their console available after initial
      // execution. Reset, Stop, or navigation removes the entire frame.
      send({type:'done',error:false});return;
    }
    ended = true;
    nativeClear(settling);
    for (const [id,value] of timers) nativeClear(typeof id==='object'?value:id);
    timers.clear();
    for (const child of children) child.terminate();
    send({type:'done',error:failed});
  }
  function idle() {
    nativeClear(settling);
    if (topDone && pending === 0 && !ended) settling = nativeTimeout(() => finish(),50);
  }
  function beginAsync() {
    if (config.dom && pending===0) send({type:'busy'});
    pending++;
  }
  globalThis.setTimeout = (callback,delay=0,...args) => {
    if (typeof callback !== 'function') throw TypeError('Use a function with setTimeout.');
    beginAsync();
    const id = nativeTimeout(async () => {
      if (!timers.delete(id) || ended) return;
      try { await callback(...args); } catch(error) { finish(error,true); }
      finally { pending--; idle(); }
    },delay);
    timers.set(id,true); return id;
  };
  globalThis.clearTimeout = id => { if(timers.delete(id))pending--;nativeClear(id);idle(); };
  // Intervals use recursive native timeouts so the same cleanup handles both APIs.
  globalThis.setInterval = (callback,delay=0,...args) => {
    if (typeof callback !== 'function') throw TypeError('Use a function with setInterval.');
    const handle = {};
    beginAsync();
    const tick = async () => {
      if (!timers.has(handle) || ended) return;
      try { await callback(...args); } catch(error) { finish(error,true); }
      if (timers.has(handle) && !ended) timers.set(handle,nativeTimeout(tick,delay));
    };
    timers.set(handle,nativeTimeout(tick,delay)); return handle;
  };
  globalThis.clearInterval = handle => {
    if (timers.has(handle)) { nativeClear(timers.get(handle));timers.delete(handle);pending--;idle(); }
  };
  const nativeFetch = globalThis.fetch?.bind(globalThis);
  if (nativeFetch) globalThis.fetch = async (...args) => {
    beginAsync();
    try {return await nativeFetch(...args);} finally {pending--;idle();}
  };
  const NativeWorker = globalThis.Worker;
  if (NativeWorker) globalThis.Worker = class extends NativeWorker {
    constructor(...args) { super(...args);children.add(this);pending++; }
    terminate() { if(children.delete(this))pending--;super.terminate();idle(); }
  };
  const memoryStorage = () => {
    const map = new Map();
    return {getItem:key=>map.get(String(key))??null,setItem:(key,value)=>map.set(String(key),String(value)),
      removeItem:key=>map.delete(String(key)),clear:()=>map.clear(),key:i=>[...map.keys()][i]??null,get length(){return map.size;}};
  };
  if (config.dom) {
    // Native storage is unavailable on an opaque origin. A fresh implementation
    // teaches the Storage methods without exposing saved studio progress.
    for (const name of ['localStorage','sessionStorage']) Object.defineProperty(globalThis,name,{value:memoryStorage(),configurable:true});
  }
  globalThis.addEventListener('error',event=>{event.preventDefault();finish(event.error||Error(event.message),true);});
  globalThis.addEventListener('unhandledrejection',event=>{event.preventDefault();finish(event.reason,true);});
  let lastCheck=performance.now(),deadline=lastCheck+1200;
  const check = () => {
    const now=performance.now();
    if(now-lastCheck>100)deadline=now+1200;
    lastCheck=now;
    if(now>deadline)throw Error('Loop stopped: execution time limit exceeded.');
  };
  try {
    if (config.moduleURL) await import(config.moduleURL);
    else {
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      await new AsyncFunction(config.guardName || '__wikiGuard', `${config.code}\n//# sourceURL=wiki/example.js`)(check);
    }
    topDone=true;idle();
  } catch(error) {finish(error,true);}
}
