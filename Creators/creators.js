//Using the similar logic from the game.js
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".project-card");
    const showAllBtn = document.getElementById("show-all");

    // Collect unique tags from all cards
    const tagSet = new Set();
    cards.forEach(card => {
        const cardTags = card.querySelectorAll(".tag");
        cardTags.forEach(tag => tagSet.add(tag.textContent.trim()));
    });

    const tagFilterContainer = document.querySelector(".tag-filter-container");

    // Create buttons for each tag
    tagSet.forEach(tagName => {
        const button = document.createElement("button");
        button.textContent = tagName;
        button.classList.add("tag");
        button.style.cursor = "pointer";
        tagFilterContainer.appendChild(button);
    });

    let activeTag = null;

    function resetCards() {
        cards.forEach(card => card.style.display = "");
    }

    function clearActive() {
        document.querySelectorAll(".tag").forEach(tag => tag.classList.remove("active"));
        showAllBtn.classList.remove("active");
    }

    // Tag filter click
    const allTagButtons = document.querySelectorAll(".tag");
    allTagButtons.forEach(tag => {
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
                const cardTags = Array.from(card.querySelectorAll(".tag")).map(t => t.textContent.trim().toLowerCase());
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