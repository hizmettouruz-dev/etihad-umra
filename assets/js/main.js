import { initI18n, applyStaticStrings } from './i18n.js';
import { fetchSiteData } from './sheetsClient.js';
import { setSiteData, renderTariffs, renderFaq, renderContacts, renderSkeletons, renderError, closeTariffDetail } from './render.js';
import { initMediaModal } from './mediaModal.js';
import { initLeadForm } from './leadForm.js';
import { initContactWidget, renderContactWidget } from './contactWidget.js';

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
    renderFaq();
    renderContacts();
  } catch (err) {
    console.error('Sheets fetch failed:', err);
    renderError(loadData);
  }
}

function bootstrap() {
  initI18n();
  initThemeToggle();
  initMediaModal();
  initLeadForm();
  initContactWidget();

  document.getElementById('tariffBackBtn').addEventListener('click', closeTariffDetail);

  renderTariffs(); // static data — renders instantly, no network wait

  document.addEventListener('langchange', () => {
    renderTariffs();
    // FAQ/Contacts data already fetched — re-render from memory, no new network request.
    import('./render.js').then((m) => { m.renderFaq(); m.renderContacts(); });
    renderContactWidget();
  });

  loadData();
}

document.addEventListener('DOMContentLoaded', bootstrap);
