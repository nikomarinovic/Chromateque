(function initImageColors() {
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("image-input");
  const resultsWrap = document.getElementById("image-results");
  const canvas = document.getElementById("image-canvas");
  const extractedGrid = document.getElementById("extracted-grid");
  const swatchCountInput = document.getElementById("swatch-count");
  const statusEl = document.getElementById("image-status");
  const hoverLabel = document.getElementById("pixel-hover-label");
  const pickedGrid = document.getElementById("picked-grid");
  const pickedEmpty = document.getElementById("picked-empty");
  if (!dropzone || !fileInput || !canvas) return;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  let currentImage = null;
  let fullImageData = null; // cached pixel data of the canvas for fast picking
  let pickedColors = [];

  function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
  }

  function clampSwatchCount() {
    if (!swatchCountInput) return 8;
    let n = parseInt(swatchCountInput.value, 10);
    if (Number.isNaN(n)) n = 8;
    n = Math.max(3, Math.min(32, n));
    swatchCountInput.value = n;
    return n;
  }

  // Simple, fast dominant-color extraction: bucket pixels into coarse RGB
  // bins, count frequency per bin, then return the average color of the
  // most frequent bins. Runs on the already-drawn canvas, so no extra
  // downscale pass is needed.
  function extractPalette(count) {
    if (!fullImageData) return null;
    const data = fullImageData.data;
    const buckets = new Map();
    const BIN = 24; // bucket size per channel

    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a < 128) continue; // skip transparent pixels
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const key =
        Math.floor(r / BIN) * 10000 + Math.floor(g / BIN) * 100 + Math.floor(b / BIN);
      let bucket = buckets.get(key);
      if (!bucket) {
        bucket = { r: 0, g: 0, b: 0, n: 0 };
        buckets.set(key, bucket);
      }
      bucket.r += r;
      bucket.g += g;
      bucket.b += b;
      bucket.n += 1;
    }

    const sorted = Array.from(buckets.values()).sort((a, b) => b.n - a.n);
    const total = sorted.reduce((sum, b) => sum + b.n, 0) || 1;
    const capped = Math.min(count, sorted.length);

    return sorted.slice(0, capped).map((b) => ({
      hex: rgbToHex(Math.round(b.r / b.n), Math.round(b.g / b.n), Math.round(b.b / b.n)),
      share: b.n / total,
    }));
  }

  function copyHex(hex, el) {
    const done = () => {
      el.classList.add("is-copied");
      setTimeout(() => el.classList.remove("is-copied"), 900);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(hex).then(done).catch(done);
    } else {
      done();
    }
  }

  function makeSwatch(hex, { removable } = {}) {
    const el = document.createElement("div");
    el.className = "extracted-swatch";
    el.style.background = hex;
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.setAttribute("aria-label", `Copy ${hex}`);
    el.innerHTML = `<span>${hex}</span>`;
    el.addEventListener("click", () => copyHex(hex, el));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        copyHex(hex, el);
      }
    });
    if (removable) {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "extracted-swatch-remove";
      remove.setAttribute("aria-label", `Remove ${hex}`);
      remove.innerHTML = "×";
      remove.addEventListener("click", (e) => {
        e.stopPropagation();
        pickedColors = pickedColors.filter((c) => c !== hex);
        renderPicked();
      });
      el.appendChild(remove);
    }
    return el;
  }

  function renderPalette(colors) {
    extractedGrid.innerHTML = "";
    colors.forEach((c) => extractedGrid.appendChild(makeSwatch(c.hex)));
  }

  function renderPicked() {
    if (!pickedGrid) return;
    pickedGrid.innerHTML = "";
    if (pickedColors.length === 0) {
      if (pickedEmpty) pickedEmpty.style.display = "block";
      return;
    }
    if (pickedEmpty) pickedEmpty.style.display = "none";
    pickedColors.forEach((hex) => pickedGrid.appendChild(makeSwatch(hex, { removable: true })));
  }

  function runExtraction() {
    if (!currentImage) return;
    if (statusEl) statusEl.textContent = "Analyzing image…";
    // requestAnimationFrame so the "Analyzing…" state actually paints first
    requestAnimationFrame(() => {
      const count = clampSwatchCount();
      const palette = extractPalette(count);
      if (!palette) {
        if (statusEl) statusEl.textContent = "Couldn't read this image's pixels.";
        return;
      }
      renderPalette(palette);
      if (statusEl) {
        statusEl.textContent = `Extracted ${palette.length} dominant color${palette.length === 1 ? "" : "s"}. Click the image below to pick an exact pixel.`;
      }
    });
  }

  function drawToCanvas(img) {
    // Cap internal resolution for performance/memory, but keep enough detail
    // for accurate picking. Displayed size is controlled purely by CSS.
    const maxDim = 1000;
    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    try {
      fullImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    } catch (err) {
      fullImageData = null;
    }
  }

  function pixelHexAt(clientX, clientY) {
    if (!fullImageData) return null;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((clientY - rect.top) / rect.height) * canvas.height);
    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return null;
    const idx = (y * canvas.width + x) * 4;
    const d = fullImageData.data;
    if (d[idx + 3] < 8) return null; // fully transparent pixel
    return rgbToHex(d[idx], d[idx + 1], d[idx + 2]);
  }

  function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      currentImage = img;
      drawToCanvas(img);
      resultsWrap.style.display = "grid";
      pickedColors = [];
      renderPicked();
      runExtraction();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  // -- Upload interactions --
  dropzone.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInput.click();
    }
  });
  fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  });

  ["dragenter", "dragover"].forEach((evt) => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.add("is-dragover");
    });
  });
  ["dragleave", "drop"].forEach((evt) => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.remove("is-dragover");
    });
  });
  dropzone.addEventListener("drop", (e) => {
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  // -- Eyedropper: hover shows the pixel color, click pins it to "Picked colors" --
  canvas.addEventListener("mousemove", (e) => {
    const hex = pixelHexAt(e.clientX, e.clientY);
    if (hoverLabel) {
      if (hex) {
        hoverLabel.style.display = "flex";
        hoverLabel.querySelector(".hover-swatch").style.background = hex;
        hoverLabel.querySelector(".hover-hex").textContent = hex;
      } else {
        hoverLabel.style.display = "none";
      }
    }
  });
  canvas.addEventListener("mouseleave", () => {
    if (hoverLabel) hoverLabel.style.display = "none";
  });
  canvas.addEventListener("click", (e) => {
    const hex = pixelHexAt(e.clientX, e.clientY);
    if (!hex) return;
    if (!pickedColors.includes(hex)) {
      pickedColors = [hex, ...pickedColors].slice(0, 24);
      renderPicked();
    }
  });
  // Basic touch support: tap to pick.
  canvas.addEventListener(
    "touchstart",
    (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      const hex = pixelHexAt(touch.clientX, touch.clientY);
      if (hex && !pickedColors.includes(hex)) {
        pickedColors = [hex, ...pickedColors].slice(0, 24);
        renderPicked();
      }
    },
    { passive: true }
  );

  if (swatchCountInput) {
    swatchCountInput.addEventListener("change", runExtraction);
  }
})();
