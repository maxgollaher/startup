document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.querySelector("#registerForm");
    const registerButton = document.querySelector("#registerFormSubmit");

    registerButton.addEventListener("click", async (e) => {
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

        const user = {
            username: username,
            email: email,
            password: password
        };

        // add the user to the database
        try {
            const res = await fetch(`/api/auth/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user: user
                })
            });

            if (!res.ok) {
                const data = await res.json();
                alert(data.msg);
                return;
            }

            localStorage.setItem("user", username);
            window.location.href = "profile.html";
        } catch (err) {
            console.log(err);
        }
    });
});
