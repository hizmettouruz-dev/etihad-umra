import { t, getLang } from './i18n.js';
import { openMediaModal } from './mediaModal.js';
import { openLeadForm } from './leadForm.js';
import { GH_PHOTO_BASE, GENERIC_MEDIA } from './config.js';
import { datesForDepartureDay } from './departureDates.js';
import { MEDINA_PLACES, MAKKA_PLACES } from './ziyaratPlaces.js';

const INC_ICON_MAP = [
  [/перел/i, '✈️', 'inc_flight'],
  [/трансфер/i, '🚐', 'inc_transfer'],
  [/виза/i, '🛂', 'inc_visa'],
  [/гид/i, '🧭', 'inc_guide'],
  [/медстрахов/i, '➕', 'inc_insurance'],
  [/замзам/i, '💧', 'inc_zamzam'],
];

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

function photosGalleryHtml(media) {
  const photos = media.filter((m) => m.type === 'image');
  if (!photos.length) return '';
  return `<div class="tm-gallery">${photos.map((m) => {
    const idx = media.indexOf(m);
    return `
      <div class="tm-gallery-item" data-media-idx="${idx}">
        <img loading="lazy" alt="${m[`label_${getLang()}`] || ''}" src="${GH_PHOTO_BASE}${m.gh_asset_filename}">
      </div>
    `;
  }).join('')}</div>`;
}

function videoButtonsHtml(media) {
  const videos = media.filter((m) => m.type === 'video');
  if (!videos.length) return '';
  return videos.map((m) => {
    const idx = media.indexOf(m);
    const label = m[`label_${getLang()}`] || m.label_ru || '';
    return `<div class="watch-video-btn" data-media-idx="${idx}">${t('btn_watch_video')}${label ? ' — ' + label : ''}</div>`;
  }).join('');
}

function airlineBoxHtml(tf) {
  const details = field(tf, 'flight_details');
  if (!details && !tf.flight_route) return '';
  const dotIdx = details.indexOf('.');
  const airlineName = dotIdx > -1 ? details.slice(0, dotIdx) : details;
  const rest = dotIdx > -1 ? details.slice(dotIdx + 1).trim() : '';
  return `
    <div class="airline-box">
      ${airlineName ? `<div class="airline-name">✈️ ${airlineName}</div>` : ''}
      ${tf.flight_route ? `<div class="airline-route">${tf.flight_route}</div>` : ''}
      ${rest ? `<div class="airline-detail">${rest}</div>` : ''}
    </div>
  `;
}

function subtitleHtml(tf, hotels) {
  const price = tf.price_quad || tf.price_triple || tf.price_double || tf.price_single;
  const parts = [];
  if (price) parts.push(`${t('price_from')} $${price}`);
  hotels.forEach((h) => parts.push(`${h.city}: ${h.hotel_name}${h.nights ? ' (' + h.nights + ')' : ''}`));
  return parts.length ? `<div class="pkg-subtitle">${parts.join(' · ')}</div>` : '';
}

function pricesHtml(tf) {
  const tiers = PRICE_TIERS.filter(([key]) => tf[key]);
  if (!tiers.length) return '';
  return `
    <div class="tm-prices">${tiers.map(([key, n]) => `
      <div class="tm-price-row"><span>${n} ${t('per_person')}</span><b>$${tf[key]}</b></div>
    `).join('')}</div>
    <div class="price-note">${t('price_note')}</div>
  `;
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

function extraServicesHtml(hotels) {
  const rows = hotels.filter((h) => field(h, 'extra_badge_label'));
  if (!rows.length) return '';
  return `
    <div class="section-subhead">${t('extra_services_label')}</div>
    ${rows.map((h) => `
      <div class="extra-service-row">
        <span>${field(h, 'extra_badge_label')}</span>
        ${h.extra_price ? `<b>$${h.extra_price}</b>` : ''}
      </div>
    `).join('')}
  `;
}

function placesSectionHtml() {
  return `
    <div class="places-section">
      <div class="section-subhead">${t('places_label')}</div>
      <div class="places-city-label">${t('places_medina_label')}</div>
      <ul class="tm-checklist">${MEDINA_PLACES.map((p) => `<li>${p}</li>`).join('')}</ul>
      <div class="places-city-label">${t('places_makka_label')}</div>
      <ul class="tm-checklist">${MAKKA_PLACES.map((p) => `<li>${p}</li>`).join('')}</ul>
    </div>
  `;
}

function incGridHtml(tf) {
  const inclusionsRaw = (tf.inclusions_ru || '').split('|').map((s) => s.trim()).filter(Boolean);
  if (!inclusionsRaw.length) return '';
  const items = inclusionsRaw.map((raw) => {
    const match = INC_ICON_MAP.find(([re]) => re.test(raw));
    const icon = match ? match[1] : '✅';
    const label = match ? t(match[2]) : raw;
    return `<div class="inc-item"><div class="inc-ico">${icon}</div><div class="inc-label">${label}</div></div>`;
  }).join('');
  return `
    <div class="section-subhead">${t('inclusions_label')}</div>
    <div class="inc-grid">${items}</div>
  `;
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
  const dateOptions = datesForDepartureDay(tf.departure_day_ru);
  const subtitle = subtitleHtml(tf, hotels);
  const bodyHtml = `
    ${subtitle}
    ${desc ? `<div class="pkg-desc">${desc}</div>` : ''}
  `;
  const restHtml = `
    <div class="pkg-badge">${duration}${departure ? ' · ' + departure : ''}</div>
    ${photosGalleryHtml(media)}
    ${videoButtonsHtml(media)}
    ${airlineBoxHtml(tf)}
    ${hotelsHtml(hotels)}
    ${pricesHtml(tf)}
    <div class="transfer-banner">🚄 ${t('transfer_train_label')}</div>
    ${extraServicesHtml(hotels)}
    ${placesSectionHtml()}
    ${incGridHtml(tf)}
  `;

  const cardsToRender = dateOptions.length ? dateOptions : [null];
  cardsEl.innerHTML = cardsToRender.map((dates) => `
    <div class="pkg-card ${theme}" data-tariff-id="${tf.id}">
      <div class="pkg-title-banner">${name}</div>
      ${bodyHtml}
      ${dates ? datePillHtml(dates) : ''}
      ${restHtml}
      <div class="pkg-cta" data-role="request" data-date-range="${dates ? `${dates[0]} – ${dates[1]}` : ''}">${t('btn_book_dates')}</div>
    </div>
  `).join('');

  cardsEl.querySelectorAll('.tm-gallery-item, .watch-video-btn').forEach((node) => {
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
