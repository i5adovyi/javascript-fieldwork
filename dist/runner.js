// Each run receives a fresh worker. The UI terminates it after 3 seconds.
const stringify = value => {
 if(typeof value==='undefined') return 'undefined';
 if(typeof value==='bigint') return `${value}n`;
 try { return typeof value==='string'?value:JSON.stringify(value,(_,v)=>typeof v==='bigint'?`${v}n`:v); } catch {return String(value);}
};
function equal(a,b,seen=new WeakMap()) {
 if(Object.is(a,b))return true;
 if(typeof a!==typeof b||a===null||b===null||typeof a!=='object')return false;
 if(seen.get(a)===b)return true; seen.set(a,b);
 if(Object.prototype.toString.call(a)!==Object.prototype.toString.call(b))return false;
 if(a instanceof Date)return a.getTime()===b.getTime();
 if(a instanceof Set)return a.size===b.size&&[...a].every(x=>b.has(x));
 if(a instanceof Map)return a.size===b.size&&[...a].every(([k,v])=>b.has(k)&&equal(v,b.get(k),seen));
 const ka=Reflect.ownKeys(a),kb=Reflect.ownKeys(b);
 return ka.length===kb.length&&ka.every(k=>Object.hasOwn(b,k)&&equal(a[k],b[k],seen));
}
self.onmessage=async({data})=>{
 const logs=[];
 const console={log:(...args)=>logs.length<100&&logs.push(args.map(stringify).join(' ').slice(0,10000)),error:(...args)=>logs.length<100&&logs.push(args.map(stringify).join(' ').slice(0,10000)),warn:(...args)=>logs.length<100&&logs.push(args.map(stringify).join(' ').slice(0,10000))};
 const assert=(value,message='Assertion failed')=>{if(!value)throw new Error(message);};
 const assertEqual=(actual,expected)=>{if(!equal(actual,expected))throw new Error(`Expected ${stringify(expected)}, received ${stringify(actual)}`);};
 const results=[];
 try{
 const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
 const testBody=data.tests.map((t,i)=>`try { await (async()=>{${t.code}\n})(); __fieldworkResults.push({name:__fieldworkTests[${i}].name,passed:true}); } catch(error){__fieldworkResults.push({name:__fieldworkTests[${i}].name,passed:false,error:String(error?.message ?? error)});}`).join('\n');
 await new AsyncFunction('assertEqual','assert','console','__fieldworkResults','__fieldworkTests',`"use strict";\n${data.code}\n${testBody}`)(assertEqual,assert,console,results,data.tests);
 self.postMessage({results,logs:logs.slice(0,100)});
 }catch(error){self.postMessage({results,logs:logs.slice(0,100),error:String(error?.message ?? error)});}
};
