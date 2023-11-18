const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');

const authCookieName = 'token';

const port = 4000;

const jsonFuncs = require("./public/js/jsonToObj.js");
const yosemiteSort = jsonFuncs.yosemiteSort;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Trust headers that are forwarded from the proxy so we can determine IP addresses
app.set('trust proxy', true);

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// create a new user
apiRouter.post('/auth/create', async (req, res) => {
    const username = req.body.user.username;
    if (await DB.getUser(username)) {
        res.status(400).json({ "msg": "User already exists!" });
        return;
    }
    const user = await DB.createUser(username, req.body.user.email, req.body.user.password);

    // Set the cookie
    setAuthCookie(res, user.token);
    res.send({ id: user._id, });
    return;
});

// verify a user
apiRouter.post('/auth/login', async (req, res) => {
    foundUser = await DB.getUser(req.body.username);
    if (foundUser) {
        if (await bcrypt.compare(req.body.password, foundUser.password)) {
            setAuthCookie(res, foundUser.token);
            res.send({ id: foundUser._id });
            return;
        }
    }
    res.status(404).send({ "msg": "User not found!" });
});

// DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', (_req, res) => {
    res.clearCookie(authCookieName);
    res.status(204).end();
});

// secureApiRouter verifies credentials for endpoints
var secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
    authToken = req.cookies[authCookieName];
    console.log(authToken);
    const user = await DB.getUserByToken(authToken);
    if (user) {
        next();
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});

// get a user's stats
secureApiRouter.get('/userData/:username', async (req, res) => {
    const foundUser = await DB.getUserData(req.params.username);
    if (!foundUser) {
        res.status(404).send({ msg: "User not found!" });
        return;
    }
    res.send(foundUser);
});

// get the entire leaderboard
secureApiRouter.get('/userData', async (_req, res) => {
    const userData = await DB.findAllUserData();
    res.send(userData);
});

// get the user's log
secureApiRouter.get('/userLog/:username', async (req, res) => {
    const user = req.params.username;
    const userLog = await DB.getUserLog(user);
    res.json(userLog);
});

// add a climb to the user's log
secureApiRouter.post('/userLog/:username', async (req, res) => {
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

secureApiRouter.get('/markers/:username', async (req, res) => {
    const username = req.params.username;
    const markers = await DB.getMarkers(username);
    res.send(markers);
});

secureApiRouter.post('/markers', async (req, res) => {
    const username = req.body.username;
    const marker = req.body.marker;
    await DB.addMarker(username, marker);
});

// Default error handler
app.use(function (err, req, res, next) {
    res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
    res.cookie(authCookieName, authToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    });
}

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});



