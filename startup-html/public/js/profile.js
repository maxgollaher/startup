document.addEventListener("DOMContentLoaded", async () => {
        // redirect to login page if not logged in
    const user = localStorage.getItem("user");
    if (!user) {
        window.location.href = "index.html";
    }
    username.innerText = user; // display the username

    await loadStats();
    await initMap();

    const logoutButton = document.getElementById("logoutButton");
    logoutButton.addEventListener("click", logout);
});

async function loadStats() {
    const user = localStorage.getItem("user");
    // pull the stats from the api
    try {
        const response = await fetch(`/api/userData/${user}`);
        const data = await response.json();

        const topSendElement = document.getElementById("topSend");
        const topFlashElement = document.getElementById("topFlash");
        const topOnsightElement = document.getElementById("topOnsight");
        const totalAscentsElement = document.getElementById("totalAscents");

        data["top send"] ? topSendElement.innerText = data["top send"] : topSendElement.innerText = "N/A";
        data["top flash"] ? topFlashElement.innerText = data["top flash"] : topFlashElement.innerText = "N/A";
        data["top onsight"] ? topOnsightElement.innerText = data["top onsight"] : topOnsightElement.innerText = "N/A";
        data["total ascents"] ? totalAscentsElement.innerText = data["total ascents"] : totalAscentsElement.innerText = "N/A";
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}

async function logout() {
    try {
        const response = await fetch(`/api/auth/logout`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            const data = await response.json();
            alert(data.msg);
            return
        }
        localStorage.removeItem("user");
        window.location.href = "index.html";
    } catch (error) {
        console.log(error);
    }
}

let map;

async function initMap() {
    // Replace the center with the coordinates of BYU
    const center = { lat: 40.25191879272461, lng: -111.64933776855469 };

    // Import the necessary libraries
    const { Map } = await google.maps.importLibrary("maps");

    // Create the map
    map = new Map(document.getElementById("map"), {
        zoom: 14,
        center: center,
        mapId: "HEAT_MAP",
    });

    // get the list of markers from the api
    const username = localStorage.getItem("user");
    fetch(`/api/markers/${username}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            data.markers.forEach(markerInfo => {
                addMarker(markerInfo.position);
            });
        })
        .catch(error => {
            console.error("Error fetching markers:", error);
        })
}

function addMarker(location) {
    new google.maps.Marker({
        position: location,
        map: map
    });
}
