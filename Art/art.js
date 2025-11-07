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


// === TAG FILTERS ===
document.addEventListener("DOMContentLoaded", () => {
  // Only pick the filter buttons in the filter bar, not the chips inside cards
  const tags = document.querySelectorAll(".tag-filter-container .tag");    // "2D", "3D"
  const showAllBtn = document.getElementById("show-all");
  const cards = document.querySelectorAll(".project-card");

  let activeTag = null;

  function resetCards() {
    cards.forEach(card => { card.style.display = ""; });
  }

  function clearActive() {
    tags.forEach(btn => btn.classList.remove("active"));
    showAllBtn.classList.remove("active");
  }

  // Wire up tag buttons
  tags.forEach(btn => {
    btn.style.cursor = "pointer";
    btn.addEventListener("click", () => {
      const selectedTag = btn.textContent.trim().toLowerCase(); // "2d" or "3d"

      // Toggle off if clicking the same active tag
      if (activeTag === selectedTag) {
        activeTag = null;
        clearActive();
        resetCards();
        return;
      }

      activeTag = selectedTag;
      clearActive();
      btn.classList.add("active");

      cards.forEach(card => {
        const cardTags = (card.dataset.tags || "").toLowerCase(); // "2d" or "3d"
        card.style.display = cardTags.includes(selectedTag) ? "" : "none";
      });
    });
  });

  // Show All
  showAllBtn.addEventListener("click", () => {
    activeTag = null;
    clearActive();
    showAllBtn.classList.add("active");
    resetCards();
  });
});
