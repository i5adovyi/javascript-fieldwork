import {readFile,writeFile,copyFile} from 'node:fs/promises';
import {storedZip} from './build-study-pack.mjs';

const bullets=items=>items.map(item=>`- ${item}`).join('\n');
const numbered=items=>items.map((item,i)=>`${i+1}. ${item}`).join('\n');
// Longer fences keep fixture contents intact even if a future case includes Markdown.
const fence=(text,language='')=>`${'`'.repeat(4)}${language}\n${text.trimEnd()}\n${'`'.repeat(4)}`;
export function caseMarkdown(item){
 return `# ${item.id} · ${item.title}

Stage ${item.stage} · after ${item.afterLesson} · approximately ${item.minutes} minutes

${item.subtitle}

## Environment

${item.environment}

All reports, logs, and data in this packet are synthetic. The starter is deliberately broken.
Read the environment and reproduction instructions before running it. Some packets require
assembling a browser or project experiment; they are not all standalone executables.

## Report

${item.report}

## Evidence

${item.evidence.map(e=>`### ${e.label}\n\n${fence(e.text)}`).join('\n\n')}

## Reproduce

${numbered(item.reproduce)}

## Inherited code

${fence(item.starter,'javascript')}

## Fixtures

${item.files.map(file=>`### ${file.name}\n\n${fence(file.content)}`).join('\n\n')}

## Constraints

${bullets(item.constraints)}

## Acceptance evidence

${bullets(item.acceptance)}

## Focused repair lab

${item.labIds.length?item.labIds.map(id=>`Open \`#/lab/${id}\` in the portal.`).join('\n'): 'This case is a project investigation without an automated repair lab.'}

A passing focused lab does not complete the wider incident. Keep the original failing
input and event order, explain the cause, and demonstrate a nearby variation.

## Investigation record

Record reproduction, hypotheses and observations, root cause, fix, a test that fails
before and passes after, recovery, and remaining limitations. Portal investigation
notes stay in your browser and are included in My notebook → Export backup.
This public case packet does not include your notes.

## Further variation

${item.variation}

## References

${item.resources.map(r=>`- [${r.title}](${r.url})`).join('\n')}

## Clues — open only after your own attempt

${numbered(item.hints)}

## Debrief — compare after you have evidence

${bullets(item.debrief)}
`;
}

export async function buildIncidents(root){
 const {incidents}=JSON.parse(await readFile(new URL('data/incidents.json',root),'utf8'));
 const entries=[['README.md',`# Fieldwork incident workshop\n\n12 original synthetic incidents across six stages.\nRead each case's README.md for its environment, prerequisites, reproduction, and evidence requirements.\nThe starter is deliberately broken. The eight linked repair labs run in the portal;\nother experiments need your local Node or browser project as described in each packet.\n\nNo book content or personal investigation notes are included.\n`]];
 for(const item of incidents){
  entries.push([`${item.id}/README.md`,caseMarkdown(item)],[`${item.id}/incident.mjs`,item.starter],
   [`${item.id}/packet.json`,JSON.stringify(item,null,2)+'\n'],
   ...item.files.map(file=>[`${item.id}/${file.name}`,file.content]));
 }
 const workbook=`# JavaScript Fieldwork · Incident workbook\n\nTwelve original synthetic cases. Follow the prerequisites and environment in each case.\nThe [curriculum review](curriculum-review.md) explains coverage and remaining extensions.\nUse the [learner handbook](handbook.md) to fit these into your learning plan.\n\n${incidents.map(item=>`- ${item.id}: ${item.title} — after ${item.afterLesson}`).join('\n')}\n\n---\n\n${incidents.map(caseMarkdown).join('\n---\n\n')}`;
 await writeFile(new URL('incident-workbook.md',root),workbook);
 await writeFile(new URL('incident-kits.zip',root),storedZip(entries));
 await copyFile(new URL('../docs/CURRICULUM-REVIEW.md',import.meta.url),new URL('curriculum-review.md',root));
 console.log(`Built ${incidents.length} incident packets, workbook, and case-files ZIP.`);
}
