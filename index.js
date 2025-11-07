const container = document.querySelector('.carousel-container');
const track = document.querySelector('.carousel-track');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');

let slides = Array.from(track.children);

// --- Clone ends for infinite loop
const firstClone = slides[0].cloneNode(true);
const lastClone  = slides[slides.length - 1].cloneNode(true);
firstClone.classList.add('clone');
lastClone.classList.add('clone');
track.appendChild(firstClone);
track.insertBefore(lastClone, slides[0]);

slides = Array.from(track.children);

let index = 1;        // start at first real slide
let interval = null;
let centers = [];     // centers of slides relative to track left (px)

// Compute centers of each slide
function computeCenters() {
  centers = slides.map(el => el.offsetLeft + el.offsetWidth / 2);
}

// Translate so active slide is centered in container
function goToIndex(i, animate = true) {
  index = i;
  const containerCenter = container.clientWidth / 2;
  const slideCenter = centers[index];
  const target = -(slideCenter - containerCenter);

  track.style.transition = animate ? 'transform 0.6s ease' : 'none';
  track.style.transform = `translateX(${target}px)`;

  slides.forEach(s => s.classList.remove('active'));
  slides[index].classList.add('active');
}

// Next/Prev
function nextSlide() {
  if (index >= slides.length - 1) return;
  goToIndex(index + 1, true);
}
function prevSlide() {
  if (index <= 0) return;
  goToIndex(index - 1, true);
}

// Handle infinite jump (no animation)
track.addEventListener('transitionend', () => {
  if (slides[index].classList.contains('clone')) {
    if (index === slides.length - 1) index = 1;              // jumped past lastClone
    if (index === 0) index = slides.length - 2;              // jumped before last real
    goToIndex(index, false);
  }
});

// Autoplay (desktop)
function startAuto() {
  // Skip autoplay on small screens (native scroll UX)
  if (window.matchMedia('(max-width: 640px)').matches) return;
  stopAuto();
  interval = setInterval(nextSlide, 3000);
}
function stopAuto() {
  if (interval) clearInterval(interval);
  interval = null;
}

track.addEventListener('mouseenter', stopAuto);
track.addEventListener('mouseleave', startAuto);

// Pause on any user interaction
['mousedown','touchstart','pointerdown'].forEach(ev => {
  track.addEventListener(ev, stopAuto, { passive: true });
});

// Buttons
if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); nextSlide(); startAuto(); });
if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); prevSlide(); startAuto(); });

// Recompute on resize (slides may change width)
window.addEventListener('resize', () => {
  const wasAnimating = !!interval;
  track.style.transition = 'none';
  computeCenters();
  goToIndex(index, false);
  if (wasAnimating) startAuto();
});

// Init
computeCenters();
goToIndex(index, false);
startAuto();


//API
const API_KEY = "6f2d429c52d0421c849d7b80eccebe03";

// Convert rating (e.g. 4.2) to stars ★★★★☆
function starRating(rating) {
    const stars = Math.round(rating);
    return "★".repeat(stars) + "☆".repeat(5 - stars);
}

// Fetch games based on search
async function searchGames(query = "indie") {
    const url = `https://api.rawg.io/api/games?key=${API_KEY}&search=${query}&page_size=8`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        const container = document.getElementById("rawg-games");
        container.innerHTML = ""; // clear results

        // So error message to prompt user to try something else
        if (!data.results || data.results.length === 0) {
            container.innerHTML = `
                <div class="rawg-error">
                    Couldn't find anything for "<strong>${query}</strong>". 
                    Try keywords like <strong>indie</strong>, <strong>rpg</strong>, <strong>clicker</strong>, or <strong>horror</strong>.
                </div>
            `;
            return;
        }
        
        data.results.forEach(game => {
            const genres = game.genres?.map(g => g.name).join(", ") || "Unknown";

            const card = document.createElement("div");
            card.classList.add("rawg-card");
            card.innerHTML = `
                <img src="${game.background_image}" alt="${game.name}">
                <h3>${game.name}</h3>

                <div class="rawg-meta">
                    <p><strong>Released:</strong> ${game.released || "TBA"}</p>
                    <p><strong>Genres:</strong> ${genres}</p>
                    <p><strong>Rating:</strong> ${starRating(game.rating)}</p>
                </div>

                <a class="itch-btn" 
                   href="https://rawg.io/games/${game.slug}"
                   target="_blank">
                   View Game
                </a>
            `;
            container.appendChild(card);
        });

    } catch (err) {
        console.error(err);
    }
}

// Search button + Enter key
document.getElementById("searchBtn").addEventListener("click", () => {
    let query = document.getElementById("searchInput").value;
    searchGames(query);
});

document.getElementById("searchInput").addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        searchGames(e.target.value);
    }
});

// Load default indie list
document.addEventListener("DOMContentLoaded", () => searchGames());