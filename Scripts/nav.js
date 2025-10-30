const pathPrefix = location.pathname.includes("/") && !location.pathname.endsWith("index.html") ? "../" : "";

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