export function RegisterForm() {
    const handleRegister = async (e) => {
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
    }

    return (
        <>
            <form
                className={`register-form`}
                id="registerForm"
                onSubmit={handleRegister}
            >
                <h2 class="title">Register</h2>
                <div class="mb-3">
                    <input type="username" class="form-control" id="registerUsername" aria-describedby="usernameHelp"
                        placeholder="username" />
                </div>
                <div class="mb-3">
                    <input type="email" class="form-control" id="registerEmail" aria-describedby="emailHelp"
                        autocomplete="email" placeholder="email" />
                </div>
                <div class="mb-3">
                    <input type="password" class="form-control" id="registerPassword" placeholder="password"
                        autocomplete="new-password" />
                </div>
                <div class="mb-3">
                    <input type="password" class="form-control" id="registerPasswordConfirm" placeholder="confirm password"
                        autocomplete="new-password" />
                </div>
                <button type="submit" class="btn btn-primary hover" id="registerFormSubmit">Create</button>
            </form>
        </>
    )
}