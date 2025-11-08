/*document.addEventListener("DOMContentLoaded", () => {
    const images = document.querySelectorAll('.project-card img');
    const overlay = document.getElementById('lightbox-overlay');
    const lightboxImg = overlay.querySelector('img');
    const closeBtn = document.getElementById('close-btn');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');

    let currentIndex = 0;
    const imageArray = Array.from(images);

    function showLightbox(index) {
        const img = imageArray[index];
        lightboxImg.src = img.src;
        overlay.style.display = 'flex';
        currentIndex = index;
    }

    images.forEach((img, idx) => {
        img.addEventListener('click', () => showLightbox(idx));
    });

    closeBtn.addEventListener('click', () => overlay.style.display = 'none');

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % imageArray.length;
        lightboxImg.src = imageArray[currentIndex].src;
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + imageArray.length) % imageArray.length;
        lightboxImg.src = imageArray[currentIndex].src;
    });

    // Close lightbox on clicking overlay (except image)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.style.display = 'none';
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (overlay.style.display === 'flex') {
            if (e.key === 'ArrowRight') nextBtn.click();
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'Escape') overlay.style.display = 'none';
        }
    });
});




//Fixes the issue of where the image is only visible at the top in gallery mode
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll('.project-card img');
  const overlay = document.getElementById('lightbox-overlay');
  const lightboxImg = overlay.querySelector('img');
  const closeBtn = document.getElementById('close-btn');
  const nextBtn = document.getElementById('next-btn');
  const prevBtn = document.getElementById('prev-btn');

  let currentIndex = 0;
  const imageArray = Array.from(images);

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = imageArray[currentIndex].src;
    overlay.style.display = 'flex';
    document.body.classList.add('lightbox-open');

    // Focus the modal for key handling + some mobile browsers
    overlay.focus();

    // Belt-and-suspenders: if some browser paints it “up top”, yank view to top
    // (Fixed-position overlay should cover the viewport anyway, but this ensures visibility.)
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }

  function closeLightbox() {
    overlay.style.display = 'none';
    document.body.classList.remove('lightbox-open');
  }

  images.forEach((img, idx) => {
    img.addEventListener('click', () => openLightbox(idx));
  });

  closeBtn.addEventListener('click', closeLightbox);

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % imageArray.length;
    lightboxImg.src = imageArray[currentIndex].src;
  });

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + imageArray.length) % imageArray.length;
    lightboxImg.src = imageArray[currentIndex].src;
  });

  // Close on overlay click (but not when clicking the image or buttons)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });

  // Keyboard navigation when overlay is open
  document.addEventListener('keydown', (e) => {
    if (overlay.style.display === 'flex') {
      if (e.key === 'ArrowRight') nextBtn.click();
      if (e.key === 'ArrowLeft')  prevBtn.click();
      if (e.key === 'Escape')     closeLightbox();
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
    const tags = document.querySelectorAll(".tag");
    const cards = document.querySelectorAll(".project-card");
    const showAllBtn = document.getElementById("show-all");
    let activeTag = null;

    function resetCards() {
        cards.forEach(card => card.style.display = "");
    }

    function clearActive() {
        tags.forEach(tag => tag.classList.remove("active"));
        showAllBtn.classList.remove("active");
    }

*/

//Allows for the videos to play too! And it works!! Good stuff!
document.addEventListener("DOMContentLoaded", () => {
  const thumbs = document.querySelectorAll('.project-card img');
  const overlay = document.getElementById('lightbox-overlay');
  const closeBtn = document.getElementById('close-btn');
  const nextBtn = document.getElementById('next-btn');
  const prevBtn = document.getElementById('prev-btn');
  const content = document.getElementById('lightbox-content');

  // Build a media list (image or video)
  const items = Array.from(thumbs).map(img => {
    const videoSrc = img.dataset.video;
    return {
      type: videoSrc ? 'video' : 'image',
      src: videoSrc ? videoSrc : img.src,
      poster: img.src,
      alt: img.alt || 'Artwork',
      el: img
    };
  });

  let currentIndex = 0;

  function renderCurrent() {
    content.innerHTML = '';

    const item = items[currentIndex];
    if (item.type === 'image') {
      const media = new Image();
      media.src = item.src;
      media.alt = item.alt;
      content.appendChild(media);
    } else {
      const video = document.createElement('video');
      video.controls = true;
      video.autoplay = true;          // user initiated (click), usually OK
      video.muted = true;             // improves autoplay reliability across browsers
      video.loop = true;              // optional, looks nice for turntables
      video.playsInline = true;       // iOS full-screen prevention, psshtt Apple has to be different heyy
      if (item.poster) video.poster = item.poster;

      // Source (set type if you know it; this is optional)
      const source = document.createElement('source');
      source.src = item.src;
      // source.type = 'video/mp4';   // just to be safe of the codec/type
      video.appendChild(source);

      content.appendChild(video);
      // In case browser blocks autoplay even after click, start on metadata loaded
      video.addEventListener('loadeddata', () => {
        try { video.play(); } catch (_) {}
      });
    }
  }

  function openLightbox(index) {
    currentIndex = index;
    renderCurrent();
    overlay.style.display = 'flex';
    document.body.classList.add('lightbox-open');
    overlay.focus();
    // Optional: force viewport to top (belt-and-suspenders)
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }

  function closeLightbox() {
    // Pause any playing video to stop audio after close
    const vid = content.querySelector('video');
    if (vid && !vid.paused) { try { vid.pause(); } catch (_) {} }

    overlay.style.display = 'none';
    document.body.classList.remove('lightbox-open');
    content.innerHTML = '';
  }

  thumbs.forEach((img, idx) => {
    img.addEventListener('click', () => openLightbox(idx));
  });

  closeBtn.addEventListener('click', closeLightbox);

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % items.length;
    renderCurrent();
  });

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    renderCurrent();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });

  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    if (overlay.style.display === 'flex') {
      if (e.key === 'ArrowRight') nextBtn.click();
      if (e.key === 'ArrowLeft')  prevBtn.click();
      if (e.key === 'Escape')     closeLightbox();
    }
  });
});


