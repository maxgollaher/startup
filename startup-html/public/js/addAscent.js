import { Ascent } from "./Ascent.js";

document.addEventListener("DOMContentLoaded", () => {

    const user = localStorage.getItem("user");

    // prevent adding an ascent if not logged in
    if (!user) {
        window.location.href = "./index.html";
    }

    const ascentForm = document.querySelector("#ascentForm");
    const ascentSubmit = document.querySelector("#ascentSubmit");
    ascentSubmit.addEventListener("click", (e) => {
        e.preventDefault();

        const name = ascentForm.querySelector("#inputName").value;
        const grade = ascentForm.querySelector("#inputGrade").value;
        const send = ascentForm.querySelector("#inputSend").value;
        const date = ascentForm.querySelector("#inputDate").value;

        // eventually get the location data from the googlemaps api

        if (name === "" || send === "" || grade === "" || date === "") {
            alert("Please fill out all fields!");
            return;
        }

        const ascentObj = new Ascent(name, grade, send, date);
        const username = JSON.parse(localStorage.getItem("user")).username;

        // add to the userLog/userData array
        try {
            fetch(`/api/userLog/${username}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    climb: ascentObj
                })
            });
            window.location.href = "profile.html";

        } catch (err) {
            console.log(err);
        }



    });

});