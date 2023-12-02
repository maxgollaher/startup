document.addEventListener("DOMContentLoaded", () => {

    const user = localStorage.getItem("user");

    // prevent adding an ascent if not logged in
    if (!user) {
        window.location.href = "./index.html";
    }

    const ascentForm = document.querySelector("#ascentForm");
    const ascentSubmit = document.querySelector("#ascentSubmit");
    ascentSubmit.addEventListener("click", async (e) => {
        e.preventDefault();

        const name = ascentForm.querySelector("#inputName").value;
        const grade = ascentForm.querySelector("#inputGrade").value;
        const send = ascentForm.querySelector("#inputSend").value;
        const date = ascentForm.querySelector("#inputDate").value;

        if (name === "" || send === "" || grade === "" || date === "") {
            alert("Please fill out all fields!");
            return;
        }

        const ascentObj = {
            name: name,
            grade: grade,
            type: send,
            date: date
        };
        const username = localStorage.getItem("user");

        // add to the userLog/userData array
        try {
            const response = await fetch(`/api/userLog/${username}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    climb: ascentObj
                })
            });
            if (!response.ok) {
                const data = await response.json();
                console.log(data);
                return;
            }

            // create websocket connection to reload the leaderboard
            const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
            const ws = new WebSocket(`${protocol}://${window.location.host}/ws`);
            ws.onopen = async () => {
                await ws.send(JSON.stringify({
                    climb: ascentObj
                }));
                ws.close();
            };

            // redirect to the profile page
            ws.onclose = () => {
                window.location.href = "./profile.html";
            }

        } catch (err) {
            console.error(err);
            // Handle errors such as network issues or exceptions
        }
    });
});

let map;

async function initMap() {
    // Replace the center with the coordinates of BYU
    const center = { lat: 40.25191879272461, lng: -111.64933776855469 };

    // Import the necessary libraries
    const { Map } = await google.maps.importLibrary("maps");

    const mapOptions = {
        zoom: 14,
        center: center,
        mapId: "HEAT_MAP",
        mapTypeId: google.maps.MapTypeId.HYBRID,
    };

    // Create the map
    map = new Map(document.getElementById("map"), mapOptions);

    map.addListener('click', function (event) {
        addMarker(event.latLng);
    });
}

// Call the initMap function
initMap();

function addMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });

    // extract marker data
    const markerData = {
        position: marker.getPosition().toJSON()
    };

    const username = localStorage.getItem("user");

    try {
        fetch(`/api/markers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                marker: markerData
            })
        });
    } catch (err) {
        console.error(err);
    }
}
