import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=await readFile(new URL('../dist/runner.js',import.meta.url),'utf8');
const {labs}=JSON.parse(await readFile(new URL('../dist/data/labs.json',import.meta.url),'utf8'));
let count=0;
for(const lab of labs){
 let output;
 const context=vm.createContext({self:{postMessage:message=>{output=message;}},setTimeout,clearTimeout,URL,URLSearchParams,TextEncoder,TextDecoder,AbortController,structuredClone});
 vm.runInContext(source,context);
 await context.self.onmessage({data:{code:lab.solution,tests:lab.tests}});
 assert.ok(output&&!output.error,`${lab.id}: ${output?.error}`);
 for(const result of output.results)assert.ok(result.passed,`${lab.id} ${result.name}: ${result.error}`);
 assert.equal(output.results.length,lab.tests.length);count+=output.results.length;
}
console.log(`Actual browser runner verified: ${labs.length} lab solutions, ${count} passing assertions.`);
for(const fixture of [
 {code:'throw null;',tests:[],error:'null'},
 {code:'const results = []; const tests = [];',tests:[{name:'Learner variable names are allowed',code:'assertEqual(results.length, 0); assertEqual(tests.length, 0);'}]},
 {code:'function f(){throw null;}',tests:[{name:'Non-Error thrown values are reported',code:'f();'},{name:'Remaining tests still run',code:'assert(true);'}],firstFails:true}
]){
 let output;const context=vm.createContext({self:{postMessage:x=>{output=x;}},setTimeout,clearTimeout});vm.runInContext(source,context);await context.self.onmessage({data:fixture});assert.ok(output,'Worker posts a result');if(fixture.error)assert.equal(output.error,fixture.error);else if(fixture.firstFails){assert.equal(output.results[0].passed,false);assert.equal(output.results[0].error,'null');assert.equal(output.results[1].passed,true);}else assert.equal(output.results[0].passed,true);
}
console.log('Runner regressions passed: thrown primitives, independent tests, and learner identifier collisions.');
