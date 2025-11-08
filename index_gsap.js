//Landing Page tings
(() => {
  if (!window.gsap) return;
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  //Project cards: intro + hover tilt/bob
  function cardsIntro() {
    const cards = gsap.utils.toArray(".carousel-slide, .project-card");
    if (!cards.length) return;

    cards.forEach((card, i) => {
      if (card.dataset.fxBuilt) return;
      card.dataset.fxBuilt = "1";

      if (prefersReduced) {
        gsap.set(card, { opacity: 1, x: 0, y: 0, filter: "none" });
        return;
      }

      const fromX = (i % 2 ? 60 : -60);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });
      tl.fromTo(card,
        { opacity: 0, x: fromX, y: 12, filter: "blur(6px) brightness(0.8)" },
        { opacity: 1, x: 0, y: 0, filter: "blur(0) brightness(1)", duration: 0.85, ease: "power3.out" }
      )
      .to(card, { filter: "brightness(1.18)", duration: 0.1, yoyo: true, repeat: 1, ease: "power1.inOut" }, "-=0.25");

      // Hover ambient tilt/bob
      const lerp = gsap.utils.interpolate;
      let vx = 0, vy = 0, raf;
      const onMove = (e) => {
        const r = card.getBoundingClientRect();
        const mx = ((e.clientX - r.left) / r.width - 0.5) * 2;  // -1..1
        const my = ((e.clientY - r.top)  / r.height - 0.5) * 2;
        vx = mx * 7;  // rotateY
        vy = my * -7; // rotateX
        if (!raf) tick();
      };
      const tick = () => {
        raf = requestAnimationFrame(tick);
        const rx = lerp(parseFloat(card.dataset.rx||"0"), vy, 0.12);
        const ry = lerp(parseFloat(card.dataset.ry||"0"), vx, 0.12);
        card.dataset.rx = rx; card.dataset.ry = ry;
        card.style.transform = `translateZ(0) rotateX(${rx}deg) rotateY(${ry}deg)`;
      };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", () => {
        cancelAnimationFrame(raf); raf = null;
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.35, ease: "power2.out", clearProps: "transform" });
      });
    });
  }


  //Tried a neon scroll progress bar (top HUD feel)
  function scrollProgress() {
    let bar = document.querySelector(".gg-progress");
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "gg-progress";
      document.body.appendChild(bar);
    }
    if (bar.dataset.fxBuilt) return;
    bar.dataset.fxBuilt = "1";

    gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => gsap.to(bar, { scaleX: self.progress, overwrite: true, duration: 0.1, ease: "linear" })
    });
  }

  // Tried "Game Search" title: SVG underline + orb rider
  function searchHeadingUnderline() {
    const h2 = document.querySelector('.API h2');
    if (!h2 || h2.dataset.fxBuilt) return;
    h2.dataset.fxBuilt = "1";
    if (prefersReduced) return;

    const text = h2.textContent || "Game Search";
    h2.textContent = "";

    const label = document.createElement("span");
    label.className = "gg-search-label";
    label.textContent = text;
    h2.appendChild(label);

    const svgNS = "http://www.w3.org/2000/svg";
    const svg  = document.createElementNS(svgNS, "svg");
    svg.classList.add("gg-search-underline");
    svg.setAttribute("viewBox", "0 0 100 14");
    svg.setAttribute("preserveAspectRatio", "none");

    const gradId = `ggSearchGrad-${Math.random().toString(36).slice(2,7)}`;
    const defs = document.createElementNS(svgNS, "defs");
    const grad = document.createElementNS(svgNS, "linearGradient");
    grad.setAttribute("id", gradId);
    grad.setAttribute("x1", "0%"); grad.setAttribute("y1", "0%");
    grad.setAttribute("x2", "100%"); grad.setAttribute("y2", "0%");
    [["0%","var(--neon-cyan)"],["50%","var(--neon-green)"],["100%","var(--neon-magenta)"]].forEach(([off,col])=>{
      const s = document.createElementNS(svgNS,"stop");
      s.setAttribute("offset", off); s.setAttribute("stop-color", col); grad.appendChild(s);
    });
    defs.appendChild(grad); svg.appendChild(defs);

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", "M2,10 C30,4 70,4 98,10");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke", `url(#${gradId})`);
    path.classList.add("gg-search-path");
    svg.appendChild(path);

    const orb = document.createElementNS(svgNS, "circle");
    orb.setAttribute("r", "1.7");
    orb.setAttribute("cx", "2");
    orb.setAttribute("cy", "10");
    orb.classList.add("gg-search-orb");
    svg.appendChild(orb);

    h2.appendChild(svg);

    const size = () => {
      const W = label.getBoundingClientRect().width || 280;
      svg.style.width = Math.min(W * 1.1, 720) + "px";
      svg.style.marginInline = "auto";
    };
    size(); addEventListener("resize", size);

    const L = (typeof path.getTotalLength === "function") ? path.getTotalLength() : 160;
    path.style.strokeDasharray = L;
    path.style.strokeDashoffset = L;

    const tl = gsap.timeline({ defaults: { ease: "power2.out" }, scrollTrigger: { trigger: h2, start: "top 85%", once: true }});
    tl.fromTo(h2, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
      .to(path, { strokeDashoffset: 0, duration: 0.9 }, "-=0.25");
    if (window.MotionPathPlugin) {
      tl.to(orb, { opacity: 1, duration: 0.06 }, "<+0.05")
        .to(orb, {
          duration: 1.0,
          ease: "power2.inOut",
          motionPath: { path, align: path, autoRotate: false, start: 0, end: 1 }
        }, "<")
        .to(orb, { opacity: 0, duration: 0.2 }, "-=0.05");
    }
  }
  


  document.addEventListener("DOMContentLoaded", () => {
    cardsIntro();
    carouselAmbient();
    scrollProgress();
    searchHeadingUnderline();
  });
})();

