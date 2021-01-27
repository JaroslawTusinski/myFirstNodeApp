document.addEventListener("DOMContentLoaded", function() {
    const LOADING_CONTAINER = document.querySelectorAll(".loading-container")

    LOADING_CONTAINER.forEach((container) => {
        container.classList.toggle("hide")
    })
});