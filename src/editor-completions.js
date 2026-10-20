import {completionPath} from '@codemirror/lang-javascript';

// Static suggestions never inspect or execute a learner's program.
const methods = (names, detail) => names.split(' ').map(label => ({label, type: 'method', detail}));
const members = {
  console: methods('log info warn error table clear assert time timeEnd', 'console'),
  Math: methods('abs ceil floor round trunc max min pow sqrt random sign', 'Math'),
  JSON: methods('parse stringify', 'JSON'),
  Object: methods('keys values entries fromEntries assign create freeze is hasOwn getPrototypeOf', 'Object'),
  Array: methods('from isArray of', 'Array'),
  Number: methods('isNaN isFinite isInteger isSafeInteger parseInt parseFloat', 'Number'),
  String: methods('fromCharCode fromCodePoint', 'String'),
  Promise: methods('all allSettled any race resolve reject', 'Promise'),
  Date: methods('now parse UTC', 'Date'),
  Reflect: methods('apply construct get set has ownKeys', 'Reflect'),
};
const domMembers = {
  document: methods('createElement createTextNode querySelector querySelectorAll getElementById addEventListener', 'document').concat({label:'body',type:'property',detail:'document'}),
  'document.body': methods('append prepend appendChild replaceChildren querySelector addEventListener', 'Element'),
  localStorage: methods('getItem setItem removeItem clear key', 'Storage'),
  sessionStorage: methods('getItem setItem removeItem clear key', 'Storage'),
  window: methods('addEventListener removeEventListener setTimeout clearTimeout', 'window'),
};
const classes='Object Array String Number Boolean BigInt Symbol Promise Map Set WeakMap WeakSet Date RegExp Error TypeError RangeError SyntaxError AggregateError ArrayBuffer Uint8Array DataView TextEncoder TextDecoder URL URLSearchParams Blob File ReadableStream WritableStream TransformStream AbortController Worker';
const globals = [
  ...classes.split(' ').map(label => ({label, type:'class', detail:'JavaScript'})),
  ...'setTimeout clearTimeout setInterval clearInterval queueMicrotask parseInt parseFloat isNaN isFinite structuredClone fetch'.split(' ').map(label => ({label, type:'function',detail:'JavaScript'})),
  ...'console Math JSON Reflect Intl globalThis undefined NaN Infinity'.split(' ').map(label => ({label,type:'variable',detail:'JavaScript'})),
];
export function standardCompletions(dom = false) {
  const scope = dom ? {...members,...domMembers} : members;
  const names = dom ? globals.concat('document window localStorage sessionStorage'.split(' ').map(label=>({label,type:'variable',detail:'Browser preview'}))) : globals;
  return context => {
    const path = completionPath(context);
    if (!path) return null;
    const options = path.path.length ? scope[path.path.join('.')] : names;
    if (!options) return null;
    return {from:context.pos-path.name.length, options, validFor:/^[\w$]*$/};
  };
}
