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

// Featured slideshow (Lifestyle page)
const show = document.querySelector(".slideshow");
if (show) {
  const track = show.querySelector(".slides");
  const slides = [...track.children];
  const dots = [...show.querySelectorAll(".slide-dots button")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let index = 0;
  let timer;

  const go = (i) => {
    index = (i + slides.length) % slides.length;
    track.scrollTo({ left: index * track.clientWidth });
  };
  const markDot = () => {
    index = Math.round(track.scrollLeft / track.clientWidth);
    dots.forEach((d, i) => d.setAttribute("aria-current", i === index));
  };
  const start = () => {
    if (reduceMotion) return;
    clearInterval(timer);
    timer = setInterval(() => go(index + 1), 5000);
  };
  const stop = () => clearInterval(timer);

  show.querySelector(".slide-prev").addEventListener("click", () => { go(index - 1); start(); });
  show.querySelector(".slide-next").addEventListener("click", () => { go(index + 1); start(); });
  dots.forEach((d, i) => d.addEventListener("click", () => { go(i); start(); }));
  track.addEventListener("scroll", () => requestAnimationFrame(markDot));
  show.addEventListener("mouseenter", stop);
  show.addEventListener("mouseleave", start);
  track.addEventListener("touchstart", stop, { passive: true });
  markDot();
  start();
}

// Themed photo rows: arrow buttons scroll sideways
document.querySelectorAll(".photo-row").forEach((row) => {
  const track = row.querySelector(".row-track");
  const step = () => track.clientWidth * 0.8;
  row.querySelector(".row-prev").addEventListener("click", () => track.scrollBy({ left: -step() }));
  row.querySelector(".row-next").addEventListener("click", () => track.scrollBy({ left: step() }));
});

// Lightbox: click any photo to view it full size, then browse its group
const box = document.querySelector(".lightbox");
if (box) {
  const big = box.querySelector("img");
  let photos = [];
  let current = 0;

  const open = (i) => {
    current = (i + photos.length) % photos.length;
    big.src = photos[current].src;
    big.alt = photos[current].alt;
    box.classList.add("open");
  };
  const close = () => box.classList.remove("open");

  document.querySelectorAll("[data-lightbox]").forEach((group) => {
    const imgs = [...group.querySelectorAll("img")];
    imgs.forEach((img, i) =>
      img.parentElement.addEventListener("click", () => { photos = imgs; open(i); }));
  });
  box.querySelector(".close").addEventListener("click", close);
  box.querySelector(".prev").addEventListener("click", () => open(current - 1));
  box.querySelector(".next").addEventListener("click", () => open(current + 1));
  box.addEventListener("click", (e) => { if (e.target === box) close(); });
  document.addEventListener("keydown", (e) => {
    if (!box.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") open(current - 1);
    if (e.key === "ArrowRight") open(current + 1);
  });
}
