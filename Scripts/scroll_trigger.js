document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // Power-on flick fade-up for content sections, verry cool. Tony Stark vibes
  // Trying to add .fade-section to sections animated
  gsap.utils.toArray(".fade-section").forEach(section => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    // initial "power-on" flick effect
    tl.fromTo(section, 
      { opacity: 0, y: 40, filter: "brightness(0.5)" },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    )
    .to(section, 
      { filter: "brightness(1.2)", duration: 0.1, yoyo: true, repeat: 2, ease: "power1.inOut" },
      "-=0.3"
    );
  });


});