// ============================================================
// GOOGLE FORM: paste the embed URL between the quotes below.
// In Google Forms: Send → < > (embed) → copy the src URL, e.g.
// https://docs.google.com/forms/d/e/XXXXXXXX/viewform?embedded=true
// ============================================================
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSd9a1Puy65MdMaloLVSfay_iqxPpk1nRKofX_SbXqPOP2CJNQ/viewform?embedded=true';

// Show the embedded form once a URL is set; otherwise keep the email card
if (GOOGLE_FORM_URL) {
  const gform = document.getElementById('gform');
  const fallback = document.getElementById('form-fallback');
  gform.src = GOOGLE_FORM_URL;
  document.getElementById('form-link').href = GOOGLE_FORM_URL;
  gform.hidden = false;
  fallback.hidden = false;
  document.getElementById('form-placeholder').hidden = true;
}

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Simple lightbox: clicking a gallery item shows a larger version with its name
const lightbox = document.getElementById('lightbox');
const lightboxContent = lightbox.querySelector('.lightbox-content');
let lastFocused = null;

document.querySelectorAll('.gallery-item').forEach((item) => {
  const open = () => {
    const media = item.querySelector('img, .ph');
    const caption = item.querySelector('figcaption');
    lightboxContent.innerHTML = '';

    const shown = media.cloneNode(true);
    shown.loading = 'eager';
    lightboxContent.appendChild(shown);

    if (caption) {
      const label = document.createElement('p');
      label.className = 'lightbox-caption';
      label.textContent = caption.textContent.trim();
      lightboxContent.appendChild(label);
    }

    lastFocused = item;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox-close').focus();
  };
  item.addEventListener('click', open);
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  });
});

const closeLightbox = () => {
  lightbox.hidden = true;
  document.body.style.overflow = '';
  if (lastFocused) { lastFocused.focus(); lastFocused = null; }
};

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target.classList.contains('lightbox-close')) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
});
