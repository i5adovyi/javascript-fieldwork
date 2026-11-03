import {CONFIGURED_HOSTED_URL,SOURCE_URL} from './site-config.js';
export {SOURCE_URL};
export const HOSTED_URL=CONFIGURED_HOSTED_URL;
export const LOCAL_URL='http://localhost:4187/';

export function runtimeInfo(href){
 const url=new URL(href);
 const local=['localhost','127.0.0.1','[::1]'].includes(url.hostname);
 return {
  local,
  label:local?'On this computer':url.hostname.endsWith('.github.io')?'GitHub Pages':url.protocol==='https:'&&url.hostname.endsWith('.chatgpt.site')?'OpenAI Sites':'Another web host',
  hostedURL:local?HOSTED_URL:new URL('./',url).href,
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
 <section class="run-card"><span class="eyebrow">01 / WEB STUDIO</span><h2>Open and learn.</h2><p>Use the published copy from a browser without starting a local server. Hosting availability and limits follow the hosting provider’s terms.</p>${mode.hostedURL?`<a class="button dark" href="${esc(mode.hostedURL)}#/dashboard" target="_blank" rel="noopener">Open hosted studio ↗</a>`:'<p>Publish your own Site, then set its URL with <code>npm run configure:hosted -- --url YOUR_SITE_URL</code>.</p>'}<small>The app makes no AI API calls. Access to a private Site follows the owner’s sharing settings.</small></section>
 <section class="run-card"><span class="eyebrow">02 / LOCALHOST</span><h2>Run it on your computer.</h2><p>Keep the project folder and use Node.js 22.13 or newer (24 LTS recommended). No OpenAI account, API key, or package installation is needed to use the bundled app.</p><a class="button orange" href="${esc(mode.localURL)}#/dashboard" target="_blank" rel="noopener">${mode.local?'Open local studio':'Open localhost after starting it'} ↗</a><small>A website cannot start a program on your computer. Start the local server using the steps below first.</small></section>
 </div>
 <section class="run-instructions"><span class="eyebrow">LOCAL QUICK START</span><h2>One folder. One command.</h2><ol><li>Open your <strong>javascript-fieldwork</strong> project folder.</li><li>On macOS, double-click <strong>Start Fieldwork.command</strong>. On Windows, double-click <strong>Start Fieldwork.cmd</strong>. The launcher opens your default browser.</li><li>Keep the Terminal window open while studying. Press <strong>Control-C</strong> there to stop the server.</li></ol><p>Or open a terminal in the project folder and run:</p><pre><code>npm start</code></pre><p>Visit <code>http://localhost:4187</code>. Use <code>npm run start:open</code> to start and open the browser together. If the port is occupied, the terminal explains how to select another port.</p><a class="text-link" href="running.md" download>Download the setup guide ↓</a></section>
 <section class="run-instructions"><span class="eyebrow">YOUR SOURCE BACKUP</span><h2>Keep building from GitHub.</h2><p>You can clone the source from GitHub or <a href="https://i5adovyi.github.io/javascript-fieldwork/">open the public studio on GitHub Pages</a> without signing in. A GitHub push does not automatically publish a Sites update.</p><a class="button outline small" href="${SOURCE_URL}" target="_blank" rel="noopener">Open GitHub repository ↗</a></section><section class="run-instructions"><span class="eyebrow">ANOTHER ACCOUNT, YOUR SAME PROJECT</span><h2>Continue in Codex.</h2><p>Open this folder in Codex after signing into another account. Run <code>npm run prepare:new-account</code> for a separate copy ready to create a new OpenAI Site owned by that account.</p><a class="text-link" href="new-account.md" download>Download the new-account guide ↓</a></section><section class="run-transfer"><span class="eyebrow">BRING YOUR PROGRESS WITH YOU</span><h2>Switch copies without losing your work.</h2><p>Hosted copies save in their own browser storage. Desktop copies connect to the SQLite database on your computer. Switching to a hosted link does not sync or move it.</p><ol><li>Open <strong>Data &amp; backups → Export this window</strong> for progress, drafts, and book notes together.</li><li>Open the other copy and use <strong>Data &amp; backups → Import all-data backup</strong>.</li><li>Choose your original PDF in that browser. The book file is separate from the backup.</li><li>Select <strong>Remember PDF</strong> once for that browser and address. Keep using the same hostname and port.</li></ol><p>Your original PDF stays on your device. It is not included in GitHub, deployment files, or either notes backup.</p>${link('data','Open Data & backups →','button outline small')}</section>`;
}
