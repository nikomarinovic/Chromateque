const colors = [
  { name: "Paper White", hex: "#f8fafc", category: "Neutrals" },
  { name: "Snow", hex: "#f1f5f9", category: "Neutrals" },
  { name: "Bone", hex: "#f4f4f5", category: "Neutrals" },
  { name: "Oyster", hex: "#e7e5e4", category: "Neutrals" },
  { name: "Fog", hex: "#d9dadd", category: "Neutrals" },
  { name: "Mist", hex: "#cbd5e1", category: "Neutrals" },
  { name: "Dove", hex: "#c4c4cb", category: "Neutrals" },
  { name: "Pearl", hex: "#bcc3c8", category: "Neutrals" },
  { name: "Cloud", hex: "#e2e8f0", category: "Neutrals" },
  { name: "Ash", hex: "#94a3b8", category: "Neutrals" },
  { name: "Haze", hex: "#cbd5e1", category: "Neutrals" },
  { name: "Flint", hex: "#9ca3af", category: "Neutrals" },
  { name: "Stone", hex: "#6b7280", category: "Neutrals" },
  { name: "Slate 500", hex: "#64748b", category: "Neutrals" },
  { name: "Slate 700", hex: "#334155", category: "Neutrals" },
  { name: "Slate 900", hex: "#0f172a", category: "Neutrals" },
  { name: "Charcoal", hex: "#18181b", category: "Neutrals" },
  { name: "Ink", hex: "#090909", category: "Neutrals" },
  { name: "Concrete", hex: "#a8a29e", category: "Neutrals" },
  { name: "Putty", hex: "#d6d3d1", category: "Neutrals" },
  { name: "Graphite", hex: "#27272a", category: "Neutrals" },
  { name: "Driftwood", hex: "#8a8378", category: "Neutrals" },
  { name: "Chalk", hex: "#eeeeef", category: "Neutrals" },
  { name: "Onyx", hex: "#101014", category: "Neutrals" },

  { name: "Pale Sky", hex: "#dbeafe", category: "Blue" },
  { name: "Ice", hex: "#bfdbfe", category: "Blue" },
  { name: "Cornflower", hex: "#93c5fd", category: "Blue" },
  { name: "Azure", hex: "#38bdf8", category: "Blue" },
  { name: "Sky", hex: "#0ea5e9", category: "Blue" },
  { name: "Water", hex: "#3b82f6", category: "Blue" },
  { name: "Lake", hex: "#2563eb", category: "Blue" },
  { name: "Ocean", hex: "#1d4ed8", category: "Blue" },
  { name: "Sapphire", hex: "#0c4a6e", category: "Blue" },
  { name: "Royal", hex: "#4338ca", category: "Blue" },
  { name: "Indigo", hex: "#6366f1", category: "Blue" },
  { name: "Cobalt", hex: "#1e40af", category: "Blue" },
  { name: "Navy", hex: "#0b3d91", category: "Blue" },
  { name: "Midnight", hex: "#0f172a", category: "Blue" },
  { name: "Denim", hex: "#3c5a86", category: "Blue" },
  { name: "Steel", hex: "#4a6fa5", category: "Blue" },
  { name: "Periwinkle", hex: "#8ea9ee", category: "Blue" },
  { name: "Bluebell", hex: "#5b7fd4", category: "Blue" },

  { name: "Azure Mist", hex: "#e0f2fe", category: "Cyan" },
  { name: "Skyline", hex: "#bae6fd", category: "Cyan" },
  { name: "Aqua", hex: "#22d3ee", category: "Cyan" },
  { name: "Iceberg", hex: "#dbeafe", category: "Cyan" },
  { name: "Bubbles", hex: "#a5f3fc", category: "Cyan" },
  { name: "Sea Glass", hex: "#5eead4", category: "Cyan" },
  { name: "Turquoise", hex: "#2dd4bf", category: "Cyan" },
  { name: "Lagoon", hex: "#0f766e", category: "Cyan" },
  { name: "Harbor", hex: "#0d9488", category: "Cyan" },
  { name: "Glacier", hex: "#bfdbfe", category: "Cyan" },
  { name: "Polar", hex: "#ccfbf1", category: "Cyan" },
  { name: "Neon Aqua", hex: "#4ade80", category: "Cyan" },
  { name: "Tidepool", hex: "#0891b2", category: "Cyan" },
  { name: "Cerulean", hex: "#0ea5c4", category: "Cyan" },
  { name: "Teal Reef", hex: "#115e59", category: "Cyan" },

  { name: "Mint", hex: "#6ee7b7", category: "Green" },
  { name: "Aloe", hex: "#4ade80", category: "Green" },
  { name: "Seafoam", hex: "#86efac", category: "Green" },
  { name: "Chartreuse", hex: "#a3e635", category: "Green" },
  { name: "Lime", hex: "#84cc16", category: "Green" },
  { name: "Meadow", hex: "#22c55e", category: "Green" },
  { name: "Sage", hex: "#65a30d", category: "Green" },
  { name: "Olive", hex: "#a3b18a", category: "Green" },
  { name: "Fern", hex: "#4d7c0f", category: "Green" },
  { name: "Moss", hex: "#365314", category: "Green" },
  { name: "Basil", hex: "#166534", category: "Green" },
  { name: "Pine", hex: "#0f5132", category: "Green" },
  { name: "Evergreen", hex: "#054f31", category: "Green" },
  { name: "Jade", hex: "#059669", category: "Green" },
  { name: "Bamboo", hex: "#4d7c0f", category: "Green" },
  { name: "Clover", hex: "#3f9142", category: "Green" },
  { name: "Kelp", hex: "#1f4d2c", category: "Green" },
  { name: "Pistachio", hex: "#9cd68a", category: "Green" },

  { name: "Lemon", hex: "#fde68a", category: "Yellow" },
  { name: "Butter", hex: "#fef08a", category: "Yellow" },
  { name: "Daffodil", hex: "#facc15", category: "Yellow" },
  { name: "Sunbeam", hex: "#fbbf24", category: "Yellow" },
  { name: "Gold", hex: "#f59e0b", category: "Yellow" },
  { name: "Marigold", hex: "#fcbf49", category: "Yellow" },
  { name: "Honey", hex: "#fcd34d", category: "Yellow" },
  { name: "Citrine", hex: "#eab308", category: "Yellow" },
  { name: "Flax", hex: "#f3de8a", category: "Yellow" },
  { name: "Candle", hex: "#f5d76e", category: "Yellow" },
  { name: "Mustard", hex: "#cf9d0d", category: "Yellow" },
  { name: "Wheat", hex: "#f0dfa1", category: "Yellow" },
  { name: "Brass", hex: "#b8860b", category: "Yellow" },

  { name: "Apricot", hex: "#fb923c", category: "Orange" },
  { name: "Peach", hex: "#fdba74", category: "Orange" },
  { name: "Amber", hex: "#f59e0b", category: "Orange" },
  { name: "Tangerine", hex: "#fb923c", category: "Orange" },
  { name: "Carrot", hex: "#f97316", category: "Orange" },
  { name: "Pumpkin", hex: "#ea580c", category: "Orange" },
  { name: "Copper", hex: "#dd6b20", category: "Orange" },
  { name: "Persimmon", hex: "#fb5607", category: "Orange" },
  { name: "Mango", hex: "#f97316", category: "Orange" },
  { name: "Spice", hex: "#d97706", category: "Orange" },
  { name: "Sunset", hex: "#fb923c", category: "Orange" },
  { name: "Ginger", hex: "#ea580c", category: "Orange" },
  { name: "Terracotta", hex: "#c2603f", category: "Orange" },
  { name: "Clay", hex: "#b5651d", category: "Orange" },

  { name: "Blush", hex: "#fda4af", category: "Red" },
  { name: "Cherry", hex: "#ef4444", category: "Red" },
  { name: "Rose", hex: "#f43f5e", category: "Red" },
  { name: "Ruby", hex: "#b91c1c", category: "Red" },
  { name: "Crimson", hex: "#dc2626", category: "Red" },
  { name: "Scarlet", hex: "#e11d48", category: "Red" },
  { name: "Fire", hex: "#fb4a3d", category: "Red" },
  { name: "Brick", hex: "#991b1b", category: "Red" },
  { name: "Merlot", hex: "#7f1d1d", category: "Red" },
  { name: "Wine", hex: "#6b0f1a", category: "Red" },
  { name: "Burgundy", hex: "#581c1c", category: "Red" },
  { name: "Pomegranate", hex: "#9d174d", category: "Red" },
  { name: "Cardinal", hex: "#b91c1c", category: "Red" },
  { name: "Candy Apple", hex: "#ff0000", category: "Red" },
  { name: "Rust", hex: "#a3402b", category: "Red" },
  { name: "Garnet", hex: "#79242f", category: "Red" },

  { name: "Petal", hex: "#f9a8d4", category: "Pink" },
  { name: "Bubblegum", hex: "#fb7185", category: "Pink" },
  { name: "Flamingo", hex: "#f472b6", category: "Pink" },
  { name: "Magenta", hex: "#d946ef", category: "Pink" },
  { name: "Fuchsia", hex: "#ec4899", category: "Pink" },
  { name: "Candy", hex: "#fbcfe8", category: "Pink" },
  { name: "Cotton Candy", hex: "#f5d0fe", category: "Pink" },
  { name: "Powder Pink", hex: "#fce7f3", category: "Pink" },
  { name: "Rosewater", hex: "#ffe4e6", category: "Pink" },
  { name: "Cherry Blossom", hex: "#ffb7c5", category: "Pink" },
  { name: "Sunrise", hex: "#fca5a5", category: "Pink" },
  { name: "Coral", hex: "#fb7185", category: "Pink" },
  { name: "Watermelon", hex: "#ff6f91", category: "Pink" },
  { name: "Peony", hex: "#e85d9a", category: "Pink" },

  { name: "Lavender", hex: "#c4b5fd", category: "Purple" },
  { name: "Lilac", hex: "#c084fc", category: "Purple" },
  { name: "Orchid", hex: "#a855f7", category: "Purple" },
  { name: "Violet", hex: "#8b5cf6", category: "Purple" },
  { name: "Plum", hex: "#7c3aed", category: "Purple" },
  { name: "Amethyst", hex: "#a14ef0", category: "Purple" },
  { name: "Grape", hex: "#6d28d9", category: "Purple" },
  { name: "Eggplant", hex: "#5b21b6", category: "Purple" },
  { name: "Aubergine", hex: "#4c1d95", category: "Purple" },
  { name: "Wisteria", hex: "#a78bfa", category: "Purple" },
  { name: "Iris", hex: "#6366f1", category: "Purple" },
  { name: "Twilight", hex: "#7c3aed", category: "Purple" },
  { name: "Mulberry", hex: "#6a2c70", category: "Purple" },
  { name: "Heliotrope", hex: "#b565d8", category: "Purple" },

  { name: "Neon Pink", hex: "#ff00e5", category: "Cyberpunk" },
  { name: "Neon Purple", hex: "#a855f7", category: "Cyberpunk" },
  { name: "Neon Blue", hex: "#0ea5e9", category: "Cyberpunk" },
  { name: "Neon Green", hex: "#22c55e", category: "Cyberpunk" },
  { name: "Laser Yellow", hex: "#facc15", category: "Cyberpunk" },
  { name: "Electric Cyan", hex: "#06b6d4", category: "Cyberpunk" },
  { name: "Photon", hex: "#22d3ee", category: "Cyberpunk" },
  { name: "Plasma", hex: "#fb7185", category: "Cyberpunk" },
  { name: "Glitch", hex: "#d946ef", category: "Cyberpunk" },
  { name: "Circuit", hex: "#7c3aed", category: "Cyberpunk" },
  { name: "Synthwave", hex: "#ff2a6d", category: "Cyberpunk" },
  { name: "Nightdrive", hex: "#05d9e8", category: "Cyberpunk" },
  { name: "Hologram", hex: "#9d4edd", category: "Cyberpunk" },

  { name: "Pastel Pink", hex: "#fbcfe8", category: "Pastel" },
  { name: "Pastel Blue", hex: "#bfdbfe", category: "Pastel" },
  { name: "Pastel Mint", hex: "#d9f99d", category: "Pastel" },
  { name: "Pastel Peach", hex: "#fed7aa", category: "Pastel" },
  { name: "Pastel Lavender", hex: "#ddd6fe", category: "Pastel" },
  { name: "Pastel Lemon", hex: "#fef9c3", category: "Pastel" },
  { name: "Pastel Sky", hex: "#bae6fd", category: "Pastel" },
  { name: "Pastel Lilac", hex: "#e9d5ff", category: "Pastel" },
  { name: "Pastel Coral", hex: "#fed7d7", category: "Pastel" },
  { name: "Pastel Aqua", hex: "#cfe8ff", category: "Pastel" },
  { name: "Pastel Sage", hex: "#dcfce7", category: "Pastel" },
  { name: "Pastel Rose", hex: "#ffe4e6", category: "Pastel" },
  { name: "Pastel Butter", hex: "#fff3c4", category: "Pastel" },
  { name: "Pastel Periwinkle", hex: "#dbe4ff", category: "Pastel" }
];

