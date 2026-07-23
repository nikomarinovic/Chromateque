// ---------------------------------------------------------------------------
// Chromateque — palettes.js
// ---------------------------------------------------------------------------
// The 17 curated palettes below are always available immediately (no fetch).
// Generated palettes are loaded lazily from data/palettes.json — one flat
// file, not a folder of manifests. Both sets are merged and treated the same.
// ---------------------------------------------------------------------------

const palettes = [
  {
    name: "Neutral Monotone",
    tags: ["Minimal", "System"],
    colors: ["#27272a", "#3f3f46", "#71717a", "#d4d4d8", "#f4f4f5"]
  },
  {
    name: "Deep Ocean",
    tags: ["Editorial", "Cool"],
    colors: ["#0f172a", "#334155", "#38bdf8", "#7dd3fc", "#f0f9ff"]
  },
  {
    name: "Forest Archive",
    tags: ["Nature", "Dark Academia"],
    colors: ["#0b1f17", "#1f3a2e", "#6b8f71", "#a7b8a0", "#e8e3d5"]
  },
  {
    name: "Sunset Ember",
    tags: ["Warm", "Bold"],
    colors: ["#dc2626", "#f97316", "#fdba74", "#fed7aa", "#fff7ed"]
  },
  {
    name: "Retro Diner",
    tags: ["Retro", "Bold"],
    colors: ["#7f1d1d", "#e63946", "#f4a261", "#e9c46a", "#f1faee"]
  },
  {
    name: "Midnight Circuit",
    tags: ["Cyberpunk", "Vibrant"],
    colors: ["#0d0221", "#0f4c81", "#ff2a6d", "#05d9e8", "#d1f7ff"]
  },
  {
    name: "Soft Bloom",
    tags: ["Pastel", "Editorial"],
    colors: ["#ffe4e6", "#fbcfe8", "#e9d5ff", "#dbeafe", "#fef9c3"]
  },
  {
    name: "Desert Dune",
    tags: ["Warm", "Nature"],
    colors: ["#5c3d2e", "#a3703d", "#d9a06b", "#f1c795", "#fbe8d3"]
  },
  {
    name: "Monochrome Slate",
    tags: ["Monochrome", "System"],
    colors: ["#0f172a", "#334155", "#64748b", "#cbd5e1", "#f1f5f9"]
  },
  {
    name: "Citrus Grove",
    tags: ["Vibrant", "Warm"],
    colors: ["#166534", "#84cc16", "#facc15", "#fb923c", "#fff7ed"]
  },
  {
    name: "Nordic Fjord",
    tags: ["Cool", "Minimal"],
    colors: ["#1e293b", "#475569", "#94a3b8", "#cbd5e1", "#f8fafc"]
  },
  {
    name: "Velvet Plum",
    tags: ["Bold", "Dark Academia"],
    colors: ["#2d0b2e", "#5b1a4a", "#a1266b", "#d16ba5", "#f4c6dc"]
  },
  {
    name: "Sakura Morning",
    tags: ["Pastel", "Nature"],
    colors: ["#7f1d3a", "#f472b6", "#fbcfe8", "#fef3c7", "#f8fafc"]
  },
  {
    name: "Terminal Green",
    tags: ["Cyberpunk", "Monochrome"],
    colors: ["#031409", "#0a3d1c", "#15803d", "#4ade80", "#d1fae5"]
  },
  {
    name: "Deep Fjord",
    tags: ["Cool", "Monochrome"],
    colors: ["#193d43", "#30737e", "#46aab9", "#90ccd5", "#daeef1"]
  },
  {
    name: "Velvet Bloom",
    tags: ["Cool", "Editorial"],
    colors: ["#3c1943", "#72307e", "#a846b9", "#cb90d5", "#eedaf1"]
  },
  {
    name: "Midnight Contrast",
    tags: ["Pastel", "Editorial"],
    colors: ["#ffffff", "#676f9d", "#424769", "#2d3250", "#f9b17a"]
  }
];

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

let _allPalettes = [...palettes]; // curated + generated, merged after fetch
let _activeList  = [...palettes]; // what's currently filtered/shown
const BATCH      = 60;
let _shown       = 0;
let _sentinel    = null;
let _observer    = null;

// ---------------------------------------------------------------------------
// Fetch generated palettes from data/palettes.json (one flat array file).
// Merges with the curated 17 and fires "palettes-loaded" when ready.
// ---------------------------------------------------------------------------

