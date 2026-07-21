import { t } from './i18n.js?v=11';
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from './config.js?v=11';

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function el(id) { return document.getElementById(id); }

export function openLeadForm(packageName) {
  el('leadPackageName').value = packageName || '';
  el('leadPackageLabel').textContent = packageName || '';
  el('leadPackageLabel').style.display = packageName ? 'block' : 'none';
  el('leadStatus').textContent = '';
  el('leadStatus').className = 'lead-status';
  el('leadForm').reset();
  el('leadPackageName').value = packageName || '';
  el('leadBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function closeLeadForm() {
  el('leadBackdrop').classList.remove('open');
  document.body.style.overflow = '';
}

async function submitLead(e) {
  e.preventDefault();
  const form = el('leadForm');
  // Honeypot: real users never fill a visually-hidden field; if it has a
  // value, silently pretend to succeed instead of forwarding to Telegram.
  if (el('leadHoneypot').value) {
    el('leadStatus').textContent = t('form_ok');
    el('leadStatus').className = 'lead-status ok';
    setTimeout(closeLeadForm, 1200);
    return;
  }

  const submitBtn = form.querySelector('.lead-submit');
  submitBtn.disabled = true;
  submitBtn.textContent = t('form_sending');
  el('leadStatus').textContent = '';
  el('leadStatus').className = 'lead-status';

  const firstName = el('leadFirstName').value.trim();
  const lastName = el('leadLastName').value.trim();
  const phone = el('leadPhone').value.trim();
  const travelDates = el('leadDates').value.trim();
  const packageName = el('leadPackageName').value;

  const text = [
    '🕋 <b>Новая заявка — EtiHAD</b>',
    `Имя: ${escapeHtml(firstName)}`,
    `Фамилия: ${escapeHtml(lastName)}`,
    `Телефон: ${escapeHtml(phone)}`,
    travelDates ? `Даты: ${escapeHtml(travelDates)}` : null,
    packageName ? `Пакет: ${escapeHtml(packageName)}` : null,
  ].filter(Boolean).join('\n');

  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'HTML' }),
    });
    if (!res.ok) throw new Error(`Telegram ${res.status}`);
    el('leadStatus').textContent = t('form_ok');
    el('leadStatus').className = 'lead-status ok';
    setTimeout(closeLeadForm, 1800);
  } catch (err) {
    el('leadStatus').textContent = t('form_err');
    el('leadStatus').className = 'lead-status err';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = t('form_submit');
  }
}

export function initLeadForm() {
  el('leadBackdrop').addEventListener('click', (e) => {
    if (e.target === el('leadBackdrop')) closeLeadForm();
  });
  el('leadModalCloseBtn').addEventListener('click', closeLeadForm);
  el('leadForm').addEventListener('submit', submitLead);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && el('leadBackdrop').classList.contains('open')) closeLeadForm();
  });
}
