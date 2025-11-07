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
*/

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

    // Tag filter click
    tags.forEach(tag => {
        tag.style.cursor = "pointer";

        tag.addEventListener("click", () => {
            const selectedTag = tag.textContent.trim().toLowerCase();

            // Clicking same tag again toggles off
            if (activeTag === selectedTag) {
                activeTag = null;
                clearActive();
                resetCards();
                return;
            }

            activeTag = selectedTag;
            clearActive();
            tag.classList.add("active");

            cards.forEach(card => {
                const cardTags = card.dataset.tags.toLowerCase();
                card.style.display = cardTags.includes(selectedTag) ? "" : "none";
            });
        });
    });

    // Show All logic
    showAllBtn.addEventListener("click", () => {
        activeTag = null;
        clearActive();
        showAllBtn.classList.add("active");
        resetCards();
    });
});
