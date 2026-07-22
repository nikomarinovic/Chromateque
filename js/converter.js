(function initConverter() {
  const input = document.getElementById("converter-input");
  const picker = document.getElementById("converter-picker");
  const preview = document.getElementById("converter-preview");
  const errorHint = document.getElementById("converter-error");
  const rows = {
    hex: document.getElementById("row-hex"),
    rgb: document.getElementById("row-rgb"),
    hsl: document.getElementById("row-hsl"),
    hsv: document.getElementById("row-hsv"),
    cmyk: document.getElementById("row-cmyk"),
  };
  if (!input || !preview) return;

  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  function parseColor(raw) {
    const value = raw.trim();
    if (!value) return null;

    // HEX: #abc, #aabbcc
    let m = value.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (m) {
      let hex = m[1];
      if (hex.length === 3) {
        hex = hex.split("").map((c) => c + c).join("");
      }
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return { r, g, b };
    }

    // rgb(r, g, b) / r, g, b
    m = value.match(/rgba?\(?\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
    if (m) {
      return {
        r: clamp(Math.round(+m[1]), 0, 255),
        g: clamp(Math.round(+m[2]), 0, 255),
        b: clamp(Math.round(+m[3]), 0, 255),
      };
    }

    // hsl(h, s%, l%)
    m = value.match(/hsla?\(?\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?/i);
    if (m) {
      const { r, g, b } = hslToRgb(+m[1], +m[2], +m[3]);
      return { r, g, b };
    }

    // Bare triplet with no prefix, e.g. "59, 130, 246" or "217, 91%, 60%".
    // If the last two numbers carry a %, treat it as h, s%, l% (HSL);
    // otherwise treat it as plain r, g, b (RGB).
    m = value.match(/^([\d.]+)%?\s*,\s*([\d.]+)(%)?\s*,\s*([\d.]+)(%)?$/);
    if (m) {
      const hasPercent = Boolean(m[3] || m[5]);
      if (hasPercent) {
        const { r, g, b } = hslToRgb(+m[1], +m[2], +m[4]);
        return { r, g, b };
      }
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

  function rgbToHex(r, g, b) {
    return (
      "#" +
      [r, g, b]
        .map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0"))
        .join("")
    );
  }

  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
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

  function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    if (d !== 0) {
      switch (max) {
        case r: h = ((g - b) / d) % 6; break;
        case g: h = (b - r) / d + 2; break;
        default: h = (r - g) / d + 4;
      }
      h *= 60;
      if (h < 0) h += 360;
    }
    const s = max === 0 ? 0 : d / max;
    const v = max;
    return { h, s: s * 100, v: v * 100 };
  }

  function rgbToCmyk(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const k = 1 - Math.max(r, g, b);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    const c = (1 - r - k) / (1 - k);
    const m = (1 - g - k) / (1 - k);
    const y = (1 - b - k) / (1 - k);
    return { c: c * 100, m: m * 100, y: y * 100, k: k * 100 };
  }

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

  function setRow(row, label, value) {
    row.querySelector(".format-row-value").textContent = value;
    row.querySelector(".format-copy").onclick = (e) => copyValue(value, e.currentTarget);
  }

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
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

    preview.style.background = hex;
    if (picker) picker.value = hex;

    setRow(rows.hex, "HEX", hex);
    setRow(rows.rgb, "RGB", `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
    setRow(rows.hsl, "HSL", `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`);
    setRow(rows.hsv, "HSV", `hsv(${Math.round(hsv.h)}, ${Math.round(hsv.s)}%, ${Math.round(hsv.v)}%)`);
    setRow(
      rows.cmyk,
      "CMYK",
      `cmyk(${Math.round(cmyk.c)}%, ${Math.round(cmyk.m)}%, ${Math.round(cmyk.y)}%, ${Math.round(cmyk.k)}%)`
    );
  }

  input.addEventListener("input", render);
  if (picker) {
    picker.addEventListener("input", (e) => {
      input.value = e.target.value;
      render();
    });
  }
  render();
})();
