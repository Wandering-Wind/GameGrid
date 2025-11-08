// Typewriter + neon underline with an orb riding the line.
// Works on the first <h1 class="p-name"> it finds on the page.

(() => {
  if (!window.gsap) return;
  const { gsap } = window;
  const hasMP = !!window.MotionPathPlugin;
  if (hasMP) gsap.registerPlugin(MotionPathPlugin);

  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function buildTypewriter(heading) {
    if (heading.dataset.fxBuilt === "1") return;
    heading.dataset.fxBuilt = "1";

    const original = heading.textContent.trim();
    heading.textContent = "";

    // text line
    const line = document.createElement("span");
    line.className = "gg-title-line";
    [...original].forEach(ch => {
      const s = document.createElement("span");
      s.className = "gg-char";
      s.textContent = ch;
      line.appendChild(s);
    });
    heading.appendChild(line);

    // caret
    const caret = document.createElement("span");
    caret.className = "gg-caret";
    caret.setAttribute("aria-hidden", "true");
    heading.appendChild(caret);

    if (prefersReduced) {
      gsap.set(heading, { opacity: 0, y: 8, filter: "blur(4px)" });
      gsap.to(heading, { opacity: 1, y: 0, filter: "blur(0)", duration: 0.35, ease: "power2.out" });
      return;
    }

    const chars = heading.querySelectorAll(".gg-char");
    gsap.set(heading, { opacity: 1 });
    gsap.set(chars, { opacity: 0, yPercent: 30, filter: "blur(8px)" });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(heading, { opacity: 0, filter: "brightness(0.7)" }, { opacity: 1, filter: "brightness(1)", duration: 0.25 });
    tl.to(chars, {
      opacity: 1,
      yPercent: 0,
      filter: "blur(0px)",
      duration: 0.045,
      stagger: { each: 0.018, from: "start" }
    }, "+=0.02");
    tl.fromTo(".gg-title-line", { y: 5, scale: 0.985 }, { y: 0, scale: 1, duration: 0.35, ease: "back.out(2)" }, "-=0.25");
    tl.set(caret, { autoAlpha: 1 }, "-=0.2");
  }

  function buildNeonUnderline(heading) {
    // Wrap to center the whole cluster
    const wrap = document.createElement("div");
    wrap.className = "gg-title-wrap";
    heading.parentNode.insertBefore(wrap, heading);
    wrap.appendChild(heading);

    // SVG
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.classList.add("gg-title-underline");
    svg.setAttribute("viewBox", "0 0 100 12");
    svg.setAttribute("preserveAspectRatio", "none");

    // Unique gradient ID per heading (avoid collisions across pages)
    const gradId = `ggTitleGrad-${Math.random().toString(36).slice(2, 8)}`;

    // defs for gradient glow
    const defs = document.createElementNS(svgNS, "defs");
    const grad = document.createElementNS(svgNS, "linearGradient");
    grad.setAttribute("id", gradId);
    grad.setAttribute("x1", "0%");  grad.setAttribute("y1", "0%");
    grad.setAttribute("x2", "100%"); grad.setAttribute("y2", "0%");
    [["0%","var(--neon-cyan)"],["50%","var(--neon-green)"],["100%","var(--neon-magenta)"]]
      .forEach(([off,color])=>{
        const st = document.createElementNS(svgNS,"stop");
        st.setAttribute("offset", off);
        st.setAttribute("stop-color", color);
        grad.appendChild(st);
      });
    defs.appendChild(grad);
    svg.appendChild(defs);

    // path (slightly arced)
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", "M2,9 C30,2 70,2 98,9");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-linecap", "round");
    path.classList.add("gg-underline-path");
    path.setAttribute("stroke", `url(#${gradId})`);
    svg.appendChild(path);

    // orb
    const orb = document.createElementNS(svgNS, "circle");
    orb.setAttribute("r", "1.6");
    orb.setAttribute("cx", "2");
    orb.setAttribute("cy", "9");
    orb.classList.add("gg-underline-orb");
    svg.appendChild(orb);

    wrap.appendChild(svg);

    // --- center & size underline based on real h1 width ---
    function sizeUnderline() {
      const W = heading.getBoundingClientRect().width || 480;
      const target = Math.min(W * 1.25, 900); // extend a bit past the text
      svg.style.width = `${target}px`;
      svg.style.marginLeft = "auto";
      svg.style.marginRight = "auto";
    }
    sizeUnderline();
    window.addEventListener("resize", sizeUnderline);

    // dash setup (use actual path length for crisp dash animation)
    const length = (typeof path.getTotalLength === "function") ? path.getTotalLength() : 160;
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    if (prefersReduced) {
      gsap.set(path, { strokeDashoffset: 0 });
      gsap.set(orb, { opacity: 0 });
      return;
    }

    // Looping timeline: draw -> orb ride -> pulse -> fade/reset -> repeat
    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      repeat: -1,
      repeatDelay: 0.5
    });

    tl.to(path, { strokeDashoffset: 0, duration: 0.7 });

    if (hasMP) {
      tl.to(orb, { opacity: 1, duration: 0.08 }, "<+0.05");
      tl.to(orb, {
        duration: 0.85,
        ease: "power2.inOut",
        motionPath: { path, align: path, autoRotate: false, start: 0.0, end: 1.0, alignOrigin: [0.5, 0.5] }
      }, "<");
      tl.to(orb, { scale: 1.3, duration: 0.18, yoyo: true, repeat: 1, ease: "sine.inOut" }, "-=0.25");
    } else {
      tl.fromTo(orb, { opacity: 0 }, { opacity: 1, duration: 0.2 }, "<+0.2")
        .to(orb, { x: 90, duration: 0.8, ease: "power2.inOut" })
        .to(orb, { opacity: 0.0, duration: 0.2 }, "-=0.1");
    }

    tl.to(path, { opacity: 0.7, duration: 0.25 }, "-=0.2")
      .to(path, { opacity: 1, duration: 0.15 })
      .set(path, { strokeDashoffset: length })
      .set(orb, { opacity: 0, clearProps: "x,y,scale" });
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("h1.p-name").forEach(h1 => {
      buildTypewriter(h1);
      buildNeonUnderline(h1);
    });
  });
})();