// === TAG FILTERS (bar buttons + per-card tags) ===
document.addEventListener("DOMContentLoaded", () => {
  // Top filter buttons (next to "Show All")
  const barTags = document.querySelectorAll(".tag-filter-container .tag"); // 2D, 3D
  const showAllBtn = document.getElementById("show-all");

  // Card list (elements to show/hide)
  const cards = Array.from(document.querySelectorAll(".project-card"));

  // Tags inside cards (clicking these should also filter + highlight bar)
  const cardTags = document.querySelectorAll(".project-card .project-tags .tag");

  let activeTag = null; // "2d" | "3d" | null

  const norm = (s = "") => s.trim().toLowerCase();

  function clearActiveBar() {
    barTags.forEach(btn => btn.classList.remove("active"));
    showAllBtn.classList.remove("active");
  }

  function resetCards() {
    cards.forEach(card => { card.style.display = ""; });
  }

  function applyFilter(tagName /* "2d" | "3d" */) {
    activeTag = tagName ? norm(tagName) : null;

    if (!activeTag) {
      clearActiveBar();
      showAllBtn.classList.add("active");
      resetCards();
      return;
    }

    // highlight the matching top filter button
    clearActiveBar();
    let matched = false;
    barTags.forEach(btn => {
      if (norm(btn.textContent) === activeTag) {
        btn.classList.add("active");
        matched = true;
      }
    });
    if (!matched) {
      // If somehow the bar doesn’t have this tag, just leave none highlighted.
      // (Not expected here since we have 2D & 3D.)
    }

    // show/hide cards
    cards.forEach(card => {
      // support multiple, comma-separated data-tags
      const raw = (card.dataset.tags || "");
      const parts = raw.split(",").map(norm);
      card.style.display = parts.includes(activeTag) ? "" : "none";
    });

    window.sharedAnims?.refresh();
  }

  // Wire top bar buttons (2D / 3D)
  barTags.forEach(btn => {
    btn.style.cursor = "pointer";
    btn.addEventListener("click", () => {
      const tag = norm(btn.textContent);
      // toggle the same tag off
      if (activeTag === tag) {
        applyFilter(null);
      } else {
        applyFilter(tag);
      }
    });
  });

  // Wire Show All
  showAllBtn.addEventListener("click", () => applyFilter(null));

  // Wire per-card tags (li.tag) to trigger the same filter
  cardTags.forEach(li => {
    li.setAttribute("role", "button");
    li.setAttribute("tabindex", "0");
    li.style.cursor = "pointer";
    li.addEventListener("click", (e) => {
      e.stopPropagation(); // don’t bubble into figure/img clicks
      applyFilter(norm(li.textContent));
      // Optional: scroll back to the top filters so users see the highlight
      // document.querySelector(".tag-filter-container")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        li.click();
      }
    });
  });
});

// Swipe gestures (being mobile-friendly)
let touchStartX = null;
overlay.addEventListener('touchstart', (e) => {
  if (e.touches && e.touches.length === 1) {
    touchStartX = e.touches[0].clientX;
  }
}, { passive: true });

overlay.addEventListener('touchend', (e) => {
  if (touchStartX === null) return;
  const endX = (e.changedTouches && e.changedTouches[0].clientX) || touchStartX;
  const dx = endX - touchStartX;
  const SWIPE_THRESHOLD = 50; // px
  if (Math.abs(dx) > SWIPE_THRESHOLD) {
    if (dx < 0) nextBtn.click(); else prevBtn.click();
  }
  touchStartX = null;
});