const previewCount = 12;
const pageMode = document.body.dataset.mode || "preview";
const colorGrid = document.getElementById("color-grid");
const toggleLink = document.getElementById("toggle-colors");
const colorCount = document.getElementById("color-count");
const tabs = Array.from(document.querySelectorAll("[data-color-tabs] .tab"));
const searchInput = document.getElementById("color-search");

let activeCategory = "All";
let searchQuery = "";
let showAll = pageMode === "archive";

// The array above is just a small curated preview set. The real archive
// (colors/<category>.json, grown by generate_colors.py) can hold thousands
// of colors per category, so the "of X colors" count should reflect that
// real total rather than this file's length. We fetch it once and re-render.
let archiveCounts = null; // { "Red": 15400, "Blue": 400, ... } from colors/manifest.json

fetch("colors/manifest.json")
  .then((res) => (res.ok ? res.json() : null))
  .then((data) => {
    if (data && typeof data === "object") {
      archiveCounts = data;
      renderColors();
    }
  })
  .catch(() => {
    // no manifest available (e.g. opened via file://, or folder not generated
    // yet) -- silently fall back to counting this file's own array below.
  });

function archiveTotalFor(category) {
  if (!archiveCounts) return null;
  if (category === "All") {
    return Object.values(archiveCounts).reduce((sum, n) => sum + n, 0);
  }
  return archiveCounts[category] ?? null;
}

