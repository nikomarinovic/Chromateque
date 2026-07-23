/* Optional premium polish for the converter page.
   Loads AFTER converter.js. Doesn't modify its logic — just:
   1) mirrors the current hex into an ambient CSS accent variable, so the
      glow behind the card and the accent rails follow the picked color
   2) drops a live "#hex" chip onto the preview panel
   Safe to omit entirely; the CSS looks good without it too. */
(function () {
  const input = document.getElementById("converter-input");
  const preview = document.getElementById("converter-preview");
  if (!input || !preview) return;

  // Live hex chip on the preview panel
  let label = document.querySelector(".cvt-preview-label");
  if (!label) {
    label = document.createElement("span");
    label.className = "cvt-preview-label";
    preview.appendChild(label);
  }

  function currentHex() {
    // converter.js already writes the resolved hex into row-hex's value cell
    const cell = document.querySelector("#row-hex .format-row-value");
    return cell ? cell.textContent.trim() : null;
  }

  function sync() {
    const hex = currentHex();
    if (!hex || hex === "—") return;
    label.textContent = hex.toUpperCase();
    document.documentElement.style.setProperty("--cvt-accent", hex);
  }

  input.addEventListener("input", () => requestAnimationFrame(sync));
  const picker = document.getElementById("converter-picker");
  if (picker) picker.addEventListener("input", () => requestAnimationFrame(sync));

  sync();
})();