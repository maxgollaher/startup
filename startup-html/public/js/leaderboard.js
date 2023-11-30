document.addEventListener("DOMContentLoaded", createWebSocket);

function createWebSocket() {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    const ws = new WebSocket(`${protocol}://${window.location.host}/ws`);

    ws.onopen = () => {
        console.log("connected");
        loadLeaderboard();
    };

    ws.onmessage = (msg) => {
        loadLeaderboard();
    };

    ws.onclose = () => {
        console.log("disconnected");
        ws.close();
    };
}
