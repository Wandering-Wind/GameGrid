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

  // --- Active link highlighting (EXACT pathname match after normalization)
  const links = linksList.querySelectorAll("a");

  // Normalize pathname so ".../index.html" === ".../", handle prefix root
  function normalizePathname(pathname, prefix) {
    if (!pathname) return '/';

    // If using a repo prefix and pathname equals the prefix without trailing slash,
    // normalize it to have a trailing slash (e.g. "/GameGrid" -> "/GameGrid/")
    if (prefix && pathname === prefix) return prefix + '/';

    // Collapse ".../index.html" -> ".../"
    if (pathname.endsWith('/index.html')) {
      return pathname.slice(0, -'index.html'.length);
    }

    return pathname;
  }

  const currentPath = normalizePathname(window.location.pathname, pathPrefix);
  let activated = false;

  // 1) Exact match only
  for (const a of links) {
    const hrefPath = normalizePathname(new URL(a.href, window.location.origin).pathname, pathPrefix);
    if (hrefPath === currentPath) {
      a.classList.add('active-link');
      a.setAttribute('aria-current', 'page');
      activated = true;
      break;
    }
  }

  // 2) Fallback: if on literal site root, ensure Home is highlighted
  if (!activated) {
    for (const a of links) {
      const hrefPath = normalizePathname(new URL(a.href, window.location.origin).pathname, pathPrefix);
      const homePath = pathPrefix ? `${pathPrefix}/` : '/';
      if (currentPath === homePath && hrefPath === homePath) {
        a.classList.add('active-link');
        a.setAttribute('aria-current', 'page');
        break;
      }
    }
  }
});