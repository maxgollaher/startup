export function LoginForm() {
    const handleLogin = async (e) => {
        e.preventDefault();
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
                window.location.href = "profile";
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <form
                className={`login-form`}
                id="loginForm"
                onSubmit={handleLogin}
            >
                <h2 class="title">Login</h2>
                <div class="mb-3">
                    <input type="text" class="form-control" id="inputEmail" aria-describedby="usernameHelp" autocomplete="username"
                        placeholder="username" />
                </div>
                <div class="mb-3">
                    <input type="password" class="form-control" id="inputPassword" placeholder="password"
                        autocomplete="current-password" />
                </div>
                <button type="submit" class="btn btn-primary hover" id="loginFormSubmit">Login</button>
            </form>

        </>

    );
}