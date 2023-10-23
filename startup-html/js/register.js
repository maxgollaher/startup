import { User } from "./User.js";

// load the dom before running the script
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.querySelector("#register-form");
    const registerButton = document.querySelector("#register-form-submit");

    registerButton.addEventListener("click", (e) => {
        e.preventDefault();

        const username = registerForm.querySelector("#registerUsername").value;
        const email = registerForm.querySelector("#registerEmail").value;
        const password = registerForm.querySelector("#registerPassword").value;
        const passwordConfirm = registerForm.querySelector(
            "#registerPasswordConfirm"
        ).value;

        if (username === "" || email === "" || password === "" || passwordConfirm === "") {
            alert("Please fill out all fields!");
            return;
        }

        if (password !== passwordConfirm) {
            alert("Passwords do not match!");
            return;
        }

        const user = new User(email, username, password);

        // eventually add the user to the database here

        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "profile.html";

    });
});