const form = document.getElementById("feedbackForm")

form.addEventListener("submit", async (event) => {
    event.preventDefault()

    const studentName = document.getElementById("studentName").value
    const rating = document.getElementById("rating").value
    const comment = document.getElementById("comment").value

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
    })

    const data = await response.json()

    alert(data.message)

    if (response.ok) {
        form.reset()
    }
})