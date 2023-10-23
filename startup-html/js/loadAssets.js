
document.addEventListener("DOMContentLoaded", loadHeader);
document.addEventListener("DOMContentLoaded", loadFooter);

function loadHeader() {
    fetch("./assets/header.html")
        .then(response => {
            return response.text()
        })
        .then(data => {
            document.querySelector("header").innerHTML = data;
        });
}

function loadFooter() {
    fetch("./assets/footer.html")
        .then(response => {
            return response.text()
        })
        .then(data => {
            const footer = document.querySelector("footer")
            footer.innerHTML = data;
            footer.classList.add("align-end");
        });
}

