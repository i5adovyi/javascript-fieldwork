import {playgroundMarkup,bindPlayground} from './wiki-playground.js';
// The reference layer is independent of lesson progress and the lab runner.
export function searchableText(article) {
  return [article.title, article.summary, article.rule, article.category,
    ...(article.keywords || []), ...(article.details || []), ...(article.useWhen || []),
    ...(article.pitfalls || []), article.example?.code || '',
    ...(article.sections || []).map(s => s.ref)].join(' ').toLowerCase();
}
export function matchesQuery(article, query) {
  const text = searchableText(article);
  return query.toLowerCase().trim().split(/\s+/).filter(Boolean).every(word => text.includes(word));
}
export function relatedForLesson(articles, lesson) {
  // Exact curated links for existing lessons, then chapter/stage relevance for new lessons.
  if (lesson.wiki?.length) return articles.filter(a => lesson.wiki.includes(a.id));
  const exact = articles.filter(a => a.lessonNumbers.includes(lesson.number));
  if (exact.length) return exact;
  const title = `${lesson.title} ${lesson.subtitle}`.toLowerCase();
  const stage = articles.filter(a => a.stage === lesson.stage);
  return stage.map(a => ({a, score: a.keywords.filter(k => k.length > 3 && title.includes(k.toLowerCase())).length}))
    .sort((a,b) => b.score - a.score).slice(0,4).map(x => x.a);
}
export function createWiki({data, shell, esc, link, codeBlock}) {
  let query = '', category = 'All topics', disposePlayground;
  const articles = data.wiki;
  const categories = [...new Set(articles.map(a => a.category))];
  const ul = items => `<ul>${items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
  const readingTime = a => Math.max(2, Math.ceil([a.rule,...a.details,...a.useWhen,...a.pitfalls,a.example.explanation].join(' ').split(/\s+/).length/180));
  function cards() {
    const found = articles.filter(a => (category === 'All topics' || a.category === category) && matchesQuery(a,query));
    return {count:found.length, html:found.length ? found.map(a => link('wiki/'+a.id,
      `<span class="wiki-card-meta">${esc(a.category)} <span>${readingTime(a)} MIN</span></span><h2>${esc(a.title)}</h2><p>${esc(a.summary)}</p><span class="wiki-card-bottom">Chapter ${a.chapter} <span aria-hidden="true">↗</span></span>`,'wiki-card')).join('') : '<div class="wiki-empty"><h2>No matching topics</h2><p>Try a shorter term or choose All topics.</p><button class="button outline small" data-wiki-clear>Clear filters</button></div>'};
  }
  function index() {
    const result = cards();
    return shell(`<div class="wiki-index"><div class="page-intro"><div><span class="eyebrow">THE WORKING REFERENCE</span><h1>Less searching.<br>More understanding.</h1><p>The useful parts of JavaScript, close at hand. Rules, examples, and the details that prevent bugs.</p></div><span class="wiki-total">${articles.length}<small>REFERENCE PAGES</small></span></div><div class="wiki-search-bar"><label class="input-search" for="wiki-search"><span aria-hidden="true">⌕</span><input type="search" id="wiki-search" aria-label="Search wiki topics" value="${esc(query)}" placeholder="Search a concept, API, or problem…" autocomplete="off" aria-describedby="wiki-result-count"></label><span class="wiki-shortcut">Also in <kbd>⌘ / Ctrl K</kbd></span></div><div class="wiki-filters" role="group" aria-label="Filter wiki topics">${['All topics',...categories].map(c => `<button data-wiki-category="${esc(c)}" aria-pressed="${category === c}">${esc(c)}</button>`).join('')}</div><div class="wiki-results-heading"><p id="wiki-result-count" role="status">${result.count} of ${articles.length} topics</p><span>SELECTED ESSENTIALS · CHAPTERS 1–17</span></div><div id="wiki-results" class="wiki-grid">${result.html}</div><aside class="wiki-about"><h2>A reference you can use while building.</h2><p>Each page distills a practical topic from David Flanagan’s <i>JavaScript: The Definitive Guide, 7th edition</i> into original explanations and examples. Book references use section numbers and the page index of your PDF. Examples target modern browsers and this project’s Node 20+ baseline; updates beyond the book are identified on the relevant pages.</p><p>This is selected coverage, not a section-by-section substitute: specialized graphics, audio, binary data, and tool setup remain in the book. Choose a topic, use the example, then follow its lesson or project links to practice.</p><a class="text-link" href="wiki-reference.md" download>Download the complete wiki as Markdown ↓</a></aside></div>`,'wiki');
  }
  function page(id) {
    if (!id) return index();
    const a = articles.find(a => a.id === id);
    if (!a) return shell(`<div class="wiki-empty"><h1>Topic not found</h1><p>This wiki link does not match a published topic.</p>${link('wiki','Browse all wiki topics','button orange')}</div>`,'wiki');
    const lessons = data.lessons.filter(l => relatedForLesson(articles,l).some(x => x.id === id));
    const projects = data.projects.filter(p => p.stage === a.stage);
    const labs = data.labs.filter(l => l.stage === a.stage).slice(0,2);
    const sections = [['rule','The essential rule'],['use','When to use it'],['example','Practical example'],['pitfalls','Common pitfalls'],['related','Keep going'],['source','Book & sources']];
    return shell(`<div class="wiki-layout"><article class="wiki-article"><a class="back-link" href="#/wiki">← All wiki topics</a><div class="wiki-article-header"><span class="eyebrow">${esc(a.category)} · ${readingTime(a)} MIN READ</span><h1 tabindex="-1">${esc(a.title)}</h1><p class="lead">${esc(a.summary)}</p><div class="wiki-article-tools"><span class="tag">Chapter ${a.chapter}</span><button class="text-button" data-wiki-copy-link>Copy page link ↗</button></div></div><section id="wiki-rule" class="wiki-rule"><span class="tiny-label">THE ESSENTIAL RULE</span><h2>${esc(a.rule)}</h2></section><div class="wiki-details">${a.details.map(p=>`<p>${esc(p)}</p>`).join('')}</div><section id="wiki-use" class="prose-section"><h2>When to use it</h2>${ul(a.useWhen)}</section><section id="wiki-example" class="prose-section"><h2>Practical example</h2>${playgroundMarkup(a,esc,codeBlock)}<p>${esc(a.example.explanation)}</p></section><section id="wiki-pitfalls" class="wiki-pitfalls"><span class="tiny-label">WATCH YOUR STEP</span><h2>Common pitfalls</h2>${ul(a.pitfalls)}</section><section id="wiki-related" class="prose-section"><h2>Keep going</h2><div class="wiki-related">${a.related.map(id=>articles.find(x=>x.id===id)).filter(Boolean).map(x=>link('wiki/'+x.id,`${esc(x.title)} <span aria-hidden="true">↗</span>`)).join('')}</div>${lessons.length?`<h3>Use this while studying</h3><div class="wiki-study-links">${lessons.map(l=>link('lesson/'+l.id,`Lesson ${String(l.number).padStart(2,'0')} · ${esc(l.title)}`)).join('')}</div>`:''}${projects.length?`<h3>Apply it in a project</h3><div class="wiki-study-links">${projects.map(p=>link('project/'+p.id,esc(p.title))).join('')}</div>`:''}${labs.length?`<h3>Practice this stage</h3><div class="wiki-study-links">${labs.map(l=>link('lab/'+l.id,esc(l.title))).join('')}</div>`:''}</section><section id="wiki-source" class="wiki-source"><h2>Book & sources</h2><p>David Flanagan · <i>JavaScript: The Definitive Guide</i> · 7th edition (2020). Original summary and examples.</p><p class="muted">Open your local copy at a section’s PDF page. PDF page indexes differ from printed page numbers.</p><div class="wiki-source-links">${a.sections.map(s=>`<button data-action="book" data-page="${s.pdfPage}">§${esc(s.ref)} <span>PDF p. ${s.pdfPage} ↗</span></button>`).join('')}</div>${a.modernNote?`<p><strong>Edition note:</strong> ${esc(a.modernNote)}</p>`:''}${(a.references||[]).map(r=>`<p><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.title)} ↗</a></p>`).join('')}</section><a class="back-link" href="#/wiki">← Back to the wiki</a></article><aside class="wiki-rail"><span class="tiny-label">ON THIS PAGE</span><nav aria-label="On this wiki page">${sections.map(([id,title])=>`<button data-wiki-jump="wiki-${id}">${title}</button>`).join('')}</nav><div class="wiki-rail-note"><span>LOOK IT UP.<br>TRY IT OUT.<br>KEEP BUILDING.</span><p>One topic at a time. Every example includes its expected result.</p></div></aside></div>`,'wiki');
  }
  function lessonLinks(l) {
    const related = relatedForLesson(articles,l);
    return `<section class="wiki-lesson-links"><div><span class="tiny-label">QUICK REFERENCE</span><h2>Wiki for this lesson</h2><p>Need a rule or a small example while you practice?</p></div><div class="wiki-related">${related.map(a=>link('wiki/'+a.id,`${esc(a.title)} <span aria-hidden="true">↗</span>`)).join('')}</div></section>`;
  }
  function bind() {
    const playground=document.querySelector('[data-playground-kind="wiki"]');
    if(playground)disposePlayground=bindPlayground(playground,articles.find(a=>a.id===playground.dataset.playground));
    function refresh() {
      const result = cards();
      document.querySelector('#wiki-results').innerHTML = result.html;
      document.querySelector('#wiki-result-count').textContent = `${result.count} of ${articles.length} topics`;
      document.querySelectorAll('[data-wiki-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.wikiCategory===category)));
    }
    document.querySelector('#wiki-search')?.addEventListener('input',e=>{query=e.target.value;refresh();});
    document.querySelectorAll('[data-wiki-category]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.wikiCategory;refresh();}));
    document.querySelector('#wiki-results')?.addEventListener('click',e=>{if(e.target.closest('[data-wiki-clear]')){query='';category='All topics';document.querySelector('#wiki-search').value='';refresh();document.querySelector('#wiki-search').focus();}});
    document.querySelectorAll('[data-wiki-jump]').forEach(b=>b.addEventListener('click',()=>{
      const target=document.getElementById(b.dataset.wikiJump);
      target.tabIndex=-1;target.focus({preventScroll:true});target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
    }));
    document.querySelector('[data-wiki-copy-link]')?.addEventListener('click',async e=>{
      try {await navigator.clipboard.writeText(location.href);e.target.textContent='Link copied';}
      catch {e.target.textContent='Copy the URL from your address bar';}
    });
  }
  return {page,bind,dispose:()=>{disposePlayground?.();disposePlayground=null;},lessonLinks,searchEntries:()=>articles.map(a=>({...a,type:'wiki',label:'Wiki',subtitle:a.summary}))};
}
