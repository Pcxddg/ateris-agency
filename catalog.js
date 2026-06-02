/* ════════════════════════════════════════════════════════════════════
   ATERIS — catalog.js (interacciones del catálogo). Carga tras translations.js.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var WA_NUMBER = "5515988033899";
  var WA_MSG = {
    pt: "Olá ATERIS! Quero um orçamento para meu projeto.",
    es: "¡Hola ATERIS! Quiero cotizar mi proyecto."
  };
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(s, c) { return (c || document).querySelector(s); }
  function $all(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function lang() { return (window.__aterisI18n && window.__aterisI18n.current) || "es"; }

  /* Scroll progress + nav state */
  var progress = $("#scrollProgress");
  var cnav = $("#cnav");
  function onScroll() {
    var st = window.pageYOffset || document.documentElement.scrollTop;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (h > 0 ? (st / h) * 100 : 0) + "%";
    if (cnav) cnav.classList.toggle("scrolled", st > 6);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Reveal */
  var revealEls = $all(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { if (!el.classList.contains("in")) io.observe(el); });
    setTimeout(function () { revealEls.forEach(function (el) { el.classList.add("in"); }); }, 2500);
  }

  /* Idioma + WhatsApp */
  function waHref(l) { return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(WA_MSG[l] || WA_MSG.es); }
  function syncWA(l) { $all("#waNav, #waHero, #waFinal, #waFloat").forEach(function (a) { if (a) a.setAttribute("href", waHref(l)); }); }
  function syncBtns(l) {
    $all(".lang-btn").forEach(function (b) {
      var on = b.getAttribute("data-lang") === l;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }
  $all(".lang-btn").forEach(function (b) {
    b.addEventListener("click", function () { if (window.__aterisI18n) window.__aterisI18n.setLang(b.getAttribute("data-lang")); });
  });
  document.addEventListener("ateris:langchange", function (e) { syncBtns(e.detail.lang); syncWA(e.detail.lang); });
  syncBtns(lang()); syncWA(lang());
})();
