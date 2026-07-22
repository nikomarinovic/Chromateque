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

    for (let i = 0; i < seed.length; i++) {
      h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    }

    for (let i = arr.length - 1; i > 0; i--) {
      h = (h * 1103515245 + 12345) >>> 0;

      const j = h % (i + 1);

      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
  }


  function getLocalDayKey() {
    const now = new Date();

    return [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0")
    ].join("-");
  }


  function scheduleMidnightRefresh() {
    const now = new Date();

    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      1
    );

    setTimeout(() => {
      location.reload();
    }, midnight - now);
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

      }
    };

    navigator.clipboard?.writeText(text).then(done).catch(done);
  }


  const todayKey = getLocalDayKey();


  // Color of the Day
  const colorOfDay = colors[
    seededIndex(todayKey + "color", colors.length)
  ];

  if (codSwatch) codSwatch.style.background = colorOfDay.hex;
  if (codName) codName.textContent = colorOfDay.name;
  if (codHex) codHex.textContent = colorOfDay.hex;

  if (codCopy) {
    codCopy.onclick = () => copyText(colorOfDay.hex, codCopy);
  }



  // Palette of the Day
  const paletteOfDay = palettes[
    seededIndex(todayKey + "palette", palettes.length)
  ];

  if (podSwatches) {
    podSwatches.innerHTML = paletteOfDay.colors
      .map(hex => `<div style="background:${hex}"></div>`)
      .join("");
  }

  if (podName) {
    podName.textContent = paletteOfDay.name;
  }



  // Trending palettes
  if (trendingPaletteGrid && typeof renderPaletteGrid === "function") {

    const trendingPalettes = seededShuffle(
      palettes,
      todayKey + "trending-p"
    ).slice(0, 6);

    renderPaletteGrid(
      trendingPaletteGrid,
      trendingPalettes
    );
  }



  // Trending colors
  if (trendingColorGrid) {

    const trendingColors = seededShuffle(
      colors,
      todayKey + "trending-c"
    ).slice(0, 12);


    trendingColorGrid.innerHTML = trendingColors
      .map(c => `
        <div class="chip"
          style="--c:${c.hex}"
          data-hex="${c.hex}">
          <span>${c.name} · ${c.hex}</span>
        </div>
      `)
      .join("");

  }

  scheduleMidnightRefresh();


})();