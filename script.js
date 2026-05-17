/* ATERIS — interacciones (UX + a11y) */

(() => {
  'use strict';

  /* ---------- NAV scroll state ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 12) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  const closeMenu = () => {
    navToggle.classList.remove('is-open');
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-controls', 'navLinks');
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.classList.toggle('is-open');
    navLinks.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  // ESC cierra el menú (H3 — control y libertad)
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
      closeMenu();
      navToggle.focus();
    }
  });

  /* ---------- Tabs de servicios (ARIA + teclado) ---------- */
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const panels = Array.from(document.querySelectorAll('.panel'));

  // Marca cada panel como tabpanel ligado a su tab
  panels.forEach(panel => {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${panel.id}`);
    panel.setAttribute('tabindex', '0');
    panel.hidden = !panel.classList.contains('is-active');
  });

  function selectTab(tab, focus = false) {
    const id = tab.dataset.tab;
    tabs.forEach(t => {
      const active = t === tab;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
      t.setAttribute('tabindex', active ? '0' : '-1');
    });
    panels.forEach(p => {
      const active = p.id === id;
      p.classList.toggle('is-active', active);
      p.hidden = !active;
    });
    if (focus) tab.focus();
  }

  tabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', e => {
      let next = null;
      switch (e.key) {
        case 'ArrowRight': next = tabs[(idx + 1) % tabs.length]; break;
        case 'ArrowLeft':  next = tabs[(idx - 1 + tabs.length) % tabs.length]; break;
        case 'Home':       next = tabs[0]; break;
        case 'End':        next = tabs[tabs.length - 1]; break;
      }
      if (next) { e.preventDefault(); selectTab(next, true); }
    });
  });

  /* ---------- Scroll-spy: marca la sección activa en el nav (H1) ---------- */
  const navAnchors = Array.from(document.querySelectorAll('.nav__links a[href^="#"]:not(.btn)'));
  const sectionMap = new Map(); // id → anchor
  navAnchors.forEach(a => {
    const id = a.getAttribute('href').slice(1);
    const sec = document.getElementById(id);
    if (sec) sectionMap.set(sec, a);
  });
  if (sectionMap.size && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navAnchors.forEach(a => a.classList.remove('is-active'));
          const anchor = sectionMap.get(entry.target);
          if (anchor) anchor.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sectionMap.forEach((_a, sec) => navObserver.observe(sec));
  }

  /* ---------- TOC activo en documentación ---------- */
  const tocLinks = document.querySelectorAll('.docs__toc a');
  const docSections = Array.from(document.querySelectorAll('.docs__content > section'));
  if (tocLinks.length && docSections.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          tocLinks.forEach(link => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
    docSections.forEach(s => observer.observe(s));
  }

  /* ---------- Reveal on scroll ---------- */
  const revealTargets = document.querySelectorAll(
    '.section__head, .panel.is-active, .step, .why__list li, .doc-card, .kpi, .cta__copy, .cta__form'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------- Form: validación por campo + feedback (H5, H9) ---------- */
  const form = document.getElementById('ctaForm');
  const status = document.getElementById('formStatus');
  if (form) {
    const nameInput  = form.elements.name;
    const emailInput = form.elements.email;

    const setError = (input, errId, msg) => {
      const errEl = document.getElementById(errId);
      const field = input.closest('.field');
      if (msg) {
        field.classList.add('is-invalid');
        input.setAttribute('aria-invalid', 'true');
        errEl.textContent = msg;
      } else {
        field.classList.remove('is-invalid');
        input.removeAttribute('aria-invalid');
        errEl.textContent = '';
      }
    };

    const validateName = (silent = false) => {
      const v = nameInput.value.trim();
      const lang = (window.__aterisI18n && window.__aterisI18n.current) || 'pt';
      if (!v) {
        if (!silent) setError(nameInput, 'name-err', lang === 'pt' ? 'Informe seu nome.' : 'Indica tu nombre.');
        return false;
      }
      if (v.length < 2) {
        if (!silent) setError(nameInput, 'name-err', lang === 'pt' ? 'Mínimo 2 caracteres.' : 'Mínimo 2 caracteres.');
        return false;
      }
      setError(nameInput, 'name-err', '');
      return true;
    };

    const validateEmail = (silent = false) => {
      const v = emailInput.value.trim();
      const lang = (window.__aterisI18n && window.__aterisI18n.current) || 'pt';
      if (!v) {
        if (!silent) setError(emailInput, 'email-err', lang === 'pt' ? 'Informe um email.' : 'Indica un email.');
        return false;
      }
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      if (!ok) {
        if (!silent) setError(emailInput, 'email-err', lang === 'pt' ? 'Email inválido.' : 'Email inválido.');
        return false;
      }
      setError(emailInput, 'email-err', '');
      return true;
    };

    // Validación en blur (real-time pero no molesta mientras escriben)
    nameInput.addEventListener('blur',  () => validateName());
    emailInput.addEventListener('blur', () => validateEmail());
    // Limpia error al volver a escribir
    nameInput.addEventListener('input',  () => { if (nameInput.value.trim())  setError(nameInput,  'name-err',  ''); });
    emailInput.addEventListener('input', () => { if (emailInput.value.trim()) setError(emailInput, 'email-err', ''); });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const okName  = validateName();
      const okEmail = validateEmail();
      if (!okName || !okEmail) {
        status.className = 'form__status is-error';
        const lang = (window.__aterisI18n && window.__aterisI18n.current) || 'pt';
        status.textContent = lang === 'pt'
          ? 'Revise os campos marcados.'
          : 'Revisa los campos marcados.';
        (okName ? emailInput : nameInput).focus();
        return;
      }
      status.className = 'form__status is-success';
      const lang = (window.__aterisI18n && window.__aterisI18n.current) || 'pt';
      status.textContent = lang === 'pt'
        ? 'Obrigado! Entraremos em contato em menos de 24 horas.'
        : '¡Gracias! Te contactaremos en menos de 24 horas.';
      form.reset();
    });
  }

  /* ---------- Año footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
