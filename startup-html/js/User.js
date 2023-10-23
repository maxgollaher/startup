class User {

    constructor(email, username, password) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.uuid = this.generateUUID();
    }

    generateUUID() {
        return Math.random().toString(16).slice(2);
    }
}

export { User };