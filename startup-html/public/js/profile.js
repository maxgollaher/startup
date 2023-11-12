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

            data["top send"] ? topSendElement.innerText = data["top send"] : topSendElement.innerText = "N/A";
            data["top flash"] ? topFlashElement.innerText = data["top flash"] : topFlashElement.innerText = "N/A";
            data["top onsight"] ? topOnsightElement.innerText = data["top onsight"] : topOnsightElement.innerText = "N/A";
            data["total ascents"] ? totalAscentsElement.innerText = data["total ascents"] : totalAscentsElement.innerText = "N/A";
        });
});

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
    const username = JSON.parse(localStorage.getItem("user")).username;
    fetch(`/api/markers/${username}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            data.forEach(markerInfo => {
                addMarker(markerInfo.position);
            });
        })
        .catch(error => {
            console.error("Error fetching markers:", error);
        })
}

// Call the initMap function
initMap();

function addMarker(location) {
    new google.maps.Marker({
        position: location,
        map: map
    });
}
