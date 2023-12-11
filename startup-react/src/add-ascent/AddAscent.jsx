import { useEffect } from "react";
import { HeatMap } from "../profile/HeatMap";

export function AddAscent() {

    useEffect(() => {
        if (!localStorage.getItem("user")) {
            window.location.href = "/";
            return;
        }

        const main = document.querySelector("main");
        main.classList.add("d-grid");
    }, []);

    const logClimb = async (e) => {
        e.preventDefault();

        const name = ascentForm.querySelector("#inputName").value;
        const grade = ascentForm.querySelector("#inputGrade").value;
        const send = ascentForm.querySelector("#inputSend").value;
        const date = ascentForm.querySelector("#inputDate").value;

        if (name === "" || send === "" || grade === "" || date === "") {
            alert("Please fill out all fields!");
            return;
        }

        const username = localStorage.getItem("user");
        const ascentObj = {
            name: username,
            grade: grade,
            type: send,
            date: date
        };

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
                window.location.href = "profile";
            }

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            <div class="container">
                <div class="container-fluid">
                    <div class="box box-v-center">
                        <h2>Add an Ascent</h2>
                    </div>
                    <form class="box" id="ascentForm" onSubmit={logClimb}>
                        <div class="mb-3">
                            <label for="inputName" class="form-label">Name</label>
                            <input type="name" class="form-control" id="inputName" />
                        </div>
                        <div class="mb-3">
                            <label for="inputGrade" class="form-label">Grade</label>
                            <select class="form-select" id="inputGrade" aria-label="Climb Grade">
                                <option>5.6</option>
                                <option>5.7</option>
                                <option>5.8</option>
                                <option selected>5.9</option>
                                <option>5.10a</option>
                                <option>5.10b</option>
                                <option>5.10c</option>
                                <option>5.10d</option>
                                <option>5.11a</option>
                                <option>5.11b</option>
                                <option>5.11c</option>
                                <option>5.11d</option>
                                <option>5.12a</option>
                                <option>5.12b</option>
                                <option>5.12c</option>
                                <option>5.12d</option>
                                <option>5.13a</option>
                                <option>5.13b</option>
                                <option>5.13c</option>
                                <option>5.13d</option>
                                <option>5.14a</option>
                                <option>5.14b</option>
                                <option>5.14c</option>
                                <option>5.14d</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="inputSend" class="form-label">Type of Send</label>
                            <select class="form-select" id="inputSend" aria-label="Climb Send">
                                <option selected>Flash</option>
                                <option>Onsight</option>
                                <option>Fell/Rested</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label for="inputDate" class="form-label">Date</label>
                            <input type="date" class="form-control" id="inputDate" />
                        </div>
                        <button type="submit" id="ascentSubmit" class="btn btn-primary hover">Submit</button>
                    </form>
                </div>

                <div class="container-fluid">
                    <div class="box">
                        <h3>Location</h3>
                        <HeatMap markers={false} />
                    </div>
                </div>
            </div>
        </>
    );
}
