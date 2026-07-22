(function initTrending() {
  const codSwatch = document.getElementById("cod-swatch");
  const codName = document.getElementById("cod-name");
  const codHex = document.getElementById("cod-hex");
  const codCopy = document.getElementById("cod-copy");

  const podSwatches = document.getElementById("pod-swatches");
  const podName = document.getElementById("pod-name");
  const podCopy = document.getElementById("pod-copy");

  const trendingPaletteGrid = document.getElementById("trending-palette-grid");
  const trendingColorGrid = document.getElementById("trending-color-grid");

  if (typeof colors === "undefined" || typeof palettes === "undefined") return;

  // Deterministic "random" pick seeded by today's date, so everyone sees the
  // same Color/Palette of the Day and it changes once every 24h.
  function seededIndex(seed, max) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    return hash % max;
  }

  function seededShuffle(list, seed) {
    const arr = [...list];
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    for (let i = arr.length - 1; i > 0; i--) {
      h = (h * 1103515245 + 12345) >>> 0;
      const j = h % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function copyText(text, el, doneClass) {
    const cls = doneClass || "is-copied";
    const label = el.tagName === "BUTTON" ? null : el.querySelector("span");
    const done = () => {
      el.classList.add(cls);
      if (el.tagName === "BUTTON") {
        const original = el.textContent;
        el.textContent = "Copied!";
        setTimeout(() => {
          el.classList.remove(cls);
          el.textContent = original;
        }, 1200);
      } else if (label) {
        const original = label.textContent;
        label.textContent = "Copied!";
        setTimeout(() => {
          el.classList.remove(cls);
          label.textContent = original;
        }, 900);
      } else {
        setTimeout(() => el.classList.remove(cls), 900);
      }
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(done);
    } else {
      done();
    }
  }

  const todayKey = new Date().toISOString().slice(0, 10);

  // --- Color of the Day ---
  const colorOfDay = colors[seededIndex(todayKey + "color", colors.length)];
  if (codSwatch) codSwatch.style.background = colorOfDay.hex;
  if (codName) codName.textContent = colorOfDay.name;
  if (codHex) codHex.textContent = colorOfDay.hex;
  if (codCopy) {
    codCopy.addEventListener("click", () => copyText(colorOfDay.hex, codCopy));
  }

  // --- Palette of the Day ---
  const paletteOfDay = palettes[seededIndex(todayKey + "palette", palettes.length)];
  if (podSwatches) {
    podSwatches.innerHTML = paletteOfDay.colors
      .map((hex) => `<div style="background:${hex}"></div>`)
      .join("");
  }
  if (podName) podName.textContent = paletteOfDay.name;
  if (podCopy) {
    podCopy.addEventListener("click", () => {
      const css = `:root {\n${paletteOfDay.colors
        .map((hex, i) => `  --color-${i + 1}: ${hex};`)
        .join("\n")}\n}`;
      copyText(css, podCopy);
    });
  }

  // --- Trending palettes (rotates daily, reuses existing palette cards) ---
  if (trendingPaletteGrid && typeof renderPaletteGrid === "function") {
    const trendingPalettes = seededShuffle(palettes, todayKey + "trending-p").slice(0, 6);
    renderPaletteGrid(trendingPaletteGrid, trendingPalettes);
  }

  // --- Trending colors (rotates daily) ---
  if (trendingColorGrid) {
    const trendingColors = seededShuffle(colors, todayKey + "trending-c").slice(0, 12);
    trendingColorGrid.innerHTML = trendingColors
      .map(
        (c) => `
        <div class="chip" style="--c:${c.hex}" data-hex="${c.hex}" role="button" tabindex="0" aria-label="Copy ${c.name} ${c.hex}">
          <span>${c.name} · ${c.hex}</span>
        </div>`
      )
      .join("");
    Array.from(trendingColorGrid.querySelectorAll(".chip")).forEach((chip) => {
      const copy = () => copyText(chip.dataset.hex, chip);
      chip.addEventListener("click", copy);
      chip.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          copy();
        }
      });
    });
  }
})();
