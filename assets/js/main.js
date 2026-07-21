import { initI18n, applyStaticStrings } from './i18n.js?v=10';
import { fetchSiteData, fetchPriceSheetData } from './sheetsClient.js?v=10';
import {
  setSiteData, renderTariffs, refreshTariffView, renderFaq, renderContacts,
  renderSkeletons, renderError, closeTariffDetail,
  applyCachedPriceOverrides, applyLivePriceOverrides,
} from './render.js?v=10';
import { initMediaModal } from './mediaModal.js?v=10';
import { initLeadForm } from './leadForm.js?v=10';
import { initContactWidget, renderContactWidget } from './contactWidget.js?v=10';

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

async function loadPriceData() {
  try {
    // Reconcile prices/dates in the background. Usually a silent no-op
    // visually (the cache already matched); if the sheet changed since the
    // last successful fetch, this quietly updates whatever tariff screen is
    // open — no error state, no flash, since something correct was already
    // on screen from applyCachedPriceOverrides() below. Deliberately a
    // separate request/try-catch from FAQ/Contacts above, so a missing or
    // malformed price/date tab can never break those.
    const data = await fetchPriceSheetData();
    applyLivePriceOverrides(data);
    refreshTariffView();
  } catch (err) {
    console.error('Price sheet fetch failed:', err);
    // Tariffs are intentionally left untouched on failure — whatever was
    // already painted (cache or static baseline) stays exactly as-is.
  }
}

function bootstrap() {
  initI18n();
  initThemeToggle();
  initMediaModal();
  initLeadForm();
  initContactWidget();

  document.getElementById('tariffBackBtn').addEventListener('click', closeTariffDetail);

  applyCachedPriceOverrides(); // last known-good prices/dates, zero network wait
  renderTariffs(); // paints instantly — cached-or-static, never blank

  document.addEventListener('langchange', () => {
    refreshTariffView();
    // FAQ/Contacts data already fetched — re-render from memory, no new network request.
    renderFaq();
    renderContacts();
    renderContactWidget();
  });

  loadData();
  loadPriceData();
}

document.addEventListener('DOMContentLoaded', bootstrap);
