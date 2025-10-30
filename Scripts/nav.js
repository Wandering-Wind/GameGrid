/*const pathPrefix = location.pathname.includes("/") && !location.pathname.endsWith("index.html") ? "../" : "";

    document.getElementById("nav-bar").innerHTML = `
    <nav class="nav-container">
        <div class="logo">
        </div>
        <ul class="nav-links">
        <li><a href="${pathPrefix}index.html">Home</a></li>
        <li><a href="${pathPrefix}games/games.html">Games</a></li>
        <li><a href="${pathPrefix}art/art.html">Art</a></li>
        <li><a href="${pathPrefix}creators/creators.html">Creators</a></li>
        <li><a href="${pathPrefix}about/about.html">About</a></li>
        </ul>
        <button class="burger" id="burger">☰</button>
    </nav>

    `;

    const burger = document.getElementById("burger");
    burger.addEventListener("click", () => {
    document.querySelector(".nav-links").classList.toggle("nav-open");
    });
*/

document.addEventListener("DOMContentLoaded", () => {
    const nav = document.getElementById("nav-bar");

    nav.innerHTML = `
        <nav class="nav">
            <div class="logo">GameGrid</div>
            <button id="menu-toggle" class="menu-btn">☰</button>
            <ul class="nav-links">
                <li><a href="/GameGrid/index.html">Home</a></li>
                <li><a href="/GameGrid/Games/games.html">Games</a></li>
                <li><a href="/GameGrid/Art/art.html">Art</a></li>
                <li><a href="/GameGrid/Creators/creators.html">Creators</a></li>
                <li><a href="/GameGrid/About/about.html">About</a></li>
            </ul>
        </nav>
    `;

    // Mobile toggle
    const toggle = document.getElementById("menu-toggle");
    const links = document.querySelector(".nav-links");

    toggle.addEventListener("click", () => {
        links.classList.toggle("open");
    });
});
