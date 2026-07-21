import { openLeadForm } from './leadForm.js?v=11';
import { t } from './i18n.js?v=11';
import { getSiteData, resolveContacts } from './render.js?v=11';

function el(id) { return document.getElementById(id); }

function telHref(phone) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export function renderContactWidget() {
  const panel = el('contactPanel');
  if (!panel) return;

  const siteData = getSiteData();
  const c = resolveContacts(siteData && siteData.contacts);

  panel.innerHTML = `
    <a class="contact-link" href="${c.instagramUrl}" target="_blank" rel="noopener">
      <span class="ico">📷</span> ${t('contact_instagram')}
    </a>
    <a class="contact-link" href="${c.telegramUrl}" target="_blank" rel="noopener">
      <span class="ico">✈️</span> ${t('contact_telegram')}
    </a>
    <a class="contact-link" href="${c.whatsappUrl}" target="_blank" rel="noopener">
      <span class="ico">💬</span> ${t('contact_whatsapp')}
    </a>
    ${c.phones.map((p) => `
      <a class="contact-link" href="${telHref(p)}">
        <span class="ico">📞</span> ${p}
      </a>
    `).join('')}
    <a class="contact-link" href="${c.mapsUrl}" target="_blank" rel="noopener">
      <span class="ico">📍</span> ${c.address}
    </a>
    <button type="button" class="contact-lead-btn" id="contactLeadBtn">${t('btn_request')}</button>
  `;

  el('contactLeadBtn').addEventListener('click', () => {
    closeContactWidget();
    openLeadForm('');
  });
}

export function openContactWidget() {
  el('contactPanel').classList.add('open');
  el('contactToggleBtn').setAttribute('aria-expanded', 'true');
}

export function closeContactWidget() {
  el('contactPanel').classList.remove('open');
  el('contactToggleBtn').setAttribute('aria-expanded', 'false');
}

export function initContactWidget() {
  renderContactWidget();
  const btn = el('contactToggleBtn');
  const panel = el('contactPanel');

  btn.addEventListener('click', () => {
    if (panel.classList.contains('open')) closeContactWidget();
    else openContactWidget();
  });

  document.addEventListener('click', (e) => {
    if (!panel.classList.contains('open')) return;
    if (panel.contains(e.target) || btn.contains(e.target)) return;
    closeContactWidget();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeContactWidget();
  });
}
