import { initI18n, applyStaticStrings } from './i18n.js';
import { fetchSiteData } from './sheetsClient.js';
import { setSiteData, renderAll, renderSkeletons, renderError } from './render.js';
import { initTariffModal } from './tariffModal.js';
import { initMediaModal } from './mediaModal.js';
import { initLeadForm } from './leadForm.js';

function initThemeToggle() {
  const KEY = 'theme';
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem(KEY);
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(KEY, next);
  });
}

async function loadData() {
  renderSkeletons();
  try {
    const data = await fetchSiteData();
    setSiteData(data);
    renderAll();
  } catch (err) {
    console.error('Sheets fetch failed:', err);
    renderError(loadData);
  }
}

function bootstrap() {
  initI18n();
  initThemeToggle();
  initTariffModal();
  initMediaModal();
  initLeadForm();

  document.addEventListener('langchange', () => {
    // Data already fetched — re-render from memory, no new network request.
    import('./render.js').then((m) => m.renderAll());
  });

  document.getElementById('heroRequestBtn').addEventListener('click', () => {
    import('./leadForm.js').then((m) => m.openLeadForm(''));
  });

  loadData();
}

document.addEventListener('DOMContentLoaded', bootstrap);
