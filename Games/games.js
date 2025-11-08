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
  // Top filter controls
  const barTags    = document.querySelectorAll(".tag-filter-container .tag"); // Game Jam / Portfolio Project / Group Project
  const showAllBtn = document.getElementById("show-all");

  // Cards to show/hide
  const cards      = Array.from(document.querySelectorAll(".project-card"));

  // Per-card tag chips (clicking these should also filter + sync the top bar)
  const cardTags   = document.querySelectorAll(".project-card .project-tags .tag");

  let activeTag = null; // normalized, e.g. "game jam"

  const norm = (s = "") => s.trim().toLowerCase();

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

    // show/hide cards (supports multiple comma-separated tags in data-tags)
    cards.forEach(card => {
      const raw   = card.dataset.tags || "";
      const parts = raw.split(",").map(norm); // e.g. "game jam, group project"
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
      // Optional: scroll the filter bar into view so the highlight is visible
      // document.querySelector(".tag-filter-container")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    li.addEventListener("click", (e) => {
      e.stopPropagation(); // don’t bubble into card/figure image clicks
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


//GSAP stuffs
