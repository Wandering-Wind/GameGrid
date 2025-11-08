// Scripts/gsap_logo.js
(() => {
  if (!window.gsap) return;
  const { gsap } = window;

  // Tuning knobs (slow + readable)
  const TYPE_STAGGER = 0.16;   // time between each typed char
  const TYPE_DUR     = 0.10;   // per-char tween duration
  const ERASE_STAGGER= 0.12;   // time between each erased char
  const ERASE_DUR    = 0.08;   // per-char erase tween duration
  const PAUSE_AFTER_TYPE  = 1.1;
  const PAUSE_AFTER_ERASE = 0.7;

  const SELECTOR = ".nav .logo";
  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function build(el) {
    if (!el || el.dataset.tyBuilt === "1") return;
    el.dataset.tyBuilt = "1";

    const text = (el.textContent || "").trim();
    el.textContent = "";

    const line = document.createElement("span");
    line.className = "gg-logo-line";
    [...text].forEach(ch => {
      const s = document.createElement("span");
      s.className = "gg-logo-char";
      s.textContent = ch;
      line.appendChild(s);
    });
    el.appendChild(line);

    const caret = document.createElement("span");
    caret.className = "gg-logo-caret";
    caret.setAttribute("aria-hidden", "true");
    el.appendChild(caret);

    const chars = el.querySelectorAll(".gg-logo-char");

    if (prefersReduced) {
      // Minimal static result for reduced motion users
      el.textContent = text;
      return;
    }

    // Baselines
    gsap.set(el,    { opacity: 1, filter: "brightness(1)" });
    gsap.set(chars, { opacity: 0, yPercent: 30, filter: "blur(6px)" });
    gsap.set(caret, { autoAlpha: 1 });

    // Master infinite loop
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      repeat: -1,
      repeatDelay: 0.0
    });

    // TYPE: left-to-right
    tl.to(chars, {
      opacity: 1,
      yPercent: 0,
      filter: "blur(0px)",
      duration: TYPE_DUR,
      stagger: { each: TYPE_STAGGER, from: "start" }
    });

    // Pause with caret blinking
    tl.to({}, { duration: PAUSE_AFTER_TYPE });

    // ERASE: right-to-left (backspace vibe)
    tl.to(chars, {
      opacity: 0,
      yPercent: 30,
      filter: "blur(6px)",
      duration: ERASE_DUR,
      stagger: { each: ERASE_STAGGER, from: "end" }
    });

    // Short pause before re-type
    tl.to({}, { duration: PAUSE_AFTER_ERASE });

    // Optional: pause-on-hover (handy if users want to read nav calmly)
    el.addEventListener("mouseenter", () => tl.pause());
    el.addEventListener("mouseleave", () => tl.play());
  }

  // Run after DOM and nav injection
  document.addEventListener("DOMContentLoaded", () => {
    // If nav is injected by JS, poll briefly until .logo exists
    let tries = 0;
    const t = setInterval(() => {
      const logo = document.querySelector(SELECTOR);
      if (logo || tries++ > 40) {
        clearInterval(t);
        build(logo);
      }
    }, 50);
  });
})();