/*(() => {
  if (!window.gsap) return;
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- 1) Hero "About Me" card: premium entrance ----------
  function buildAboutCardIn() {
    const card = document.querySelector(".about-card");
    if (!card || card.dataset.fxBuilt) return;
    card.dataset.fxBuilt = "1";

    if (prefersReduced) {
      gsap.set(card, { opacity: 1, y: 0, scale: 1, filter: "none" });
      return;
    }

    gsap.fromTo(card,
      { opacity: 0, y: 40, scale: 0.98, filter: "blur(6px) brightness(0.8)" },
      {
        opacity: 1, y: 0, scale: 1, filter: "blur(0px) brightness(1)",
        duration: 0.9, ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 75%",
          once: true
        },
        onComplete() {
          // tiny neon “kick”
          gsap.to(card, {
            duration: 0.12,
            filter: "brightness(1.18)",
            yoyo: true, repeat: 1, ease: "power1.inOut"
          });
        }
      }
    );
  }

  // ---------- 2) Avatar: gentle float + parallax tilt ----------
  function buildAvatarFloat() {
    const img = document.querySelector(".about-card .u-photo");
    if (!img || img.dataset.fxBuilt) return;
    img.dataset.fxBuilt = "1";

    if (prefersReduced) return;

    // idle float
    gsap.to(img, {
      y: -6, rotate: 0.5,
      duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1
    });

    // parallax tilt on hover/move
    const wrap = img.closest(".about-card");
    let mx = 0, my = 0;
    const handler = (e) => {
      const r = wrap.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2; // -1..1
      my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      gsap.to(img, { rotateX: my * -6, rotateY: mx * 6, transformPerspective: 700, transformOrigin: "center" , duration: 0.25 });
    };
    wrap.addEventListener("mousemove", handler);
    wrap.addEventListener("mouseleave", () => gsap.to(img, { rotateX: 0, rotateY: 0, duration: 0.35, ease: "power2.out" }));
  }

  // ---------- 3) “Contact Me” title: neon sweep underline ----------
  // (No plugin required; a simple gradient shimmer + scale pop)
  function buildContactNeon() {
    const h2 = document.querySelector(".contact-wrapper h2");
    if (!h2 || h2.dataset.fxBuilt) return;
    h2.dataset.fxBuilt = "1";

    if (prefersReduced) return;

    // wrap & bar
    const wrap = document.createElement("span");
    wrap.className = "gg-contact-wrap";
    h2.replaceChildren(wrap);
    wrap.textContent = h2.textContent || "Contact Me";

    const bar = document.createElement("span");
    bar.className = "gg-contact-bar";
    h2.appendChild(bar);

    const tl = gsap.timeline({
      scrollTrigger: { trigger: h2, start: "top 85%", once: true }
    });
    tl.fromTo(h2, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
      .fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "back.out(1.6)" }, "-=0.2")
      .to(bar, { "--ggShimmerX": "120%", duration: 1.2, ease: "power2.inOut" }, "-=0.25");
  }

  // ---------- Init ----------
  document.addEventListener("DOMContentLoaded", () => {
    buildAboutCardIn();
    buildAvatarFloat();
    buildContactNeon();
  });
})();
*/

