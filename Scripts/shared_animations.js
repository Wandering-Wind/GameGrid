//Shared GSAPs for games.html, art.html, creators.html
// Slide-in intro for project cards + ambient hover drift
// Works on any page that has .project-card elements.

(() => {
  if (!window.gsap) return;
  const { gsap } = window;
  gsap.registerPlugin(window.ScrollTrigger);

  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- Intro sequence: slide in from sides (staggered) ---
  function introSlideIn() {
    const cards = gsap.utils.toArray(".project-card");
    if (!cards.length) return;

    // initial state
    gsap.set(cards, { opacity: 0, y: 10 });

    // alternate left / right entry per index
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.6 } });

    tl.from(".p-name", { opacity: 0, y: 16, filter: "blur(6px)", duration: 0.5 })
      .from(".tag-filter-container", { opacity: 0, y: 12, filter: "blur(4px)" }, "-=0.3")
      .add(() => {
        if (prefersReduced) {
          // minimal fade if reduced motion
          gsap.to(cards, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 });
          return;
        }

        // slide from side with alternating direction
        gsap.fromTo(cards,
          i => ({ xPercent: (i % 2 === 0) ? -12 : 12, rotateX: 4 }),
          {
            xPercent: 0,
            rotateX: 0,
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: { each: 0.07, from: "start" }
          }
        );
      });
  }


  
  // --- Ambient hover / movement (subtle drift) ---
  // This is a simple repeating tween (NOT an SVG / motion path).
  // Each visible card gets a tiny yoyo float; pausing on hover.
  const floatTweens = new WeakMap();

  function startFloat(el) {
    if (floatTweens.has(el) || prefersReduced) return;

    const dur = gsap.utils.random(3, 5);
    const yAmt = gsap.utils.random(4, 10);
    const rAmt = gsap.utils.random(-1.2, 1.2);

    const t = gsap.to(el, {
      y: `+=${yAmt}`,
      rotation: rAmt,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      duration: dur
    });

    el.addEventListener("mouseenter", () => t.pause());
    el.addEventListener("mouseleave", () => t.resume());
    floatTweens.set(el, t);
  }

  function stopFloat(el) {
    const t = floatTweens.get(el);
    if (t) { t.kill(); floatTweens.delete(el); }
  }

  function manageFloat() {
    const cards = gsap.utils.toArray(".project-card");
    cards.forEach(el => {
      const visible = el.offsetParent !== null && el.style.display !== "none";
      if (visible) startFloat(el); else stopFloat(el);
    });
  }

  // Re-run layout/float after you show/hide via filters
  function refresh() {
    gsap.delayedCall(0.01, () => {
      ScrollTrigger.refresh();
      manageFloat();
    });
  }

  // Observe visibility/style changes under the grid so float stays correct
  function observeMutations() {
    const roots = document.querySelectorAll("article.e-content, .Project-Container");
    const obs = new MutationObserver(() => refresh());
    roots.forEach(r => obs.observe(r, { attributes: true, childList: true, subtree: true, attributeFilter: ["style", "class"] }));
  }

  document.addEventListener("DOMContentLoaded", () => {
    introSlideIn();
    manageFloat();
    observeMutations();
  });

  // tiny public API
  window.sharedAnims = { refresh };
})();


