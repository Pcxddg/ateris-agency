/* ════════════════════════════════════════════════════════════════════
   ATERIS — area.js · Login (gate) + Painel do cliente
   Sin backend: credenciales demo + sesión en localStorage.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var AUTH_KEY = "ateris.area.auth";
  var DEMO = { user: "cliente@suamarca.com", pass: "ateris2026", name: "Marca Demo" };

  function $(s, c) { return (c || document).querySelector(s); }
  function $all(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function isAuthed() { try { return !!localStorage.getItem(AUTH_KEY); } catch (e) { return false; } }
  function getSession() { try { return JSON.parse(localStorage.getItem(AUTH_KEY) || "null"); } catch (e) { return null; } }

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ══════════════════ LOGIN ══════════════════ */
  var loginForm = $("#loginForm");
  if (loginForm) {
    // Si ya hay sesión, ir directo al panel
    if (isAuthed()) { location.replace("area"); return; }

    var userI = $("#l-user"), passI = $("#l-pass"), errBox = $("#loginError");
    var passToggle = $("#passToggle");

    passToggle.addEventListener("click", function () {
      var show = passI.type === "password";
      passI.type = show ? "text" : "password";
      passToggle.setAttribute("aria-label", show ? "Ocultar senha" : "Mostrar senha");
    });

    function clearErr(input, el) { input.removeAttribute("aria-invalid"); el.textContent = ""; }
    function fieldErr(input, el, msg) { input.setAttribute("aria-invalid", "true"); el.textContent = msg; }

    [userI, passI].forEach(function (inp) {
      inp.addEventListener("input", function () { if (errBox) errBox.hidden = true; });
    });

    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var eu = $("#err-user"), ep = $("#err-pass");
      clearErr(userI, eu); clearErr(passI, ep);
      if (errBox) errBox.hidden = true;
      var ok = true;
      if (!userI.value.trim()) { fieldErr(userI, eu, "Informe seu usuário"); ok = false; }
      if (!passI.value.trim()) { fieldErr(passI, ep, "Informe sua senha"); ok = false; }
      if (!ok) { (userI.value.trim() ? passI : userI).focus(); return; }

      var u = userI.value.trim().toLowerCase();
      var p = passI.value;
      if (u === DEMO.user && p === DEMO.pass) {
        try { localStorage.setItem(AUTH_KEY, JSON.stringify({ name: DEMO.name, user: DEMO.user, ts: Date.now() })); } catch (e2) {}
        var btn = $(".login-submit");
        if (btn) btn.textContent = "Entrando…";
        setTimeout(function () { location.href = "area"; }, 350);
      } else {
        if (errBox) errBox.hidden = false;
        passI.value = ""; passI.focus();
      }
    });
    return; // fin login
  }

  /* ══════════════════ GUARD del panel ══════════════════ */
  if (document.body.hasAttribute("data-app-guard")) {
    if (!isAuthed()) { location.replace("area-login"); return; }
  } else {
    return;
  }

  var session = getSession() || { name: DEMO.name };
  function initials(name) { return name.split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase(); }

  /* ── Datos mock ── */
  var CAT_COLORS = {
    branding: "linear-gradient(135deg,#ff6b6b,#d83f47)",
    web: "linear-gradient(135deg,#101014,#2c2c34)",
    marketing: "linear-gradient(135deg,#ffd23f,#f5bd0a)",
    audiovisual: "linear-gradient(135deg,#6b5bff,#3f2fd8)"
  };
  var CAT_LABEL = { branding: "Branding", web: "Web", marketing: "Marketing", audiovisual: "Audiovisual" };

  var DELIVERABLES = [
    { id: "d1", cat: "branding", title: "Logo final — pacote completo", type: "ZIP", size: "24 MB", date: "28 mai", status: "new" },
    { id: "d2", cat: "branding", title: "Manual de marca", type: "PDF", size: "8 MB", date: "28 mai", status: "new" },
    { id: "d3", cat: "branding", title: "Paleta &amp; tipografia", type: "PDF", size: "2 MB", date: "22 mai", status: "approved" },
    { id: "d4", cat: "web", title: "Site — versão de revisão", type: "LINK", size: "online", date: "30 mai", status: "review" },
    { id: "d5", cat: "web", title: "Banner principal (hero)", type: "PNG", size: "5 MB", date: "30 mai", status: "approved" },
    { id: "d6", cat: "marketing", title: "Calendário de conteúdo — junho", type: "PDF", size: "1 MB", date: "1 jun", status: "approved" },
    { id: "d7", cat: "marketing", title: "Kit de posts (10 peças)", type: "ZIP", size: "32 MB", date: "1 jun", status: "approved" },
    { id: "d8", cat: "audiovisual", title: "Vídeo institucional 60s", type: "MP4", size: "180 MB", date: "26 mai", status: "approved" },
    { id: "d9", cat: "audiovisual", title: "Fotos de produto (set 1)", type: "ZIP", size: "96 MB", date: "20 mai", status: "approved" }
  ];

  var PROJECTS = [
    { name: "Identidade + Site", sub: "Plano integral", progress: 82, due: "12 jun", deliver: 14, status: "active" },
    { name: "Campanha de lançamento", sub: "Marketing + Ads", progress: 45, due: "30 jun", deliver: 6, status: "active" },
    { name: "Vídeo institucional", sub: "Audiovisual", progress: 100, due: "Concluído", deliver: 3, status: "done" }
  ];

  var INVOICES = [
    { num: "FAT-0042", desc: "Identidade + Site — 1ª parcela", date: "5 mai", val: "R$ 4.800", status: "paid" },
    { num: "FAT-0048", desc: "Identidade + Site — 2ª parcela", date: "5 jun", val: "R$ 4.800", status: "open" },
    { num: "FAT-0051", desc: "Campanha de lançamento", date: "10 jun", val: "R$ 2.400", status: "open" }
  ];

  var MESSAGES = [
    { who: "them", text: "Olá! Acabamos de subir o logo final e o manual de marca na sua área. 🎉", time: "Ontem 16:20" },
    { who: "them", text: "Quando puder, dá uma olhada e nos diga se aprova para seguirmos com as aplicações.", time: "Ontem 16:21" },
    { who: "me", text: "Perfeito, vou revisar hoje à noite e já aviso!", time: "Ontem 18:05" }
  ];

  /* ── Helpers de render ── */
  function statusChip(s) {
    if (s === "new") return '<span class="chip chip-new">Novo</span>';
    if (s === "review") return '<span class="chip chip-wait">Para revisar</span>';
    return '<span class="chip chip-ok">Aprovado</span>';
  }
  function dlIcon() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>'; }

  /* ── Entregáveis grid ── */
  var deliverGrid = $("#deliverGrid");
  function renderDeliverables(filter) {
    if (!deliverGrid) return;
    var list = DELIVERABLES.filter(function (d) { return filter === "todos" || d.cat === filter; });
    deliverGrid.innerHTML = list.map(function (d) {
      return '<article class="dcard" data-id="' + d.id + '">' +
        '<div class="dcard-prev" style="background:' + CAT_COLORS[d.cat] + '" data-view-id="' + d.id + '">' +
          '<span class="dcard-flag">' + statusChip(d.status) + '</span>' +
          '<span class="ptype">' + d.type + '</span>' +
        '</div>' +
        '<div class="dcard-body">' +
          '<span class="dcard-cat">' + CAT_LABEL[d.cat] + '</span>' +
          '<h3 class="dcard-title">' + d.title + '</h3>' +
          '<p class="dcard-meta">' + d.type + ' · ' + d.size + ' · ' + d.date + '</p>' +
          '<div class="dcard-actions">' +
            '<button class="dbtn dbtn-dl" data-dl="' + d.id + '">' + dlIcon() + ' Baixar</button>' +
            '<button class="dbtn dbtn-view" data-view-id="' + d.id + '">Ver</button>' +
          '</div>' +
        '</div>' +
      '</article>';
    }).join("");
  }

  /* ── Recientes (inicio) ── */
  var recentList = $("#recentList");
  if (recentList) {
    recentList.innerHTML = DELIVERABLES.slice(0, 4).map(function (d) {
      return '<div class="mini-item" data-view-id="' + d.id + '">' +
        '<span class="mini-ic" style="background:' + CAT_COLORS[d.cat] + '">' + d.type + '</span>' +
        '<div class="mini-info"><b>' + d.title + '</b><small>' + CAT_LABEL[d.cat] + ' · ' + d.date + '</small></div>' +
        '<button class="mini-dl" data-dl="' + d.id + '" aria-label="Baixar">' + dlIcon() + '</button>' +
      '</div>';
    }).join("");
  }

  /* ── Projetos ── */
  var projGrid = $("#projGrid");
  if (projGrid) {
    projGrid.innerHTML = PROJECTS.map(function (p) {
      return '<div class="pcard">' +
        '<div class="pcard-head"><div><div class="pcard-name">' + p.name + '</div><div class="pcard-sub">' + p.sub + '</div></div>' +
          (p.status === "done" ? '<span class="chip chip-ok">Concluído</span>' : '<span class="chip chip-new">Ativo</span>') + '</div>' +
        '<div class="pbar"><span style="width:' + p.progress + '%"></span></div>' +
        '<div style="font-size:13px;color:var(--text-3);font-weight:700">' + p.progress + '% concluído</div>' +
        '<div class="pcard-foot"><span>' + p.deliver + ' entregáveis</span><span>Entrega: <b>' + p.due + '</b></span></div>' +
      '</div>';
    }).join("");
  }

  /* ── Faturas ── */
  /* ── Faturas (com pagamento por etapas) ── */
  var milestoneCleared = false; // FAT-0048 liberada ao aprovar o entregável "Site"
  var invBody = $("#invBody");
  function renderInvoices() {
    if (!invBody) return;
    invBody.innerHTML = INVOICES.map(function (i) {
      var locked = (i.num === "FAT-0048" && !milestoneCleared);
      var chip;
      if (i.status === "paid") chip = '<span class="chip chip-ok">Pago</span>';
      else if (locked) chip = '<span class="chip chip-wait">Aguarda aprovação</span>';
      else chip = '<span class="chip chip-new">Em aberto</span>';
      var action = locked
        ? '<span class="dim" style="color:var(--text-3);font-size:12.5px">—</span>'
        : '<a class="f-dl" href="#" data-invoice="' + i.num + '">PDF</a>';
      return '<tr><td class="fnum">' + i.num + '</td><td>' + i.desc + '</td><td>' + i.date + '</td><td class="fval">' + i.val + '</td><td>' + chip + '</td><td>' + action + '</td></tr>';
    }).join("");
  }
  renderInvoices();

  /* ── Chat ── */
  var chat = $("#chat");
  function renderChat() {
    if (!chat) return;
    chat.innerHTML = MESSAGES.map(function (m) {
      return '<div class="msg ' + m.who + '">' + m.text + '<small>' + m.time + '</small></div>';
    }).join("");
    chat.scrollTop = chat.scrollHeight;
  }
  renderChat();
  var chatForm = $("#chatForm");
  if (chatForm) {
    chatForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var inp = $("#chatInput");
      var v = inp.value.trim();
      if (!v) return;
      MESSAGES.push({ who: "me", text: v, time: "Agora" });
      renderChat(); inp.value = "";
      setTimeout(function () {
        MESSAGES.push({ who: "them", text: "Recebido! Nossa equipe responde em breve. 👍", time: "Agora" });
        renderChat();
      }, 900);
    });
  }

  /* ── Nombre / avatar ── */
  $all("#tbName, #welcomeName").forEach(function (el) { el.textContent = session.name || DEMO.name; });
  var av = $("#tbAvatar"); if (av) av.textContent = initials(session.name || DEMO.name);

  /* ── Navegación de vistas ── */
  var TITLES = {
    inicio: ["Início", "Resumo do seu projeto com a ATERIS"],
    entregaveis: ["Entregáveis", "Baixe e aprove seus materiais"],
    projetos: ["Projetos", "Acompanhe o progresso de cada projeto"],
    faturas: ["Faturas", "Histórico de pagamentos"],
    mensagens: ["Mensagens", "Fale direto com a equipe"],
    relatorios: ["Relatórios", "Resultados e métricas das suas campanhas"],
    solicitacoes: ["Solicitações", "Peça novas peças com seus créditos de design"],
    brief: ["Brief da marca", "Conte tudo para começarmos com as cartas na mesa"],
    config: ["Configurações", "Gerencie sua conta e suas empresas"]
  };
  function setView(view) {
    $all(".view").forEach(function (v) { v.classList.toggle("active", v.getAttribute("data-panel") === view); });
    $all(".side-link").forEach(function (l) { l.classList.toggle("active", l.getAttribute("data-view") === view); });
    var t = TITLES[view] || TITLES.inicio;
    $("#viewTitle").textContent = t[0];
    $("#viewSub").textContent = t[1];
    if (history.replaceState) history.replaceState(null, "", "#" + view);
    var sc = $("#appScroll"); if (sc) sc.scrollTop = 0;
    if (view === "relatorios") animateReports();
    closeSide();
  }
  $all(".side-link").forEach(function (l) {
    l.addEventListener("click", function (e) { e.preventDefault(); setView(l.getAttribute("data-view")); });
  });
  $all("[data-jump]").forEach(function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); setView(b.getAttribute("data-jump")); });
  });
  // vista inicial por hash
  var initial = (location.hash || "#inicio").slice(1);
  if (!TITLES[initial]) initial = "inicio";

  /* ── Sidebar móvil ── */
  function openSide() { document.body.classList.add("side-open"); var s = $("#sideScrim"); if (s) s.hidden = false; }
  function closeSide() { document.body.classList.remove("side-open"); var s = $("#sideScrim"); if (s) s.hidden = true; }
  var so = $("#sideOpen"), sc2 = $("#sideClose"), scr = $("#sideScrim");
  if (so) so.addEventListener("click", openSide);
  if (sc2) sc2.addEventListener("click", closeSide);
  if (scr) scr.addEventListener("click", closeSide);

  /* ── Logout ── */
  var lo = $("#logoutBtn");
  if (lo) lo.addEventListener("click", function () {
    try { localStorage.removeItem(AUTH_KEY); } catch (e) {}
    location.replace("area-login");
  });

  /* ── Toast ── */
  var toast = $("#toast"), toastT = null;
  function showToast(msg) {
    if (!toast) return;
    toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="m4 12 5 5L20 6"/></svg>' + msg;
    toast.hidden = false;
    requestAnimationFrame(function () { toast.classList.add("show"); });
    clearTimeout(toastT);
    toastT = setTimeout(function () {
      toast.classList.remove("show");
      setTimeout(function () { toast.hidden = true; }, 280);
    }, 2400);
  }

  /* ── Modal preview ── */
  var modal = $("#modal");
  function findD(id) { return DELIVERABLES.filter(function (d) { return d.id === id; })[0]; }
  function openModal(id) {
    var d = findD(id); if (!d || !modal) return;
    $("#modalPrev").style.background = CAT_COLORS[d.cat];
    $("#modalPrev").textContent = d.type;
    $("#modalCat").textContent = CAT_LABEL[d.cat];
    $("#modalTitle").innerHTML = d.title;
    $("#modalMeta").textContent = d.type + " · " + d.size + " · enviado em " + d.date;
    modal.hidden = false;
    $("#modalDownload").onclick = function () { closeModal(); showToast("Download iniciado: " + stripTags(d.title)); };
    $("#modalApprove").onclick = function () {
      closeModal();
      if (d.id === "d4" && !milestoneCleared) { clearMilestone(); showToast("Entregável aprovado · fatura FAT-0048 liberada"); }
      else showToast("Entregável aprovado. Obrigado!");
    };
  }
  function closeModal() { if (modal) modal.hidden = true; }
  function stripTags(s) { var t = document.createElement("div"); t.innerHTML = s; return t.textContent || s; }
  if (modal) {
    $("#modalX").addEventListener("click", closeModal);
    $("#modalScrim").addEventListener("click", closeModal);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
  }

  /* ── Delegación de clics global (download / ver / preview) ── */
  document.addEventListener("click", function (e) {
    var dl = e.target.closest("[data-dl]");
    if (dl) { e.preventDefault(); var d = findD(dl.getAttribute("data-dl")); showToast("Download iniciado: " + (d ? stripTags(d.title) : "arquivo")); return; }
    var vw = e.target.closest("[data-view-id]");
    if (vw) { e.preventDefault(); openModal(vw.getAttribute("data-view-id")); return; }
    var inv = e.target.closest("[data-invoice]");
    if (inv) { e.preventDefault(); showToast("Baixando " + inv.getAttribute("data-invoice") + ".pdf"); return; }
  });

  /* ── Filtros entregáveis ── */
  var filters = $("#filters");
  if (filters) {
    filters.addEventListener("click", function (e) {
      var b = e.target.closest(".filter"); if (!b) return;
      $all(".filter", filters).forEach(function (f) { f.classList.remove("active"); });
      b.classList.add("active");
      renderDeliverables(b.getAttribute("data-filter"));
    });
  }

  /* ── Count-up KPIs (soporta data-fmt="k" y data-dec) ── */
  function fmtNum(n, el) {
    var dec = parseInt(el.getAttribute("data-dec") || "0", 10);
    if (el.getAttribute("data-fmt") === "k") {
      if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
      return String(Math.round(n));
    }
    return dec ? n.toFixed(dec) : String(Math.round(n));
  }
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    if (isNaN(target)) return;
    if (prefersReduced) { el.textContent = fmtNum(target, el); return; }
    var dur = 950, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = fmtNum(target * (1 - Math.pow(1 - p, 3)), el);
      if (p < 1) requestAnimationFrame(tick); else el.textContent = fmtNum(target, el);
    }
    requestAnimationFrame(tick);
  }

  /* ── Relatórios: notificaciones, top de contenido, animaciones ── */
  var NOTIFS = [
    { ic: "branding", t: "Novo entregável: Logo final", s: "Branding · pronto para baixar", time: "2 h", unread: true },
    { ic: "web", t: "Site enviado para revisão", s: "Web · aguardando sua aprovação", time: "1 d", unread: true },
    { ic: "marketing", t: "Relatório de junho disponível", s: "Marketing · +18% em leads", time: "2 d", unread: false }
  ];
  var notifList = $("#notifList");
  function renderNotifs() {
    if (!notifList) return;
    notifList.innerHTML = NOTIFS.map(function (n) {
      return '<div class="notif-item' + (n.unread ? " unread" : "") + '">' +
        '<span class="ni-ic" style="background:' + (CAT_COLORS[n.ic] || CAT_COLORS.branding) + '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8 12 3 3 8l9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/></svg></span>' +
        '<div class="ni-body"><b>' + n.t + '</b><small>' + n.s + '</small></div>' +
        '<span class="ni-time">' + n.time + '</span></div>';
    }).join("");
  }
  renderNotifs();
  var notifBtn = $("#notifBtn"), notifPop = $("#notifPop"), tbDot = $(".tb-dot");
  function toggleNotif(show) {
    if (!notifPop) return;
    var open = show != null ? show : notifPop.hidden;
    notifPop.hidden = !open;
    if (notifBtn) notifBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (notifBtn) notifBtn.addEventListener("click", function (e) { e.stopPropagation(); toggleNotif(); });
  document.addEventListener("click", function (e) {
    if (notifPop && !notifPop.hidden && !e.target.closest(".tb-notif")) toggleNotif(false);
  });
  var notifClear = $("#notifClear");
  if (notifClear) notifClear.addEventListener("click", function () {
    NOTIFS.forEach(function (n) { n.unread = false; }); renderNotifs();
    if (tbDot) tbDot.style.display = "none";
  });

  var TOPCONTENT = [
    { p: "Reels — bastidores do projeto", f: "Reels", reach: "12.4k", inter: "1.820", leads: "64" },
    { p: "Carrossel — antes e depois", f: "Carrossel", reach: "9.1k", inter: "1.340", leads: "48" },
    { p: "Post — lançamento da marca", f: "Post", reach: "7.8k", inter: "980", leads: "37" },
    { p: "Stories — enquete de cores", f: "Stories", reach: "5.2k", inter: "760", leads: "21" }
  ];
  var topBody = $("#topBody");
  if (topBody) {
    topBody.innerHTML = TOPCONTENT.map(function (c) {
      return '<tr><td class="fnum">' + c.p + '</td><td>' + c.f + '</td><td>' + c.reach + '</td><td>' + c.inter + '</td><td class="fval">' + c.leads + '</td></tr>';
    }).join("");
  }

  var reportsAnimated = false;
  function animateReports() {
    var bars = $("#rbars");
    if (bars) requestAnimationFrame(function () { bars.classList.add("in"); });
    if (reportsAnimated) return;
    reportsAnimated = true;
    $all('[data-panel="relatorios"] [data-count]').forEach(countUp);
  }

  var repExport = $("#repExport");
  if (repExport) repExport.addEventListener("click", function () { showToast("Gerando relatório PDF…"); });
  var repPeriod = $("#repPeriod");
  if (repPeriod) repPeriod.addEventListener("click", function (e) {
    var b = e.target.closest(".filter"); if (!b) return;
    $all(".filter", repPeriod).forEach(function (f) { f.classList.remove("active"); });
    b.classList.add("active");
    var bars = $("#rbars"); if (bars) { bars.classList.remove("in"); requestAnimationFrame(function () { bars.classList.add("in"); }); }
  });

  /* ── Meu plano (Pacote Full) ── */
  var PLAN_ITEMS = [
    { t: "Diseño de logo", done: true },
    { t: "Manual de identidade corporativa", done: true },
    { t: "Papelaria (5 peças)", done: true },
    { t: "Logos com cores + sem fundo", done: true },
    { t: "Mockups", done: true },
    { t: "Feed Instagram — 6 imagens", done: true },
    { t: "Carrossel (3 imagens)", done: false },
    { t: "3 Stories (não animados)", done: false }
  ];
  var planGrid = $("#planGrid");
  if (planGrid) {
    planGrid.innerHTML = PLAN_ITEMS.map(function (i) {
      return '<div class="plan-item' + (i.done ? " done" : "") + '">' +
        '<span class="plan-ck">' + (i.done
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="m4 12 5 5L20 6"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="9"/></svg>') +
        '</span><span>' + i.t + '</span></div>';
    }).join("");
  }

  /* ── FASE 2: milestone (aprovação → pagamento) ── */
  function clearMilestone() {
    milestoneCleared = true;
    renderInvoices();
    var banner = $("#milestoneBanner");
    if (banner) {
      banner.classList.add("cleared");
      var txt = $("#msText");
      if (txt) txt.innerHTML = "Entregável aprovado. A fatura <b>FAT-0048</b> foi liberada e já aparece como <b>Em aberto</b>.";
      var b = banner.querySelector("b"); if (b) b.textContent = "Etapa aprovada — pagamento liberado";
    }
  }
  var msApprove = $("#msApprove");
  if (msApprove) msApprove.addEventListener("click", function () {
    setView("entregaveis");
    setTimeout(function () { openModal("d4"); }, 200);
  });

  /* ── FASE 2: créditos de design + solicitações ── */
  var credits = 8, creditsMax = 10, urgency = "normal";
  var REQUESTS = [
    { type: "Post para Instagram", desc: "Promoção de inverno — 20% off", urg: "normal", status: "pronto", date: "ontem" },
    { type: "Story (não animado)", desc: "Enquete de novas cores", urg: "rapida", status: "andamento", date: "hoje" },
    { type: "Flyer / panfleto", desc: "Evento de lançamento", urg: "normal", status: "fila", date: "hoje" }
  ];
  function reqCost() { return urgency === "rapida" ? 2 : 1; }
  function syncCredits() {
    var n = $("#creditsNum"); if (n) n.textContent = credits;
    var bar = $("#creditsBar"); if (bar) bar.style.width = Math.max(0, (credits / creditsMax) * 100) + "%";
    var badge = $("#badgeCredits"); if (badge) badge.textContent = credits;
    var cost = $("#reqCost"); if (cost) cost.textContent = "· " + reqCost() + (reqCost() > 1 ? " créditos" : " crédito");
  }
  var STATUS_LABEL = { fila: ["Na fila", "rs-fila"], andamento: ["Em andamento", "rs-andamento"], pronto: ["Pronto", "rs-pronto"] };
  var reqList = $("#reqList");
  function renderRequests() {
    if (!reqList) return;
    reqList.innerHTML = REQUESTS.map(function (r) {
      var st = STATUS_LABEL[r.status] || STATUS_LABEL.fila;
      return '<div class="req-item">' +
        '<span class="req-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg></span>' +
        '<div class="req-info"><b>' + r.type + '</b><small>' + r.desc + ' · ' + r.date + (r.urg === "rapida" ? ' · rápida' : '') + '</small></div>' +
        '<span class="req-status ' + st[1] + '">' + st[0] + '</span></div>';
    }).join("");
  }
  renderRequests(); syncCredits();

  var urg = $("#urg");
  if (urg) urg.addEventListener("click", function (e) {
    var b = e.target.closest(".urg-opt"); if (!b) return;
    $all(".urg-opt", urg).forEach(function (o) { o.classList.remove("active"); });
    b.classList.add("active"); urgency = b.getAttribute("data-urg"); syncCredits();
  });

  var reqForm = $("#reqForm");
  if (reqForm) reqForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var desc = $("#r-desc"), err = $("#err-desc");
    if (!desc.value.trim()) { desc.setAttribute("aria-invalid", "true"); if (err) err.textContent = "Descreva o que precisa"; desc.focus(); return; }
    desc.removeAttribute("aria-invalid"); if (err) err.textContent = "";
    var cost = reqCost();
    if (credits < cost) { showToast("Créditos insuficientes este mês"); return; }
    credits -= cost;
    REQUESTS.unshift({ type: $("#r-type").value, desc: desc.value.trim(), urg: urgency, status: "fila", date: "agora" });
    renderRequests(); syncCredits();
    reqForm.reset(); urgency = "normal";
    $all(".urg-opt", urg).forEach(function (o, i) { o.classList.toggle("active", i === 0); });
    syncCredits();
    showToast("Solicitação enviada · " + cost + (cost > 1 ? " créditos usados" : " crédito usado"));
  });

  /* ── FASE 3: multi-marca ── */
  var BRANDS = [
    { id: "demo", name: "Marca Demo", plan: "Pacote Full", color: "#ff6b6b", briefDone: false },
    { id: "andino", name: "Café Andino", plan: "Pacote Avançado", color: "#1f9d63", briefDone: true },
    { id: "maru", name: "Boutique Maru", plan: "Pacote Básico", color: "#9b59b6", briefDone: true }
  ];
  var activeBrand = BRANDS[0];
  function brandInitials(n) { return n.split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase(); }
  function applyBrand(b) {
    activeBrand = b;
    var logo = $("#bsLogo"); if (logo) { logo.textContent = brandInitials(b.name); logo.style.background = b.color; }
    var nm = $("#bsName"); if (nm) nm.textContent = b.name;
    var pl = $("#bsPlan"); if (pl) pl.textContent = b.plan;
    $all("#tbName, #welcomeName, #bsName").forEach(function (el) { el.textContent = b.name; });
    var av2 = $("#tbAvatar"); if (av2) { av2.textContent = brandInitials(b.name); av2.style.background = b.color; }
    updateBriefBanner();
    renderBrandPop();
  }
  var bsPop = $("#bsPop");
  function renderBrandPop() {
    if (!bsPop) return;
    var html = BRANDS.map(function (b) {
      return '<button type="button" class="bs-opt' + (b.id === activeBrand.id ? " active" : "") + '" data-brand="' + b.id + '">' +
        '<span class="bs-logo" style="background:' + b.color + '">' + brandInitials(b.name) + '</span>' +
        '<span><b>' + b.name + '</b><small>' + b.plan + '</small></span>' +
        (b.id === activeBrand.id ? '<svg class="bs-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="m4 12 5 5L20 6"/></svg>' : '') +
      '</button>';
    }).join("");
    html += '<button type="button" class="bs-opt bs-add" id="bsAdd"><span class="bs-logo" style="background:var(--ink-line)">+</span><span><b>Adicionar marca</b><small>Falar com a ATERIS</small></span></button>';
    bsPop.innerHTML = html;
  }
  var brandSwitch = $("#brandSwitch"), bsTrigger = $("#bsTrigger");
  function toggleBrand(show) {
    if (!bsPop || !brandSwitch) return;
    var open = show != null ? show : bsPop.hidden;
    bsPop.hidden = !open; brandSwitch.classList.toggle("open", open);
    if (bsTrigger) bsTrigger.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (bsTrigger) bsTrigger.addEventListener("click", function (e) { e.stopPropagation(); toggleBrand(); });
  if (bsPop) bsPop.addEventListener("click", function (e) {
    var opt = e.target.closest("[data-brand]");
    if (opt) { var b = BRANDS.filter(function (x) { return x.id === opt.getAttribute("data-brand"); })[0]; if (b) { applyBrand(b); toggleBrand(false); showToast("Mudou para " + b.name); } return; }
    if (e.target.closest("#bsAdd")) { toggleBrand(false); setView("config"); setTimeout(function () { var b = $("#addCompanyBtn"); if (b) b.click(); }, 200); }
  });
  document.addEventListener("click", function (e) { if (bsPop && !bsPop.hidden && !e.target.closest("#brandSwitch")) toggleBrand(false); });

  /* ── FASE 3: Configurações — empresas (reusa BRANDS) ── */
  var companyList = $("#companyList"), companyForm = $("#companyForm");
  function renderCompanies() {
    if (!companyList) return;
    companyList.innerHTML = BRANDS.map(function (b) {
      var isActive = b.id === activeBrand.id;
      var canRemove = BRANDS.length > 1;
      return '<div class="company-row">' +
        '<span class="co-logo" style="background:' + b.color + '">' + brandInitials(b.name) + '</span>' +
        '<div class="co-info"><b>' + b.name + (isActive ? ' <span class="co-tag">Ativa</span>' : '') + '</b><small>' + b.plan + (b.sector ? ' · ' + b.sector : '') + '</small></div>' +
        (isActive ? '<span class="co-current">Em uso</span>' : '<button type="button" class="co-use" data-use="' + b.id + '">Acessar</button>') +
        (canRemove ? '<button type="button" class="co-del" data-del="' + b.id + '" aria-label="Remover ' + b.name + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6"/></svg></button>' : '') +
      '</div>';
    }).join("");
  }
  renderCompanies();

  var addCompanyBtn = $("#addCompanyBtn"), companyCancel = $("#companyCancel");
  function showCompanyForm(show) {
    if (!companyForm) return;
    companyForm.hidden = !show;
    if (show) { var n = $("#c-name"); if (n) n.focus(); }
  }
  if (addCompanyBtn) addCompanyBtn.addEventListener("click", function () { showCompanyForm(companyForm && companyForm.hidden); });
  if (companyCancel) companyCancel.addEventListener("click", function () { showCompanyForm(false); companyForm.reset(); $("#err-cname").textContent = ""; });

  var COLORS = ["#ff6b6b", "#1f9d63", "#9b59b6", "#2862c8", "#e67e22", "#16a085"];
  if (companyForm) companyForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var nameI = $("#c-name"), err = $("#err-cname");
    var name = nameI.value.trim();
    if (!name) { err.textContent = "Informe o nome da empresa"; nameI.setAttribute("aria-invalid", "true"); nameI.focus(); return; }
    err.textContent = ""; nameI.removeAttribute("aria-invalid");
    var id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36).slice(-3);
    BRANDS.push({ id: id, name: name, plan: "A definir", sector: $("#c-sector").value.trim(), color: COLORS[BRANDS.length % COLORS.length], briefDone: false });
    renderCompanies(); renderBrandPop();
    companyForm.reset(); showCompanyForm(false);
    showToast("Empresa “" + name + "” adicionada");
  });

  if (companyList) companyList.addEventListener("click", function (e) {
    var use = e.target.closest("[data-use]");
    if (use) { var b = BRANDS.filter(function (x) { return x.id === use.getAttribute("data-use"); })[0]; if (b) { applyBrand(b); renderCompanies(); showToast("Mudou para " + b.name); } return; }
    var del = e.target.closest("[data-del]");
    if (del) {
      var id = del.getAttribute("data-del");
      var b2 = BRANDS.filter(function (x) { return x.id === id; })[0];
      if (!b2 || BRANDS.length <= 1) return;
      if (!window.confirm("Remover “" + b2.name + "” da sua conta?")) return;
      var wasActive = id === activeBrand.id;
      BRANDS = BRANDS.filter(function (x) { return x.id !== id; });
      if (wasActive) applyBrand(BRANDS[0]);
      renderCompanies(); renderBrandPop();
      showToast("Empresa removida");
    }
  });

  /* ── Configurações: conta + preferências ── */
  var accForm = $("#accForm");
  if (accForm) accForm.addEventListener("submit", function (e) { e.preventDefault(); showToast("Dados da conta salvos"); });
  var cfgLogout = $("#cfgLogout");
  if (cfgLogout) cfgLogout.addEventListener("click", function () { try { localStorage.removeItem(AUTH_KEY); } catch (e) {} location.replace("area-login"); });

  /* ── FASE 3: brief / onboarding ── */
  var briefBanner = $("#briefBanner");
  function updateBriefBanner() {
    if (!briefBanner) return;
    briefBanner.hidden = !!activeBrand.briefDone;
  }
  var briefStep = 1, briefMax = 4;
  function showBriefStep(n) {
    briefStep = Math.max(1, Math.min(briefMax, n));
    $all(".bpanel").forEach(function (p) { p.classList.toggle("active", +p.getAttribute("data-panel-step") === briefStep); });
    $all(".bstep").forEach(function (s) {
      var sn = +s.getAttribute("data-step");
      s.classList.toggle("active", sn === briefStep);
      s.classList.toggle("done", sn < briefStep);
    });
    var prog = $("#briefProg"); if (prog) prog.style.width = (briefStep / briefMax * 100) + "%";
    var back = $("#briefBack"), next = $("#briefNext"), done = $("#briefDone");
    if (back) back.hidden = briefStep === 1;
    if (next) next.hidden = briefStep === briefMax;
    if (done) done.hidden = briefStep !== briefMax;
  }
  var briefNext = $("#briefNext"), briefBack = $("#briefBack");
  if (briefNext) briefNext.addEventListener("click", function () { showBriefStep(briefStep + 1); });
  if (briefBack) briefBack.addEventListener("click", function () { showBriefStep(briefStep - 1); });

  // picks (chips + swatches, single/multi)
  document.addEventListener("click", function (e) {
    var chip = e.target.closest(".cpick, .swpick");
    if (!chip) return;
    var group = chip.closest("[data-pick]");
    if (!group) return;
    var multi = group.getAttribute("data-multi") === "true";
    if (multi) chip.classList.toggle("active");
    else { $all(".cpick, .swpick", group).forEach(function (c) { c.classList.remove("active"); }); chip.classList.add("active"); }
  });

  var briefForm = $("#briefForm");
  if (briefForm) briefForm.addEventListener("submit", function (e) {
    e.preventDefault();
    activeBrand.briefDone = true;
    updateBriefBanner();
    var nameVal = ($("#b-name") && $("#b-name").value.trim());
    briefForm.innerHTML = '<div class="brief-done-state">' +
      '<div class="brief-done-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="m4 12 5 5L20 6"/></svg></div>' +
      '<h3 class="card-title" style="font-size:21px">Brief enviado!</h3>' +
      '<p style="color:var(--text-2);max-width:380px;margin:8px auto 20px">Obrigado' + (nameVal ? ", " + nameVal : "") + '. Nossa equipe vai revisar e voltar com uma proposta clara em menos de 24h.</p>' +
      '<button type="button" class="btn btn-wa" data-jump="inicio">Voltar ao início</button></div>';
    showToast("Brief enviado · responderemos em 24h");
  });

  applyBrand(activeBrand);

  // delegación global para data-jump (cubre botones creados dinámicamente)
  document.addEventListener("click", function (e) {
    var j = e.target.closest("[data-jump]");
    if (j) { e.preventDefault(); setView(j.getAttribute("data-jump")); }
  });

  /* ── Init ── */
  renderDeliverables("todos");
  setView(initial);
  $all('.view[data-panel="inicio"] [data-count]').forEach(countUp);
})();
