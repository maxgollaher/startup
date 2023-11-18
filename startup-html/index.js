const express = require("express");
const jsonFuncs = require("./public/js/jsonToObj.js");
const yosemiteSort = jsonFuncs.yosemiteSort;
const app = express();
const DB = require('./database.js');

const port = process.argv.length > 2 ? process.argv[2] : 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Return the application's default page if the path is unknown
app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

// get leaderboard
apiRouter.get('/userData', async (_req, res) => {
    const userData = await DB.findAllUserData();
    res.send(userData);
});

// add a user
apiRouter.post('/userData', async (req, res) => {
    const username = req.body.user.username;
    const userFound = await DB.userExists(username);
    if (userFound) {
        res.status(400).json({ "msg": "User already exists!" });
        return;
    }
    const userData = {
        "name": username,
        "top send": "",
        "top flash": "",
        "top onsight": "",
        "total ascents": 0
    };

    // create the user in the database
    await DB.addData(userData);
    await DB.addVerify({
        username: username,
        email: req.body.user.email,
        password: req.body.user.password
    });
    await DB.addMarkers({
        username: username,
        markers: []
    });
    await DB.addLog({
        username: username,
        climbs: [
        ]
    })
    res.send(userData);
});

// get a user's stats
apiRouter.get('/userData/:username', async (req, res) => {
    const user = req.params.username;
    const foundUser = await DB.getUserData(user);
    if (foundUser) {
        res.send(foundUser);
    } else {
        res.status(404).send({ msg: "User not found!" });
    }
});


// get the user's log
apiRouter.get('/userLog/:username', async (req, res) => {
    const user = req.params.username;
    const userLog = await DB.getUserLog(user);
    res.json(userLog);
});

// add a climb to the user's log
apiRouter.post('/userLog/:username', async (req, res) => {
    const user = req.params.username;
    const newClimb = req.body.climb;

    const userData = await DB.getUserData(user);

    // add the field to the user's log if necessary
    switch (newClimb.type) {
        case "Fell/Rested":
            if (userData["top send"] === undefined) {
                userData["top send"] = "";
            }
            break;
        case "Flash":
            if (userData["top flash"] === undefined) {
                userData["top flash"] = "";
            }
            break;
        case "Onsight":
            if (userData["top onsight"] === undefined) {
                userData["top onsight"] = "";
            }
            break;
    }

    // update the user's stats
    if (newClimb.type === "Fell/Rested" && (userData["top send"] === "" || yosemiteSort(newClimb.grade, userData["top send"]) === 1)) {
        userData["top send"] = newClimb.grade;
    } else if (newClimb.type === "Flash" && (userData["top flash"] === "" || yosemiteSort(newClimb.grade, userData["top flash"]) === 1)) {
        userData["top flash"] = newClimb.grade;
    } else if (newClimb.type === "Onsight" && (userData["top onsight"] === "" || yosemiteSort(newClimb.grade, userData["top onsight"]) === 1)) {
        userData["top onsight"] = newClimb.grade;
    }
    userData["total ascents"]++;
    await DB.updateUserData(user, userData);
    await DB.updateUserLog(user, newClimb);
    res.send(userData);
});

// verify a user
apiRouter.post('/verify', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    foundUser = await DB.verifyUser(username, password);
    if (foundUser) {
        res.send(foundUser);
    } else {
        res.status(404).send({ "msg": "Username or Password incorrect!" });
    }
});


apiRouter.get('/markers/:username', async (req, res) => {
    const username = req.params.username;
    const markers = await DB.getMarkers(username);
    res.send(markers);
});

apiRouter.post('/markers', async (req, res) => {
    const username = req.body.username;
    const marker = req.body.marker;
    await DB.addMarker(username, marker);
});


