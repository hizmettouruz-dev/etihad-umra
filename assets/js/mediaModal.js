import { GH_VIDEO_BASE, GH_PHOTO_BASE } from './config.js?v=8';

let items = [];
let idx = 0;

function resolveSrc(item) {
  return item.type === 'video' ? GH_VIDEO_BASE + item.filename : GH_PHOTO_BASE + item.filename;
}

function el(id) { return document.getElementById(id); }

export function openMediaModal(mediaItems, startIndex = 0) {
  items = mediaItems;
  idx = startIndex;
  el('mediaBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
  render();
}

export function closeMediaModal() {
  el('mediaBackdrop').classList.remove('open');
  document.body.style.overflow = '';
  const v = el('mediaVideo');
  v.pause();
  v.src = '';
}

function goTo(newIdx) {
  idx = (newIdx + items.length) % items.length;
  render();
}

function render() {
  const item = items[idx];
  const videoEl = el('mediaVideo');
  const imgEl = el('mediaImage');
  const label = el('mediaLabel');

  videoEl.pause();
  videoEl.src = '';
  videoEl.style.display = 'none';
  imgEl.style.display = 'none';

  label.textContent = item.label || '';

  const src = resolveSrc(item);
  if (item.type === 'image') {
    imgEl.src = src;
    imgEl.style.display = 'block';
  } else {
    videoEl.src = src;
    videoEl.style.display = 'block';
    videoEl.load();
    videoEl.play().catch(() => {});
  }

  el('mediaPrev').classList.toggle('hidden', items.length <= 1);
  el('mediaNext').classList.toggle('hidden', items.length <= 1);

  const thumbs = el('mediaThumbs');
  thumbs.style.display = items.length > 1 ? 'flex' : 'none';
  thumbs.innerHTML = items.map((it, i) =>
    `<button type="button" class="${i === idx ? 'active' : ''}" data-idx="${i}">${it.label || i + 1}</button>`
  ).join('');
  thumbs.querySelectorAll('button').forEach((b) => {
    b.addEventListener('click', () => goTo(Number(b.dataset.idx)));
  });
}

async function shareCurrent() {
  const item = items[idx];
  const src = resolveSrc(item);
  const btn = el('mediaShareBtn');
  const originalLabel = btn.textContent;

  if (navigator.canShare) {
    btn.textContent = '…';
    btn.disabled = true;
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const ext = item.type === 'video' ? 'mp4' : 'jpg';
      const file = new File([blob], `etihad-media.${ext}`, { type: blob.type });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file] });
        btn.textContent = originalLabel;
        btn.disabled = false;
        return;
      }
    } catch (e) {
      // fall through to plain download
    }
    btn.disabled = false;
    btn.textContent = originalLabel;
  }

  // Fallback for browsers without Web Share API (e.g. desktop): plain download link.
  const a = document.createElement('a');
  a.href = src;
  a.download = '';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function initMediaModal() {
  el('mediaBackdrop').addEventListener('click', (e) => {
    if (e.target === el('mediaBackdrop')) closeMediaModal();
  });
  el('mediaCloseBtn').addEventListener('click', closeMediaModal);
  el('mediaPrev').addEventListener('click', () => goTo(idx - 1));
  el('mediaNext').addEventListener('click', () => goTo(idx + 1));
  el('mediaShareBtn').addEventListener('click', shareCurrent);
  document.addEventListener('keydown', (e) => {
    if (!el('mediaBackdrop').classList.contains('open')) return;
    if (e.key === 'Escape') closeMediaModal();
    if (e.key === 'ArrowLeft') goTo(idx - 1);
    if (e.key === 'ArrowRight') goTo(idx + 1);
  });
}
