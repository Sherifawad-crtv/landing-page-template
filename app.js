/* See Padel — landing page behaviour
   Vanilla-JS port of the scroll/interaction logic from the Claude Design
   prototype (See Padel.dc.html). Theme props baked to their defaults:
   accentColor #F5821F, heroFrame "Framed", scaleFrom 0.86, parallax 48. */

(() => {
  'use strict';

  const SCALE_FROM = 0.86;
  const PARALLAX = 48;
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const smooth = (t) => t * t * (3 - 2 * t);

  const hero      = $('[data-r="hero"]');
  const hand      = $('[data-r="hand"]');
  const fab       = $('[data-r="fab"]');
  const fabmenu   = $('[data-r="fabmenu"]');
  const burger    = $('[data-r="burger"]');
  const hl        = $('[data-r="hl"]');
  const hlMockup  = $('#seepadel-hl-mockup');
  const wordmark  = $('[data-r="footer-wordmark"]');

  let handReady = false;
  let fabY = null;
  let fabUp = true;

  /* ---------- hero hand: scroll-linked lift + zoom ---------- */
  function syncHeroHand() {
    if (!hand || !hero || !handReady) return;
    const h = hero.offsetHeight || window.innerHeight;
    const p = clamp((window.scrollY || 0) / Math.max(1, h), 0, 1);
    const x = (getComputedStyle(hand).getPropertyValue('--hand-x') || '').trim() || '-50%';
    const lift = window.innerWidth <= 767 ? -70 : -110;
    hand.style.transform =
      `translateX(${x}) translateY(${(p * lift).toFixed(1)}px) scale(${(1 + p * 0.06).toFixed(4)})`;
  }

  /* ---------- floating menu button ---------- */
  function syncFab() {
    if (!fab || !hero) return;
    const y = window.scrollY || 0;
    const prevY = fabY == null ? y : fabY;
    fabY = y;
    const past = y > hero.offsetHeight - 90;
    const menuOpen = fabmenu && fabmenu.getAttribute('data-open') === 'true';
    if (Math.abs(y - prevY) > 3) fabUp = y < prevY;
    const show = menuOpen || (past && fabUp !== false);
    fab.setAttribute('data-on', show ? 'true' : 'false');
    if (!past && fabmenu) fabmenu.setAttribute('data-open', 'false');
    if (!show) return;

    const r = fab.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    let onBlue = false;
    $$('[data-r="hl"], [data-r="inside"], [data-r="cta-panel"], [data-r="footer"]').forEach((b) => {
      const br = b.getBoundingClientRect();
      if (cx >= br.left && cx <= br.right && cy >= br.top && cy <= br.bottom) onBlue = true;
    });
    fab.style.color = onBlue || menuOpen ? '#FFFFFF' : '#0052C9';
  }

  /* ---------- shareable-highlights: scale-in + inner parallax ---------- */
  function syncHighlights() {
    if (!hl) return;
    const r = hl.getBoundingClientRect();
    const vh = window.innerHeight;
    const center = r.top + r.height / 2;
    const span = (vh + r.height) / 2;
    const p = center <= vh / 2 ? 1 : clamp(1 - (center - vh / 2) / span, 0, 1);
    const eased = smooth(p);
    hl.style.transform = `scale(${(SCALE_FROM + (1 - SCALE_FROM) * eased).toFixed(4)})`;
    hl.style.transformOrigin = 'center center';
    hl.style.willChange = 'transform';

    if (hlMockup) {
      const scale = 1.1;
      const headroom = Math.max(0, (hlMockup.getBoundingClientRect().height * (scale - 1)) / 2);
      const amount = Math.min(PARALLAX, headroom);
      const t = eased < 1 ? 0 : clamp((vh / 2 - center) / span, 0, 1);
      hlMockup.style.transform = `translateY(${(amount * (1 - 2 * t)).toFixed(1)}px) scale(${scale})`;
      hlMockup.style.willChange = 'transform';
    }
  }

  /* ---------- how it works: scroll-scrubbed steps ---------- */
  const LABELS = ['Spot', 'Evaluate', 'Elevate'];
  function syncSteps() {
    const wrap = $('[data-r="steps-wrap"]');
    if (!wrap) return;
    const steps = $$('[data-r="step"]');
    const imgs = $$('[data-r="step-img"]');
    const rail = $('[data-r="steps-rail"]');
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const r = wrap.getBoundingClientRect();

    if (isMobile) {
      const mid = window.innerHeight * 0.46;
      const rects = steps.map((el) => el.getBoundingClientRect());
      let best = 0, bestD = Infinity;
      rects.forEach((rc, i) => {
        const d = Math.abs(rc.top + rc.height * 0.28 - mid);
        if (d < bestD) { bestD = d; best = i; }
      });
      steps.forEach((el, i) => {
        const num = $('[data-r="step-num"]', el);
        const media = $('[data-r="step-media"]', el);
        const current = i === best;
        el.style.opacity = current ? '1' : '0.4';
        if (num) {
          num.style.background = current ? '#0052C9' : 'rgba(11,42,91,0.10)';
          num.style.color = current ? '#fff' : '#0B2A5B';
        }
        if (media) {
          const rc = rects[i];
          const spanM = Math.max(1, window.innerHeight * 0.62);
          const d = Math.min(1, Math.abs(rc.top + rc.height * 0.28 - mid) / spanM);
          const near = 1 - smooth(d);
          media.style.transition = 'none';
          media.style.transform = `scale(${(0.94 + 0.06 * near).toFixed(4)})`;
          media.style.opacity = (0.55 + 0.45 * near).toFixed(3);
        }
      });
      const list = $('[data-r="steps-list"]');
      if (rail && list) {
        const lr = list.getBoundingClientRect();
        const spanL = Math.max(1, lr.height - 12);
        const reach = clamp(mid - (lr.top + 6), 0, spanL);
        rail.style.transition = 'none';
        rail.style.height = reach + 'px';
      }
      return;
    }

    const travel = Math.max(1, r.height - window.innerHeight);
    const p = clamp(-r.top / travel, 0, 0.999);
    const n = steps.length;
    const pos = clamp(p * n - 0.5, 0, n - 1);
    const active = Math.round(pos);
    const mix = (a, b, t) => a + (b - a) * t;

    steps.forEach((el, i) => {
      const num = $('[data-r="step-num"]', el);
      const d = Math.min(1, Math.abs(i - pos));
      const near = 1 - smooth(d);
      el.style.transition = 'none';
      el.style.opacity = mix(0.34, 1, near).toFixed(3);
      if (num) {
        const reached = i <= pos + 0.5;
        num.style.transition = 'background 320ms ease, color 320ms ease';
        num.style.background = reached ? '#0052C9' : 'rgba(11,42,91,0.10)';
        num.style.color = reached ? '#fff' : '#0B2A5B';
      }
    });
    if (rail) {
      rail.style.transition = 'none';
      rail.style.height = (clamp(pos / Math.max(1, n - 1), 0, 1) * 100).toFixed(2) + '%';
    }
    imgs.forEach((el, i) => {
      const d = Math.abs(i - pos);
      const t = Math.max(0, 1 - d);
      const eased = smooth(t);
      el.style.transition = 'none';
      el.style.opacity = eased.toFixed(3);
      el.style.transform = `scale(${(1.05 - 0.05 * eased).toFixed(4)})`;
      el.style.zIndex = i === active ? '2' : '1';
    });
  }

  /* ---------- footer wordmark: fit to width ---------- */
  function fitWordmark() {
    if (!wordmark || !wordmark.parentElement) return;
    wordmark.style.transform = 'none';
    const avail = wordmark.parentElement.clientWidth;
    const natural = wordmark.scrollWidth;
    if (!avail || !natural) return;
    const k = (avail / natural) * 0.998;
    wordmark.style.transform = `scale(${k.toFixed(4)})`;
    wordmark.style.marginBottom = '0px';
    wordmark.parentElement.style.height = `${Math.round(wordmark.offsetHeight * k)}px`;
    wordmark.parentElement.style.alignItems = 'flex-start';
    wordmark.style.transformOrigin = 'center top';
  }

  /* ---------- FAQ accordion ---------- */
  function initFaq() {
    const items = $$('[data-r="faq-item"]');
    const set = (item, open) => {
      const icon = $('[data-r="faq-icon"]', item);
      const glyph = $('[data-r="faq-glyph"]', item);
      const panel = $('[data-r="faq-panel"]', item);
      item.toggleAttribute('data-open', open);
      if (icon) { icon.style.background = open ? '#F5821F' : 'rgba(11,42,91,0.08)'; icon.style.color = open ? '#fff' : '#0B2A5B'; }
      if (glyph) glyph.style.transform = `rotate(${open ? 45 : 0}deg)`;
      if (panel) { panel.style.maxHeight = open ? '260px' : '0px'; panel.style.opacity = open ? '1' : '0'; }
    };
    items.forEach((item) => {
      set(item, item.hasAttribute('data-open'));
      $('button', item).addEventListener('click', () => {
        const willOpen = !item.hasAttribute('data-open');
        items.forEach((it) => set(it, it === item && willOpen));
      });
    });
  }

  /* ---------- mobile menu (burger + FAB share one fullscreen menu) ---------- */
  function initMenu() {
    const toggle = () => {
      if (!fabmenu) return;
      const open = fabmenu.getAttribute('data-open') === 'true';
      fabmenu.setAttribute('data-open', open ? 'false' : 'true');
      $$('[data-r="fab"], [data-r="burger"]').forEach((el) => el.setAttribute('data-x', open ? 'false' : 'true'));
      if (fab && !open) { fab.style.color = '#FFFFFF'; fab.setAttribute('data-on', 'true'); }
      fabY = null;
      if (open) syncFab();
    };
    const close = () => {
      if (fabmenu) fabmenu.setAttribute('data-open', 'false');
      $$('[data-r="fab"], [data-r="burger"]').forEach((el) => el.setAttribute('data-x', 'false'));
      syncFab();
    };
    if (fab) fab.addEventListener('click', toggle);
    if (burger) burger.addEventListener('click', toggle);
    $$('[data-fab-close], [data-nav-close]').forEach((a) => a.addEventListener('click', close));
  }

  /* ---------- main scroll loop ---------- */
  let raf = 0;
  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      syncHeroHand();
      syncFab();
      syncHighlights();
      syncSteps();
      fitWordmark();
    });
  }

  function init() {
    initFaq();
    initMenu();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitWordmark);
    setTimeout(fitWordmark, 400);

    // Match the prototype: after the intro animations play, freeze the hero
    // elements at their resting state and hand scroll control to the parallax.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const settle = () => {
      if (hand) {
        const x = (getComputedStyle(hand).getPropertyValue('--hand-x') || '').trim() || '-50%';
        hand.style.transition = 'none';
        hand.style.transform = `translateX(${x}) translateY(0px) scale(1)`;
        hand.style.opacity = '1';
        hand.style.filter = 'none';
        hand.style.animation = 'none';
      }
      $$('[data-r="copy"], [data-r="frame"], [data-r="header"], [data-r="line"]').forEach((el) => {
        el.style.animation = 'none';
        el.style.opacity = '1';
        el.style.filter = 'none';
        el.style.transform = 'none';
      });
      handReady = true;
      onScroll();
    };
    setTimeout(settle, reduce ? 0 : 1900);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
