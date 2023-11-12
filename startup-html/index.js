const express = require("express");
const yosemiteSort = require("./public/js/jsonToObj.js");
const app = express();
const port = 3000;

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
apiRouter.get('/userData', (_req, res) => {
    res.json(userData);
});

// add a user
apiRouter.post('/userData', (req, res) => {
    const username = req.body.user.username;
    if (userVerify[username] !== undefined || userData[username] !== undefined) {
        res.status(400).json({ "msg": "User already exists!" });
        return;
    }
    userData[username] = {
        "name": username,
        "top send": "",
        "top flash": "",
        "top onsight": "",
        "total ascents": 0
    };
    userVerify[username] = {
        email: req.body.user.email,
        password: req.body.user.password,
        username: username
    };
    res.send(userData);
});

// get a user's stats
apiRouter.get('/userData/:username', (req, res) => {
    const user = req.params.username;
    if (userData[user]) {
        res.send(userData[user]);
    } else {
        res.status(404).send({ msg: "User not found!"});
    }
});


// get the user's log
apiRouter.get('/userLog/:username', (req, res) => {
    const user = req.params.username;
    if (userLogs[user]) {
        res.send(userLogs[user]);
    } else {
        res.send(
            {
                "climbs": [
                    {
                        "name": "",
                        "grade": "",
                        "send": "",
                        "date": ""
                    }
                ]
            }
        );
    }
});

// add a user to the database
apiRouter.post('/userLog', (req, res) => {
    const newUser = req.body.user;
    userLogs.push(newUser);
    res.send(userLogs);
});

// add a climb to the user's log
apiRouter.post('/userLog/:username', (req, res) => {
    const user = req.params.username;
    const newClimb = req.body.climb;

    // update the user's stats
    if (newClimb.type === "Fell/Rested" && (userData[user]["top send"] === "" || yosemiteSort(newClimb.grade, userData[user]["top send"]) === 1)) {
        userData[user]["top send"] = newClimb.grade;
    } else if (newClimb.type === "Flash" && (userData[user]["top flash"] === "" || yosemiteSort(newClimb.grade, userData[user]["top flash"]) === 1)) {
        userData[user]["top flash"] = newClimb.grade;
    } else if (newClimb.type === "Onsight" && (userData[user]["top onsight"] === "" || yosemiteSort(newClimb.grade, userData[user]["top onsight"]) === 1)) {
        userData[user]["top onsight"] = newClimb.grade;
    }
    userData[user]["total ascents"]++;
    userLogs[user].climbs.push(newClimb);
});

// verify a user
apiRouter.post('/verify', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (userVerify[username] && userVerify[username].password === password) {
        res.send(userVerify[username]);
    } else {
        res.status(404).send({ "msg": "Username or Password incorrect!" });
    }
});


apiRouter.get('/markers/:username', (req, res) => {
    const username = req.params.username;
    res.json(markers[username]);
});

apiRouter.post('/markers', (req, res) => {
    const userMarkers = markers[req.body.username];

    // create the user's marker array if it doesn't exist
    if (userMarkers === undefined) {
        markers[req.body.username] = [];
    }
    userMarkers.push(req.body.marker);
});


let userData = {
    "John Smith": {
        "name": "John Smith",
        "top send": "5.9b",
        "top flash": "5.7",
        "top onsight": "5.7",
        "total ascents": 3
    },
    "Jane Doe": {
        "name": "Jane Doe",
        "top send": "5.9a",
        "top flash": "5.8",
        "top onsight": "5.8",
        "total ascents": 0
    },
    "John Doe": {
        "name": "John Doe",
        "top send": "5.9c",
        "top flash": "5.9",
        "top onsight": "5.9",
        "total ascents": 0
    },
    "Jane Smith": {
        "name": "Jane Smith",
        "top send": "5.11",
        "top flash": "5.10a",
        "top onsight": "5.10",
        "total ascents": 0
    },
    "Max": {
        "name": "Max",
        "top send": "5.12",
        "top flash": "5.10b",
        "top onsight": "5.11",
        "total ascents": 0
    },
    "Matt": {
        "name": "Matt",
        "top send": "5.13",
        "top flash": "5.10c",
        "top onsight": "5.12",
        "total ascents": 0
    },
    "Kai": {
        "name": "Kai",
        "top send": "",
        "top flash": "",
        "top onsight": "",
        "total ascents": 0
    }
}


let userLogs = {
    "John Smith": {
        climbs: [
            {
                "name": "The Nose",
                "grade": "5.9b",
                "send": "send",
                "date": "2021-07-01"
            },
            {
                "name": "Curious George",
                "grade": "5.7",
                "send": "flash",
                "date": "2021-06-01"
            },
            {
                "name": "Green Monster",
                "grade": "5.7",
                "send": "onsight",
                "date": "2021-05-01"
            }
        ]
    }
}

let userVerify = {
    "John Smith": {
        email: "John@Smith",
        password: "password",
        username: "John Smith"
    }
}

let markers = {
    "John Smith": [
        { position: { lat: 40.25191879272461, lng: -111.64933776855469 } },
        { position: { lat: 40.26716232299805, lng: -111.63573455810547 } }
    ]  
}
