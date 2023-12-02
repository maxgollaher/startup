document.addEventListener("DOMContentLoaded", createWebSocket);

function createWebSocket() {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    const ws = new WebSocket(`${protocol}://${window.location.host}/ws`);

    ws.onopen = () => {
        loadLeaderboard();
        console.log("WebSocket connection opened.");
        document.getElementById("webSocket").innerText    = "Waiting for new climbs...";
    };

    ws.onmessage = async (event) => {
        const msg = JSON.parse(await event.data.text());
        const socketElement = document.getElementById("webSocket");

        const ascentData = msg.climb;
        console.log(`New climb: ${ascentData.name} ${ascentData.grade} ${ascentData.type}`);
        const climbMsg = `${ascentData.name} just logged a ${ascentData.grade} ${ascentData.type}!!`;

        socketElement.innerText = climbMsg;

        loadLeaderboard(false);
    };


    ws.onclose = () => {
        ws.close();
        console.log("WebSocket connection closed.");
        document.getElementById("webSocket").innerText    = "Connection closed.";
    };
}