// about_gsap.js
(() => {
  if (!window.gsap) return;
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  if (window.MotionPathPlugin) gsap.registerPlugin(MotionPathPlugin);

  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- 1) Hero "About Me" card: premium entrance ----------
  function buildAboutCardIn() {
    const card = document.querySelector(".about-card");
    if (!card || card.dataset.fxBuilt) return;
    card.dataset.fxBuilt = "1";

    if (prefersReduced) {
      gsap.set(card, { opacity: 1, y: 0, scale: 1, filter: "none" });
      return;
    }

    gsap.fromTo(card,
      { opacity: 0, y: 40, scale: 0.98, filter: "blur(6px) brightness(0.8)" },
      {
        opacity: 1, y: 0, scale: 1, filter: "blur(0px) brightness(1)",
        duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 75%", once: true },
        onComplete() {
          gsap.to(card, {
            duration: 0.12, filter: "brightness(1.18)",
            yoyo: true, repeat: 1, ease: "power1.inOut"
          });
        }
      }
    );
  }

  // ---------- 2) Avatar: float → flip → float (loop) + parallax tilt ----------
  function buildAvatarFloat() {
  const img = document.querySelector(".about-card .u-photo");
  if (!img || img.dataset.fxBuilt) return;
  img.dataset.fxBuilt = "1";
  if (prefersReduced) return;

  // --- wrap the image in a 3D container so flip & tilt don't clash ---
  let wrap = img.parentElement?.classList.contains("avatar-3d")
    ? img.parentElement
    : null;

  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "avatar-3d";
    img.parentNode.insertBefore(wrap, img);
    wrap.appendChild(img);
  }

  // Base micro wobble on the IMAGE (not the wrapper)
  gsap.to(img, {
    rotationZ: 0.6,
    duration: 4,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1
  });

  // Float → card flip → float (loop) ON THE WRAPPER
  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: 0.5,
    defaults: { ease: "sine.inOut" }
  });

  // Gentle float (wrapper up/down)
  tl.to(wrap, { y: -8, duration: 1.6 })
    .to(wrap, { y: 0,  duration: 1.6 })
    .to(wrap, { y: -8, duration: 1.6 })
    .to(wrap, { y: 0,  duration: 1.6 });

  // Card-like spin: add a tiny Z pop so the perspective reads
  tl.to(wrap, {
    rotateY: "+=180",
    z: 18,
    transformOrigin: "50% 50%",
    duration: 0.6,
    ease: "power2.in"
  })
  .to(wrap, {
    rotateY: "+=180",
    z: 0,
    duration: 0.6,
    ease: "power2.out"
  }, ">-0.02");

  // --- parallax tilt ON THE IMAGE so it composes with wrapper flip ---
  const card = img.closest(".about-card");
  const onMove = (e) => {
    const r = card.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width  - 0.5) * 2; // -1..1
    const my = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    gsap.to(img, {
      rotateX: my * -6,
      rotateY: mx *  6,
      transformPerspective: 800,
      transformOrigin: "center",
      duration: 0.25,
      overwrite: "auto"
    });
  };
  card.addEventListener("mousemove", onMove);
  card.addEventListener("mouseleave", () =>
    gsap.to(img, { rotateX: 0, rotateY: 0, duration: 0.35, ease: "power2.out" })
  );
}

  // ---------- 3) Contact title: SVG neon arc + orb MotionPath ----------
  function buildContactNeon() {
    const h2 = document.querySelector(".contact-wrapper h2");
    if (!h2 || h2.dataset.fxBuilt) return;
    h2.dataset.fxBuilt = "1";

    if (prefersReduced) return;

    // Wrap text so we can size the SVG to the text width
    const text = h2.textContent || "Contact Me";
    h2.textContent = "";

    const label = document.createElement("span");
    label.className = "gg-contact-label";
    label.textContent = text;
    h2.appendChild(label);

    // Build SVG under the label
    const svgNS = "http://www.w3.org/2000/svg";
    const svg  = document.createElementNS(svgNS, "svg");
    svg.classList.add("gg-contact-svg");
    svg.setAttribute("viewBox", "0 0 100 16");
    svg.setAttribute("preserveAspectRatio", "none");

    // Gradient (unique id per page load)
    const gradId = `ggContactGrad-${Math.random().toString(36).slice(2,8)}`;
    const defs = document.createElementNS(svgNS, "defs");
    const grad = document.createElementNS(svgNS, "linearGradient");
    grad.setAttribute("id", gradId);
    grad.setAttribute("x1", "0%"); grad.setAttribute("y1", "0%");
    grad.setAttribute("x2", "100%"); grad.setAttribute("y2", "0%");
    [
      ["0%",   "var(--neon-cyan)"],
      ["50%",  "var(--neon-green)"],
      ["100%", "var(--neon-magenta)"]
    ].forEach(([off, col]) => {
      const stop = document.createElementNS(svgNS, "stop");
      stop.setAttribute("offset", off);
      stop.setAttribute("stop-color", col);
      grad.appendChild(stop);
    });
    defs.appendChild(grad);
    svg.appendChild(defs);

    // Curved underline path (slight arc)
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", "M2,12 C30,4 70,4 98,12"); // 100x16 viewBox space
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke", `url(#${gradId})`);
    path.classList.add("gg-contact-path");
    svg.appendChild(path);

    // Glowing orb that rides the path
    const orb = document.createElementNS(svgNS, "circle");
    orb.setAttribute("r", "1.8");
    orb.setAttribute("cx", "2");
    orb.setAttribute("cy", "12");
    orb.classList.add("gg-contact-orb");
    svg.appendChild(orb);

    h2.appendChild(svg);

    // Size SVG to label width (responsive)
    const sizeSVG = () => {
      const W = label.getBoundingClientRect().width || 360;
      const target = Math.min(W * 1.1, 820); // a bit wider than text
      svg.style.width = `${target}px`;
      svg.style.marginInline = "auto";
    };
    sizeSVG();
    window.addEventListener("resize", sizeSVG);

    // Stroke dash animation uses actual path length if available
    const length = (typeof path.getTotalLength === "function") ? path.getTotalLength() : 160;
    path.style.strokeDasharray  = length;
    path.style.strokeDashoffset = length;

    // Intro pop for the heading + draw line + orb ride (once on reveal)
    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      scrollTrigger: { trigger: h2, start: "top 85%", once: true }
    });

    tl.fromTo(h2, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
      .to(path, { strokeDashoffset: 0, duration: 0.9 }, "-=0.2");

    if (window.MotionPathPlugin) {
      tl.to(orb, { opacity: 1, duration: 0.08 }, "<+0.05")
        .to(orb, {
          duration: 1.0,
          ease: "power2.inOut",
          motionPath: { path, align: path, autoRotate: false, start: 0.0, end: 1.0, alignOrigin: [0.5, 0.5] }
        }, "<")
        .to(orb, { scale: 1.35, duration: 0.22, yoyo: true, repeat: 1, ease: "sine.inOut" }, "-=0.25")
        .to(orb, { opacity: 0, duration: 0.25 }, "-=0.05");
    }

    // Optional subtle loop after the intro (re-draw and re-ride occasionally)
    // Comment out this block if you want it to run only once.
    const loop = gsap.timeline({ repeat: -1, repeatDelay: 2.2, defaults: { ease: "power2.out" } });
    loop.set(path, { strokeDashoffset: length });
    loop.to(path, { strokeDashoffset: 0, duration: 0.9 });

    if (window.MotionPathPlugin) {
      loop.to(orb, { opacity: 1, duration: 0.08 }, "<+0.05")
          .to(orb, {
            duration: 1.0,
            ease: "power2.inOut",
            motionPath: { path, align: path, autoRotate: false, start: 0.0, end: 1.0 }
          }, "<")
          .to(orb, { opacity: 0, duration: 0.25 }, "-=0.05");
    }

    // Respect reduced motion: stop the loop if user prefers
    if (prefersReduced) loop.pause(0);
  }

  // ---------- Init ----------
  document.addEventListener("DOMContentLoaded", () => {
    buildAboutCardIn();
    buildAvatarFloat();
    buildContactNeon();
  });
})();
