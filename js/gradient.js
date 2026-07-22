(function initGradientTool() {
  const preview = document.getElementById("gradient-preview");
  const track = document.getElementById("gradient-track");
  const stopsWrap = document.getElementById("gradient-stops");
  const addBtn = document.getElementById("gradient-add-stop");
  const randomBtn = document.getElementById("gradient-random");
  const typeSelect = document.getElementById("gradient-type");
  const angleWrap = document.getElementById("gradient-angle-wrap");
  const angleInput = document.getElementById("gradient-angle");
  const angleLabel = document.getElementById("gradient-angle-label");
  const codeEl = document.getElementById("gradient-code-value");
  const copyCodeBtn = document.getElementById("gradient-copy-code");
  if (!preview || !stopsWrap || !track) return;

  let stops = [
    { hex: "#6366f1", pos: 0 },
    { hex: "#ec4899", pos: 50 },
    { hex: "#f59e0b", pos: 100 },
  ];

  function randomHex() {
    const n = Math.floor(Math.random() * 0xffffff);
    return "#" + n.toString(16).padStart(6, "0");
  }

  function buildCSS() {
    const sorted = [...stops].sort((a, b) => a.pos - b.pos);
    const stopList = sorted.map((s) => `${s.hex} ${Math.round(s.pos)}%`).join(", ");
    if (typeSelect.value === "radial") {
      return `radial-gradient(circle, ${stopList})`;
    }
    if (typeSelect.value === "conic") {
      return `conic-gradient(from ${angleInput.value}deg, ${stopList})`;
    }
    return `linear-gradient(${angleInput.value}deg, ${stopList})`;
  }

  // Cheap update: recompute the CSS and repaint the preview + code block.
  // Safe to call on every pointermove while dragging a handle, since it
  // never touches the DOM nodes being dragged.
  function updatePreview() {
    const css = buildCSS();
    preview.style.background = css;
    if (codeEl) codeEl.textContent = `background: ${css};`;
  }

  // Rebuilds the draggable position handles above the preview. Only called
  // on structural changes (add/remove/color edit/typing a position), never
  // during an active drag -- otherwise the handle being dragged would be
  // torn out of the DOM mid-gesture and lose its pointer capture.
  function renderTrack() {
    track.innerHTML = "";
    stops.forEach((stop, i) => {
      const handle = document.createElement("div");
      handle.className = "gradient-handle";
      handle.style.left = `${stop.pos}%`;
      handle.style.background = stop.hex;
      handle.title = `${stop.hex} · ${Math.round(stop.pos)}%`;
      handle.setAttribute("role", "slider");
      handle.setAttribute("aria-label", `Stop ${i + 1} position`);
      handle.setAttribute("aria-valuemin", "0");
      handle.setAttribute("aria-valuemax", "100");
      handle.setAttribute("aria-valuenow", String(Math.round(stop.pos)));
      handle.tabIndex = 0;

      handle.addEventListener("pointerdown", (e) => startDrag(e, stop, handle));
      handle.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
          stop.pos = Math.max(0, stop.pos - 1);
          updatePreview();
          handle.style.left = `${stop.pos}%`;
          syncRowPosition(i, stop.pos);
        } else if (e.key === "ArrowRight") {
          stop.pos = Math.min(100, stop.pos + 1);
          updatePreview();
          handle.style.left = `${stop.pos}%`;
          syncRowPosition(i, stop.pos);
        }
      });

      track.appendChild(handle);
    });
  }

  function startDrag(e, stop, handle) {
    e.preventDefault();
    handle.setPointerCapture(e.pointerId);
    handle.classList.add("is-active");

    function move(ev) {
      const rect = track.getBoundingClientRect();
      let pct = ((ev.clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      stop.pos = pct;
      handle.style.left = `${pct}%`;
      handle.setAttribute("aria-valuenow", String(Math.round(pct)));
      updatePreview();
      syncRowPosition(stops.indexOf(stop), pct);
    }
    function up() {
      handle.classList.remove("is-active");
      handle.releasePointerCapture(e.pointerId);
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
    }
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up);
  }

  // Keeps a stop-row's range input (and title text) in sync while dragging
  // its handle, without rebuilding the whole row list.
  function syncRowPosition(index, pos) {
    const row = stopsWrap.children[index];
    if (!row) return;
    const range = row.querySelector('input[type="range"]');
    if (range) range.value = Math.round(pos);
  }

  function renderStopsList() {
    stopsWrap.innerHTML = "";
    stops.forEach((stop, i) => {
      const row = document.createElement("div");
      row.className = "gradient-stop";
      row.innerHTML = `
        <input type="color" value="${stop.hex}" aria-label="Stop ${i + 1} color" />
        <input type="text" value="${stop.hex}" aria-label="Stop ${i + 1} hex" spellcheck="false" />
        <input type="range" min="0" max="100" value="${Math.round(stop.pos)}" aria-label="Stop ${i + 1} position" />
        <button type="button" class="gradient-stop-remove" aria-label="Remove stop ${i + 1}" ${stops.length <= 2 ? "disabled" : ""}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      `;
      const [colorInput, textInput, rangeInput] = row.querySelectorAll("input");
      const removeBtn = row.querySelector(".gradient-stop-remove");

      colorInput.addEventListener("input", (e) => {
        stop.hex = e.target.value;
        textInput.value = e.target.value;
        render();
      });
      textInput.addEventListener("change", (e) => {
        const v = e.target.value.trim();
        if (/^#?[0-9a-f]{6}$/i.test(v)) {
          stop.hex = v.startsWith("#") ? v : `#${v}`;
          render();
        }
      });
      rangeInput.addEventListener("input", (e) => {
        stop.pos = +e.target.value;
        render();
      });
      removeBtn.addEventListener("click", () => {
        stops = stops.filter((s) => s !== stop);
        render();
      });

      stopsWrap.appendChild(row);
    });
  }

  function render() {
    updatePreview();
    angleWrap.style.display = typeSelect.value === "radial" ? "none" : "flex";
    angleLabel.textContent = `${angleInput.value}°`;
    renderStopsList();
    renderTrack();
  }

  addBtn.addEventListener("click", () => {
    if (stops.length >= 8) return;
    stops.push({ hex: randomHex(), pos: 50 });
    render();
  });

  randomBtn.addEventListener("click", () => {
    const count = 2 + Math.floor(Math.random() * 3);
    stops = Array.from({ length: count }, (_, i) => ({
      hex: randomHex(),
      pos: Math.round((100 / (count - 1)) * i),
    }));
    const roll = Math.random();
    typeSelect.value = roll > 0.85 ? "conic" : roll > 0.6 ? "radial" : "linear";
    angleInput.value = Math.floor(Math.random() * 360);
    render();
  });

  typeSelect.addEventListener("change", render);
  angleInput.addEventListener("input", render);

  if (copyCodeBtn) {
    copyCodeBtn.addEventListener("click", () => {
      const text = `background: ${buildCSS()};`;
      const done = () => {
        copyCodeBtn.classList.add("is-copied");
        setTimeout(() => copyCodeBtn.classList.remove("is-copied"), 900);
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
