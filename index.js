const track = document.querySelector('.carousel-track');
let slides = Array.from(track.children);
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');

let index = 1; // start at 1 because we will clone slides
let interval;

/* Clone slides to create infinite loop */
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

firstClone.classList.add('clone');
lastClone.classList.add('clone');

track.appendChild(firstClone);
track.insertBefore(lastClone, slides[0]);

slides = Array.from(track.children);

/* Adjust positioning */
function updatePosition() {
    const slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(${-slideWidth * index}px)`;
}

function updateActiveClass() {
    slides.forEach(s => s.classList.remove("active"));
    slides[index].classList.add("active");
}

function nextSlide() {
    if (index >= slides.length - 1) return;
    index++;
    moveSlides();
}

function prevSlideFunc() {
    if (index <= 0) return;
    index--;
    moveSlides();
}

function moveSlides() {
    const slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transition = "0.5s ease";
    track.style.transform = `translateX(${-slideWidth * index}px)`;
    updateActiveClass();
}

/* Looping logic (jump without animation) */
track.addEventListener("transitionend", () => {
    if (slides[index].classList.contains("clone")) {
        track.style.transition = "none";
        if (index === slides.length - 1) index = 1;
        if (index === 0) index = slides.length - 2;
        updatePosition();
        updateActiveClass();
    }
});

/* Auto slide */
function startAutoSlide() {
    interval = setInterval(() => nextSlide(), 3000);
}
function stopAutoSlide() {
    clearInterval(interval);
}

track.addEventListener("mouseenter", stopAutoSlide);
track.addEventListener("mouseleave", startAutoSlide);

nextBtn.addEventListener("click", () => {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
});

prevBtn.addEventListener("click", () => {
    stopAutoSlide();
    prevSlideFunc();
    startAutoSlide();
});

/* Init */
updatePosition();
updateActiveClass();
startAutoSlide();


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