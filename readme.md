<h1 align="center">
  <img src="public/logo.svg.svg" alt="Chromateque Logo" width="96" />
  <br />
  Chromateque
</h1>

<p align="center">
  A curated color and palette archive for people who obsess over hex codes.
</p>

<p align="center">
  <a href="https://chromateque.netlify.app">chromateque.netlify.app</a>
</p>

---

## What is Chromateque?

**Chromateque is a static, zero-dependency archive of colors, palettes, and a live palette generator — no backend, no build step, no accounts:**

- A searchable library of ~185 curated colors across 11 categories
- 14 tagged, filterable palettes for interfaces, brand systems, and editorial work
- A palette generator built on real color theory (analogous, complementary, triadic, monochrome)
- One-click copy for any hex, palette, or generated scheme — including CSS variables, Tailwind config, and JSON export
- A single shared design system across every page, so it looks and feels like one product, not a collection of tabs

**`No backend. No database. No build step — just static files you can open in a browser.`**

---

## How It Works

Getting started with Chromateque is fast:

1. **Open the archive** — `colors.html` shows every color, filterable by category tab or by live search on name/hex.
2. **Browse palettes** — `palettes.html` groups colors into 5-swatch palettes, filterable by mood tags like Warm, Cool, or Pastel.
3. **Generate a palette** — On the homepage, pick a color-theory scheme (or "Surprise me") and click Generate, or press `Space`.
4. **Copy what you need** — Click any swatch to copy its hex, or use the format dropdown to copy a full palette as CSS variables, Tailwind config, or JSON.
5. **Read the docs** — `docs.html` explains how the underlying `colors.js` / `palettes.js` / `generator.js` files are structured, in case you want to reuse the data in your own project.

> [!TIP]
> Every color and palette swatch across the site is clickable — you never need to manually select and copy a hex code.

---

## Installation

### macOS

```bash
git clone https://github.com/nikomarinovic/chromateque.git
cd chromateque
python3 -m http.server 8000
# open http://localhost:8000
```

### Linux

```bash
git clone https://github.com/nikomarinovic/chromateque.git
cd chromateque
python3 -m http.server 8000
# open http://localhost:8000
```

### Windows (PowerShell)

```powershell
git clone https://github.com/nikomarinovic/chromateque.git
cd chromateque
py -m http.server 8000
# open http://localhost:8000
```

---

## Features

- **Color Archive** — ~185 named colors across Neutrals, Blue, Cyan, Green, Yellow, Orange, Red, Pink, Purple, Cyberpunk, and Pastel categories, with live text/hex search.
- **Palette Archive** — 14 curated 5-color palettes, filterable by tag (Minimal, Warm, Cool, Nature, Bold, Pastel, Cyberpunk, and more).
- **Palette Generator** — Real HSL color-theory schemes with a keyboard shortcut (`Space`) to reroll and a format-aware copy button.
- **Copy Everywhere** — Every chip and palette card copies to your clipboard on click, with inline "Copied!" feedback — no separate button or modal required.
- **Zero Dependencies** — Three plain JavaScript files (`colors.js`, `palettes.js`, `generator.js`) and one shared stylesheet. No framework, no package manager, no build step.

---

## Screenshots

<p align="center">
  <img src="public/screenshot-1.png" alt="Chromateque homepage with hero and color archive" width="700" />
</p>

---

## Data & Privacy

Chromateque runs entirely in your browser. There is no server-side component, no database, and nothing is sent anywhere.

> [!NOTE]
> Copy-to-clipboard uses the browser's native Clipboard API, which requires a secure context (`https://` or `localhost`). It will silently no-op on plain `http://` origins other than localhost.

> [!WARNING]
> The "API reference" in `docs.html` documents the shape of the JavaScript data (`colors`, `palettes`, and the generator functions) — it is **not** a hosted network API. There is no endpoint to `curl` or `fetch()` against unless you deploy the data as static JSON yourself.

---

<h3 align="center">
Chromateque does not accept feature implementations via pull requests. Feature requests and bug reports are welcome through GitHub issues.
</h3>

---

<p align="center">
  © 2026 Niko Marinović. All rights reserved.
</p>