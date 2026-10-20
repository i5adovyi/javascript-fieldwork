import {playgroundMarkup,bindPlayground} from './wiki-playground.js';

// Stable content IDs keep drafts attached to the example even if sections move.
export function lessonExamples(lesson) {
  return (lesson.body||[]).filter(section=>section.code).map(section=>{
    const p=section.playground;
    if(!p)throw Error(`Missing playground for ${lesson.id}: ${section.heading}`);
    const code=p.code??[p.before,section.code,p.after].filter(Boolean).join('\n\n');
    const files=p.files||{'example.js':code};
    return {
      id:`${lesson.id}-${p.id}`,kind:'lesson',title:section.heading,
      example:{code:section.code,files,output:p.output,runtime:p.runtime},
      playground:{
        files,dom:p.runtime==='dom',module:p.runtime==='module',
        note:p.note||'Edit the example and run it here. Each run starts fresh; sample inputs and calls are included where needed.',
        original:!!p.code||!!p.files,originalLabel:'Original lesson excerpt'
      }
    };
  });
}

export function lessonBody(lesson,esc,codeBlock) {
  const examples=new Map(lessonExamples(lesson).map(example=>[example.id,example]));
  return lesson.body.map(section=>`<section class="prose-section"><h2>${esc(section.heading)}</h2>${(section.paragraphs||[]).map(p=>`<p>${esc(p)}</p>`).join('')}${section.code?playgroundMarkup(examples.get(`${lesson.id}-${section.playground.id}`),esc,codeBlock):''}</section>`).join('');
}

export function bindLessonPlaygrounds(lesson,root=document) {
  const examples=new Map(lessonExamples(lesson).map(example=>[example.id,example]));
  const disposers=[...root.querySelectorAll('[data-playground-kind="lesson"]')].map(panel=>bindPlayground(panel,examples.get(panel.dataset.playground)));
  return ()=>disposers.forEach(dispose=>dispose());
}
