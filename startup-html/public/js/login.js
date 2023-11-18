document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.querySelector("#loginFormSubmit");

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        login();
    });
});

async function login() {
    const loginForm = document.querySelector("#loginForm");
    const username = loginForm.querySelector("#inputEmail").value;
    const password = loginForm.querySelector("#inputPassword").value;

    if (username === "" || password === "") {
        alert("Please fill out all fields!");
        return;
    }

    // verify the user
    try {
        const res = await fetch(`/api/auth/login`, {
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
        } else {
            localStorage.setItem("user", username);
            window.location.href = "profile.html";
        }
    } catch (err) {
        console.log(err);
    }
};
