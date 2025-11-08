//For some reason, this just sticks to the footer, it's supposed to hover as the user scrolls down
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("toTopBtn");
  if (!btn) return;

  //making sure it's a direct child of <body>
  if (btn.parentElement !== document.body) {
    document.body.appendChild(btn);
  }

  // trying to force fixed positioning so transforms can’t trap it
  btn.style.position = "fixed";
  btn.style.right = btn.style.right || "20px";
  btn.style.bottom = btn.style.bottom || "20px";
  btn.style.zIndex = btn.style.zIndex || "10000";

  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // show as soon as user scrolls down even a little
  const update = () => {
    const scrolled = (document.scrollingElement?.scrollTop ?? window.scrollY ?? 0);
    btn.style.display = scrolled > 0 ? "grid" : "none";
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (prefersReduced) window.scrollTo(0, 0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  });
});