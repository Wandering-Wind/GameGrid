document.addEventListener("DOMContentLoaded", () => {
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