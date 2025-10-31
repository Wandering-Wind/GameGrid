document.getElementById("show-all").addEventListener("click", () => {
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