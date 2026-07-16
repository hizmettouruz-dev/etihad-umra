import { t, getLang } from './i18n.js';
import { openMediaModal } from './mediaModal.js';
import { openLeadForm } from './leadForm.js';
import { GH_PHOTO_BASE, GENERIC_MEDIA } from './config.js';
import { datesForDepartureDay } from './departureDates.js';

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

export function renderAll() {
  renderTariffs();
  renderFaq();
  renderContacts();
}

const PRICE_TIERS = [['price_single', 1], ['price_double', 2], ['price_triple', 3], ['price_quad', 4]];

function galleryHtml(media) {
  if (!media.length) return '';
  return `<div class="tm-gallery">${media.slice(0, 6).map((m, i) => `
    <div class="tm-gallery-item" data-media-idx="${i}">
      ${m.type === 'image'
        ? `<img loading="lazy" alt="${m[`label_${getLang()}`] || ''}" src="${GH_PHOTO_BASE}${m.gh_asset_filename}">`
        : `<div class="play-badge">▶</div>`}
    </div>
  `).join('')}</div>`;
}

function pricesHtml(tf) {
  const tiers = PRICE_TIERS.filter(([key]) => tf[key]);
  if (!tiers.length) return '';
  return `<div class="tm-prices">${tiers.map(([key, n]) => `
    <div class="tm-price-row"><span>${n} ${t('per_person')}</span><b>$${tf[key]}</b></div>
  `).join('')}</div>`;
}

function hotelsHtml(hotels) {
  if (!hotels.length) return '';
  return hotels.map((h) => `
    <div class="tm-hotel-row">
      <div class="hotel-name">${h.hotel_name} <span class="hotel-meta">· ${h.city}</span></div>
      <div class="hotel-meta">${h.nights ? h.nights + ' · ' : ''}${field(h, 'meal_plan')}</div>
    </div>
  `).join('');
}

function activeTariffs() {
  return siteData.tariffs
    .filter((tf) => tf.is_active !== 'FALSE')
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
}

export function renderTariffs() {
  const grid = document.getElementById('tariffs-grid');
  if (!grid || !siteData) return;

  grid.innerHTML = activeTariffs().map((tf) => {
    const isPlaceholder = tf.is_placeholder === 'TRUE';
    const name = field(tf, 'name');
    const theme = tf.theme || 't-gold';
    return `
      <div class="tile ${theme}" data-tariff-id="${tf.id}" ${isPlaceholder ? '' : 'role="button" tabindex="0"'}>
        <div class="tname">${name}</div>
        <div class="tsub">${t('pkg_label')}</div>
        <div class="tgo">${isPlaceholder ? t('coming_soon') : t('btn_view') + ' →'}</div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.tile').forEach((tile) => {
    const tf = siteData.tariffs.find((r) => r.id === tile.dataset.tariffId);
    if (tf && tf.is_placeholder === 'TRUE') return;
    tile.addEventListener('click', () => openTariffDetail(tile.dataset.tariffId));
  });
}

function datePillHtml(dates) {
  if (!dates.length) return '';
  const [start, end] = dates;
  return `
    <div class="date-strip">
      <div class="date-label">${t('date_label')}</div>
      <div class="date-pills">
        <div class="date-pill">${start}</div>
        <div class="date-dash">→</div>
        <div class="date-pill">${end}</div>
      </div>
    </div>
  `;
}

function renderTariffDetail(tariffId) {
  const cardsEl = document.getElementById('tariffDetailCards');
  const tf = siteData.tariffs.find((r) => r.id === tariffId);
  if (!cardsEl || !tf) return;

  const name = field(tf, 'name');
  const duration = field(tf, 'duration_days');
  const departure = field(tf, 'departure_day');
  const theme = tf.theme || 't-gold';
  const hotels = siteData.tariffHotels.filter((r) => r.tariff_id === tf.id);
  const media = [
    ...siteData.media.filter((r) => r.tariff_id === tf.id).sort((a, b) => Number(a.order || 0) - Number(b.order || 0)),
    ...GENERIC_MEDIA,
  ];
  const desc = field(tf, 'short_desc');
  const inclusions = field(tf, 'inclusions').split('|').map((s) => s.trim()).filter(Boolean);
  const dateOptions = datesForDepartureDay(tf.departure_day_ru);
  const bodyHtml = `
    <div class="pkg-badge">${duration}${departure ? ' · ' + departure : ''}</div>
    ${desc ? `<div class="pkg-desc">${desc}</div>` : ''}
    ${galleryHtml(media)}
    ${tf.flight_route ? `<div class="tm-info-row route"><b>${tf.flight_route}</b></div>` : ''}
    ${field(tf, 'flight_details') ? `<div class="tm-info-row">${field(tf, 'flight_details')}</div>` : ''}
    ${hotelsHtml(hotels)}
    ${field(tf, 'meal_plan') ? `<div class="tm-info-row">${field(tf, 'meal_plan')}</div>` : ''}
    ${pricesHtml(tf)}
    ${inclusions.length ? `<ul class="tm-checklist">${inclusions.map((i) => `<li>${i}</li>`).join('')}</ul>` : ''}
  `;

  const cardsToRender = dateOptions.length ? dateOptions : [null];
  cardsEl.innerHTML = cardsToRender.map((dates) => `
    <div class="pkg-card ${theme}" data-tariff-id="${tf.id}">
      <div class="pkg-title-banner">${name}</div>
      ${dates ? datePillHtml(dates) : ''}
      ${bodyHtml}
      <div class="pkg-cta" data-role="request" data-date-range="${dates ? `${dates[0]} – ${dates[1]}` : ''}">${t('btn_book_dates')}</div>
    </div>
  `).join('');

  cardsEl.querySelectorAll('.tm-gallery-item').forEach((node) => {
    node.addEventListener('click', () => {
      const items = media.map((m) => ({
        type: m.type,
        filename: m.gh_asset_filename,
        label: m[`label_${getLang()}`] || m.label_ru || '',
      }));
      openMediaModal(items, Number(node.dataset.mediaIdx));
    });
  });

  cardsEl.querySelectorAll('[data-role="request"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dateRange = btn.dataset.dateRange;
      openLeadForm(dateRange ? `${name} (${dateRange})` : name);
    });
  });
}

export function openTariffDetail(tariffId) {
  const tf = siteData.tariffs.find((r) => r.id === tariffId);
  if (!tf) return;

  document.getElementById('tariffCrumb').innerHTML = `<b>${field(tf, 'name')}</b>`;
  document.getElementById('tariffsHead').hidden = true;
  document.getElementById('tariffs-grid').hidden = true;
  document.getElementById('tariffDetail').hidden = false;
  renderTariffDetail(tariffId);
  document.getElementById('tariffDetail').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function closeTariffDetail() {
  document.getElementById('tariffsHead').hidden = false;
  document.getElementById('tariffs-grid').hidden = false;
  document.getElementById('tariffDetail').hidden = true;
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
