export const HOSTED_URL='https://javascript-fieldwork-igor.igor-sadovyi87.chatgpt.site/';
export const SOURCE_URL='https://github.com/i5adovyi/javascript-fieldwork';
export const LOCAL_URL='http://localhost:4187/';

export function runtimeInfo(href){
 const url=new URL(href);
 const local=['localhost','127.0.0.1','[::1]'].includes(url.hostname);
 return {
  local,
  label:local?'On this computer':url.origin===new URL(HOSTED_URL).origin?'OpenAI Sites':'Another web host',
  origin:url.origin,
  // Retain a local visitor's chosen hostname and port: changing either changes storage.
  localURL:local?url.origin+'/':LOCAL_URL
 };
}

export function runAnywherePage({href,esc,link}){
 const mode=runtimeInfo(href);
 return `<div class="page-intro"><div><span class="eyebrow">YOUR STUDIO, TWO WAYS</span><h1>Choose where you learn.</h1><p>The same lessons, labs, wiki, and private book reader. Run online or from your own project folder.</p></div></div>
 <div class="run-current"><span class="online-dot"></span><strong>Currently: ${esc(mode.label)}</strong><code>${esc(mode.origin)}</code></div>
 <div class="run-options">
 <section class="run-card"><span class="eyebrow">01 / OPENAI SITES</span><h2>Open and learn.</h2><p>Use the published copy from a browser without starting a local server. Hosting availability and limits follow the hosting provider’s terms.</p><a class="button dark" href="${HOSTED_URL}#/dashboard" target="_blank" rel="noopener">Open hosted studio ↗</a><small>The hosted app has no learner login and makes no AI API calls.</small></section>
 <section class="run-card"><span class="eyebrow">02 / LOCALHOST</span><h2>Run it on your computer.</h2><p>Keep the project folder and use Node.js 20.11 or newer. No OpenAI account, API key, or package installation is needed to use the bundled app.</p><a class="button orange" href="${esc(mode.localURL)}#/dashboard" target="_blank" rel="noopener">${mode.local?'Open local studio':'Open localhost after starting it'} ↗</a><small>A website cannot start a program on your computer. Start the local server using the steps below first.</small></section>
 </div>
 <section class="run-instructions"><span class="eyebrow">LOCAL QUICK START</span><h2>One folder. One command.</h2><ol><li>Open your <strong>javascript-fieldwork</strong> project folder.</li><li>On macOS, double-click <strong>Start Fieldwork.command</strong>. On Windows, double-click <strong>Start Fieldwork.cmd</strong>. The launcher opens your default browser.</li><li>Keep the Terminal window open while studying. Press <strong>Control-C</strong> there to stop the server.</li></ol><p>Or open a terminal in the project folder and run:</p><pre><code>npm start</code></pre><p>Visit <code>http://localhost:4187</code>. Use <code>npm run start:open</code> to start and open the browser together. If the port is occupied, the terminal explains how to select another port.</p><a class="text-link" href="running.md" download>Download the setup guide ↓</a></section>
 <section class="run-instructions"><span class="eyebrow">YOUR SOURCE BACKUP</span><h2>Keep building from GitHub.</h2><p>The complete project lives in your private GitHub repository. Sign in with an account that has access to clone or download it. A GitHub push does not automatically publish a Sites update.</p><a class="button outline small" href="${SOURCE_URL}" target="_blank" rel="noopener">Open GitHub repository ↗</a></section><section class="run-transfer"><span class="eyebrow">BRING YOUR PROGRESS WITH YOU</span><h2>Switch copies without losing your work.</h2><p>Each browser and address has its own saved data. Switching links does not sync or move it.</p><ol><li>In the copy you currently use, open <strong>My notebook → Export backup</strong>.</li><li>In the private PDF reader, separately choose <strong>Your book notes → Export notes</strong>.</li><li>Open the other copy, import your progress in <strong>My notebook</strong>, then choose your original PDF and import the book notes.</li><li>Select <strong>Remember PDF</strong> once for that browser and address. Keep using the same hostname and port.</li></ol><p>Your original PDF stays on your device. It is not included in GitHub, deployment files, or either notes backup.</p>${link('notebook','Open My notebook →','button outline small')}</section>`;
}
