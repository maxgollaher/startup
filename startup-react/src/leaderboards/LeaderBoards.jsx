import React from "react";
import { useEffect } from "react";
import { ClimbLog } from "../profile/ClimbLog";

export function Leaderboards() {

    const [socketText, setSocketText] = React.useState("");
    const [reloadFlag, setReloadFlag] = React.useState(false);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            window.location.href = "/";
            return;
        }

        const main = document.querySelector("main");
        main.classList.add("d-grid");

        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        const ws = new WebSocket(`${protocol}://${window.location.host}/ws`);

        ws.onopen = () => {
            console.log("WebSocket connection opened.");
            setSocketText("Waiting for new climbs...");
        };

        ws.onmessage = async (event) => {
            const msg = JSON.parse(await event.data.text());
            const username = msg.username;
            const ascentData = msg.climb;
            console.log(`New climb: ${ascentData.name} ${ascentData.grade} ${ascentData.type}`);
            const climbMsg = `${username} just logged a ${ascentData.grade} ${ascentData.type}!!`;
            setSocketText(climbMsg);
            reloadLeaderboard();
        };


        ws.onclose = () => {
            ws.close();
            console.log("WebSocket connection closed.");
            socketText("Connection closed.");
        };
    }, []);
    
    const reloadLeaderboard = () => {
        setReloadFlag(prevReloadFlag => !prevReloadFlag);
    }

    return (
        <>
            <div class="container grid-rows">
                <div class="box">
                    <h2>Leaderboards</h2>
                    <ClimbLog apiPath={'/api/userData'} reload={reloadFlag} />
                </div>
                <div class="box">
                    <h2>Recent Updates</h2>
                    <p>{socketText}</p>
                </div>
            </div>
        </>
    );
}
