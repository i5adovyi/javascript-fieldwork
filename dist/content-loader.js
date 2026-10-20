export class ContentLoadError extends Error {
  constructor(message, kind = 'content') {
    super(message);
    this.name = 'ContentLoadError';
    this.kind = kind;
  }
}

// Resolve from the module, not the current document URL (which may be a deep link).
export async function loadContent(name, { fetcher = fetch, baseURL = import.meta.url } = {}) {
  const url = new URL(`./data/${name}.json`, baseURL);
  const response = await fetcher(url, {
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
    cache: 'no-cache',
  });
  if (response.status === 401 || response.status === 403) {
    throw new ContentLoadError('Sign in to access your private learning studio, then reload this page.', 'auth');
  }
  if (!response.ok) {
    throw new ContentLoadError(`Could not load ${name} (HTTP ${response.status}). Please try again.`);
  }
  const type = response.headers.get('content-type') || '';
  const text = await response.text();
  if (/^\s*</.test(text) || type.toLowerCase().includes('text/html')) {
    const isSignIn = /log in to access|sign in required|signin-with-chatgpt|auth\.openai\.com/i.test(text);
    throw new ContentLoadError(isSignIn
      ? 'Sign in to access your private learning studio, then reload this page.'
      : `The server returned a web page instead of ${name} data. Reload the studio to retry.`, isSignIn ? 'auth' : 'content');
  }
  if (!/(?:application|text)\/(?:[a-z0-9.+-]*\+)?json\b/i.test(type)) {
    throw new ContentLoadError(`The server returned an unsupported format for ${name}. Please reload the studio.`);
  }
  let content;
  try { content = JSON.parse(text); }
  catch { throw new ContentLoadError(`The ${name} data could not be read. Please reload the studio.`); }
  const expected = { curriculum: ['stages', 'lessons'], labs: ['labs'], library: ['resources', 'articles', 'projects'], wiki: ['wiki'] }[name];
  if (!expected || !content || !expected.every(key => Array.isArray(content[key]))) {
    throw new ContentLoadError(`The ${name} data has an unexpected structure. Please reload the studio.`);
  }
  return content;
}
