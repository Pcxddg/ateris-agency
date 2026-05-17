/* ATERIS — Sistema de traducción ES / PT
   - Recorre los nodos de texto del DOM
   - Normaliza espacios y busca en el diccionario
   - Persiste la elección en localStorage
*/
(() => {
  'use strict';

  // ---------- Diccionario Español → Portugués ----------
  const ES_TO_PT = {
    // ===== NAV =====
    "Servicios": "Serviços",
    "Proceso": "Processo",
    "Documentación": "Documentação",
    "Por qué": "Por quê",
    "Contacto": "Contato",
    "Cotizar": "Orçar",

    // ===== HERO =====
    "Agencia de marketing digital": "Agência de marketing digital",
    "El tiempo es": "O tempo é",
    "oro": "ouro",
    "El tiempo es un recurso limitado y sus clientes lo saben. Dejemos de lado los caprichos y trabajemos de la mano con":
      "O tempo é um recurso limitado e seus clientes sabem disso. Deixemos os caprichos de lado e trabalhemos juntos com",
    "todas las cartas sobre la mesa.": "todas as cartas sobre a mesa.",
    "Empezar un proyecto": "Começar um projeto",
    "Ver servicios": "Ver serviços",
    "áreas de servicio": "áreas de serviço",
    "entregables definidos": "entregáveis definidos",
    "cartas sobre la mesa": "cartas sobre a mesa",

    // ===== Card hero =====
    "ATERIS · brief": "ATERIS · briefing",
    "Ejecución": "Execução",
    "Entrega": "Entrega",
    "Propuestas": "Propostas",
    "3 días": "3 dias",
    "Estrategia · Planificación de actividades": "Estratégia · Planejamento de atividades",
    "Entregable": "Entregável",
    "Presentación": "Apresentação",

    // ===== STRIP / Tabs =====
    "Desarrollo Web": "Desenvolvimento Web",
    "Publicidad": "Publicidade",
    "Diseño Gráfico": "Design Gráfico",
    "Redacción": "Redação",
    "Dirección de proyectos": "Direção de projetos",

    // ===== Section heads =====
    "Todo lo que necesitas, en un solo lugar.": "Tudo o que você precisa, em um só lugar.",
    "Cada actividad con su tiempo de ejecución, plazo de entrega, propuestas incluidas y entregable. Sin caprichos. Sin sorpresas.":
      "Cada atividade com seu tempo de execução, prazo de entrega, propostas incluídas e entregável. Sem caprichos. Sem surpresas.",

    // ===== Legend =====
    "Horas de trabajo": "Horas de trabalho",
    "Plazo al cliente": "Prazo ao cliente",
    "Alternativas incluidas": "Alternativas incluídas",

    // ===== Table headers =====
    "Actividad": "Atividade",
    "Descripción": "Descrição",

    // ===== Panel descriptions =====
    "Análisis, estrategia e informes para que cada decisión esté respaldada por datos.":
      "Análise, estratégia e relatórios para que cada decisão esteja respaldada por dados.",
    "De la idea al manual de marca. Identidad coherente, memorable y aplicable.":
      "Da ideia ao manual de marca. Identidade coerente, memorável e aplicável.",
    "Sitios y ecommerce: UX, diseño, programación, seguridad y capacitación.":
      "Sites e ecommerce: UX, design, programação, segurança e treinamento.",
    "Contenido, redes, email y automatización. Conversa con tu audiencia con consistencia.":
      "Conteúdo, redes, email e automação. Converse com sua audiência com consistência.",
    "Conceptos creativos que viajan a cualquier formato.": "Conceitos criativos que viajam para qualquer formato.",
    "Piezas impresas y digitales con corrección de estilo y diseño cuidado.":
      "Peças impressas e digitais com revisão de estilo e design cuidadoso.",
    "Video, foto y animación. Producción y post producción de alta calidad.":
      "Vídeo, foto e animação. Produção e pós-produção de alta qualidade.",
    "Palabras que comunican: guiones, boletines, descripciones y experiencia conversacional.":
      "Palavras que comunicam: roteiros, boletins, descrições e experiência conversacional.",

    // ===== Pills (días) =====
    "1 día": "1 dia",
    "2 días": "2 dias",
    "4 días": "4 dias",
    "5 días": "5 dias",
    "10 días": "10 dias",
    "16 días": "16 dias",
    "30 días": "30 dias",
    "2h / día": "2h / dia",
    "3–4h": "3–4h",
    "1–5 días": "1–5 dias",
    "2–4h": "2–4h",

    // ===== Dirección de proyectos =====
    "Análisis de marca": "Análise de marca",
    "Situación actual de la marca": "Situação atual da marca",
    "Estrategia": "Estratégia",
    "Planificación de actividades": "Planejamento de atividades",
    "Informe": "Relatório",
    "Analytics, Adwords, Social Media, Actividades": "Analytics, Adwords, Social Media, Atividades",
    "Asesoría / Consultas": "Consultoria / Consultas",
    "Activación de plataformas, asesorías técnicas, análisis": "Ativação de plataformas, consultorias técnicas, análise",

    // ===== Branding =====
    "Concepto de marca": "Conceito de marca",
    "Definir estilo y comunicación": "Definir estilo e comunicação",
    "Slogan, story, nombre de story, frases ancla": "Slogan, story, nome de story, frases âncora",
    "Presentación de referencias visuales": "Apresentação de referências visuais",
    "Nombres viables de registro": "Nomes viáveis de registro",
    "Diseño de logotipo": "Design de logotipo",
    "Guía de estilo": "Guia de estilo",
    "Guía rápida para el uso de la marca": "Guia rápida para o uso da marca",
    "Pack de íconos": "Pack de ícones",
    "Pack de 10 íconos en formatos EPS y SVG": "Pack de 10 ícones em formatos EPS e SVG",
    "Manual de identidad": "Manual de identidade",
    "Aplicaciones": "Aplicações",
    "Por aplicación": "Por aplicação",
    "Editable": "Editável",
    "Brandbook web con accesos al cliente": "Brandbook web com acessos para o cliente",

    // ===== Desarrollo Web =====
    "Experiencia del usuario UX": "Experiência do usuário UX",
    "Contenido de 5 secciones (5 escenas por sección)": "Conteúdo de 5 seções (5 cenas por seção)",
    "Diseño de interfaz UI": "Design de interface UI",
    "Diseño de 5 secciones (5 escenas por sección)": "Design de 5 seções (5 cenas por seção)",
    "Instalación": "Instalação",
    "Configuración de correos y servidor FTP": "Configuração de e-mails e servidor FTP",
    "Programación": "Programação",
    "Programación de 5 secciones (5 escenas por sección)": "Programação de 5 seções (5 cenas por seção)",
    "Sitio móvil": "Site móvel",
    "Configuración WooCommerce": "Configuração WooCommerce",
    "Optimización": "Otimização",
    "Optimización del sistema y entrega": "Otimização do sistema e entrega",
    "Migración de web": "Migração de site",
    "Migración de sitio": "Migração do site",
    "Planeación de web": "Planejamento de site",
    "Estructura y funcionalidad de front end": "Estrutura e funcionalidade de front end",
    "Consultas e investigaciones web": "Consultas e pesquisas web",
    "Asesoría técnica": "Consultoria técnica",
    "Capacitación publicación / contenido": "Treinamento publicação / conteúdo",
    "Capacitación presencial o videoconferencia": "Treinamento presencial ou videoconferência",
    "Capacitación carga de producto": "Treinamento de carga de produto",
    "Seguridad del sitio": "Segurança do site",
    "Manual de carga de producto": "Manual de carga de produto",
    "Contenido, corrección de estilo y diseño": "Conteúdo, revisão de estilo e design",
    "Manual de publicación post / contenido": "Manual de publicação post / conteúdo",
    "Automatizaciones": "Automações",

    // ===== Marketing Digital =====
    "Parrilla de contenidos mensual": "Grade de conteúdos mensal",
    "Planeación de 12 contenidos con referencia": "Planejamento de 12 conteúdos com referência",
    "Portada y cover (redes sociales)": "Capa e cover (redes sociais)",
    "Administración de 12 contenidos": "Administração de 12 conteúdos",
    "Manual de atención al cliente": "Manual de atendimento ao cliente",
    "Formato PDF": "Formato PDF",
    "Template de Mailchimp": "Template de Mailchimp",
    "Artículo / comunicado": "Artigo / comunicado",
    "Máximo una cuartilla, diseño y contenido": "Máximo uma lauda, design e conteúdo",
    "Máximo 2 páginas": "Máximo 2 páginas",
    "Máximo 4 escenas": "Máximo 4 cenas",
    "Video (30 seg)": "Vídeo (30 seg)",
    "Producción y postproducción": "Produção e pós-produção",
    "Animación (30 seg)": "Animação (30 seg)",
    "Diseño, animación y musicalización": "Design, animação e musicalização",
    "Traducción": "Tradução",
    "Máximo 1 cuartilla": "Máximo 1 lauda",
    "Copy, grabación y edición": "Copy, gravação e edição",
    "Contenido y diseño": "Conteúdo e design",
    "Canva, secuencia": "Canva, sequência",
    "Infografía": "Infográfico",
    "Máximo 1 página carta": "Máximo 1 página carta",
    "Infografía animada (20 seg)": "Infográfico animado (20 seg)",

    // ===== Publicidad =====
    "Concepto de campaña": "Conceito de campanha",
    "Estrategia y planeación": "Estratégia e planejamento",
    "Gráfico maestro": "Gráfico mestre",
    "Carta, billboard, social media y POP": "Carta, billboard, social media e POP",

    // ===== Diseño Gráfico =====
    "Etiqueta de producto": "Etiqueta de produto",
    "Formato máximo 1/3 carta": "Formato máximo 1/3 carta",
    "Empaque": "Embalagem",
    "Previsualización tipo render": "Pré-visualização tipo render",
    "Plano mecánico": "Plano mecânico",
    "Planos para impresión": "Planos para impressão",
    "Brochure / catálogo / revista": "Brochura / catálogo / revista",
    "Corrección de estilo y diseño (4 páginas)": "Revisão de estilo e design (4 páginas)",
    "Presentación PowerPoint": "Apresentação PowerPoint",
    "Corrección de estilo y diseño (por diapositiva)": "Revisão de estilo e design (por slide)",
    "Escaparate": "Vitrine",
    "Exhibidor 1×1": "Expositor 1×1",
    "Lona publicitaria": "Lona publicitária",
    "Corrección de estilo y diseño": "Revisão de estilo e design",
    "Infografía (1 carta)": "Infográfico (1 carta)",
    "Corrección y calibración de color": "Revisão e calibração de cor",

    // ===== Audiovisual =====
    "Animación (1 min)": "Animação (1 min)",
    "Render, diseño, animación y musicalización": "Render, design, animação e musicalização",
    "Video corporativo (1 min)": "Vídeo corporativo (1 min)",
    "Producción y post producción": "Produção e pós-produção",
    "Foto producto": "Foto produto",
    "Producción y post producción (3 vistas)": "Produção e pós-produção (3 vistas)",
    "Foto bodegón": "Foto still",
    "Foto instalaciones": "Foto instalações",
    "4 hr de cobertura y 2 hr de edición": "4 hr de cobertura e 2 hr de edição",
    "Foto publicitaria": "Foto publicitária",
    "8 hr de sesión y 4 de edición": "8 hr de sessão e 4 de edição",
    "Foto evento": "Foto evento",
    "Grabación de voz, limpieza de audio": "Gravação de voz, limpeza de áudio",
    "Fotografías con volumen (fondo blanco, ecommerce)": "Fotografias com volume (fundo branco, ecommerce)",

    // ===== Redacción =====
    "Guión de radio (30 seg)": "Roteiro de rádio (30 seg)",
    "1 cuartilla": "1 lauda",
    "Guión corporativo (1 min)": "Roteiro corporativo (1 min)",
    "Boletines informativos": "Boletins informativos",
    "1 cuartilla (notas breves)": "1 lauda (notas breves)",
    "Lineamientos de comunicación": "Diretrizes de comunicação",
    "Comunicación escrita y visual de marca": "Comunicação escrita e visual da marca",
    "Traducciones": "Traduções",
    "Traducción por hoja o sección de web": "Tradução por folha ou seção de web",
    "Descripción de producto": "Descrição de produto",
    "Características de producto para web": "Características de produto para web",
    "Corrección de estilo": "Revisão de estilo",
    "Desarrollo de chatbot": "Desenvolvimento de chatbot",
    "Análisis y listado de chats automáticos (WhatsApp, Messenger, web chat)":
      "Análise e listagem de chats automáticos (WhatsApp, Messenger, web chat)",
    "Experiencia de usuario para automatizaciones + análisis": "Experiência de usuário para automações + análise",

    // ===== Proceso =====
    "Cómo trabajamos": "Como trabalhamos",
    "Cuatro pasos, todas las cartas sobre la mesa.": "Quatro passos, todas as cartas sobre a mesa.",
    "Cada proyecto avanza con tiempos y entregables claros. Sin sorpresas, sin caprichos.":
      "Cada projeto avança com prazos e entregáveis claros. Sem surpresas, sem caprichos.",
    "Análisis": "Análise",
    "Diagnóstico de marca, mercado y datos. Punto de partida realista.":
      "Diagnóstico de marca, mercado e dados. Ponto de partida realista.",
    "Planificación de actividades con tiempos, propuestas y entregables.":
      "Planejamento de atividades com prazos, propostas e entregáveis.",
    "Producción de cada pieza con horas y plazos previamente acordados.":
      "Produção de cada peça com horas e prazos previamente acordados.",
    "Resultados medibles: Analytics, Ads, Social Media y siguientes pasos.":
      "Resultados mensuráveis: Analytics, Ads, Social Media e próximos passos.",

    // ===== Por qué =====
    "Por qué ATERIS": "Por quê ATERIS",
    "Procesos claros. Entregables tangibles.": "Processos claros. Entregáveis tangíveis.",
    "No vendemos promesas: cada actividad tiene horas de ejecución, plazo de entrega, número de propuestas y formato del entregable. Tú decides, nosotros ejecutamos.":
      "Não vendemos promessas: cada atividade tem horas de execução, prazo de entrega, número de propostas e formato do entregável. Você decide, nós executamos.",
    "Conversemos": "Vamos conversar",
    "Tiempos pactados": "Prazos acordados",
    "Cada entregable con horas y plazo definidos desde el día uno.":
      "Cada entregável com horas e prazo definidos desde o primeiro dia.",
    "Propuestas reales": "Propostas reais",
    "Alternativas tangibles para que elijas con criterio, no con corazonadas.":
      "Alternativas tangíveis para você escolher com critério, não com palpites.",
    "Equipo integral": "Equipe integral",
    "Branding, web, contenido, publicidad y audiovisual bajo un solo techo.":
      "Branding, web, conteúdo, publicidade e audiovisual sob um mesmo teto.",
    "Resultados medibles": "Resultados mensuráveis",
    "Informes con Analytics, Adwords, Social Media y siguientes pasos.":
      "Relatórios com Analytics, Adwords, Social Media e próximos passos.",

    // ===== Docs =====
    "ATERIS Marketing Digital — Manual operativo": "ATERIS Marketing Digital — Manual operacional",
    "Aquí explicamos a fondo cómo trabajamos cada pieza del área de Marketing Digital: qué hacemos, cómo lo hacemos, qué entregamos y qué resultados puedes esperar.":
      "Aqui explicamos a fundo como trabalhamos cada peça da área de Marketing Digital: o que fazemos, como fazemos, o que entregamos e que resultados você pode esperar.",
    "contenidos / mes": "conteúdos / mês",
    "días de gestión": "dias de gestão",
    "tipos de entregable": "tipos de entregável",
    "canales activados": "canais ativados",

    // TOC
    "Contenido": "Conteúdo",
    "Filosofía": "Filosofia",
    "Flujo de trabajo": "Fluxo de trabalho",
    "Parrilla mensual": "Grade mensal",
    "Atención al cliente": "Atendimento ao cliente",
    "Video y animación": "Vídeo e animação",
    "Podcast / Streaming": "Podcast / Streaming",
    "Arte, Canva, Infografía": "Arte, Canva, Infográfico",
    "Medición e informes": "Medição e relatórios",
    "Preguntas frecuentes": "Perguntas frequentes",

    // Docs content
    "1. Filosofía del área": "1. Filosofia da área",
    "El marketing digital de ATERIS parte de una premisa simple:":
      "O marketing digital da ATERIS parte de uma premissa simples:",
    "el tiempo es oro": "o tempo é ouro",
    ". Cada acción que tomamos en una marca cuesta horas, presupuesto y oportunidad. Por eso documentamos todo: tiempos de ejecución, plazos de entrega, número de propuestas y formato del entregable.":
      ". Cada ação que tomamos em uma marca custa horas, orçamento e oportunidade. Por isso documentamos tudo: tempos de execução, prazos de entrega, número de propostas e formato do entregável.",
    "“Dejemos de lado los caprichos y trabajemos de la mano con todas las cartas sobre la mesa.”":
      "“Deixemos os caprichos de lado e trabalhemos juntos com todas as cartas sobre a mesa.”",
    "El área se sostiene sobre cuatro principios:": "A área se sustenta em quatro princípios:",
    "Planeación primero:": "Planejamento primeiro:",
    "ninguna pieza sale al aire sin estar dentro de una parrilla mensual aprobada.":
      "nenhuma peça vai ao ar sem estar dentro de uma grade mensal aprovada.",
    "Consistencia visual:": "Consistência visual:",
    "todo respeta el Look & Feel y la guía de marca acordada.":
      "tudo respeita o Look & Feel e o guia de marca acordado.",
    "Datos antes que opiniones:": "Dados antes que opiniões:",
    "cada decisión se valida con métricas y se reporta en el informe mensual.":
      "cada decisão é validada com métricas e reportada no relatório mensal.",
    "tú sabes cuánto tarda cada cosa antes de empezar.":
      "você sabe quanto demora cada coisa antes de começar.",

    "2. Flujo de trabajo mensual": "2. Fluxo de trabalho mensal",
    "Así se ve un mes operativo en ATERIS Marketing Digital:":
      "Assim é um mês operacional no ATERIS Marketing Digital:",
    "Día 1–2": "Dia 1–2",
    "Día 3–5": "Dia 3–5",
    "Día 6–8": "Dia 6–8",
    "Día 9–30": "Dia 9–30",
    "Día 30": "Dia 30",
    "Parrilla mensual": "Grade mensal",
    "Producción de piezas": "Produção de peças",
    "Revisión y aprobación": "Revisão e aprovação",
    "Publicación + community": "Publicação + community",
    "Informe + cierre": "Relatório + fechamento",
    "Cada etapa tiene responsable, plazo y entregable definido. Si una pieza requiere cambios, se gestionan dentro de los tiempos previstos para no romper el calendario.":
      "Cada etapa tem responsável, prazo e entregável definidos. Se uma peça precisa de mudanças, são geridas dentro dos prazos previstos para não quebrar o calendário.",

    "Look & Feel de redes sociales": "Look & Feel de redes sociais",
    "Manual de atención al cliente": "Manual de atendimento ao cliente",
    "Newsletter": "Newsletter",
    "Ebook": "Ebook",
    "Landing page": "Landing page",
    "Video y animación (30 seg)": "Vídeo e animação (30 seg)",
    "Podcast y Streaming (15 min)": "Podcast e Streaming (15 min)",
    "Arte JPG, Canva y Infografía": "Arte JPG, Canva e Infográfico",

    // Cards labels
    "1 propuesta": "1 proposta",
    "3 propuestas": "3 propostas",

    "Qué es.": "O que é.",
    "Planeación de 12 contenidos para el mes con referencia visual y de copy. Es el documento maestro del área.":
      "Planejamento de 12 conteúdos para o mês com referência visual e de copy. É o documento mestre da área.",
    "Qué incluye:": "O que inclui:",
    "Calendario con fecha y hora de publicación por pieza.": "Calendário com data e hora de publicação por peça.",
    "Canal (Instagram, Facebook, LinkedIn, TikTok, X, web).": "Canal (Instagram, Facebook, LinkedIn, TikTok, X, web).",
    "Objetivo de la pieza (awareness, engagement, conversión, recordación).":
      "Objetivo da peça (awareness, engagement, conversão, lembrança).",
    "Copy completo, hashtags y referencia visual.": "Copy completo, hashtags e referência visual.",
    "Etiqueta de campaña o pilar de contenido.": "Etiqueta de campanha ou pilar de conteúdo.",
    "Entregable:": "Entregável:",
    "tablero online editable (Notion / Google Sheets / Trello).":
      "quadro online editável (Notion / Google Sheets / Trello).",

    "Definimos portada, cover, plantillas de feed y estilo visual unificado para que tu marca se vea siempre coherente.":
      "Definimos capa, cover, modelos de feed e estilo visual unificado para que sua marca pareça sempre coerente.",
    "Portadas y banners (Facebook, LinkedIn, X, YouTube).": "Capas e banners (Facebook, LinkedIn, X, YouTube).",
    "Plantillas de feed (3–5 estilos rotables).": "Modelos de feed (3–5 estilos rotativos).",
    "Plantilla de historia y reel.": "Modelo de stories e reels.",
    "Set de íconos y elementos gráficos reutilizables.": "Set de ícones e elementos gráficos reutilizáveis.",
    "kit online con archivos editables.": "kit online com arquivos editáveis.",

    "Administración integral de 12 contenidos al mes: publicación, monitoreo, interacción y reportes.":
      "Administração integral de 12 conteúdos ao mês: publicação, monitoramento, interação e relatórios.",
    "Publicación:": "Publicação:",
    "calendarización y subida en tiempo y forma.": "calendarização e upload em tempo e forma.",
    "Moderación:": "Moderação:",
    "respuesta a comentarios y mensajes en horario hábil.": "resposta a comentários e mensagens em horário comercial.",
    "Crisis básica:": "Crise básica:",
    "escalado al cliente con protocolo definido.": "escalada ao cliente com protocolo definido.",
    "Monitoreo:": "Monitoramento:",
    "menciones, etiquetas y palabras clave de marca.": "menções, etiquetas e palavras-chave da marca.",
    "tablero online con métricas semanales + informe mensual.":
      "quadro online com métricas semanais + relatório mensal.",

    "Documento PDF con respuestas tipo, tono de voz, casos críticos y árbol de decisión para que cualquier persona del equipo responda como la marca.":
      "Documento PDF com respostas tipo, tom de voz, casos críticos e árvore de decisão para que qualquer pessoa da equipe responda como a marca.",
    "PDF descargable + plantillas de respuesta.": "PDF para download + modelos de resposta.",

    "Template de email diseñado y armado en Mailchimp (o plataforma equivalente) listo para enviarse.":
      "Template de email projetado e montado em Mailchimp (ou plataforma equivalente) pronto para ser enviado.",
    "Diseño responsive (móvil + escritorio).": "Design responsive (móvel + desktop).",
    "Bloques reutilizables para futuras campañas.": "Blocos reutilizáveis para futuras campanhas.",
    "Configuración de listas y segmentos básicos.": "Configuração de listas e segmentos básicos.",
    "Pruebas A/B opcionales en asunto.": "Testes A/B opcionais no assunto.",
    "campaña online lista para programarse.": "campanha online pronta para ser programada.",

    "Máximo una cuartilla, diseño y contenido. Ideal para notas de blog, comunicados de prensa o anuncios oficiales.":
      "Máximo uma lauda, design e conteúdo. Ideal para posts de blog, comunicados de imprensa ou anúncios oficiais.",
    "Investigación breve y verificación de datos.": "Pesquisa breve e verificação de dados.",
    "Redacción, corrección de estilo y SEO básico.": "Redação, revisão de estilo e SEO básico.",
    "Diseño de cabecera y maquetación web.": "Design de cabeçalho e diagramação web.",
    "artículo publicado online o documento listo para publicar.":
      "artigo publicado online ou documento pronto para publicar.",

    "Pieza de hasta 2 páginas pensada como lead magnet o material descargable de alto valor.":
      "Peça de até 2 páginas pensada como lead magnet ou material para download de alto valor.",
    "Estructura editorial (intro, desarrollo, CTA).": "Estrutura editorial (intro, desenvolvimento, CTA).",
    "Diseño visual con identidad de marca.": "Design visual com identidade de marca.",
    "Optimización para descarga (PDF ligero, hipervínculos).": "Otimização para download (PDF leve, hyperlinks).",
    "PDF.": "PDF.",

    "Máximo 4 escenas, enfocada en conversión. Cada escena tiene un objetivo específico:":
      "Máximo 4 cenas, focada em conversão. Cada cena tem um objetivo específico:",
    "Hero:": "Hero:",
    "propuesta de valor + CTA principal.": "proposta de valor + CTA principal.",
    "Beneficios:": "Benefícios:",
    "3 a 5 puntos clave.": "3 a 5 pontos-chave.",
    "Prueba social:": "Prova social:",
    "testimonios, logos o casos.": "depoimentos, logos ou casos.",
    "Cierre:": "Fechamento:",
    "formulario o CTA final.": "formulário ou CTA final.",
    "landing online con tracking básico (Analytics + píxel).": "landing online com tracking básico (Analytics + pixel).",

    "Producimos dos formatos de pieza corta:": "Produzimos dois formatos de peça curta:",
    "Video (30 seg):": "Vídeo (30 seg):",
    "producción y postproducción con material real o stock. Ideal para reels, ads y testimoniales cortos.":
      "produção e pós-produção com material real ou stock. Ideal para reels, ads e depoimentos curtos.",
    "Animación (30 seg):": "Animação (30 seg):",
    "diseño, animación y musicalización. Perfecta para explicar conceptos o anunciar promociones.":
      "design, animação e musicalização. Perfeita para explicar conceitos ou anunciar promoções.",
    "Infografía animada (20 seg):": "Infográfico animado (20 seg):",
    "diseño, animación y musicalización de datos clave.": "design, animação e musicalização de dados-chave.",
    "archivo MP4 optimizado para cada red social.": "arquivo MP4 otimizado para cada rede social.",

    "Podcast (15 min):": "Podcast (15 min):",
    "copy, grabación y edición. Producimos el episodio listo para subir a Spotify / Apple Podcasts / YouTube.":
      "copy, gravação e edição. Produzimos o episódio pronto para subir no Spotify / Apple Podcasts / YouTube.",
    "Streaming (15 min):": "Streaming (15 min):",
    "producción y postproducción de transmisiones en vivo (escenografía digital, gráficos, edición de la grabación).":
      "produção e pós-produção de transmissões ao vivo (cenografia digital, gráficos, edição da gravação).",
    "MP4 o MP3 final + miniaturas y copy de publicación.":
      "MP4 ou MP3 final + miniaturas e copy de publicação.",

    "Hasta una cuartilla por unidad. Traducción profesional, no automática, con localización al mercado objetivo.":
      "Até uma lauda por unidade. Tradução profissional, não automática, com localização para o mercado-alvo.",
    "documento editable.": "documento editável.",

    "Arte JPG:": "Arte JPG:",
    "contenido y diseño de una pieza individual para redes.": "conteúdo e design de uma peça individual para redes.",
    "Canva, secuencia:": "Canva, sequência:",
    "carrusel o secuencia de piezas (ideal para storytelling).":
      "carrossel ou sequência de peças (ideal para storytelling).",
    "Infografía:": "Infográfico:",
    "hasta 1 página carta. Datos, procesos o comparativas visualizadas.":
      "até 1 página carta. Dados, processos ou comparativos visualizados.",
    "JPG optimizado para cada red.": "JPG otimizado para cada rede.",

    "3. Medición e informes": "3. Medição e relatórios",
    "Todo lo que producimos se mide. Cada mes recibes un informe con:":
      "Tudo o que produzimos é medido. A cada mês você recebe um relatório com:",
    "Analytics:": "Analytics:",
    "tráfico, fuentes, comportamiento y conversiones del sitio.":
      "tráfego, fontes, comportamento e conversões do site.",
    "Adwords:": "Adwords:",
    "inversión, impresiones, clics, CPC y conversiones por campaña.":
      "investimento, impressões, cliques, CPC e conversões por campanha.",
    "Social Media:": "Social Media:",
    "alcance, engagement, crecimiento y mejores piezas.": "alcance, engagement, crescimento e melhores peças.",
    "Actividades:": "Atividades:",
    "qué se hizo, qué se publicará y qué decisiones tomar el próximo mes.":
      "o que foi feito, o que será publicado e que decisões tomar no próximo mês.",
    "El informe es una": "O relatório é uma",
    "presentación": "apresentação",
    "que se revisa contigo en sesión de 60 minutos. No es un PDF que se manda y se olvida: es una conversación con datos al frente.":
      "que é revisada com você em sessão de 60 minutos. Não é um PDF que se envia e se esquece: é uma conversa com dados na frente.",

    "4. Preguntas frecuentes": "4. Perguntas frequentes",
    "¿Puedo contratar solo una pieza, sin todo el paquete mensual?":
      "Posso contratar apenas uma peça, sem o pacote mensal inteiro?",
    "Sí. Cada actividad del listado se puede cotizar individualmente. La parrilla mensual es la opción más eficiente, pero no es obligatoria.":
      "Sim. Cada atividade da lista pode ser orçada individualmente. A grade mensal é a opção mais eficiente, mas não é obrigatória.",
    "¿Qué pasa si pido cambios fuera de las propuestas incluidas?":
      "O que acontece se eu pedir mudanças fora das propostas incluídas?",
    "Las propuestas incluidas (1 a 3 según la actividad) cubren la mayoría de los casos. Cambios adicionales se cotizan por hora extra, siempre con tu aprobación antes de ejecutar.":
      "As propostas incluídas (1 a 3 conforme a atividade) cobrem a maioria dos casos. Mudanças adicionais são orçadas por hora extra, sempre com sua aprovação antes de executar.",
    "¿Quién es dueño del contenido producido?": "Quem é dono do conteúdo produzido?",
    "Tú. Una vez entregado y pagado, todo el material es 100% propiedad de tu marca, con archivos editables incluidos cuando aplique.":
      "Você. Uma vez entregue e pago, todo o material é 100% propriedade da sua marca, com arquivos editáveis incluídos quando se aplique.",
    "¿Manejan publicidad pagada (ads)?": "Vocês gerenciam publicidade paga (ads)?",
    "Sí, dentro del módulo de": "Sim, dentro do módulo de",
    "y la actividad de": "e a atividade de",
    "Concepto de campaña": "Conceito de campanha",
    ". La gestión y pauta de ads se cotiza aparte del marketing digital orgánico.":
      ". A gestão e pauta de ads é orçada à parte do marketing digital orgânico.",
    "¿Cómo empezamos?": "Como começamos?",
    "Con un": "Com um",
    "Análisis de marca": "Análise de marca",
    "(2h de ejecución, 3 días de entrega). De ahí sale la estrategia y la primera parrilla.":
      "(2h de execução, 3 dias de entrega). Daí sai a estratégia e a primeira grade.",
    "Escríbenos para arrancar.": "Escreva-nos para começar.",

    // ===== CTA =====
    "Cotiza tu proyecto": "Orce seu projeto",
    "¿Empezamos?": "Vamos começar?",
    "Cuéntanos qué necesitas. Te respondemos con un plan claro de tiempos, propuestas y entregables.":
      "Conte-nos o que você precisa. Respondemos com um plano claro de prazos, propostas e entregáveis.",
    "Email": "Email",
    "WhatsApp": "WhatsApp",
    "Horario": "Horário",
    "Lun – Vie · 9:00 a 18:00": "Seg – Sex · 9:00 às 18:00",

    // Form labels
    "Nombre": "Nome",
    "Tu nombre": "Seu nome",
    "tu@empresa.com": "voce@empresa.com",
    "Servicio de interés": "Serviço de interesse",
    "Aún no lo sé": "Ainda não sei",
    "Mensaje": "Mensagem",
    "Cuéntanos brevemente tu proyecto": "Conte-nos brevemente seu projeto",
    "Enviar mensaje": "Enviar mensagem",

    // Form status messages
    "Necesitamos un nombre y un email válido.": "Precisamos de um nome e um email válido.",
    "¡Gracias! Te contactaremos en menos de 24 horas.": "Obrigado! Entraremos em contato em menos de 24 horas.",

    // ===== Footer =====
    "Agencia de marketing digital. El tiempo es oro.": "Agência de marketing digital. O tempo é ouro.",
    "Estudio": "Estúdio",
    "Instagram": "Instagram",
    "LinkedIn": "LinkedIn",
    "Todos los derechos reservados.": "Todos os direitos reservados.",
    "Hecho con ☕ y todas las cartas sobre la mesa.": "Feito com ☕ e todas as cartas sobre a mesa.",
  };

  // Diccionario inverso para volver al español
  const PT_TO_ES = {};
  Object.entries(ES_TO_PT).forEach(([es, pt]) => {
    if (!PT_TO_ES[pt]) PT_TO_ES[pt] = es;
  });

  // ---------- Atributos a traducir (placeholders, etc) ----------
  const ATTR_TARGETS = [
    { selector: 'input[placeholder]', attr: 'placeholder' },
    { selector: 'textarea[placeholder]', attr: 'placeholder' },
    { selector: 'select option', attr: 'text' }
  ];

  let currentLang = 'es';

  /**
   * Reemplaza el contenido de un nodo de texto preservando los espacios
   * iniciales y finales.
   */
  function swapTextNode(node, dict) {
    const value = node.nodeValue;
    if (!value) return;
    const leading = value.match(/^\s*/)[0];
    const trailing = value.match(/\s*$/)[0];
    const content = value.slice(leading.length, value.length - trailing.length);
    if (!content) return;
    const normalized = content.replace(/\s+/g, ' ');
    const translation = dict[normalized];
    if (translation) {
      node.nodeValue = leading + translation + trailing;
    }
  }

  function walkAndTranslate(dict) {
    // 1. Recorrer todos los text nodes del body
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          // Saltar nodos dentro de scripts y styles
          const p = node.parentNode;
          if (!p) return NodeFilter.FILTER_REJECT;
          const tag = p.nodeName;
          if (tag === 'SCRIPT' || tag === 'STYLE') return NodeFilter.FILTER_REJECT;
          // Saltar el botón del toggle (ES / PT) y el logo
          if (p.closest && p.closest('.lang-toggle')) return NodeFilter.FILTER_REJECT;
          if (p.closest && p.closest('.logo')) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(node => swapTextNode(node, dict));

    // 2. Traducir placeholders
    document.querySelectorAll('[placeholder]').forEach(el => {
      const v = el.getAttribute('placeholder');
      if (dict[v]) el.setAttribute('placeholder', dict[v]);
    });

    // 3. Traducir <option> (su contenido es text, ya cubierto por el walker)
    //    pero el .value de submit no, lo dejamos.
  }

  function setLang(target) {
    if (target === currentLang) return;
    const dict = target === 'pt' ? ES_TO_PT : PT_TO_ES;
    walkAndTranslate(dict);
    document.documentElement.lang = target;
    currentLang = target;

    // Actualizar estado visual del toggle
    document.querySelectorAll('.lang-toggle button').forEach(b => {
      const isActive = b.dataset.lang === target;
      b.classList.toggle('is-active', isActive);
      b.setAttribute('aria-pressed', String(isActive));
    });

    // Persistir
    try { localStorage.setItem('ateris.lang', target); } catch (_) {}
  }

  // ---------- Inicialización ----------
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('langToggle');
    if (toggle) {
      toggle.addEventListener('click', e => {
        const btn = e.target.closest('button[data-lang]');
        if (!btn) return;
        setLang(btn.dataset.lang);
      });
    }

    // Aplicar idioma guardado (o detección por navegador)
    let saved = null;
    try { saved = localStorage.getItem('ateris.lang'); } catch (_) {}
    if (!saved) {
      const browser = (navigator.language || '').toLowerCase();
      if (browser.startsWith('pt')) saved = 'pt';
    }
    if (saved && saved !== 'es') setLang(saved);
  });

  // Exponer por si se necesita desde consola/QA
  window.__aterisI18n = { setLang, get current() { return currentLang; } };
})();
