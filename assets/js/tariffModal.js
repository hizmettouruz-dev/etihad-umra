import { t, getLang } from './i18n.js';
import { getSiteData } from './render.js';
import { openMediaModal } from './mediaModal.js';
import { openLeadForm } from './leadForm.js';
import { GH_PHOTO_BASE } from './config.js';

function field(obj, base) {
  return obj[`${base}_${getLang()}`] || obj[`${base}_ru`] || '';
}

function el(id) { return document.getElementById(id); }

export function openTariffModal(tariffId, focusRequest = false) {
  const data = getSiteData();
  const tf = data.tariffs.find((r) => r.id === tariffId);
  if (!tf) return;

  if (focusRequest) {
    openLeadForm(field(tf, 'name'));
    return;
  }

  const hotels = data.tariffHotels.filter((r) => r.tariff_id === tariffId);
  const media = data.media
    .filter((r) => r.tariff_id === tariffId)
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

  el('tariffModalTitle').textContent = field(tf, 'name');

  // Column 1 — gallery + prices
  const priceTiers = [
    ['price_single', 1], ['price_double', 2], ['price_triple', 3], ['price_quad', 4],
  ].filter(([key]) => tf[key]);

  el('tmGallery').innerHTML = media.slice(0, 6).map((m, i) => `
    <div class="tm-gallery-item" data-media-idx="${i}">
      ${m.type === 'image'
        ? `<img loading="lazy" alt="${m[`label_${getLang()}`] || ''}" src="${GH_PHOTO_BASE}${m.gh_asset_filename}">`
        : `<div class="play-badge">▶</div>`}
    </div>
  `).join('');

  el('tmPrices').innerHTML = priceTiers.map(([key, n]) => `
    <div class="tm-price-row"><span>${n} ${t('per_person')}</span><b>$${tf[key]}</b></div>
  `).join('');

  el('tmGallery').querySelectorAll('.tm-gallery-item').forEach((node) => {
    node.addEventListener('click', () => {
      const items = media.map((m) => ({
        type: m.type,
        filename: m.gh_asset_filename,
        label: m[`label_${getLang()}`] || m.label_ru || '',
      }));
      openMediaModal(items, Number(node.dataset.mediaIdx));
    });
  });

  // Column 2 — hotels by city
  el('tmHotels').innerHTML = hotels.map((h) => `
    <div class="tm-hotel-row">
      <div class="hotel-name">${h.hotel_name} <span class="hotel-meta">· ${h.city}</span></div>
      <div class="hotel-meta">${h.nights ? h.nights + ' · ' : ''}${field(h, 'meal_plan')}</div>
    </div>
  `).join('') || `<div class="tm-hotel-row hotel-meta">—</div>`;

  // Column 3 — flight + meal + inclusions
  const inclusions = field(tf, 'inclusions').split('|').map((s) => s.trim()).filter(Boolean);
  el('tmFlight').innerHTML = `
    ${tf.flight_route ? `<div class="tm-info-row"><b>${tf.flight_route}</b></div>` : ''}
    ${tf.flight_details ? `<div class="tm-info-row">${tf.flight_details}</div>` : ''}
    ${field(tf, 'meal_plan') ? `<div class="tm-info-row">${field(tf, 'meal_plan')}</div>` : ''}
  `;
  el('tmChecklist').innerHTML = inclusions.map((i) => `<li>${i}</li>`).join('');

  const isPlaceholder = tf.is_placeholder === 'TRUE';
  const ctaBtn = el('tmCta');
  ctaBtn.textContent = isPlaceholder ? t('coming_soon') : t('btn_request');
  ctaBtn.classList.toggle('disabled', isPlaceholder);
  ctaBtn.onclick = () => { if (!isPlaceholder) openLeadForm(field(tf, 'name')); };

  // Mobile tabs default to first
  el('tariffBackdrop').querySelectorAll('.tm-col').forEach((c, i) => c.classList.toggle('active', i === 0));
  el('tariffBackdrop').querySelectorAll('.tariff-modal-tabs button').forEach((b, i) => b.classList.toggle('active', i === 0));

  el('tariffBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function closeTariffModal() {
  el('tariffBackdrop').classList.remove('open');
  document.body.style.overflow = '';
}

export function initTariffModal() {
  el('tariffBackdrop').addEventListener('click', (e) => {
    if (e.target === el('tariffBackdrop')) closeTariffModal();
  });
  el('tariffModalCloseBtn').addEventListener('click', closeTariffModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && el('tariffBackdrop').classList.contains('open')) closeTariffModal();
  });
  el('tariffBackdrop').querySelectorAll('.tariff-modal-tabs button').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      el('tariffBackdrop').querySelectorAll('.tariff-modal-tabs button').forEach((b) => b.classList.remove('active'));
      el('tariffBackdrop').querySelectorAll('.tm-col').forEach((c) => c.classList.remove('active'));
      btn.classList.add('active');
      el('tariffBackdrop').querySelectorAll('.tm-col')[i].classList.add('active');
    });
  });
}
