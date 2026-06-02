# ATERIS — Agência de Marketing Digital

Sitio web de una sola página (landing) para **ATERIS**, una agencia de marketing digital.
Lema: *“El tiempo es oro — todas las cartas sobre la mesa.”*

🔗 **En vivo:** https://pcxddg.github.io/ateris-agency/
📦 **Repo:** https://github.com/pcxddg/ateris-agency

---

## Tabla de contenido

- [Resumen](#resumen)
- [Stack y filosofía técnica](#stack-y-filosofía-técnica)
- [Estructura de archivos](#estructura-de-archivos)
- [Cómo ejecutarlo localmente](#cómo-ejecutarlo-localmente)
- [Despliegue (GitHub Pages)](#despliegue-github-pages)
- [Arquitectura de la página](#arquitectura-de-la-página)
- [Sistema de idiomas (i18n ES/PT)](#sistema-de-idiomas-i18n-espt)
- [JavaScript: interacciones](#javascript-interacciones)
- [CSS: arquitectura de estilos](#css-arquitectura-de-estilos)
- [Accesibilidad (a11y)](#accesibilidad-a11y)
- [Guía de mantenimiento](#guía-de-mantenimiento)
- [Pendientes / TODO](#pendientes--todo)

---

## Resumen

ATERIS es un **sitio estático** sin framework, sin dependencias y sin paso de build.
Son 3 archivos (`index.html`, `styles.css`, `script.js`) más un módulo de traducción
(`translations.js`). Se abre directamente en el navegador o se publica tal cual en
cualquier hosting estático.

El contenido central es un **catálogo de servicios** organizado en 8 áreas, cada una con
una tabla de actividades que detalla: tiempo de ejecución, plazo de entrega, número de
propuestas incluidas, descripción y formato del entregable. La idea de negocio es la
*transparencia total* — el cliente sabe cuánto tarda y qué recibe antes de contratar.

| Métrica | Valor |
|---|---|
| Áreas de servicio | 8 |
| Entregables definidos | 70+ |
| Idiomas | 2 (Portugués por defecto, Español) |
| Dependencias externas | 1 (Google Fonts — Manrope) |

---

## Stack y filosofía técnica

- **HTML5 semántico** — `<header>`, `<section>`, `<article>`, `<nav>`, roles ARIA.
- **CSS puro** — variables CSS (custom properties), sin preprocesador, sin Tailwind.
- **JavaScript vanilla (ES6+)** — un IIFE por archivo, sin librerías, sin npm.
- **Sin build, sin bundler, sin `package.json`.** Lo que ves es lo que se sirve.
- **Fuente:** Manrope vía Google Fonts (`<link>` con `preconnect`).

Decisión de diseño: mantenerlo *zero-dependency* para que cargue rápido, sea fácil de
editar por cualquier persona y se despliegue en GitHub Pages sin pipeline.

---

## Estructura de archivos

```
ateris-agency/
├── index.html        # Toda la estructura y el contenido de la página
├── styles.css        # Todos los estilos (~1020 líneas, organizado por secciones)
├── script.js         # Interacciones: nav, tabs, scroll-spy, validación de form
├── translations.js   # Motor i18n ES↔PT + diccionario completo
├── .gitignore        # Ignora .DS_Store, Thumbs.db, *.log, .vscode/, .idea/, node_modules/
└── README.md         # Este archivo
```

> **Orden de carga importante:** en `index.html`, `translations.js` se carga **antes** que
> `script.js`. El motor i18n expone `window.__aterisI18n`, que `script.js` consulta para
> mostrar los mensajes de error del formulario en el idioma activo.

---

## Cómo ejecutarlo localmente

No hay build. Tres opciones:

**1. Abrir el archivo directamente**
```
Doble clic en index.html
```

**2. Servidor estático con Python** (recomendado para que el i18n y localStorage funcionen igual que en producción)
```bash
python -m http.server 8000
# luego abrir http://localhost:8000
```

**3. Con Node (si tienes `npx`)**
```bash
npx serve .
# o
npx http-server -p 8000
```

---

## Despliegue (GitHub Pages)

El sitio se sirve desde la rama por defecto del repo `pcxddg/ateris-agency` vía GitHub Pages.
Como es 100% estático, **cualquier push a la rama publicada se despliega automáticamente**.

```bash
git add .
git commit -m "Descripción del cambio"
git push origin main
```

No requiere configuración de CI ni de build. La URL final es
`https://pcxddg.github.io/ateris-agency/`.

---

## Arquitectura de la página

`index.html` está dividido en bloques claramente comentados, en este orden:

| # | Sección | `id` | Qué contiene |
|---|---|---|---|
| 1 | **Nav** | `#nav` | Logo, enlaces, toggle de idioma (ES/PT), botón “Cotizar”, menú móvil |
| 2 | **Hero** | `#hero` | Titular “El tiempo es oro”, CTAs, stats, tarjetas decorativas |
| 3 | **Strip** | — | Marquesina con las áreas de servicio en bucle |
| 4 | **Servicios** | `#servicios` | **Tabs** con 8 paneles, cada uno con su tabla de actividades |
| 5 | **Proceso** | `#proceso` | 4 pasos: Análisis → Estrategia → Ejecución → Informe |
| 6 | **Por qué** | `#porque` | 4 diferenciadores de la agencia |
| 7 | **Documentación** | `#documentacion` | Manual operativo de Marketing Digital con TOC lateral |
| 8 | **Contacto / CTA** | `#contacto` | Formulario de contacto con validación |
| 9 | **Footer** | — | Enlaces, contacto, año dinámico |

### Las 8 áreas de servicio (tabs)

`Dirección de proyectos` · `Branding` · `Desarrollo Web` · `Marketing Digital` ·
`Publicidad` · `Diseño Gráfico` · `Audiovisual` · `Redacción`

Cada panel es un `<article class="panel">` con una tabla `.svc`. Las columnas son:
**Actividad · Ejecución · Entrega · Propuestas · Descripción · Entregable**.

Los valores van en “pills” de color con significado fijo:

| Pill | Clase | Significado |
|---|---|---|
| 🟡 Amarillo | `.pill--yellow` | Tiempo de **ejecución** (horas de trabajo) |
| 🔴 Coral | `.pill--coral` | **Plazo** de entrega al cliente |
| 🟣 Violeta | `.pill--violet` | Número de **propuestas** / alternativas incluidas |

---

## Sistema de idiomas (i18n ES/PT)

Todo vive en [`translations.js`](translations.js). Es un traductor **basado en el DOM**, no
en claves `data-i18n`. Funciona así:

1. **Diccionario único `ES_TO_PT`** — pares `"texto español": "texto português"`.
   El diccionario inverso `PT_TO_ES` se genera automáticamente al cargar.
2. **`walkAndTranslate(dict)`** recorre todos los *text nodes* del `<body>` con un
   `TreeWalker`, normaliza los espacios y, si encuentra el texto en el diccionario, lo
   reemplaza conservando los espacios iniciales/finales. También traduce `placeholder`s y
   `<option>`s.
3. **Nodos excluidos:** los que están dentro de `.lang-toggle` y `.logo` (no se traducen
   “ATERIS”, “ES”, “PT”).
4. **Persistencia:** la elección se guarda en `localStorage` bajo la clave `ateris.lang`.
5. **Idioma por defecto:** **Portugués.** El sitio está escrito en español en el HTML, pero
   al cargar se traduce a PT salvo que el usuario haya elegido ES antes.
6. **Anti-flash (cloak):** `<html>` arranca con la clase `i18n-cloak` (que oculta el body);
   se quita una vez traducido el contenido. Hay un *failsafe* a 600 ms por si algo falla.

API expuesta para consola / QA:
```js
window.__aterisI18n.setLang('es');   // forzar español
window.__aterisI18n.setLang('pt');   // forzar portugués
window.__aterisI18n.current;          // idioma actual
```

> ⚠️ **Al añadir texto nuevo al HTML**, debes agregar su par de traducción en `ES_TO_PT`
> dentro de `translations.js`, o quedará en español al cambiar a portugués. El texto debe
> coincidir exactamente (tras normalizar espacios múltiples a uno solo).

---

## JavaScript: interacciones

Todo en [`script.js`](script.js), un único IIFE. Bloques:

| Bloque | Qué hace |
|---|---|
| **Nav scroll state** | Añade `.is-scrolled` al header tras 12px de scroll |
| **Mobile menu** | Abre/cierra el menú hamburguesa; cierra con clic en enlace o tecla `Esc`; gestiona `aria-expanded` |
| **Tabs de servicios** | Cambio de panel con clic y navegación por teclado (`←` `→` `Home` `End`), patrón ARIA tablist completo |
| **Scroll-spy (nav)** | `IntersectionObserver` marca el enlace de nav de la sección visible |
| **TOC de documentación** | `IntersectionObserver` resalta el ítem del índice lateral activo |
| **Reveal on scroll** | Anima la aparición de bloques al entrar en viewport (`.reveal` → `.is-visible`) |
| **Validación del form** | Valida nombre y email en `blur` y en `submit`, con mensajes en ES/PT y feedback accesible (`aria-invalid`, `aria-live`) |
| **Año del footer** | Inserta el año actual en `#year` |

El formulario **no envía datos a ningún backend** — solo valida y muestra un mensaje de
éxito simulado. Para hacerlo funcional hay que conectar un endpoint (ver [TODO](#pendientes--todo)).

---

## CSS: arquitectura de estilos

[`styles.css`](styles.css) está organizado por secciones comentadas, en este orden:

```
:root (variables)  →  Skip link  →  Focus visible  →  Buttons  →  NAV  →
Language toggle  →  HERO  →  STRIP  →  Section heads  →  SERVICES  →
PROCESS  →  WHY  →  DOCS  →  CTA  →  FOOTER  →  RESPONSIVE  →  Reveal animation
```

### Tokens de diseño (`:root`)

La paleta está inspirada en el PDF original de la agencia: **coral / amarillo / violeta**.

- **Colores:** `--coral`, `--yellow`, `--violet` (+ variantes `-soft`, `-strong`, `-text`).
  Las variantes `-text` existen específicamente para **cumplir contraste WCAG AA** sobre el
  fondo claro (ej. `--coral-text: #c43d3d` da 6.4:1).
- **Tipografía:** Manrope.
- **Sombras:** `--shadow-sm`, `--shadow`, `--shadow-lg`.
- **Radios:** `--radius-xs/sm/(base)/lg`.
- **Layout:** `--container: 1200px`.

> Para hacer un *re-skin*, en la mayoría de los casos basta con cambiar las variables del
> bloque `:root`. Evita hardcodear colores fuera de ahí.

---

## Accesibilidad (a11y)

El sitio recibió una auditoría de a11y + heurísticas de Nielsen (ver historial git). Incluye:

- **Skip link** (“Saltar al contenido”) visible al tabular.
- **Foco visible global** con anillo de color accesible (`--focus`).
- **Tabs** con patrón ARIA completo (`role="tablist/tab/tabpanel"`, `aria-selected`,
  navegación por flechas).
- **Menú móvil** con `aria-expanded` / `aria-controls` y cierre con `Esc`.
- **Formulario** con `aria-required`, `aria-invalid`, `aria-describedby` y errores en
  regiones `aria-live="polite"`.
- **Contraste de color** ajustado a WCAG AA (de ahí las variables `-text`).
- **`prefers-reduced-motion`** respetado en las animaciones de reveal (revisar bloque
  RESPONSIVE / Reveal animation del CSS).

---

## Guía de mantenimiento

### Añadir una nueva actividad a un servicio
1. Localiza el `<article class="panel" id="...">` correspondiente en `index.html`.
2. Agrega una fila `<tr>` en el `<tbody>` siguiendo el patrón de pills existente.
3. Añade las traducciones de cualquier texto nuevo en `translations.js`.

### Añadir una nueva área de servicio (tab)
1. Agrega un `<button class="tab" ...>` en el `.tabs` con `data-tab="nuevo-id"`.
2. Crea el `<article class="panel" id="nuevo-id">` correspondiente.
3. Asegura los atributos ARIA (`aria-controls`, `aria-labelledby`) — el JS los completa,
   pero el `id` y el `data-tab` deben coincidir.
4. Traduce los textos nuevos.

### Cambiar el idioma por defecto
En `translations.js`, función `init()`:
```js
const target = saved === 'es' ? 'es' : 'pt';   // 'pt' es el default actual
```

### Cambiar colores de marca
Edita las variables del bloque `:root` en `styles.css`. Cuida no romper el contraste AA.

---

## Pendientes / TODO

- [ ] **Conectar el formulario de contacto** a un backend o servicio (Formspree, Netlify
      Forms, EmailJS, etc.). Hoy solo valida y muestra un mensaje simulado.
- [ ] Reemplazar los datos de contacto placeholder: `+52 000 000 0000` y los enlaces `#`
      de WhatsApp / Instagram / LinkedIn en el footer.
- [ ] Verificar/actualizar el email `hola@ateris.agency` si corresponde.
- [ ] Añadir imagen Open Graph real (`og:image`) para previsualizaciones en redes.
- [ ] (Opcional) Considerar mover el diccionario i18n a un patrón de claves si el contenido
      crece mucho, para evitar dependencia del texto exacto del DOM.

---

*Hecho con ☕ y todas las cartas sobre la mesa.*
