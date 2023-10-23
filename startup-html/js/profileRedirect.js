// disable the profile link if the user is not logged in
document.addEventListener("headerLoaded", () => {
    console.log("headerLoaded");
    const profileLink = document.querySelector("#profileLink");
    console.log(profileLink);

    profileLink.addEventListener("click", (e) => {
        e.preventDefault();

        const user = localStorage.getItem("user");

        console.log(profileLink);

        if (!user) {
            window.location.href = "./index.html";
        } else {
            window.location.href = "./profile.html";
        }
    });

});