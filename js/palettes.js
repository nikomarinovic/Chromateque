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
  }
];

const swatchWeights = [2, 1.5, 1, 1, 1];

function paletteChip(hex, i) {
  return `<div style="background:${hex}; flex:${swatchWeights[i] || 1}"></div>`;
}

function paletteCard(palette) {
  return `
    <article class="palette" data-tags="${palette.tags.join(",")}">
      <div class="palette-swatches">
        ${palette.colors.map((hex, i) => paletteChip(hex, i)).join("")}
      </div>
      <div class="palette-meta">
        <h3>${palette.name}</h3>
        <div class="tags">${palette.tags.map((t) => `<span>${t}</span>`).join("")}</div>
      </div>
    </article>
  `;
}

function renderPaletteGrid(el, list) {
  if (!el) return;
  el.innerHTML = list.map(paletteCard).join("");
}