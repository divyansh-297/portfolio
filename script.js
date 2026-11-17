(() => {
  'use strict';
  const content = window.portfolioContent || {};
  document.querySelectorAll('[data-content]').forEach(el => {
    if (typeof content[el.dataset.content] === 'string') el.textContent = content[el.dataset.content];
  });
  if (content.maIsPlaceholder === false) document.querySelector('[data-ma-label]').hidden = true;
  document.querySelectorAll('[data-detail]').forEach(el => {
    const [index, key] = el.dataset.detail.split('.');
    const value = content.dissertations?.[Number(index)]?.[key];
    if (value) el.textContent = value;
  });
  const validUrl = value => {
    if (!value || typeof value !== 'string') return null;
    try { const url = new URL(value, location.href); return ['http:', 'https:', 'file:'].includes(url.protocol) ? url.href : null; } catch { return null; }
  };
  const makeLink = (href, text) => {
    const link = document.createElement('a'); link.href = href; link.textContent = text; link.target = '_blank'; link.rel = 'noopener noreferrer'; return link;
  };
  document.querySelectorAll('[data-dissertation-link]').forEach(el => {
    const url = validUrl(content.dissertations?.[Number(el.dataset.dissertationLink)]?.url);
    if (url) { const a = makeLink(url, 'Read full dissertation ↗'); a.className = 'text-link'; el.replaceChildren(a); }
  });
  ['resume', 'linkedin'].forEach(name => {
    const url = validUrl(content[name + 'Url']); if (!url) return;
    const row = document.querySelector(`[data-resource="${name}"]`);
    row.querySelector('p').textContent = name === 'resume' ? 'Academic background and experience' : 'Professional profile';
    row.querySelector('.coming-soon').replaceWith(makeLink(url, name === 'resume' ? 'View resume ↗' : 'Visit profile ↗'));
  });
  if (typeof content.contactEmail === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.contactEmail)) {
    const a = document.createElement('a'); a.href = 'mailto:' + content.contactEmail; a.textContent = content.contactEmail; a.className = 'resource-contact'; document.querySelector('[data-contact]').append(a);
  }

  const menu = document.querySelector('.menu-toggle'), nav = document.querySelector('#navigation');
  const closeMenu = () => { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); };
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !motion.matches) {
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    motion.addEventListener('change', event => { if (event.matches) { document.documentElement.classList.remove('motion-ready'); observer.disconnect(); } });
  }
  const progress = document.querySelector('.reading-progress');
  const navLinks = [...nav.querySelectorAll('a')];
  let scheduled = false;
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    let active = null;
    for (const link of navLinks) { const section = document.querySelector(link.hash); if (section && section.getBoundingClientRect().top <= 170) active = link; }
    // Education and qualifications are intentionally ordered differently in the navigation.
    active = navLinks.filter(link => document.querySelector(link.hash).getBoundingClientRect().top <= 170).sort((a,b) => document.querySelector(b.hash).offsetTop - document.querySelector(a.hash).offsetTop)[0];
    navLinks.forEach(link => { if (link === active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
    scheduled = false;
  };
  addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateScroll); } }, { passive: true });
  addEventListener('resize', updateScroll); updateScroll();

  const certificates = {
    nss: { title: 'National Service Scheme · 2022–2024', src: 'assets/nss-certificate.png', alt: 'Original NSS certificate for Divyansh Jaiswal: 240 hours of participation in 2022–2024 and a special camp from 26 February to 3 March 2024.' },
    mela: { title: 'Magh Mela · Mela Mitra · 2023', src: 'assets/magh-mela-certificate.png', alt: 'Original Mela Mitra appreciation certificate for Divyansh Jaiswal, Magh Mela 2022–23, Prayagraj.' }
  };
  const dialog = document.querySelector('#certificate-dialog');
  document.querySelectorAll('[data-certificate]').forEach(button => button.addEventListener('click', () => {
    const item = certificates[button.dataset.certificate];
    document.querySelector('#dialog-title').textContent = item.title;
    const image = document.querySelector('#dialog-image'); image.src = item.src; image.alt = item.alt;
    document.querySelector('#original-link').href = item.src;
    dialog.showModal();
    dialog.querySelector('.dialog-close').focus();
  }));
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
})();
