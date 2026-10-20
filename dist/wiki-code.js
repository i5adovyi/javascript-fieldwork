import {parse} from './vendor/acorn.js';

function walk(node, visit) {
  if (!node || typeof node !== 'object') return;
  if (node.type) visit(node);
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) value.forEach(child => walk(child, visit));
    else if (value && typeof value === 'object') walk(value, visit);
  }
}

// DOM examples share the browser's event loop. Check a deadline inside each loop.
// Parse syntax first so strings, comments, and unbraced/nested loops stay intact.
export function guardLoops(code, guardName) {
  const tree = parse(code, {ecmaVersion:'latest', allowAwaitOutsideFunction:true, allowReturnOutsideFunction:true});
  const edits = [];
  walk(tree, node => {
    if (!['ForStatement','ForInStatement','ForOfStatement','WhileStatement','DoWhileStatement'].includes(node.type)) return;
    const body = node.body;
    if (body.type === 'BlockStatement') edits.push([body.start + 1, `${guardName}();`]);
    else edits.push([body.start, `{${guardName}();`], [body.end, '}']);
  });
  for (const [position, text] of edits.sort((a,b) => b[0] - a[0])) code = code.slice(0,position) + text + code.slice(position);
  return code;
}

// Preserve native module semantics; only local import specifiers become blob URLs.
export function buildModules(files, entry = 'app.mjs') {
  const urls = new Map(), visiting = new Set();
  function build(name) {
    if (!Object.hasOwn(files,name)) throw Error(`Module not found: ${name}`);
    if (visiting.has(name)) throw Error('Circular imports are not supported in this playground.');
    if (urls.has(name)) return urls.get(name);
    visiting.add(name);
    let source = files[name];
    const tree = parse(source, {ecmaVersion:'latest',sourceType:'module'});
    const edits = [];
    walk(tree, node => {
      if (!['ImportDeclaration','ExportNamedDeclaration','ExportAllDeclaration','ImportExpression'].includes(node.type) || !node.source) return;
      const value = node.source.value;
      if (typeof value !== 'string' || !value.startsWith('./')) throw Error('Use a literal local import such as "./summary.mjs". External packages are not available here.');
      const path = new URL(value, 'https://playground.invalid/' + name).pathname.slice(1);
      edits.push([node.source.start,node.source.end,JSON.stringify(build(path))]);
    });
    for (const [start,end,value] of edits.sort((a,b) => b[0]-a[0])) source = source.slice(0,start)+value+source.slice(end);
    const url = URL.createObjectURL(new Blob([source + `\n//# sourceURL=wiki/${name}`], {type:'text/javascript'}));
    visiting.delete(name); urls.set(name,url);
    return url;
  }
  const dispose = () => urls.forEach(url => URL.revokeObjectURL(url));
  try { return {url:build(entry),dispose}; }
  catch (error) { dispose(); throw error; }
}
