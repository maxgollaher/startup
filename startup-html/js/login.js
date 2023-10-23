import { User } from "./User.js"; 

// load the dom before running the script
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login-form");
    const loginButton = document.querySelector("#login-form-submit");

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();

        const email = loginForm.querySelector("#inputEmail").value;
        const password = loginForm.querySelector("#inputPassword").value;

        if (email === "" || password === "") {
            alert("Please fill out all fields!");
            return;
        }

        // before SQL database is implemented, just create a user object instead of finding and verifying the User object in the database
        const user = new User(email, "username", password);

        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "profile.html";
    });
});
