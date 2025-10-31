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
    const tags = document.querySelectorAll(".tag");
    const cards = document.querySelectorAll(".project-card");
    const showAllBtn = document.getElementById("show-all");
    let activeTag = null;

    function resetCards() {
        cards.forEach(card => card.style.display = "");
    }

    function clearActive() {
        tags.forEach(tag => tag.classList.remove("active"));
        showAllBtn.classList.remove("active");
    }

    // Tag filter click
    tags.forEach(tag => {
        tag.style.cursor = "pointer";

        tag.addEventListener("click", () => {
            const selectedTag = tag.textContent.trim().toLowerCase();

            // Clicking same tag again toggles off
            if (activeTag === selectedTag) {
                activeTag = null;
                clearActive();
                resetCards();
                return;
            }

            activeTag = selectedTag;
            clearActive();
            tag.classList.add("active");

            cards.forEach(card => {
                const cardTags = card.dataset.tags.toLowerCase();
                card.style.display = cardTags.includes(selectedTag) ? "" : "none";
            });
        });
    });

    // Show All logic
    showAllBtn.addEventListener("click", () => {
        activeTag = null;
        clearActive();
        showAllBtn.classList.add("active");
        resetCards();
    });
});