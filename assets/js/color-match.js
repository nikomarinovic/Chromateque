(function initColorMatch() {
  const input = document.getElementById("cm-input");
  const picker = document.getElementById("cm-picker");
  const errorHint = document.getElementById("cm-error");
  const heroPreview = document.getElementById("cm-hero-preview");
  const heroChip = document.getElementById("cm-hero-chip");
  const contrastGrid = document.getElementById("cm-contrast-grid");
  const modeGrid = document.getElementById("cm-mode-grid");
  const ramp = document.getElementById("cm-ramp");
  const harmonyGrid = document.getElementById("cm-harmony-grid");
  const exportBtn = document.getElementById("cm-export");
  if (!input || !heroPreview) return;

  /* ---------- color math (same conventions as the converter tool) ---------- */
  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  function parseColor(raw) {
    const value = raw.trim();
    if (!value) return null;

    let m = value.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (m) {
      let hex = m[1];
      if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
      };
    }

    m = value.match(/rgba?\(?\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
    if (m) {
      return {
        r: clamp(Math.round(+m[1]), 0, 255),
        g: clamp(Math.round(+m[2]), 0, 255),
        b: clamp(Math.round(+m[3]), 0, 255),
      };
    }

    m = value.match(/hsla?\(?\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?/i);
    if (m) return hslToRgb(+m[1], +m[2], +m[3]);

    m = value.match(/^([\d.]+)%?\s*,\s*([\d.]+)(%)?\s*,\s*([\d.]+)(%)?$/);
    if (m) {
      const hasPercent = Boolean(m[3] || m[5]);
      if (hasPercent) return hslToRgb(+m[1], +m[2], +m[4]);
      return {
        r: clamp(Math.round(+m[1]), 0, 255),
        g: clamp(Math.round(+m[2]), 0, 255),
        b: clamp(Math.round(+m[4]), 0, 255),
      };
    }
    return null;
  }

  function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360;
    s = clamp(s, 0, 100) / 100;
    l = clamp(l, 0, 100) / 100;
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
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    const d = max - min;
    if (d !== 0) {
      s = d / (1 - Math.abs(2 * l - 1));
      switch (max) {
        case r: h = ((g - b) / d) % 6; break;
        case g: h = (b - r) / d + 2; break;
        default: h = (r - g) / d + 4;
      }
      h *= 60;
      if (h < 0) h += 360;
    }
    return { h, s: s * 100, l: l * 100 };
  }

  function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0")).join("");
  }

  function relLuminance({ r, g, b }) {
    const srgb = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  }

  function contrastRatio(rgbA, rgbB) {
    const L1 = relLuminance(rgbA), L2 = relLuminance(rgbB);
    const lighter = Math.max(L1, L2), darker = Math.min(L1, L2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  function badgeFor(ratio) {
    if (ratio >= 7) return { label: "AAA", cls: "cm-badge--pass" };
    if (ratio >= 4.5) return { label: "AA", cls: "cm-badge--pass" };
    if (ratio >= 3) return { label: "AA Large", cls: "cm-badge--warn" };
    return { label: "Fail", cls: "cm-badge--fail" };
  }

  /* ---------- copy helper (matches the check-morph pattern used elsewhere) ---------- */
  function copyValue(text, btn) {
    const done = () => {
      btn.classList.add("is-copied");
      setTimeout(() => btn.classList.remove("is-copied"), 900);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(done);
    } else {
      done();
    }
  }

  function copyIconSVG() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
  }

  function makeCopyBtn(getText, label) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cm-copy";
    btn.setAttribute("aria-label", label || "Copy value");
    btn.innerHTML = copyIconSVG();
    btn.addEventListener("click", () => copyValue(getText(), btn));
    return btn;
  }

  /* ---------- section renderers ---------- */
  function renderContrast(rgb) {
    contrastGrid.innerHTML = "";
    const options = [
      { name: "Black text", hex: "#000000", rgb: { r: 0, g: 0, b: 0 } },
      { name: "White text", hex: "#ffffff", rgb: { r: 255, g: 255, b: 255 } },
    ];
    const ratios = options.map((o) => contrastRatio(rgb, o.rgb));
    const bestIdx = ratios[0] >= ratios[1] ? 0 : 1;

    options.forEach((opt, i) => {
      const ratio = ratios[i];
      const badge = badgeFor(ratio);
      const card = document.createElement("div");
      card.className = "cm-contrast-card";
      card.style.background = rgbToHex(rgb.r, rgb.g, rgb.b);

      const sample = document.createElement("div");
      sample.className = "cm-contrast-sample";
      sample.style.color = opt.hex;
      sample.textContent = "Aa";
      card.appendChild(sample);

      const meta = document.createElement("div");
      meta.className = "cm-contrast-meta";
      meta.style.color = opt.hex;

      const top = document.createElement("div");
      top.className = "cm-contrast-top";
      const nameEl = document.createElement("span");
      nameEl.className = "cm-contrast-name";
      nameEl.textContent = opt.name;
      top.appendChild(nameEl);
      if (i === bestIdx) {
        const tag = document.createElement("span");
        tag.className = "cm-tag";
        tag.style.color = opt.hex;
        tag.textContent = "Best";
        top.appendChild(tag);
      }
      meta.appendChild(top);

      const ratioRow = document.createElement("div");
      ratioRow.className = "cm-contrast-ratio-row";
      const ratioEl = document.createElement("span");
      ratioEl.className = "cm-contrast-ratio";
      ratioEl.textContent = ratio.toFixed(2) + " : 1";
      const badgeEl = document.createElement("span");
      badgeEl.className = "cm-badge " + badge.cls;
      badgeEl.textContent = badge.label;
      ratioRow.appendChild(ratioEl);
      ratioRow.appendChild(badgeEl);
      meta.appendChild(ratioRow);

      card.appendChild(meta);
      card.appendChild(makeCopyBtn(() => opt.hex, "Copy " + opt.name));
      contrastGrid.appendChild(card);
    });
  }

  function renderModes(hsl) {
    modeGrid.innerHTML = "";

    const lightHsl = { h: hsl.h, s: clamp(hsl.s, 45, 90), l: clamp(hsl.l, 28, 50) };
    const darkHsl = { h: hsl.h, s: clamp(hsl.s, 40, 85), l: clamp(hsl.l, 58, 78) };

    const modes = [
      {
        label: "For light UI",
        note: "Deepened so it still reads clearly on white.",
        surface: "#ffffff",
        text: "#18181b",
        hsl: lightHsl,
      },
      {
        label: "For dark UI",
        note: "Lightened so it doesn't wash out on black.",
        surface: "#101012",
        text: "#f4f4f5",
        hsl: darkHsl,
      },
    ];

    modes.forEach((mode) => {
      const rgb = hslToRgb(mode.hsl.h, mode.hsl.s, mode.hsl.l);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

      const card = document.createElement("div");
      card.className = "cm-mode-card";
      card.style.background = mode.surface;
      card.style.color = mode.text;

      const swatch = document.createElement("div");
      swatch.className = "cm-mode-swatch";
      swatch.style.background = hex;
      card.appendChild(swatch);

      const meta = document.createElement("div");
      meta.className = "cm-mode-meta";

      const label = document.createElement("div");
      label.className = "cm-mode-label";
      label.textContent = mode.label;
      meta.appendChild(label);

      const hexRow = document.createElement("div");
      hexRow.className = "cm-mode-hex-row";
      const hexEl = document.createElement("span");
      hexEl.className = "cm-mode-hex";
      hexEl.textContent = hex.toUpperCase();
      hexRow.appendChild(hexEl);
      hexRow.appendChild(makeCopyBtn(() => hex, "Copy " + mode.label));
      meta.appendChild(hexRow);

      const note = document.createElement("p");
      note.className = "cm-mode-note";
      note.textContent = mode.note;
      meta.appendChild(note);

      card.appendChild(meta);
      modeGrid.appendChild(card);
    });

    return { lightHex: rgbToHex(...Object.values(hslToRgb(lightHsl.h, lightHsl.s, lightHsl.l))), darkHex: rgbToHex(...Object.values(hslToRgb(darkHsl.h, darkHsl.s, darkHsl.l))) };
  }

  const RAMP_STEPS = [
    { step: 50, l: 96 },
    { step: 100, l: 90 },
    { step: 200, l: 80 },
    { step: 300, l: 68 },
    { step: 400, l: 58 },
    { step: 500, l: 48 },
    { step: 600, l: 40 },
    { step: 700, l: 32 },
    { step: 800, l: 22 },
    { step: 900, l: 13 },
  ];

  function renderRamp(hsl) {
    ramp.innerHTML = "";
    const hexList = [];
    RAMP_STEPS.forEach(({ step, l }) => {
      const s = clamp(hsl.s, 12, 92);
      const rgb = hslToRgb(hsl.h, s, l);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      hexList.push({ step, hex });

      const sw = document.createElement("button");
      sw.type = "button";
      sw.className = "cm-ramp-swatch";
      sw.style.background = hex;
      sw.style.color = l > 55 ? "#18181b" : "#fff";
      sw.setAttribute("aria-label", `Copy ${step}: ${hex}`);
      sw.innerHTML = `<span class="cm-ramp-step">${step}</span><span class="cm-ramp-hex">${hex.toUpperCase()}</span>`;
      sw.addEventListener("click", () => copyValue(hex, sw));
      ramp.appendChild(sw);
    });
    return hexList;
  }

  function renderHarmony(hsl) {
    harmonyGrid.innerHTML = "";
    const companions = [
      { label: "Complementary", dh: 180 },
      { label: "Analogous +", dh: 30 },
      { label: "Analogous −", dh: -30 },
      { label: "Triadic +", dh: 120 },
      { label: "Triadic −", dh: -120 },
    ];
    const hexList = [];
    companions.forEach(({ label, dh }) => {
      const rgb = hslToRgb(hsl.h + dh, hsl.s, hsl.l);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      hexList.push({ label, hex });

      const sw = document.createElement("button");
      sw.type = "button";
      sw.className = "cm-harmony-swatch";
      sw.style.background = hex;
      sw.setAttribute("aria-label", `Copy ${label}: ${hex}`);
      sw.innerHTML = `<span class="cm-harmony-label">${label}</span><span class="cm-harmony-hex">${hex.toUpperCase()}</span>`;
      sw.addEventListener("click", () => copyValue(hex, sw));
      harmonyGrid.appendChild(sw);
    });
    return hexList;
  }

  /* ---------- main render ---------- */
  let lastResult = null;

  function render() {
    const rgb = parseColor(input.value);
    if (!rgb) {
      if (errorHint) {
        errorHint.textContent = input.value.trim()
          ? "Couldn't parse that — try a hex (#3b82f6), rgb(59,130,246) or hsl(217,91%,60%)."
          : "";
      }
      input.classList.toggle("is-invalid", Boolean(input.value.trim()));
      return;
    }
    input.classList.remove("is-invalid");
    if (errorHint) errorHint.textContent = "";

    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    heroPreview.style.background = hex;
    if (heroChip) heroChip.textContent = hex.toUpperCase();
    if (picker) picker.value = hex;
    document.documentElement.style.setProperty("--cm-accent", hex);

    renderContrast(rgb);
    const modes = renderModes(hsl);
    const rampList = renderRamp(hsl);
    const harmonyList = renderHarmony(hsl);

    lastResult = { hex, modes, rampList, harmonyList };
  }

  input.addEventListener("input", render);
  if (picker) {
    picker.addEventListener("input", (e) => {
      input.value = e.target.value;
      render();
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      if (!lastResult) return;
      const lines = [":root {", `  --color-base: ${lastResult.hex.toUpperCase()};`];
      lines.push(`  --color-light-ui: ${lastResult.modes.lightHex.toUpperCase()};`);
      lines.push(`  --color-dark-ui: ${lastResult.modes.darkHex.toUpperCase()};`);
      lastResult.rampList.forEach(({ step, hex }) => lines.push(`  --color-${step}: ${hex.toUpperCase()};`));
      lastResult.harmonyList.forEach(({ label, hex }) =>
        lines.push(`  --color-${label.toLowerCase().replace(/[^a-z]+/g, "-").replace(/-$/, "")}: ${hex.toUpperCase()};`)
      );
      lines.push("}");
      const text = lines.join("\n");
      const original = exportBtn.textContent;
      const done = () => {
        exportBtn.textContent = "Copied";
        setTimeout(() => (exportBtn.textContent = original), 1100);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(done);
      } else {
        done();
      }
    });
  }

  render();
})();