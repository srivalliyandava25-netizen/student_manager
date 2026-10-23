
const form = document.getElementById("feedbackForm");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const studentName = document.getElementById("studentName").value.trim();
    const rating = document.getElementById("rating").value;
    const comment = document.getElementById("comment").value.trim();

    try {
        const response = await fetch("/feedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: studentName,
                rating: Number(rating),
                comments: comment
            })
        });

        const data = await response.json();

        alert(data.message || "Request completed");

        if (response.ok) {
            form.reset();
        }
    } catch (error) {
        console.error("Feedback submission failed:", error);
        alert("Unable to connect to the server. Please try again.");
    }
});