(function fetchGenerated() {
  // Resolve the right path whether this script is loaded from /assets/js/
  // (works for both root index.html and pages/*.html because the HTML
  // uses a relative path like ../../data/palettes.json anyway — here we
  // just use the same relative trick: go up from assets/js → root → data).
  const base = (function () {
    // Find this script's src to derive the base, fallback to "../.."
    const scripts = document.querySelectorAll("script[src]");
    for (const s of scripts) {
      if (s.src && s.src.includes("palettes.js")) {
        // e.g. http://localhost:8000/assets/js/palettes.js  → ../../
        return s.src.replace(/assets\/js\/palettes\.js.*$/, "");
      }
    }
    return "../../"; // pages/*.html fallback
  })();

  fetch(`${base}data/palettes/palettes.json`)
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (!Array.isArray(data) || data.length === 0) return;
      // Dedupe against the curated set by name
      const existing = new Set(palettes.map((p) => p.name));
      const generated = data.filter((p) => !existing.has(p.name));
      _allPalettes = [...palettes, ...generated];
      window.dispatchEvent(new CustomEvent("palettes-loaded", { detail: { total: _allPalettes.length } }));
    })
    .catch(() => {
      // No generated file yet — curated 17 still work fine.
      window.dispatchEvent(new CustomEvent("palettes-loaded", { detail: { total: palettes.length } }));
    });
})();

// ---------------------------------------------------------------------------
// Rendering helpers
// ---------------------------------------------------------------------------

const _swatchFlex = [2, 1.5, 1, 1, 1];

function _paletteChipHTML(hex, i) {
  return `<div style="background:${hex};flex:${_swatchFlex[i] || 1}"></div>`;
}

function _paletteCardHTML(p) {
  return `
<article class="palette" data-tags="${p.tags.join(",")}" data-colors="${p.colors.join(",")}">
  <div class="palette-swatches">
    ${p.colors.map((hex, i) => _paletteChipHTML(hex, i)).join("")}
  </div>
  <div class="palette-meta">
    <h3>${p.name}</h3>
    <div class="palette-meta-right">
      <div class="tags">${p.tags.map((t) => `<span>${t}</span>`).join("")}</div>
      <button class="palette-copy" type="button" aria-label="Copy ${p.name} as CSS variables">Copy</button>
    </div>
  </div>
</article>`;
}

function _copyPaletteCard(article) {
  const hexes = article.dataset.colors.split(",");
  const css = `:root {\n${hexes.map((hex, i) => `  --color-${i + 1}: ${hex};`).join("\n")}\n}`;
  const btn = article.querySelector(".palette-copy");
  const finish = () => {
    if (!btn) return;
    const orig = btn.textContent;
    btn.textContent = "Copied!";
    setTimeout(() => (btn.textContent = orig), 1200);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(css).then(finish).catch(finish);
  } else {
    finish();
  }
}

// ---------------------------------------------------------------------------
// Core grid renderer — appends one batch, sets up IntersectionObserver for
// the next one. Call with (el, list, reset=true) to start fresh.
// ---------------------------------------------------------------------------

function _appendBatch(el, list) {
  // Remove old sentinel if present
  if (_sentinel && _sentinel.parentNode === el) {
    _sentinel.remove();
    _sentinel = null;
  }
  if (_observer) {
    _observer.disconnect();
    _observer = null;
  }

  const slice = list.slice(_shown, _shown + BATCH);
  if (slice.length === 0) return;

  const frag = document.createDocumentFragment();
  const tmp = document.createElement("div");
  tmp.innerHTML = slice.map(_paletteCardHTML).join("");
  while (tmp.firstChild) frag.appendChild(tmp.firstChild);
  el.appendChild(frag);

  el.querySelectorAll(".palette-copy").forEach((btn) => {
    // Only wire up buttons that don't already have a listener
    if (!btn.dataset.wired) {
      btn.dataset.wired = "1";
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        _copyPaletteCard(btn.closest(".palette"));
      });
    }
  });

  _shown += slice.length;

  // If there's more, add a sentinel and watch it
  if (_shown < list.length) {
    _sentinel = document.createElement("div");
    _sentinel.className = "grid-sentinel";
    _sentinel.innerHTML = `<span class="spinner" aria-hidden="true"></span><span>Loading more…</span>`;
    el.appendChild(_sentinel);

    _observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          _observer.disconnect();
          _observer = null;
          _appendBatch(el, list);
        }
      },
      { rootMargin: "300px" }
    );
    _observer.observe(_sentinel);
  }
}

/**
 * Public API — renders `list` into `el`, resetting any previous render.
 * Used by palettes.html, index.html (preview), and trending.html.
 */
function renderPaletteGrid(el, list) {
  if (!el) return;
  // Clean up previous observer/sentinel
  if (_observer) { _observer.disconnect(); _observer = null; }
  _sentinel = null;
  _shown = 0;
  el.innerHTML = "";
  _activeList = list;
  _appendBatch(el, list);
}

/**
 * Returns all available palettes (curated + generated).
 * Safe to call any time; generated ones appear after the fetch resolves.
 */
function getAllPalettes() {
  return _allPalettes;
}