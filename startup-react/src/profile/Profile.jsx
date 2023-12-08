import React, { useState, useEffect } from 'react';
import { HeatMap } from './HeatMap';

export function Profile() {
    const [userData, setUserData] = useState({
        username: '',
        topSend: 'N/A',
        topFlash: 'N/A',
        topOnsight: 'N/A',
        totalAscents: 'N/A'
    });

    const logout = async () => {
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
                return;
            }
            localStorage.removeItem("user");
            window.location.href = "/";
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            window.location.href = "/";
            return;
        }

        const loadStats = async () => {
            const user = localStorage.getItem("user");
            try {
                const response = await fetch(`/api/userData/${user}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
                const data = await response.json();
                setUserData({
                    username: user,
                    topSend: data["top send"] || 'N/A',
                    topFlash: data["top flash"] || 'N/A',
                    topOnsight: data["top onsight"] || 'N/A',
                    totalAscents: data["total ascents"] || 'N/A'
                });
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        loadStats();
    }, []);

    return (
        <div className="container">
            <div className="container-fluid">
                <div class="box box-v-center">
                    <h2>Welcome {userData.username}!</h2>
                    <button type="button" className="btn btn-primary hover" onClick={logout}>Logout</button>
                </div>

                <div className="container-sm box box-v-center box-no-margin">
                    <div className="box hover bg-dark">
                        <h3>Top Send</h3>
                        <h4>{userData.topSend}</h4>
                    </div>
                    <div className="box hover bg-dark">
                        <h3>Top Flash</h3>
                        <h4>{userData.topFlash}</h4>
                    </div>
                    <div className="box hover bg-dark">
                        <h3>Top Onsight</h3>
                        <h4>{userData.topOnsight}</h4>
                    </div>
                    <div className="box hover bg-dark">
                        <h3>Total Ascents</h3>
                        <h4>{userData.totalAscents}</h4>
                    </div>
                </div>

                <div class="box">
                    <h3>Climbing Log</h3>
                    <p>
                        <a class="btn btn-primary hover" href="add-ascent.html" role="button">Add Ascent</a>
                    </p>

                    <div id="jsonTable"></div>
                </div>
            </div>


            <div class="container-fluid">
                <div class="box">
                    <h3>Climbing Heat Map</h3>
                    <HeatMap />
                </div>
            </div>
        </div>
    );
}

export default Profile;
