import { t, getLang } from './i18n.js';
import { openMediaModal } from './mediaModal.js';
import { openLeadForm } from './leadForm.js';
import { GH_PHOTO_BASE } from './config.js';
import { THU_DATES_2026, SAT_DATES_2026 } from './departureDates.js';
import { MEDINA_PLACES, MAKKA_PLACES } from './ziyaratPlaces.js';
import { TARIFFS } from './tariffsData.js';
import {
  iconPlane, iconHotel, iconMeal, iconPeople, iconLuggage, iconTrain,
  iconTicket, iconTransfer, iconVisa, iconGuide, iconMedical, iconWater,
} from './icons.js';

const INC_ICON_MAP = [
  [/aviabilet/i, iconTicket],
  [/transfer/i, iconTransfer],
  [/viza/i, iconVisa],
  [/shifokor/i, iconMedical],
  [/zamzam/i, iconWater],
  [/poyezd/i, iconTrain],
  [/ellikboshi/i, iconGuide],
  [/muzey/i, iconGuide],
  [/dengiz/i, iconWater],
  [/nimcha|sumka|beydjik/i, iconLuggage],
];

const OCC_LABEL = { sngl: '1', dbl: '2', trpl: '3', quad: '4' };

// In-memory only — never persisted, so a language switch or re-render never
// shows stale data; it just re-projects the same freshly-fetched objects.
// (Only used by FAQ/Contacts now — tariffs are static, see tariffsData.js.)
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
  ['faq-list', 'contacts-grid'].forEach((id) => {
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

// ================= Tariffs (static data, see tariffsData.js) =================

function tariffMinPrice(tf) {
  let min = Infinity;
  if (tf.mode === 'multi') {
    tf.dates.forEach((d) => Object.values(d.prices).forEach((p) => { if (p < min) min = p; }));
  } else {
    Object.values(tf.seasonal.jun_sep.prices).forEach((p) => { if (p < min) min = p; });
  }
  return min === Infinity ? null : min;
}

function tariffFirstHotels(tf) {
  return tf.mode === 'multi' ? tf.dates[0].hotels : tf.seasonal.jun_sep.hotels;
}

export function renderTariffs() {
  const grid = document.getElementById('tariffs-grid');
  if (!grid) return;

  grid.innerHTML = Object.values(TARIFFS).map((tf) => {
    const price = tariffMinPrice(tf);
    const hotels = tariffFirstHotels(tf);
    return `
      <div class="tile ${tf.theme}" data-tariff-id="${tf.id}" role="button" tabindex="0">
        <div class="tname">${tf.name}</div>
        <div class="tsub">${t('pkg_label')}</div>
        <div class="tsub-info">${price ? `${t('price_from')} $${price} · ` : ''}${hotels.map((h) => h.hotel_name).join(' · ')}</div>
        <div class="tgo">${t('btn_view')} →</div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.tile').forEach((tile) => {
    tile.addEventListener('click', () => openTariffDetail(tile.dataset.tariffId));
  });
}

function buildMediaList(tf) {
  const photos = tf.photos.map((p) => ({ type: 'image', filename: p.new_name, label: p.hotel_name, category: 'hotel' }));
  const meals = tf.daily_meal_photos.map((p, i) => ({ type: 'image', filename: p.new_name, label: `${t('meal_gallery_label')} ${i + 1}`, category: 'meal' }));
  const videos = tf.videos.map((v) => ({ type: 'video', filename: v.new_name, label: v.label, category: 'video' }));
  return [...photos, ...meals, ...videos];
}

function bestCityMatch(hotelName, hotelsList) {
  const words = hotelName.toLowerCase().split(/\s+/);
  let best = '', bestScore = 0;
  hotelsList.forEach((h) => {
    const hwords = new Set(h.hotel_name.toLowerCase().split(/\s+/));
    const score = words.filter((w) => hwords.has(w)).length;
    if (score > bestScore) { bestScore = score; best = h.city; }
  });
  return best;
}

function galleryItemHtml(m, idx) {
  return `<div class="tm-gallery-item" data-media-idx="${idx}"><img loading="lazy" alt="${m.label}" src="${GH_PHOTO_BASE}${m.filename}"></div>`;
}

function hotelGalleryHtml(media, hotelsList) {
  const photoItems = media.filter((m) => m.category === 'hotel');
  if (!photoItems.length) return '';
  const groups = [];
  const byName = {};
  photoItems.forEach((m) => {
    if (!byName[m.label]) {
      byName[m.label] = { label: m.label, city: bestCityMatch(m.label, hotelsList), items: [] };
      groups.push(byName[m.label]);
    }
    byName[m.label].items.push(m);
  });
  return groups.map((g) => `
    <div class="hotel-gallery-caption">${g.label}${g.city ? ' · ' + g.city : ''}</div>
    <div class="tm-gallery">${g.items.map((m) => galleryItemHtml(m, media.indexOf(m))).join('')}</div>
  `).join('');
}

function mealGalleryHtml(media) {
  const items = media.filter((m) => m.category === 'meal');
  if (!items.length) return '';
  return `
    <div class="hotel-gallery-caption">${t('meal_gallery_label')}</div>
    <div class="tm-gallery">${items.map((m) => galleryItemHtml(m, media.indexOf(m))).join('')}</div>
  `;
}

function videoLinkHtml(media) {
  const videos = media.filter((m) => m.type === 'video');
  if (!videos.length) return '';
  const firstIdx = media.indexOf(videos[0]);
  const label = videos.length > 1 ? `${t('btn_watch_video')} (${videos.length})` : t('btn_watch_video');
  return `<div class="media-link" data-media-idx="${firstIdx}">${label}</div>`;
}

function airlineBoxHtml(airline, route) {
  return `
    <div class="airline">
      <span class="ico">${iconPlane()}</span>
      <div>
        <div class="al-name">${airline}</div>
        <div class="al-route">${route}</div>
      </div>
    </div>
  `;
}

function hotelsHtml(hotels) {
  return hotels.map((h) => `
    <div class="hotel">
      <div class="ic">${iconHotel()}</div>
      <div class="h-body">
        <div class="h-city">${h.city.toUpperCase()} <b>— ${h.nights.toUpperCase()}</b></div>
        <div class="h-name">${h.hotel_name}</div>
        <div class="h-meal"><span class="ico">${iconMeal()}</span>${h.meal}</div>
      </div>
    </div>
  `).join('');
}

function pricesHtml(entries) {
  if (!entries.length) return '';
  return `
    <div class="prices">${entries.map(([occ, price]) => `
      <div class="price-row"><div class="pl"><span class="ico">${iconPeople()}</span><span>${occ} ${t('per_person')}</span></div><div class="price-tag">$${price}</div></div>
    `).join('')}</div>
    <div class="note">${t('price_note')}</div>
  `;
}

function inclusionIcon(raw) {
  const m = INC_ICON_MAP.find(([re]) => re.test(raw));
  return m ? m[1]() : '';
}

function inclusionsGridHtml(list) {
  if (!list.length) return '';
  const items = list.map((raw) => `<div class="inc"><div class="ib">${inclusionIcon(raw)}</div><small>${raw}</small></div>`).join('');
  return `<div class="inc-head">${t('inclusions_label')}</div><div class="inc-grid">${items}</div>`;
}

function placesSectionHtml() {
  return `
    <div class="places-section">
      <div class="inc-head">${t('places_label')}</div>
      <div class="places-line"><b>${t('places_medina_label')}:</b> ${MEDINA_PLACES.join(', ')}</div>
      <div class="places-line"><b>${t('places_makka_label')}:</b> ${MAKKA_PLACES.join(', ')}</div>
    </div>
  `;
}

function wireMediaClicks(cardsEl, media) {
  cardsEl.querySelectorAll('.tm-gallery-item, .media-link').forEach((node) => {
    node.addEventListener('click', () => {
      const items = media.map((m) => ({ type: m.type, filename: m.filename, label: m.label }));
      openMediaModal(items, Number(node.dataset.mediaIdx));
    });
  });
}

function wireCtaClicks(cardsEl, name) {
  cardsEl.querySelectorAll('[data-role="request"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dateRange = btn.dataset.dateRange;
      openLeadForm(dateRange ? `${name} (${dateRange})` : name);
    });
  });
}

function datePillHtml(start, end) {
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

// ---------------- multi-date mode ----------------

function multiSubtitle(tf) {
  const price = tariffMinPrice(tf);
  const hotels = tf.dates[0].hotels;
  const parts = [];
  if (price) parts.push(`${t('price_from')} $${price}`);
  hotels.forEach((h) => parts.push(`${h.city}: ${h.hotel_name} (${h.nights})`));
  return `<div class="pkg-subtitle">${parts.join(' · ')}</div>`;
}

function extraServicesHtmlMulti(list) {
  if (!list.length) return '';
  return `
    <div class="addon-head">${t('extra_services_label')}</div>
    ${list.map((e) => `
      <div class="extra">
        <span class="ico">${iconLuggage()}</span>
        <span>${e.label}</span>
        <b class="addon-pr">$${e.price} / ${e.unit}</b>
      </div>
    `).join('')}
  `;
}

function transferBannerHtml(entry) {
  const icon = entry.transfer_mode === 'bus' ? iconTransfer() : iconTrain();
  return `<div class="train"><span class="ico">${icon}</span>${entry.transfer_line.toUpperCase()}</div>`;
}

function renderMultiDateDetail(tf, cardsEl) {
  const media = buildMediaList(tf);
  const subtitle = multiSubtitle(tf);
  const galleryHtml = hotelGalleryHtml(media, tf.dates[0].hotels) + mealGalleryHtml(media);

  cardsEl.innerHTML = tf.dates.map((entry) => `
    <div class="col">
      <div class="pkg-card ${tf.theme}" data-tariff-id="${tf.id}">
        <div class="pkg-title-banner">${tf.name}</div>
        ${subtitle}
        ${datePillHtml(entry.date_start, entry.date_end)}
        <div class="days-badge">${entry.duration}</div>
        ${galleryHtml}
        ${videoLinkHtml(media)}
        ${airlineBoxHtml(entry.airline, entry.route)}
        ${hotelsHtml(entry.hotels)}
        ${pricesHtml(Object.entries(entry.prices).sort((a, b) => Number(b[0]) - Number(a[0])))}
        ${transferBannerHtml(entry)}
        ${entry.room_note ? `<div class="note">${entry.room_note}</div>` : ''}
        ${extraServicesHtmlMulti(entry.extra_services)}
        ${placesSectionHtml()}
        ${inclusionsGridHtml(entry.inclusions)}
        <div class="pkg-cta" data-role="request" data-date-range="${entry.date_start} – ${entry.date_end}">${t('btn_book_dates')}</div>
      </div>
    </div>
  `).join('');

  wireMediaClicks(cardsEl, media);
  wireCtaClicks(cardsEl, tf.name);
}

// ---------------- seasonal mode (+ date picker) ----------------

const seasonalSelection = {};

function extraServicesHtmlSeasonal(list) {
  if (!list.length) return '';
  return `
    <div class="addon-head">${t('extra_services_label')}</div>
    ${list.map((raw) => {
      const m = raw.match(/^(.*?):\s*\+(\d+)\$/);
      const label = (m ? m[1] : raw).replace(/^[^\wа-яёʼ']+/i, '').trim();
      const price = m ? m[2] : '';
      return `
        <div class="extra">
          <span class="ico">${iconLuggage()}</span>
          <span>${label}</span>
          ${price ? `<b class="addon-pr">+$${price}</b>` : ''}
        </div>
      `;
    }).join('')}
  `;
}

function datePickerHtml(dateList, selIdx) {
  return `
    <div class="date-picker">
      <div class="date-picker-head">${t('departure_dates_label')}</div>
      <div class="date-picker-sub">${t('choose_date_label')}</div>
      <div class="date-picker-grid">
        ${dateList.map((d, i) => `
          <button type="button" class="date-picker-item ${i === selIdx ? 'active' : ''}" data-date-idx="${i}">
            <span>${d[0]}</span><span class="arrow">→</span><span>${d[1]}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function renderSeasonalDetail(tf, cardsEl) {
  const dateList = tf.seasonal.jun_sep.weekday === 'Payshanba' ? THU_DATES_2026 : SAT_DATES_2026;
  const selIdx = seasonalSelection[tf.id] ?? 0;
  const selDate = dateList[selIdx];
  const isOctDec = Number(selDate[0].split('.')[1]) >= 10;
  const season = isOctDec ? tf.seasonal.oct_dec : tf.seasonal.jun_sep;
  const media = buildMediaList(tf);
  const priceEntries = ['quad', 'trpl', 'dbl', 'sngl']
    .filter((k) => season.prices[k])
    .map((k) => [OCC_LABEL[k], season.prices[k]]);
  const minPrice = Math.min(...Object.values(season.prices));

  cardsEl.innerHTML = `
    <div class="col">
      <div class="pkg-card ${tf.theme}" data-tariff-id="${tf.id}">
        <div class="pkg-title-banner">${tf.name}</div>
        <div class="pkg-subtitle">${t('price_from')} $${minPrice} · ${season.hotels.map((h) => `${h.city}: ${h.hotel_name} (${h.nights})`).join(' · ')}</div>
        <div class="days-badge">${season.duration.toUpperCase()}</div>
        ${hotelGalleryHtml(media, season.hotels)}
        ${mealGalleryHtml(media)}
        ${videoLinkHtml(media)}
        ${hotelsHtml(season.hotels)}
        ${pricesHtml(priceEntries)}
        ${extraServicesHtmlSeasonal(tf.seasonal.extra_services || [])}
        ${placesSectionHtml()}
        ${datePickerHtml(dateList, selIdx)}
        <div class="pkg-cta" data-role="request" data-date-range="${selDate[0]} – ${selDate[1]}">${t('btn_book_dates')}</div>
      </div>
    </div>
  `;

  cardsEl.querySelectorAll('.date-picker-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      seasonalSelection[tf.id] = Number(btn.dataset.dateIdx);
      renderSeasonalDetail(tf, cardsEl);
    });
  });
  wireMediaClicks(cardsEl, media);
  wireCtaClicks(cardsEl, tf.name);
}

// ---------------- shared open/close ----------------

export function openTariffDetail(tariffId) {
  const tf = TARIFFS[tariffId];
  if (!tf) return;

  document.getElementById('tariffCrumb').innerHTML = `<b>${tf.name}</b>`;
  document.getElementById('tariffsHead').hidden = true;
  document.getElementById('tariffs-grid').hidden = true;
  document.getElementById('tariffDetail').hidden = false;

  const cardsEl = document.getElementById('tariffDetailCards');
  if (tf.mode === 'multi') renderMultiDateDetail(tf, cardsEl);
  else renderSeasonalDetail(tf, cardsEl);

  document.getElementById('tariffDetail').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function closeTariffDetail() {
  document.getElementById('tariffsHead').hidden = false;
  document.getElementById('tariffs-grid').hidden = false;
  document.getElementById('tariffDetail').hidden = true;
}

// ================= FAQ / Contacts (still sheet-driven) =================

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
