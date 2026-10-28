/* Village Unhu — minimal progressive-enhancement script.
   The page is fully usable without this file; it only adds the marquee loop, active nav state,
   mobile menu, reveal-on-scroll and optional font-pairing preview. */
(() => {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Font pairing preview: ?display=syne&body=inter overrides the default pairing on <html>.
        Remove this block once a pairing is final. */
  const params = new URLSearchParams(location.search);
  const displayOk = ['fraunces', 'bricolage', 'syne'];
  const bodyOk = ['dm-sans', 'inter', 'work-sans'];
  if (displayOk.includes(params.get('display'))) document.documentElement.dataset.display = params.get('display');
  if (bodyOk.includes(params.get('body'))) document.documentElement.dataset.body = params.get('body');

  /* 2. Marquee: clone the track once (hidden from assistive tech) so translateX(-50%) loops seamlessly.
        The button gives users a way to pause moving text (WCAG 2.2.2). */
  const marquee = document.querySelector('.marquee');
  const track = marquee && marquee.querySelector('.marquee__track');
  if (track && !reduceMotion) {
    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.append(...Array.from(clone.children));
    Array.from(track.children).slice(track.children.length / 2).forEach(li => li.setAttribute('aria-hidden', 'true'));
  }
  const toggle = marquee && marquee.querySelector('.marquee__toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const paused = marquee.classList.toggle('is-paused');
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.setAttribute('aria-label', paused ? 'Play announcements' : 'Pause announcements');
      toggle.firstElementChild.textContent = paused ? '▶' : '❚❚';
    });
  }

  /* 3. Mobile menu: simple disclosure pattern; closes on link click or Escape. */
  const navBtn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  const setNav = open => {
    nav.classList.toggle('is-open', open);
    navBtn.setAttribute('aria-expanded', String(open));
  };
  navBtn.addEventListener('click', () => setNav(navBtn.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', e => { if (e.target.closest('a')) setNav(false); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navBtn.getAttribute('aria-expanded') === 'true') { setNav(false); navBtn.focus(); }
  });

  /* 4. Active nav link: the section crossing a band near the top of the viewport wins. */
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const byId = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const setActive = id => links.forEach(a => {
    if (byId.get(id) === a) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
  });
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: '-35% 0px -60% 0px' });
    byId.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* 5. Soft reveal-on-scroll (CSS handles the actual fade; this only flips the class). */
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(el => io.observe(el));
  } else {
    items.forEach(el => el.classList.add('is-visible'));
  }

  /* 6. Demo form handling: replace with a real endpoint. */
  const form = document.querySelector('.form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      form.querySelector('.form__status').textContent = 'Thank you — your message is ready to send once a form handler is connected.';
      form.reset();
    });
  }

  /* 7. Gallery viewer: keeps the grid light while letting visitors pause with each work. */
  const dialog = document.querySelector('.art-dialog');
  const dialogImage = dialog && dialog.querySelector('.art-dialog__image');
  const dialogCaption = dialog && dialog.querySelector('.art-dialog__caption');
  const dialogClose = dialog && dialog.querySelector('.art-dialog__close');
  document.querySelectorAll('.artwork').forEach(button => {
    button.addEventListener('click', () => {
      const image = button.querySelector('img');
      if (!dialog || !image) return;
      dialogImage.src = image.currentSrc || image.src;
      dialogImage.alt = image.alt;
      dialogCaption.textContent = button.dataset.artwork || '';
      dialog.showModal();
      dialogClose.focus();
    });
  });
  if (dialog) {
    dialogClose.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      const rect = dialog.getBoundingClientRect();
      const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
      if (outside) dialog.close();
    });
  }

  /* 8. Gallery carousel controls: the track is still scrollable without JavaScript. */
  const galleryTrack = document.getElementById('gallery-track');
  const moveGallery = direction => {
    if (!galleryTrack) return;
    galleryTrack.scrollBy({ left: direction * galleryTrack.clientWidth * .82, behavior: reduceMotion ? 'auto' : 'smooth' });
  };
  document.querySelector('[data-gallery-prev]')?.addEventListener('click', () => moveGallery(-1));
  document.querySelector('[data-gallery-next]')?.addEventListener('click', () => moveGallery(1));

  /* 9. Residency sheet: a focused panel that leads naturally back to the enquiry form. */
  const residencySheet = document.querySelector('.residency-sheet');
  const residencyClose = residencySheet?.querySelector('.residency-sheet__close');
  document.querySelector('[data-residency-open]')?.addEventListener('click', () => residencySheet?.showModal());
  residencyClose?.addEventListener('click', () => residencySheet.close());
  residencySheet?.querySelector('[data-residency-contact]')?.addEventListener('click', () => residencySheet.close());
  residencySheet?.addEventListener('click', event => {
    const rect = residencySheet.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) residencySheet.close();
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
