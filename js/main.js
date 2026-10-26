// Mobile menu
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
}

// Light / dark mode switch (remembers the visitor's choice)
const themeBtn = document.querySelector(".theme-toggle");
if (themeBtn) {
  const root = document.documentElement;
  const isDark = () =>
    root.dataset.theme
      ? root.dataset.theme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  const setIcon = () => {
    themeBtn.querySelector("i").className = isDark() ? "fa-solid fa-sun" : "fa-solid fa-moon";
  };
  setIcon();
  themeBtn.addEventListener("click", () => {
    const next = isDark() ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    setIcon();
  });
}

// Photo gallery lightbox (Lifestyle page)
const box = document.querySelector(".lightbox");
if (box) {
  const photos = [...document.querySelectorAll(".gallery img")];
  const big = box.querySelector("img");
  let current = 0;

  const show = (i) => {
    current = (i + photos.length) % photos.length;
    big.src = photos[current].src;
    big.alt = photos[current].alt;
    box.classList.add("open");
  };
  const close = () => box.classList.remove("open");

  photos.forEach((img, i) => img.parentElement.addEventListener("click", () => show(i)));
  box.querySelector(".close").addEventListener("click", close);
  box.querySelector(".prev").addEventListener("click", () => show(current - 1));
  box.querySelector(".next").addEventListener("click", () => show(current + 1));
  box.addEventListener("click", (e) => { if (e.target === box) close(); });
  document.addEventListener("keydown", (e) => {
    if (!box.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
}
