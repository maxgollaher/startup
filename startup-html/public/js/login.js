import { User } from "./User.js";

// load the dom before running the script
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#loginForm");
    const loginButton = document.querySelector("#loginFormSubmit");

    loginButton.addEventListener("click", async (e) => {
        e.preventDefault();

        const username = loginForm.querySelector("#inputEmail").value;
        const password = loginForm.querySelector("#inputPassword").value;

        if (username === "" || password === "") {
            alert("Please fill out all fields!");
            return;
        }

        // verify the user
        try {
            const res = await fetch(`/api/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            if (!res.ok) {
                const data = await res.json();
                alert(data.msg);
                return;
            }
            const data = await res.json();
            localStorage.setItem("user", JSON.stringify(data));
            window.location.href = "profile.html";
        } catch (err) {
            console.log(err);
        }
    });
});
