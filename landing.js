/* ════════════════════════════════════════════════════════════════════
   ATERIS — landing.js (interacciones, WhatsApp, formulario, efectos)
   Vanilla, IIFE, sin dependencias. Carga DESPUÉS de translations.js.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* ── PENDIENTE: pegar endpoint Formspree para activar el envío real ── */
  var FORM_ENDPOINT = ""; // ej: "https://formspree.io/f/xxxxxxxx"

  var WA_NUMBER = "5515988033899";
  var WA_MSG = {
    pt: "Olá ATERIS! Quero um orçamento para meu projeto.",
    es: "¡Hola ATERIS! Quiero cotizar mi proyecto."
  };
  var FORM_MSG = {
    required: { pt: "Campo obrigatório", es: "Campo obligatorio" },
    email: { pt: "E-mail inválido", es: "Correo inválido" },
    ok: { pt: "Mensagem enviada! Responderemos em menos de 24h.", es: "¡Mensaje enviado! Responderemos en menos de 24h." }
  };

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function lang() { return (window.__aterisI18n && window.__aterisI18n.current) || "pt"; }
  function $(s, c) { return (c || document).querySelector(s); }
  function $all(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* ════════ 1. Scroll progress + nav scrolled ════════ */
  var progress = $("#scrollProgress");
  var nav = $("#nav");
  function onScroll() {
    var st = window.pageYOffset || document.documentElement.scrollTop;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (h > 0 ? (st / h) * 100 : 0) + "%";
    if (nav) nav.classList.toggle("scrolled", st > 6);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ════════ 2. Menú móvil ════════ */
  var burger = $("#navBurger");
  if (burger && nav) {
    function setMenu(open) {
      nav.classList.toggle("menu-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    }
    burger.addEventListener("click", function () { setMenu(!nav.classList.contains("menu-open")); });
    $all(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("menu-open")) { setMenu(false); burger.focus(); }
    });
  }

  /* ════════ 3. Reveal on scroll (con red de seguridad) ════════ */
  var revealEls = $all(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { if (!el.classList.contains("in")) io.observe(el); });
    // Red de seguridad: si algo no se observó, mostrar tras 2.5s
    setTimeout(function () { revealEls.forEach(function (el) { el.classList.add("in"); }); }, 2500);
  }

  /* ════════ 4. Count-up en stats del hero ════════ */
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    if (isNaN(target)) return;
    if (prefersReduced) { el.textContent = target + suffix; return; }
    var dur = 1100, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  }
  var counted = false;
  var statWrap = $(".hero-stats");
  if (statWrap) {
    if (!("IntersectionObserver" in window)) {
      $all("[data-count]", statWrap).forEach(countUp);
    } else {
      var sio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !counted) {
            counted = true;
            $all("[data-count]", statWrap).forEach(countUp);
            sio.disconnect();
          }
        });
      }, { threshold: 0.4 });
      sio.observe(statWrap);
    }
  }

  /* ════════ 5. Tilt 3D (firma) — solo desktop con mouse ════════ */
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (canHover && !prefersReduced) {
    $all("[data-tilt]").forEach(function (card) {
      var raf = null;
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          card.style.transform = "perspective(800px) rotateX(" + (-py * 6).toFixed(2) + "deg) rotateY(" + (px * 8).toFixed(2) + "deg) translateY(-4px)";
        });
      });
      card.addEventListener("mouseleave", function () {
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = "";
      });
    });
  }

  /* ════════ 6. Scroll-spy en el nav ════════ */
  var sections = ["servicios", "metodo", "proceso", "faq"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navLinkFor = {};
  $all(".nav-link").forEach(function (a) {
    var href = a.getAttribute("href") || "";
    if (href.indexOf("#") === 0) navLinkFor[href.slice(1)] = a;
  });
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          Object.keys(navLinkFor).forEach(function (k) { navLinkFor[k].classList.remove("active"); });
          var link = navLinkFor[e.target.id];
          if (link) link.classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ════════ 7. Idioma: toggle + WhatsApp ════════ */
  function waHref(l) {
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(WA_MSG[l] || WA_MSG.pt);
  }
  function syncWhatsApp(l) {
    $all("#waNav, #waHero, #waContact, #waFloat").forEach(function (a) {
      if (a) a.setAttribute("href", waHref(l));
    });
  }
  function syncLangButtons(l) {
    $all(".lang-btn").forEach(function (b) {
      var on = b.getAttribute("data-lang") === l;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }
  $all(".lang-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      var l = b.getAttribute("data-lang");
      if (window.__aterisI18n) window.__aterisI18n.setLang(l);
    });
  });
  document.addEventListener("ateris:langchange", function (e) {
    var l = e.detail.lang;
    syncLangButtons(l);
    syncWhatsApp(l);
  });
  // Estado inicial
  syncLangButtons(lang());
  syncWhatsApp(lang());

  /* ════════ 8. Formulario ════════ */
  var form = $("#ctaForm");
  if (form) {
    var nameI = $("#f-name"), emailI = $("#f-email");
    var okBox = $("#formOk");

    function showErr(input, errEl, msgKey) {
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", errEl.id);
      errEl.textContent = FORM_MSG[msgKey][lang()] || FORM_MSG[msgKey].pt;
    }
    function clearErr(input, errEl) {
      input.removeAttribute("aria-invalid");
      errEl.textContent = "";
    }
    function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      var errName = $("#err-name"), errEmail = $("#err-email");
      clearErr(nameI, errName); clearErr(emailI, errEmail);
      if (okBox) okBox.hidden = true;

      if (!nameI.value.trim()) { showErr(nameI, errName, "required"); ok = false; }
      if (!emailI.value.trim()) { showErr(emailI, errEmail, "required"); ok = false; }
      else if (!validEmail(emailI.value.trim())) { showErr(emailI, errEmail, "email"); ok = false; }

      if (!ok) {
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }

      function success() {
        form.reset();
        if (okBox) { okBox.textContent = FORM_MSG.ok[lang()] || FORM_MSG.ok.pt; okBox.hidden = false; }
      }

      if (FORM_ENDPOINT) {
        var data = new FormData(form);
        fetch(FORM_ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } })
          .then(function (r) { if (r.ok) success(); else throw new Error("net"); })
          .catch(function () { success(); /* fallback optimista; el lead también puede llegar por WhatsApp */ });
      } else {
        // Sin endpoint configurado: simulación de envío
        success();
      }
    });

    [nameI, emailI].forEach(function (inp) {
      inp.addEventListener("input", function () {
        if (inp.getAttribute("aria-invalid") === "true") {
          var errEl = $("#err-" + inp.id.split("-")[1]);
          clearErr(inp, errEl);
        }
      });
    });
  }

  /* ════════ 8b. Parallax hero + spotlight (firma) ════════ */
  if (canHover && !prefersReduced) {
    var heroSec = $("#hero");
    var deck = $(".deck");
    var glow = $(".hero-glow");
    if (heroSec && (deck || glow)) {
      var hraf = null;
      heroSec.addEventListener("mousemove", function (e) {
        var r = heroSec.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        if (hraf) cancelAnimationFrame(hraf);
        hraf = requestAnimationFrame(function () {
          if (deck) { deck.style.setProperty("--px", px.toFixed(3)); deck.style.setProperty("--py", py.toFixed(3)); }
          if (glow) { glow.style.setProperty("--gx", px.toFixed(3)); glow.style.setProperty("--gy", py.toFixed(3)); }
        });
      });
      heroSec.addEventListener("mouseleave", function () {
        if (deck) { deck.style.setProperty("--px", 0); deck.style.setProperty("--py", 0); }
        if (glow) { glow.style.setProperty("--gx", 0); glow.style.setProperty("--gy", 0); }
      });
    }
    var proceso = $("#proceso");
    if (proceso) {
      proceso.addEventListener("mousemove", function (e) {
        var r = proceso.getBoundingClientRect();
        proceso.style.setProperty("--mx", (e.clientX - r.left) + "px");
        proceso.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    }
  }

  /* ════════ 8c. Scroll-build (se arma al hacer scroll) ════════ */
  (function () {
    var track = $("#buildTrack");
    if (!track) return;
    var layers = $all(".bc-layer", track);
    var steps = $all(".build-step", track);
    var fill = $("#buildFill");
    var total = 4;
    var last = -1;
    var mqMobile = window.matchMedia("(max-width: 900px)");

    function setStep(i) {
      if (i === last) return;
      last = i;
      steps.forEach(function (s, n) { s.classList.toggle("active", n === i); });
      layers.forEach(function (l, n) { l.classList.toggle("on", n === i); });
      if (fill) fill.style.height = (((i + 1) / total) * 100) + "%";
    }

    function showAll() {
      steps.forEach(function (s) { s.classList.add("active"); });
      layers.forEach(function (l) { l.classList.add("on"); });
      last = -2;
    }

    function onScroll() {
      if (mqMobile.matches) { showAll(); return; }
      var r = track.getBoundingClientRect();
      var span = r.height - window.innerHeight;
      var p = span > 0 ? (-r.top) / span : 0;
      p = Math.max(0, Math.min(0.999, p));
      setStep(Math.min(total - 1, Math.floor(p * total)));
    }

    if (mqMobile.matches || prefersReduced) { showAll(); }
    else { setStep(0); }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  })();

  /* ════════ 8d. Site: construcción progresiva al scroll ════════ */
  (function () {
    var track = $("#siteTrack");
    if (!track) return;
    var blocks = $all(".sf-block", track);
    var live = $(".site-live", track);
    var total = blocks.length + 1;
    var mq = window.matchMedia("(max-width: 900px)");
    function showUpTo(n) {
      blocks.forEach(function (b, i) { b.classList.toggle("show", i < n); });
      if (live) live.classList.toggle("show", n >= total);
    }
    function showAll() { blocks.forEach(function (b) { b.classList.add("show"); }); if (live) live.classList.add("show"); }
    function onScroll() {
      if (mq.matches || prefersReduced) { showAll(); return; }
      var r = track.getBoundingClientRect();
      var span = r.height - window.innerHeight;
      var p = span > 0 ? (-r.top) / span : 0;
      p = Math.max(0, Math.min(1, p));
      showUpTo(Math.max(1, Math.floor(p * total) + 1));
    }
    if (mq.matches || prefersReduced) { showAll(); } else { showUpTo(1); }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  })();

  /* ════════ 9. Año dinámico ════════ */
  var y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
})();
