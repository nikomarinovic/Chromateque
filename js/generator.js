function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = Math.min(100, Math.max(0, s)) / 100;
  l = Math.min(100, Math.max(0, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const toHex = (v) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

const schemes = {
  analogous(baseHue) {
    const offsets = [-30, -15, 0, 15, 30];
    return offsets.map((o, i) => ({
      hex: hslToHex(baseHue + o, 62 + i * 3, 40 + i * 8),
      hue: baseHue + o
    }));
  },
  complementary(baseHue) {
    const hues = [baseHue, baseHue, baseHue + 180, baseHue + 180, baseHue];
    const light = [30, 48, 55, 70, 88];
    return hues.map((h, i) => ({ hex: hslToHex(h, 65, light[i]), hue: h }));
  },
  triadic(baseHue) {
    const hues = [baseHue, baseHue + 120, baseHue + 120, baseHue + 240, baseHue + 240];
    const light = [35, 45, 62, 55, 80];
    return hues.map((h, i) => ({ hex: hslToHex(h, 60, light[i]), hue: h }));
  },
  monochrome(baseHue) {
    const light = [18, 34, 50, 70, 90];
    return light.map((l) => ({ hex: hslToHex(baseHue, 45, l), hue: baseHue }));
  }
};

function randomScheme() {
  const keys = Object.keys(schemes);
  return keys[Math.floor(Math.random() * keys.length)];
}

function generatePalette(mode) {
  const baseHue = Math.floor(Math.random() * 360);
  const key = mode === "random" ? randomScheme() : mode;
  const fn = schemes[key] || schemes.analogous;
  return { key, swatches: fn(baseHue) };
}

(function initGenerator() {
  const grid = document.getElementById("generator-palette");
  const btn = document.getElementById("gen-btn");
  const select = document.getElementById("gen-mode");
  const modeLabel = document.getElementById("gen-mode-label");
  const copyBtn = document.getElementById("gen-copy");
  const formatSelect = document.getElementById("gen-format");
  if (!grid || !btn) return;

  let currentSwatches = [];

  function copySwatch(hex, el) {
    const finish = () => {
      el.classList.add("is-copied");
      const label = el.querySelector(".gen-hex");
      const original = label.textContent;
      label.textContent = "Copied!";
      setTimeout(() => {
        el.classList.remove("is-copied");
        label.textContent = original;
      }, 900);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(hex).then(finish).catch(finish);
    } else {
      finish();
    }
  }

  function formatPalette(hexes, format) {
    switch (format) {
      case "css":
        return `:root {\n${hexes
          .map((hex, i) => `  --color-${i + 1}: ${hex};`)
          .join("\n")}\n}`;
      case "tailwind":
        return `colors: {\n${hexes
          .map((hex, i) => `  chroma${i + 1}: "${hex}",`)
          .join("\n")}\n}`;
      case "json":
        return JSON.stringify(hexes, null, 2);
      case "hex":
      default:
        return hexes.join(", ");
    }
  }

  function copyPalette() {
    if (!currentSwatches.length || !copyBtn) return;
    const format = formatSelect ? formatSelect.value : "hex";
    const text = formatPalette(
      currentSwatches.map((s) => s.hex),
      format
    );
    const finish = () => {
      const original = copyBtn.textContent;
      copyBtn.textContent = "Copied!";
      setTimeout(() => {
        copyBtn.textContent = original;
      }, 1200);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(finish).catch(finish);
    } else {
      finish();
    }
  }

  function render() {
    const mode = select ? select.value : "random";
    const { key, swatches } = generatePalette(mode);
    currentSwatches = swatches;

    grid.innerHTML = swatches
      .map(
        (s) => `
        <div class="gen-swatch" style="background:${s.hex}" data-hex="${s.hex}" role="button" tabindex="0" aria-label="Copy ${s.hex}">
          <span class="gen-hex">${s.hex}</span>
        </div>
      `
      )
      .join("");

    if (modeLabel) {
      modeLabel.textContent = key.charAt(0).toUpperCase() + key.slice(1);
    }

    Array.from(grid.querySelectorAll(".gen-swatch")).forEach((el) => {
      el.addEventListener("click", () => copySwatch(el.dataset.hex, el));
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          copySwatch(el.dataset.hex, el);
        }
      });
    });
  }

  btn.addEventListener("click", render);
  if (select) select.addEventListener("change", render);
  if (copyBtn) copyBtn.addEventListener("click", copyPalette);

  document.addEventListener("keydown", (e) => {
    const tag = (e.target && e.target.tagName) || "";
    if (e.code === "Space" && tag !== "SELECT" && tag !== "INPUT" && tag !== "BUTTON") {
      const generatorSection = document.getElementById("generator");
      if (!generatorSection) return;
      const rect = generatorSection.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        e.preventDefault();
        render();
      }
    }
  });

  render();
})();