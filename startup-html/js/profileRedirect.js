document.addEventListener("DOMContentLoaded", () => {
    // disable the profile link if the user is not logged in
    const profileLink = document.getElementById("profile-link");
    const user = localStorage.getItem("user");
    if (!user) {
        profileLink.href = "index.html";
    } else {
        profileLink.href = "profile.html";
    }
});