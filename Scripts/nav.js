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

*/



/*
//This one works
document.addEventListener("DOMContentLoaded", () => {
    const nav = document.getElementById("nav-bar");

    // Determine the repo folder dynamically for GitHub Pages
    // If hosted at root, leave empty string ''
    const pathPrefix = '/GameGrid'; // <-- replace with '' if not using a repo folder

    nav.innerHTML = `
        <nav class="nav">
            <div class="logo">GameGrid</div>
            <button id="menu-toggle" class="menu-btn">☰</button>
            <ul class="nav-links">
                <li><a href="${pathPrefix}/index.html">Home</a></li>
                <li><a href="${pathPrefix}/Games/games.html">Games</a></li>
                <li><a href="${pathPrefix}/Art/art.html">Art</a></li>
                <li><a href="${pathPrefix}/Creators/creators.html">Creators</a></li>
                <li><a href="${pathPrefix}/About/about.html">About</a></li>
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

*/

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("nav-bar");

  // If hosted at root, set ''; for GitHub Pages repo, keep '/GameGrid'
  const pathPrefix = '/GameGrid'; // '' if not using a repo folder

  nav.innerHTML = `
    <nav class="nav">
      <div class="logo">GameGrid</div>
      <button id="menu-toggle" class="menu-btn">☰</button>
      <ul class="nav-links">
        <li><a href="${pathPrefix}/index.html">Home</a></li>
        <li><a href="${pathPrefix}/Games/games.html">Games</a></li>
        <li><a href="${pathPrefix}/Art/art.html">Art</a></li>
        <li><a href="${pathPrefix}/Creators/creators.html">Creators</a></li>
        <li><a href="${pathPrefix}/About/about.html">About</a></li>
      </ul>
    </nav>
  `;

  // Mobile toggle
  const toggle = document.getElementById("menu-toggle");
  const linksList = document.querySelector(".nav-links");
  toggle.addEventListener("click", () => linksList.classList.toggle("open"));

  // --- Active link highlighting
  const links = linksList.querySelectorAll("a");

  // Normalize a path: remove trailing "index.html", ensure prefix, drop hash/query
  const normalize = (url) => {
    try {
      const u = new URL(url, window.location.origin);
      let p = u.pathname;

      // For GitHub Pages: home may be /GameGrid/ or /GameGrid/index.html
      if (p.endsWith("/index.html")) p = p.slice(0, -"/index.html".length) + "/";

      // Ensure a single trailing slash for section roots
      if (!p.endsWith(".html") && !p.endsWith("/")) p += "/";

      return p;
    } catch {
      return url;
    }
  };

  const current = normalize(window.location.href);

  // Find best match (exact path or begins-with for pages with fragments)
  let activated = false;
  links.forEach((a) => {
    const hrefPath = normalize(a.href);

    // Exact match first
    if (hrefPath === current) {
      a.classList.add("active-link");
      a.setAttribute("aria-current", "page");
      activated = true;
      return;
    }

    // If on creators page with a fragment (e.g. creators.html#arya...), start-with still matches
    if (!activated && current.startsWith(hrefPath)) {
      a.classList.add("active-link");
      a.setAttribute("aria-current", "page");
      activated = true;
    }
  });

  // Fallback: if nothing matched (e.g. 404 or different file), try simple contains of filename
  if (!activated) {
    const path = window.location.pathname;
    links.forEach((a) => {
      if (!activated && a.pathname && path.includes(a.pathname.replace(/\/index\.html$/, '/'))) {
        a.classList.add("active-link");
        a.setAttribute("aria-current", "page");
        activated = true;
      }
    });
  }
});