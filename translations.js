/* ════════════════════════════════════════════════════════════════════
   ATERIS — Motor i18n PT ⇄ ES (vanilla, sin dependencias)
   - HTML base en portugués (data-base-lang="pt"); catálogo en español.
   - Recorre nodos de texto (TreeWalker) + placeholders.
   - Persistencia en localStorage. API: window.__aterisI18n
   ════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* Diccionario base: clave en PORTUGUÉS → valor en ESPAÑOL */
  var PT_ES = {
    /* Nav */
    "Serviços": "Servicios",
    "Método": "Método",
    "Processo": "Proceso",
    "Perguntas": "Preguntas",
    "Catálogo completo": "Catálogo completo",
    "Falar pelo WhatsApp": "Hablar por WhatsApp",
    "Abrir menu": "Abrir menú",
    "Fechar menu": "Cerrar menú",
    "Início": "Inicio",

    /* Hero */
    "Agência de marketing digital": "Agencia de marketing digital",
    "Todas as cartas": "Todas las cartas",
    "sobre a mesa.": "sobre la mesa.",
    "Branding, web, marketing e audiovisual sob um mesmo teto — com": "Branding, web, marketing y audiovisual bajo un mismo techo — con",
    "prazos, propostas e entregáveis claros": "plazos, propuestas y entregables claros",
    "antes de começar.": "antes de empezar.",
    "Orçar meu projeto": "Cotizar mi proyecto",
    "Orçamento grátis e sem compromisso · resposta em menos de 24h.": "Cotización gratis y sin compromiso · respuesta en menos de 24h.",
    "áreas de serviço": "áreas de servicio",
    "entregáveis definidos": "entregables definidos",
    "tempo de resposta": "tiempo de respuesta",

    /* Hero card */
    "Projeto": "Proyecto",
    "Identidade + Site": "Identidad + Sitio",
    "Prazo acordado": "Plazo acordado",
    "Entregáveis": "Entregables",
    "Proposta": "Propuesta",
    "Tudo definido antes de começar": "Todo definido antes de empezar",
    "Aprovada": "Aprobada",
    "12 itens": "12 ítems",
    "4 semanas": "4 semanas",

    /* Strip / áreas */
    "Direção de projetos": "Dirección de proyectos",
    "Branding": "Branding",
    "Desenvolvimento Web": "Desarrollo Web",
    "Marketing Digital": "Marketing Digital",
    "Publicidade": "Publicidad",
    "Design Gráfico": "Diseño Gráfico",
    "Audiovisual": "Audiovisual",
    "Redação": "Redacción",

    /* Método */
    "Transparência total": "Transparencia total",
    "Tudo claro desde o primeiro dia.": "Todo claro desde el primer día.",
    "Na ATERIS você sabe o tempo, o prazo e o entregável de cada atividade antes de começar. Sem caprichos, sem surpresas.": "En ATERIS sabes el tiempo, el plazo y el entregable de cada actividad antes de empezar. Sin caprichos, sin sorpresas.",
    "O que você sempre tem com a ATERIS": "Lo que siempre tienes con ATERIS",
    "Prazos acordados": "Plazos acordados",
    "Datas reais combinadas por escrito.": "Fechas reales acordadas por escrito.",
    "Prazo de entrega por atividade": "Plazo de entrega por actividad",
    "Cada tarefa com seu tempo definido.": "Cada tarea con su tiempo definido.",
    "Zero surpresas": "Cero sorpresas",
    "Sem custos ocultos na fatura.": "Sin costos ocultos en la factura.",
    "Entregável tangível": "Entregable tangible",
    "Você recebe algo real, não promessas.": "Recibes algo real, no promesas.",

    /* Serviços */
    "Tudo o que sua marca precisa, sob um teto.": "Todo lo que tu marca necesita, bajo un techo.",
    "Oito áreas de serviço que trabalham juntas — cada uma com entregáveis claros desde o início.": "Ocho áreas de servicio que trabajan juntas — cada una con entregables claros desde el inicio.",
    "Ver detalhe": "Ver detalle",
    "Ver catálogo completo": "Ver catálogo completo",
    "Um só ponto de contato para coordenar toda a sua marca.": "Un solo punto de contacto para coordinar toda tu marca.",
    "Cronograma mestre": "Cronograma maestro",
    "Reuniões de acompanhamento": "Reuniones de seguimiento",
    "Relatórios de progresso": "Reportes de progreso",
    "Identidade que diferencia e fica na memória.": "Identidad que diferencia y se queda en la memoria.",
    "Logo e sistema visual": "Logo y sistema visual",
    "Manual de marca": "Manual de marca",
    "Paleta e tipografia": "Paleta y tipografía",
    "Sites rápidos, claros e feitos para converter.": "Sitios rápidos, claros y hechos para convertir.",
    "Site responsivo": "Sitio responsivo",
    "Otimização de velocidade": "Optimización de velocidad",
    "SEO técnico base": "SEO técnico base",
    "Estratégia que traz clientes, não só curtidas.": "Estrategia que trae clientes, no solo likes.",
    "Gestão de redes": "Gestión de redes",
    "Campanhas de tráfego": "Campañas de tráfico",
    "Relatórios mensais": "Reportes mensuales",
    "Anúncios que falam com quem importa.": "Anuncios que hablan con quien importa.",
    "Meta e Google Ads": "Meta y Google Ads",
    "Segmentação": "Segmentación",
    "Otimização de orçamento": "Optimización de presupuesto",
    "Peças que comunicam com intenção.": "Piezas que comunican con intención.",
    "Material para redes": "Material para redes",
    "Impressos": "Impresos",
    "Apresentações": "Presentaciones",
    "Vídeo e foto que contam a sua história.": "Video y foto que cuentan tu historia.",
    "Produção de vídeo": "Producción de video",
    "Edição": "Edición",
    "Fotografia de produto": "Fotografía de producto",
    "Palavras que vendem sem gritar.": "Palabras que venden sin gritar.",
    "Copy para site": "Copy para sitio",
    "Roteiros": "Guiones",
    "Textos para redes": "Textos para redes",

    /* Processo */
    "Como trabalhamos": "Cómo trabajamos",
    "Quatro passos, sempre os mesmos.": "Cuatro pasos, siempre los mismos.",
    "Análise": "Análisis",
    "Entendemos seu negócio, suas metas e seu prazo.": "Entendemos tu negocio, tus metas y tu plazo.",
    "Estratégia": "Estrategia",
    "Definimos o plano, os entregáveis e os tempos.": "Definimos el plan, los entregables y los tiempos.",
    "Execução": "Ejecución",
    "Colocamos a equipe a trabalhar com prazos acordados.": "Ponemos al equipo a trabajar con plazos acordados.",
    "Relatório": "Reporte",
    "Mostramos resultados medíveis, sem letras miúdas.": "Mostramos resultados medibles, sin letra pequeña.",

    /* Por quê */
    "Por quê a ATERIS": "Por qué ATERIS",
    "Quatro razões para confiar.": "Cuatro razones para confiar.",
    "Combinamos datas reais e cumprimos.": "Acordamos fechas reales y las cumplimos.",
    "Propostas reais": "Propuestas reales",
    "Escopo e preço claros antes de assinar.": "Alcance y precio claros antes de firmar.",
    "Equipe integral": "Equipo integral",
    "Todas as áreas em um só lugar, coordenadas.": "Todas las áreas en un solo lugar, coordinadas.",
    "Resultados mensuráveis": "Resultados medibles",
    "Relatórios com números, não promessas.": "Reportes con números, no promesas.",

    /* FAQ */
    "Perguntas frequentes": "Preguntas frecuentes",
    "Quanto custa?": "¿Cuánto cuesta?",
    "Depende do escopo, mas você recebe uma proposta com preço fechado antes de começar. Sem surpresas na fatura.": "Depende del alcance, pero recibes una propuesta con precio cerrado antes de empezar. Sin sorpresas en la factura.",
    "Posso contratar um só serviço?": "¿Puedo contratar un solo servicio?",
    "Sim. Você contrata só o que precisa — um serviço ou um pacote integral.": "Sí. Contratas solo lo que necesitas — un servicio o un paquete integral.",
    "Em quanto tempo vocês entregam?": "¿En cuánto tiempo entregan?",
    "Cada atividade tem um prazo acordado por escrito. Você sabe a data de entrega antes de começarmos.": "Cada actividad tiene un plazo acordado por escrito. Sabes la fecha de entrega antes de empezar.",
    "O conteúdo é meu?": "¿El contenido es mío?",
    "Sim. Tudo o que produzimos é seu: arquivos, acessos e direitos. Sem reféns.": "Sí. Todo lo que producimos es tuyo: archivos, accesos y derechos. Sin rehenes.",

    /* Contato */
    "Vamos começar?": "¿Empezamos?",
    "Conte o seu projeto e devolvemos um orçamento claro em menos de 24h.": "Cuéntanos tu proyecto y te devolvemos una cotización clara en menos de 24h.",
    "E-mail": "Correo",
    "Horário": "Horario",
    "Seg – Sex · 9:00 às 18:00": "Lun – Vie · 9:00 a 18:00",
    "Nome": "Nombre",
    "Telefone / WhatsApp": "Teléfono / WhatsApp",
    "Serviço": "Servicio",
    "Mensagem": "Mensaje",
    "Seu nome": "Tu nombre",
    "voce@email.com": "tu@email.com",
    "Conte um pouco sobre seu projeto": "Cuéntanos un poco sobre tu proyecto",
    "Selecione um serviço": "Selecciona un servicio",
    "Quero meu orçamento": "Quiero mi cotización",
    "Não compartilhamos seus dados. Só entramos em contato sobre seu projeto.": "No compartimos tus datos. Solo te contactamos sobre tu proyecto.",
    "Campo obrigatório": "Campo obligatorio",
    "E-mail inválido": "Correo inválido",
    "Mensagem enviada! Responderemos em menos de 24h.": "¡Mensaje enviado! Responderemos en menos de 24h.",

    /* Scroll-build */
    "Como montamos": "Cómo lo montamos",
    "Seu projeto, montado passo a passo.": "Tu proyecto, montado paso a paso.",
    "Da primeira conversa ao relatório final — você vê tudo sendo construído.": "De la primera conversación al reporte final — ves todo construyéndose.",
    "Briefing e metas": "Briefing y metas",
    "Plano e canais": "Plan y canales",
    "Entregáveis em produção": "Entregables en producción",
    "Resultados medíveis": "Resultados medibles",
    "Briefing": "Briefing",
    "Cliente": "Cliente",
    "Meta": "Meta",
    "Prazo": "Plazo",
    "Plano de ação": "Plan de acción",
    "Em produção": "En producción",
    "Concluído": "Concluido",
    "Alcance": "Alcance",
    "Leads": "Leads",
    "Conversão": "Conversión",
    "Resultados em 8 semanas": "Resultados en 8 semanas",

    /* Assemble: marca */
    "Identidade": "Identidad",
    "Sua marca, montada do zero.": "Tu marca, montada desde cero.",
    "Cada peça no seu lugar, pronta para usar.": "Cada pieza en su lugar, lista para usar.",
    "Logo": "Logo",
    "Cores": "Colores",
    "Tipografia": "Tipografía",
    "Cartão": "Tarjeta",
    "Post social": "Post social",
    "Relatório de marca": "Reporte de marca",
    "Sua Marca": "Tu Marca",
    "Diretor de arte": "Director de arte",
    "Sua marca aqui": "Tu marca aquí",

    /* Assemble: site */
    "Presença digital": "Presencia digital",
    "Seu site, montado bloco a bloco.": "Tu sitio, montado bloque a bloque.",
    "Da estrutura ao lançamento, você acompanha cada etapa.": "De la estructura al lanzamiento, acompañas cada etapa.",
    "Ao vivo": "En vivo",

    /* Footer */
    "Agência de marketing digital com todas as cartas sobre a mesa.": "Agencia de marketing digital con todas las cartas sobre la mesa.",
    "Estúdio": "Estudio",
    "Contato": "Contacto",
    "Todos os direitos reservados.": "Todos los derechos reservados."
  };

  var html = document.documentElement;
  var baseLang = (html.getAttribute("data-base-lang") || "pt").toLowerCase();
  var otherLang = baseLang === "pt" ? "es" : "pt";

  /* baseToOther: traduce del idioma base al otro */
  var baseToOther = {};
  if (baseLang === "pt") {
    baseToOther = PT_ES;
  } else {
    Object.keys(PT_ES).forEach(function (k) { baseToOther[PT_ES[k]] = k; });
  }

  var CANON = new WeakMap();
  var textNodes = [];
  var phEls = [];
  var current = baseLang;

  function collect() {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = n.parentNode;
        if (!p) return NodeFilter.FILTER_REJECT;
        var tag = p.nodeName;
        if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") return NodeFilter.FILTER_REJECT;
        if (p.closest && p.closest("[data-no-i18n]")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = walker.nextNode())) { textNodes.push(n); CANON.set(n, n.nodeValue); }
    var list = document.querySelectorAll("[placeholder]");
    for (var i = 0; i < list.length; i++) {
      list[i].setAttribute("data-canon-ph", list[i].getAttribute("placeholder"));
      phEls.push(list[i]);
    }
  }

  function tr(text, map) {
    var lead = text.match(/^\s*/)[0];
    var trail = text.match(/\s*$/)[0];
    var core = text.slice(lead.length, text.length - trail.length);
    if (map[core] !== undefined) return lead + map[core] + trail;
    return text;
  }

  function render(lang) {
    var map = (lang === baseLang) ? null : baseToOther;
    for (var i = 0; i < textNodes.length; i++) {
      var canon = CANON.get(textNodes[i]);
      if (canon === undefined) continue;
      textNodes[i].nodeValue = map ? tr(canon, map) : canon;
    }
    for (var j = 0; j < phEls.length; j++) {
      var c = phEls[j].getAttribute("data-canon-ph");
      var v = map ? (baseToOther[c] !== undefined ? baseToOther[c] : c) : c;
      phEls[j].setAttribute("placeholder", v);
    }
    html.setAttribute("lang", lang);
    current = lang;
    try { localStorage.setItem("ateris.lang", lang); } catch (e) {}
    document.dispatchEvent(new CustomEvent("ateris:langchange", { detail: { lang: lang } }));
  }

  function setLang(lang) {
    lang = (lang === "es" || lang === "pt") ? lang : baseLang;
    render(lang);
  }

  function init() {
    collect();
    var stored = null;
    try { stored = localStorage.getItem("ateris.lang"); } catch (e) {}
    render(stored === "es" || stored === "pt" ? stored : baseLang);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.__aterisI18n = {
    setLang: setLang,
    toggle: function () { setLang(current === "pt" ? "es" : "pt"); },
    get current() { return current; },
    baseLang: baseLang
  };
})();
