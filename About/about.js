document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const statusBox = document.getElementById("form-status");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Collecting all values
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const reason = document.getElementById("reason").value;
        const message = document.getElementById("message").value.trim();

        // Checking all required fields
        if (!name || !email || !phone || !reason || !message) {
            showStatus("⚠️ Please fill in all required fields.", "error");
            return;
        }

        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            showStatus("📧 Please enter a valid email address.", "error");
            return;
        }

        // South African +27 phone validation
        const phonePattern = /^(\+?\d{9,15})$/;
        if (!phonePattern.test(phone.replace(/\s/g, ""))) {
            showStatus("📱 Please enter a valid phone number (e.g., +27 82 000 0000).", "error");
            return;
        }

        // If everything passes, submit to Formspree (Shout-out Formspree)
        try {
            const response = await fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: { "Accept": "application/json" }
            });

            if (response.ok) {
                showStatus(" Message sent successfully! I'll reply soon.", "success");
                form.reset();
            } else {
                showStatus(" Something went wrong. Please try again.", "error");
            }
        } catch (error) {
            showStatus(" Network error. Please check your connection.", "error");
        }
    });

    function showStatus(message, type) {
        statusBox.textContent = message;
        statusBox.className = type;
        statusBox.style.display = "block";

        // Fade out after 5 seconds
        setTimeout(() => { statusBox.style.display = "none"; }, 5000);
    }
});