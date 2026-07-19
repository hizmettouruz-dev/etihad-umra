import { initI18n, applyStaticStrings } from './i18n.js?v=8';
import { fetchSiteData } from './sheetsClient.js?v=8';
import { setSiteData, renderTariffs, refreshTariffView, renderFaq, renderContacts, renderSkeletons, renderError, closeTariffDetail } from './render.js?v=8';
import { initMediaModal } from './mediaModal.js?v=8';
import { initLeadForm } from './leadForm.js?v=8';
import { initContactWidget, renderContactWidget } from './contactWidget.js?v=8';

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
    refreshTariffView();
    // FAQ/Contacts data already fetched — re-render from memory, no new network request.
    renderFaq();
    renderContacts();
    renderContactWidget();
  });

  loadData();
}

document.addEventListener('DOMContentLoaded', bootstrap);
