import { t, getLang } from './i18n.js';
import { openTariffModal } from './tariffModal.js';

// In-memory only — never persisted, so a language switch or re-render never
// shows stale data; it just re-projects the same freshly-fetched objects.
let siteData = null;

export function getSiteData() {
  return siteData;
}

export function setSiteData(data) {
  siteData = data;
}

function field(obj, base) {
  return obj[`${base}_${getLang()}`] || obj[`${base}_ru`] || '';
}

export function renderSkeletons() {
  const grid = document.getElementById('tariffs-grid');
  if (grid) {
    grid.innerHTML = Array.from({ length: 6 })
      .map(() => '<div class="skeleton skeleton-card"></div>')
      .join('');
  }
  const faq = document.getElementById('faq-list');
  if (faq) {
    faq.innerHTML = Array.from({ length: 4 })
      .map(() => '<div class="skeleton" style="height:52px"></div>')
      .join('');
  }
  const contacts = document.getElementById('contacts-grid');
  if (contacts) {
    contacts.innerHTML = Array.from({ length: 3 })
      .map(() => '<div class="skeleton" style="height:80px"></div>')
      .join('');
  }
}

function errorBlock(sectionId, onRetry) {
  return `<div class="data-error">
    <div>${t('load_error')}</div>
    <button type="button" data-retry="${sectionId}">${t('retry')}</button>
  </div>`;
}

export function renderError(retryFn) {
  ['tariffs-grid', 'faq-list', 'contacts-grid'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = errorBlock(id);
  });
  document.querySelectorAll('[data-retry]').forEach((btn) => {
    btn.addEventListener('click', onRetry, { once: true });
  });
}

function tariffThumb(tariffId) {
  const m = siteData.media.find((r) => r.tariff_id === tariffId);
  if (!m) return '';
  if (m.type === 'image') return `https://raw.githack.com/`; // placeholder, real URL built in mediaModal
  return '';
}

export function renderAll() {
  renderTariffs();
  renderFaq();
  renderContacts();
}

export function renderTariffs() {
  const grid = document.getElementById('tariffs-grid');
  if (!grid || !siteData) return;

  const active = siteData.tariffs
    .filter((tf) => tf.is_active !== 'FALSE')
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

  grid.innerHTML = active.map((tf) => {
    const isPlaceholder = tf.is_placeholder === 'TRUE';
    const name = field(tf, 'name');
    const desc = field(tf, 'short_desc');
    const duration = field(tf, 'duration_days');
    const departure = field(tf, 'departure_day');
    const price = tf.price_quad || tf.price_triple || tf.price_double || tf.price_single || '';
    const theme = tf.theme || 't-gold';
    return `
      <div class="pkg-card ${theme}" data-tariff-id="${tf.id}" role="button" tabindex="0">
        <div class="pkg-title-banner">${name}</div>
        ${isPlaceholder ? `<div class="pkg-placeholder-badge">${t('coming_soon')}</div>` : `<div class="pkg-badge">${duration}${departure ? ' · ' + departure : ''}</div>`}
        <div class="pkg-duration">${tf.flight_route || ''}</div>
        ${price ? `<div class="pkg-price"><span>${t('price_from')} / ${t('per_person')}</span><b>$${price}</b></div>` : ''}
        <div class="pkg-desc">${desc}</div>
        <div class="pkg-cta" data-role="request" data-tariff-id="${tf.id}">${isPlaceholder ? t('coming_soon') : t('btn_request')}</div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.pkg-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      const requestBtn = e.target.closest('[data-role="request"]');
      const id = card.dataset.tariffId;
      const tf = siteData.tariffs.find((r) => r.id === id);
      if (tf && tf.is_placeholder === 'TRUE' && requestBtn) return;
      openTariffModal(id, requestBtn ? true : false);
    });
  });
}

export function renderFaq() {
  const list = document.getElementById('faq-list');
  if (!list || !siteData) return;

  const items = siteData.faq.sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
  list.innerHTML = items.map((f) => `
    <div class="faq-item">
      <button class="faq-q" type="button">
        <span>${field(f, 'question')}</span>
        <span class="faq-icon">+</span>
      </button>
      <div class="faq-a"><div class="faq-a-inner">${field(f, 'answer')}</div></div>
    </div>
  `).join('');

  list.querySelectorAll('.faq-q').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.closest('.faq-item').classList.toggle('open');
    });
  });
}

export function renderContacts() {
  const grid = document.getElementById('contacts-grid');
  if (!grid || !siteData) return;

  const byKey = {};
  siteData.contacts.forEach((row) => { byKey[row.key] = row; });

  const rows = [
    { key: 'phone', label: t('contact_phone'), icon: '📞' },
    { key: 'address', label: t('contact_address'), icon: '📍' },
    { key: 'hours', label: t('contact_hours'), icon: '🕐' },
    { key: 'social', label: t('contact_social'), icon: '💬' },
  ];

  grid.innerHTML = rows
    .filter((r) => byKey[r.key])
    .map((r) => `
      <div class="contact-card">
        <div class="ico">${r.icon}</div>
        <div>
          <b>${r.label}</b>
          <span>${field(byKey[r.key], 'value') || byKey[r.key].value || ''}</span>
        </div>
      </div>
    `).join('');
}