function getFilteredColors() {
  let list =
    activeCategory === "All"
      ? colors
      : colors.filter((color) => color.category === activeCategory);

  if (searchQuery) {
    const q = searchQuery.toLowerCase().replace(/^#/, "");
    list = list.filter(
      (color) =>
        color.name.toLowerCase().includes(q) ||
        color.hex.toLowerCase().replace("#", "").includes(q)
    );
  }

  return list;
}

function copyHex(hex, chip) {
  const done = () => {
    chip.classList.add("is-copied");
    const label = chip.querySelector("span");
    const original = label.textContent;
    label.textContent = "Copied!";
    setTimeout(() => {
      chip.classList.remove("is-copied");
      label.textContent = original;
    }, 900);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(hex).then(done).catch(done);
  } else {
    done();
  }
}

function renderColors() {
  if (!colorGrid) return;
  const filtered = getFilteredColors();
  const effectiveShowAll = showAll || Boolean(searchQuery);
  const colorsToRender = effectiveShowAll
    ? filtered
    : filtered.slice(0, previewCount);

  if (colorsToRender.length === 0) {
    colorGrid.innerHTML = `<p class="empty-state">No colors match “${searchQuery}”. Try a different name or hex.</p>`;
  } else {
    colorGrid.innerHTML = colorsToRender
      .map(
        (color) => `
      <div class="chip" style="--c: ${color.hex}" data-category="${color.category}" data-hex="${color.hex}" role="button" tabindex="0" aria-label="Copy ${color.name} ${color.hex}">
        <span>${color.name} · ${color.hex}</span>
      </div>
    `
      )
      .join("");

    Array.from(colorGrid.querySelectorAll(".chip")).forEach((chip) => {
      chip.addEventListener("click", () => copyHex(chip.dataset.hex, chip));
      chip.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          copyHex(chip.dataset.hex, chip);
        }
      });
    });
  }

  if (colorCount) {
    // When we know the real archive count for this category (from
    // colors/manifest.json), show that as the "of X" total instead of the
    // length of this page's small preview array -- unless the person is
    // searching, since search only searches within the preview set here.
    const realTotal = searchQuery ? null : archiveTotalFor(activeCategory);
    const displayTotal = realTotal !== null ? realTotal : filtered.length;
    const shown = effectiveShowAll
      ? filtered.length
      : Math.min(previewCount, filtered.length);
    colorCount.textContent = `Showing ${shown.toLocaleString()} of ${displayTotal.toLocaleString()} colors`;
  }

  if (toggleLink && pageMode === "archive") {
    toggleLink.textContent = showAll ? "View fewer colors →" : "View all colors →";
  }
}

function setActiveTab(tab) {
  tabs.forEach((button) => button.classList.toggle("is-active", button === tab));
  activeCategory = tab.textContent.trim();
  showAll = pageMode === "archive";
  renderColors();
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => setActiveTab(tab));
});

if (searchInput) {
  searchInput.addEventListener("input", (event) => {
    searchQuery = event.target.value.trim();
    renderColors();
  });
}

if (toggleLink && pageMode === "archive") {
  toggleLink.addEventListener("click", (event) => {
    event.preventDefault();
    showAll = !showAll;
    renderColors();
  });
}

renderColors();