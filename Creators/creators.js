//Using the similar logic from the game.js

/*document.getElementById("show-all").addEventListener("click", () => {
    document.querySelectorAll(".project-card").forEach(card => {
        card.style.display = "";
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const tags = document.querySelectorAll(".tag");
    const cards = document.querySelectorAll(".project-card");

    tags.forEach(tag => {
        tag.style.cursor = "pointer";

        tag.addEventListener("click", () => {
            const selectedTag = tag.textContent.trim().toLowerCase();

            cards.forEach(card => {
                const cardTags = card.dataset.tags.toLowerCase();

                if (cardTags.includes(selectedTag)) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
});
*/

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

    // highlight the matching top filter button
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
      // Optional: ensure the filter bar is visible after clicking a chip
      // document.querySelector(".tag-filter-container")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
/*
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".project-card");
    const showAllBtn = document.getElementById("show-all");
    const tags = document.querySelectorAll(".tag-filter-container .tag");
    let activeTag = null;

    function resetCards() {
        cards.forEach(card => card.style.display = "");
    }

    function clearActive() {
        tags.forEach(tag => tag.classList.remove("active"));
        showAllBtn.classList.remove("active");
    }

    // Tag button click
    tags.forEach(tagBtn => {
        tagBtn.addEventListener("click", () => {
            const selectedTag = tagBtn.textContent.trim().toLowerCase();

            // Clicking same tag again toggles off
            if (activeTag === selectedTag) {
                activeTag = null;
                clearActive();
                resetCards();
                return;
            }

            activeTag = selectedTag;
            clearActive();
            tagBtn.classList.add("active");

            cards.forEach(card => {
                const cardTags = Array.from(card.querySelectorAll(".project-tags .tag"))
                    .map(t => t.textContent.trim().toLowerCase());
                card.style.display = cardTags.includes(selectedTag) ? "" : "none";
            });
        });
    });

    // Show All
    showAllBtn.addEventListener("click", () => {
        activeTag = null;
        clearActive();
        showAllBtn.classList.add("active");
        resetCards();
    });
});
*/
