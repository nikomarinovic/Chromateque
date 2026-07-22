// Shared nav behavior: makes the "Tools" dropdown work on touch devices
// (hover already works via CSS for desktop pointers).
document.addEventListener("DOMContentLoaded", () => {
  const dropdowns = document.querySelectorAll(".nav-dropdown");

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector(".nav-dropdown-trigger");
    if (!trigger) return;
    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = dropdown.classList.contains("is-open");
      dropdowns.forEach((d) => d.classList.remove("is-open"));
      dropdown.classList.toggle("is-open", !isOpen);
    });
  });

  document.addEventListener("click", () => {
    dropdowns.forEach((d) => d.classList.remove("is-open"));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      dropdowns.forEach((d) => d.classList.remove("is-open"));
    }
  });
});
