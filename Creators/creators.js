document.addEventListener("DOMContentLoaded", () => {
  // Top filter buttons (only the ones in the filter bar)
  const barTags    = document.querySelectorAll(".tag-filter-container .tag"); // Games / Art
  const showAllBtn = document.getElementById("show-all");

  // Cards to show/hide
  const cards      = Array.from(document.querySelectorAll(".project-card"));

  // Per-card tag chips (clicking these should also filter + sync the top bar)
  const cardTags   = document.querySelectorAll(".project-card .project-tags .tag");

  let activeTag = null; // normalized, e.g. "games" or "art"

  const norm = (s = "") => s.trim().toLowerCase();

  // Split tags from data-tags that might be "games art" or "games, art"
  function parseTags(s = "") {
    return s
      .split(/[\s,]+/)        // split on spaces or commas
      .map(norm)
      .filter(Boolean);
  }

  function clearActiveBar() {
    barTags.forEach(btn => btn.classList.remove("active"));
    showAllBtn.classList.remove("active");
  }

  function resetCards() {
    cards.forEach(card => { card.style.display = ""; });
  }

  function applyFilter(tagName /* string | null */) {
    activeTag = tagName ? norm(tagName) : null;

    if (!activeTag) {
      clearActiveBar();
      showAllBtn.classList.add("active");
      resetCards();
      return;
    }

    // highlighting the matching top filter button
    clearActiveBar();
    barTags.forEach(btn => {
      if (norm(btn.textContent) === activeTag) {
        btn.classList.add("active");
      }
    });

    // show/hide cards
    cards.forEach(card => {
      const parts = parseTags(card.dataset.tags || "");
      card.style.display = parts.includes(activeTag) ? "" : "none";
    });

    window.sharedAnims?.refresh();
  }

  // Clicks on top filter buttons
  barTags.forEach(btn => {
    btn.style.cursor = "pointer";
    btn.addEventListener("click", () => {
      const tag = norm(btn.textContent);
      // toggle off if clicking the same tag
      if (activeTag === tag) {
        applyFilter(null);
      } else {
        applyFilter(tag);
      }
    });
  });

  // Show All
  showAllBtn.addEventListener("click", () => applyFilter(null));

  // Clicks on per-card tags should filter + sync the top bar
  cardTags.forEach(li => {
    li.setAttribute("role", "button");
    li.setAttribute("tabindex", "0");
    li.style.cursor = "pointer";

    const trigger = () => {
      applyFilter(norm(li.textContent));
    };

    li.addEventListener("click", (e) => {
      e.stopPropagation(); // avoid bubbling to card/container
      trigger();
    });

    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        trigger();
      }
    });
  });
});
