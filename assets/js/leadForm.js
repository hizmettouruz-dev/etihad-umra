import { t, getLang } from './i18n.js';
import { LEAD_WORKER_URL } from './config.js';

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

  const payload = {
    firstName: el('leadFirstName').value.trim(),
    lastName: el('leadLastName').value.trim(),
    phone: el('leadPhone').value.trim(),
    travelDates: el('leadDates').value.trim(),
    packageName: el('leadPackageName').value,
    lang: getLang(),
  };

  try {
    const res = await fetch(LEAD_WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Worker ${res.status}`);
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
