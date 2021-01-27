document.addEventListener("DOMContentLoaded", function() {
    const BUTTONS = document.querySelectorAll(".horizontal-container-next")

    BUTTONS.forEach((button) => {
        button.addEventListener("click", function () {
            // const ID = this.id.replace("-btn", "")
            const nodes = this.parentElement.parentElement.parentElement.childNodes

            nodes.forEach((node) => {
                let translateX = new WebKitCSSMatrix(
                        window.getComputedStyle(node).transform
                    ).m41 - 100
                node.style.transform = "translateX(" + translateX + "vw)"
            })
        })
    })
});