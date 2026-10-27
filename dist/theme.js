// Runs before styles so the saved appearance is applied on the first paint.
// Appearance belongs to this browser, separately from private study records.
(() => {
  'use strict';
  const key = 'fieldwork.theme.v1';
  const modes = new Set(['system', 'light', 'dark']);
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = 'system';
  try {
    const saved = window.localStorage.getItem(key);
    if (modes.has(saved)) preference = saved;
  } catch { /* A restricted browser can still use a session-only theme. */ }

  function apply() {
    const theme = preference === 'system' ? (system.matches ? 'dark' : 'light') : preference;
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.themePreference = preference;
    const color = document.querySelector('meta[name="theme-color"]');
    if (color) color.content = theme === 'dark' ? '#181d19' : '#f5f3ed';
    document.querySelectorAll('[data-theme-select]').forEach(select => { select.value = preference; });
  }

  apply();
  system.addEventListener('change', () => { if (preference === 'system') apply(); });
  window.addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    preference = modes.has(event.newValue) ? event.newValue : 'system';
    apply();
  });
  document.addEventListener('change', event => {
    if (!event.target.matches('[data-theme-select]') || !modes.has(event.target.value)) return;
    preference = event.target.value;
    apply();
    let saved = true;
    try { window.localStorage.setItem(key, preference); } catch { saved = false; }
    document.querySelectorAll('[data-theme-status]').forEach(status => {
      status.hidden = saved;
      status.textContent = saved ? '' : 'Theme changed for this session; browser storage is unavailable.';
    });
  });
})();
