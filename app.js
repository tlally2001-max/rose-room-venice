const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const header = document.querySelector('[data-header]');

const syncHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .13, rootMargin: '0px 0px -6% 0px' });
  reveals.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    revealObserver.observe(item);
  });
} else {
  reveals.forEach(item => item.classList.add('is-visible'));
}

if (!reducedMotion) {
  const heroMedia = document.querySelector('[data-hero-media]');
  const heroTitle = document.querySelector('[data-hero-title]');
  let ticking = false;
  const updateHero = () => {
    const progress = Math.min(window.scrollY / window.innerHeight, 1);
    if (heroMedia) heroMedia.style.transform = `scale(${1.03 + progress * .08}) translateY(${progress * 18}px)`;
    if (heroTitle) heroTitle.style.transform = `translateY(${progress * 32}px)`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHero);
      ticking = true;
    }
  }, { passive: true });
}

const modes = {
  events: {
    image: 'assets/upscaled/events-live-2x.webp',
    alt: 'A live band performs to a crowd inside The Rose Room',
    label: 'Live, private, unforgettable',
    kicker: 'Celebrations · Launches · Dinners',
    title: 'Bring the people.<br>We’ll build the atmosphere.',
    copy: 'Standing receptions, seated dinners, panels, parties and pop-ups—supported by a full-service team when you want one.',
    facts: [['Up to', '225 standing'], ['Starting at', '$2,000 half day']],
    cta: 'Plan an event'
  },
  productions: {
    image: 'assets/upscaled/production-set-2x.webp',
    alt: 'Camera monitors and a stage set up for a production inside The Rose Room',
    label: 'Camera-ready, naturally lit',
    kicker: 'Photo · Film · Editorial · Content',
    title: 'Call time looks<br>good in here.',
    copy: 'Vaulted rafters, eight skylights, white walls and an open floor plan give crews a flexible, naturally lit studio near the beach.',
    facts: [['Half day from', '$1,500'], ['Full day from', '$2,900']],
    cta: 'Book a production'
  }
};

const stage = document.querySelector('[data-mode-stage]');
const modeImage = document.querySelector('[data-mode-image]');
const modeLabel = document.querySelector('[data-mode-label]');
const modeKicker = document.querySelector('[data-mode-kicker]');
const modeTitle = document.querySelector('[data-mode-title]');
const modeCopy = document.querySelector('[data-mode-copy]');
const modeFacts = document.querySelector('[data-mode-facts]');
const modeCta = stage?.querySelector('.text-link');

document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.mode;
  const data = modes[key];
  if (!data || button.classList.contains('is-active')) return;
  document.querySelectorAll('[data-mode]').forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  modeImage.parentElement.classList.add('is-changing');
  setTimeout(() => {
    modeImage.src = data.image;
    modeImage.alt = data.alt;
    modeLabel.textContent = data.label;
    modeKicker.textContent = data.kicker;
    modeTitle.innerHTML = data.title;
    modeCopy.textContent = data.copy;
    modeFacts.innerHTML = data.facts.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join('');
    modeCta.childNodes[0].textContent = `${data.cta} `;
    modeImage.parentElement.classList.remove('is-changing');
  }, reducedMotion ? 0 : 250);
}));

const possibility = document.querySelector('.possibilities');
const orb = document.querySelector('.ambient-orb');
possibility?.addEventListener('pointermove', event => {
  if (reducedMotion || !orb) return;
  const rect = possibility.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width - .5) * 80;
  const y = ((event.clientY - rect.top) / rect.height - .5) * 80;
  orb.style.setProperty('--orb-x', `${x}px`);
  orb.style.setProperty('--orb-y', `${y}px`);
});

const cursor = document.querySelector('.cursor');
if (cursor && window.matchMedia('(pointer: fine)').matches && !reducedMotion) {
  let x = -100, y = -100, targetX = -100, targetY = -100;
  window.addEventListener('pointermove', event => { targetX = event.clientX; targetY = event.clientY; });
  const renderCursor = () => {
    x += (targetX - x) * .16;
    y += (targetY - y) * .16;
    cursor.style.transform = `translate3d(${x - 24}px,${y - 24}px,0)`;
    requestAnimationFrame(renderCursor);
  };
  renderCursor();
  document.querySelectorAll('a, button, input, textarea, select').forEach(item => {
    item.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
    item.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
  });
}

const lightbox = document.querySelector('[data-lightbox]');
const lightboxImage = document.querySelector('[data-lightbox-image]');
const lightboxCaption = document.querySelector('[data-lightbox-caption]');
document.querySelectorAll('.proof-card').forEach(card => card.addEventListener('click', () => {
  lightboxImage.src = card.dataset.full;
  lightboxImage.alt = card.querySelector('img').alt;
  lightboxCaption.textContent = card.dataset.caption;
  lightbox.showModal();
}));
document.querySelector('[data-lightbox-close]')?.addEventListener('click', () => lightbox.close());
lightbox?.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });

document.querySelector('[data-inquiry-form]')?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const subject = `Rose Room inquiry — ${data.get('type') || 'Event'}`;
  const body = [
    `Name: ${data.get('name') || ''}`,
    `Email: ${data.get('email') || ''}`,
    `Ideal date: ${data.get('date') || 'Flexible'}`,
    `Event type: ${data.get('type') || ''}`,
    '',
    data.get('details') || ''
  ].join('\n');
  window.location.href = `mailto:events@roseroom.space?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

document.querySelector('[data-year]').textContent = new Date().getFullYear();
