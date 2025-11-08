//Reference for future, this version works after so many attempts

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

  // Active link highlighting (EXACT pathname match after normalization)
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

  // Exact match only
  for (const a of links) {
    const hrefPath = normalizePathname(new URL(a.href, window.location.origin).pathname, pathPrefix);
    if (hrefPath === currentPath) {
      a.classList.add('active-link');
      a.setAttribute('aria-current', 'page');
      activated = true;
      break;
    }
  }

  // Fallback: if on literal site root, ensure Home is highlighted, just in case
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