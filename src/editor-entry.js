import {EditorState, Prec} from '@codemirror/state';
import {EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection} from '@codemirror/view';
import {defaultKeymap, history, historyKeymap} from '@codemirror/commands';
import {syntaxHighlighting, bracketMatching, indentOnInput, indentUnit} from '@codemirror/language';
import {autocompletion, closeBrackets, closeBracketsKeymap, acceptCompletion, startCompletion} from '@codemirror/autocomplete';
import {javascript, javascriptLanguage} from '@codemirror/lang-javascript';
import {classHighlighter} from '@lezer/highlight';
import {standardCompletions} from './editor-completions.js';

// Exported for the development browser checks to exercise the real editor state.
export {EditorView};
export function createCodeEditor({parent, files, active, id, describedBy, dom, onChange, onRun}) {
  let current = active;
  const states = new Map();
  const makeState = (name, code) => EditorState.create({doc:code, extensions:[
    lineNumbers(), highlightActiveLineGutter(), highlightActiveLine(), drawSelection(),
    history(), indentOnInput(), indentUnit.of('  '), bracketMatching(), closeBrackets(),
    javascript(), syntaxHighlighting(classHighlighter),
    javascriptLanguage.data.of({autocomplete:standardCompletions(dom)}),
    autocompletion({icons:false, maxRenderedOptions:12}),
    Prec.highest(keymap.of([
      {key:'Mod-Enter',run:()=>{onRun();return true;}},
      {key:'Ctrl-Enter',run:()=>{onRun();return true;}},
      {key:'Tab',run:acceptCompletion},
    ])),
    keymap.of([...closeBracketsKeymap,...defaultKeymap,...historyKeymap]),
    EditorView.contentAttributes.of({id, 'aria-label':`Code editor for ${name}`, 'aria-describedby':describedBy, spellcheck:'false', autocapitalize:'off', autocorrect:'off'}),
    EditorView.updateListener.of(update=>{if(update.docChanged)onChange(current,update.state.doc.toString());}),
    EditorView.theme({'&':{colorScheme:'dark'}},{dark:true}),
  ]});
  for (const [name, code] of Object.entries(files)) states.set(name,makeState(name,code));
  parent.replaceChildren();
  const view = new EditorView({state:states.get(current),parent});
  return {
    showFile(name) {
      if (name===current) return;
      states.set(current,view.state);
      current=name;
      view.setState(states.get(name));
    },
    reset(nextFiles) {
      for (const [name,code] of Object.entries(nextFiles)) states.set(name,makeState(name,code));
      view.setState(states.get(current));
    },
    getValue:()=>view.state.doc.toString(),
    suggest:()=>{view.focus();startCompletion(view);},
    select:()=>{view.focus();view.dispatch({selection:{anchor:0,head:view.state.doc.length}});},
    destroy:()=>{states.clear();view.destroy();},
  };
}
