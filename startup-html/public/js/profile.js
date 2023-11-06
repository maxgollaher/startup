// load the dom before running the script
document.addEventListener("DOMContentLoaded", () => {
    const username = document.getElementById("username");
    const logoutButton = document.getElementById("logoutButton");

    // redirect to login page if not logged in
    const user = localStorage.getItem("user");
    if (!user) {
        window.location.href = "index.html";
    }
    username.innerText = JSON.parse(user).email; // currently displays email, but will be changed to username after the database is implemented

    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "index.html";
    });


    // temporary code to display the user's stats, will be replaced with code that pulls from the database
    const topSend = "5.12c";
    const topFlash = "5.11c";
    const topOnsight = "5.12a";
    const totalAscents = 235;

    const topSendElement = document.getElementById("topSend");
    const topFlashElement = document.getElementById("topFlash");
    const topOnsightElement = document.getElementById("topOnsight");
    const totalAscentsElement = document.getElementById("totalAscents");

    topSendElement.innerText = topSend;
    topFlashElement.innerText = topFlash;
    topOnsightElement.innerText = topOnsight;
    totalAscentsElement.innerText = totalAscents;

});