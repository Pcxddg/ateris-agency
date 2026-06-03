# ATERIS — Agência de Marketing Digital

Sitio web de **ATERIS**, agencia de marketing digital. Diferenciador de marca:
*“Todas as cartas sobre a mesa”* — transparencia total: tiempos, propuestas y entregables
claros antes de empezar.

🔗 **En vivo:** https://ateriz.com
📚 **Catálogo:** https://ateriz.com/catalogo
📦 **Repo:** https://github.com/Pcxddg/ateris-agency
☁️ **Hosting:** Cloudflare Pages (deploy automático desde `main`)

> El dominio es **ateriz.com** (con Z) porque `ateris.com` está en venta. La marca sigue siendo “ATERIS”.

---

## Resumen

Sitio **estático** de 2 páginas, sin build, sin npm, sin frameworks:

| Página | URL | Propósito |
|---|---|---|
| **Landing** | `ateriz.com` (`index.html`) | Captación de clientes (conversión: WhatsApp + formulario) |
| **Catálogo** | `ateriz.com/catalogo` (`catalogo.html`) | Detalle de las 8 áreas de servicio, paquetes y entregables |

Ambas comparten diseño y se enlazan entre sí (logo / “Início” / “Catálogo completo”).
**Bilingüe PT/ES** con portugués por defecto (mercado Brasil; WhatsApp +55).

---

## Estructura de archivos

```
index.html        ← Landing de captación (raíz del dominio). Base en portugués.
catalogo.html     ← Catálogo de servicios. Base en español.
styles.css        ← Design system / tokens compartidos (colores, tipografía, sombras)
landing.css       ← Estilos específicos de la landing
landing.js        ← Interacciones de la landing (WhatsApp, form, efectos, i18n hooks)
catalog.css       ← Estilos específicos del catálogo
catalog.js        ← Interacciones del catálogo
translations.js   ← Motor i18n PT⇄ES + diccionario (compartido por ambas páginas)
robots.txt        ← Permite rastreo + bots de IA + sitemap
sitemap.xml       ← URLs del sitio (limpias, sin .html)
```

Pendiente de crear: `og-image.png` (1200×630) para previews al compartir.

> Nota: `.agents/` y `skills-lock.json` están en `.gitignore` (herramientas de desarrollo,
> no forman parte del sitio publicado).

---

## Stack y filosofía

- **HTML5 + CSS (variables) + JS vanilla (IIFE).** Sin build, sin npm, sin dependencias
  de runtime salvo **Google Fonts (Manrope)**.
- **Contenido primero**: el HTML funciona aunque el JS falle (WhatsApp con `href` real, etc.).
- Orden de carga: `translations.js` **antes** del JS de la página.

---

## Idiomas (i18n PT/ES)

- Motor en `translations.js`: recorre los nodos de texto del DOM (`TreeWalker`) y los
  reemplaza con un diccionario; persiste en `localStorage`.
- **Idioma base por página** vía `data-base-lang` en `<html>`: la landing = `pt`
  (HTML escrito en portugués), el catálogo = `es`.
- `data-no-i18n` marca elementos que **no** se traducen (logo, botones ES/PT).
- Default portugués. Toggle PT/ES en el header. API de QA: `window.__aterisI18n`.

---

## Conversión

- **WhatsApp (CTA principal):** `wa.me/5515988033899` con mensaje pre-cargado según idioma.
  Escrito en el HTML (funciona sin JS) + `rel="noopener noreferrer"`.
- **Formulario (CTA secundario):** validación accesible. Backend recomendado **Formspree**
  → pegar el endpoint en `landing.js` (`FORM_ENDPOINT`). *(pendiente)*

---

## Diseño y efectos

Logo SVG, scroll-progress, hero con “cartas” repartiéndose + glow aurora + brillo (sheen)
en el título, tilt/reveal, menú hamburguesa móvil. Animaciones intrusivas gateadas por
`prefers-reduced-motion`. Paleta de marca: coral `#ff6b6b` / amarillo `#ffd23f` / tinta,
tipografía Manrope.

---

## SEO

- `<title>` y `meta description` únicos por página; `canonical` autorreferenciado.
- Open Graph + Twitter Cards.
- JSON-LD: `ProfessionalService` (landing) + `FAQPage`.
- `robots.txt` + `sitemap.xml` con **URLs limpias** (sin `.html`, como las sirve Cloudflare Pages).

---

## Cómo trabajar el sitio

**Local:**
```bash
python -m http.server 8000
# abrir http://localhost:8000/  (landing)  y  /catalogo.html
```

**Deploy (automático):**
```bash
git add -A
git commit -m "tu cambio"
git push origin main      # Cloudflare Pages redespliega solo en ~1 min
```

> Cloudflare Pages sirve **URLs limpias**: `/catalogo.html` redirige (308) a `/catalogo`,
> `/index.html` a `/`. Por eso los enlaces internos y el sitemap usan las rutas sin `.html`.

---

## Dominio (Cloudflare)

- `ateriz.com` administrado en Cloudflare (proxied, SSL automático).
- Conectado vía **Cloudflare Pages → Custom domains** (DNS creado automáticamente).
- `www.ateriz.com` → redirección 301 a la raíz (Redirect Rule en Cloudflare).

---

## Pendientes

- [ ] Conectar el **formulario** a Formspree (`FORM_ENDPOINT` en `landing.js`).
- [ ] Crear **`og-image.png`** (1200×630).
- [ ] **Testimonios** reales (reactivar prueba social).
- [ ] URLs reales de **Instagram / LinkedIn** en el footer.
