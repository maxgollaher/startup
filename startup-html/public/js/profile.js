// load the dom before running the script
document.addEventListener("DOMContentLoaded", () => {
    const username = document.getElementById("username");
    const logoutButton = document.getElementById("logoutButton");

    // redirect to login page if not logged in
    var user = localStorage.getItem("user");
    if (!user) {
        window.location.href = "index.html";
    }
    user = JSON.parse(user);
    username.innerText = user.username; // display the username

    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "index.html";
    });

    // pull the stats from the api
    fetch(`/api/userData/${user.username}`)
        .then(response => {
            return response.json()
        })
        .then(data => {
            const topSendElement = document.getElementById("topSend");
            const topFlashElement = document.getElementById("topFlash");
            const topOnsightElement = document.getElementById("topOnsight");
            const totalAscentsElement = document.getElementById("totalAscents");

            topSendElement.innerText = data["top send"];
            topFlashElement.innerText = data["top flash"];
            topOnsightElement.innerText = data["top onsight"];
            totalAscentsElement.innerText = data["total ascents"]
        });
});