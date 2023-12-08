const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}/`;
const client = new MongoClient(url);
const db = client.db('startup');
const userData = db.collection('userData');
const userLogs = db.collection('userLogs');
const userVerify = db.collection('userVerify');
const markers = db.collection('markers');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
})().catch((ex) => {
  console.log(`Unable to connect to database with ${url} because ${ex.message}`);
  process.exit(1);
});

async function createUser(username, email, password) {
  // hash the password before inserting it into the database
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    username: username,
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  }

  // create the user in the database
  await addData({
    "name": username,
    "top send": "",
    "top flash": "",
    "top onsight": "",
    "total ascents": 0
  });
  await addVerify(user);
  await addMarkers({
    username: username,
    markers: []
  });
  await addLog({
    username: username,
    climbs: []
  })
  return user;
}

async function addData(score) {
  return await userData.insertOne(score);
}

async function addVerify(score) {
  return await userVerify.insertOne(score);
}

async function addMarkers(score) {
  return await markers.insertOne(score);
}

async function addLog(score) {
  return await userLogs.insertOne(score);
}

// findAll for userData
async function findAllUserData() {
  const projection = { _id: 0 };
  const cursor = userData.find({}, { projection });
  return cursor.toArray();
}

async function getUserData(username) {
  return userData.findOne({ name: username });
}

async function getUserLog(username) {
  return userLogs.findOne({ username: username });
}

async function getUserByToken(token) {
  return userVerify.findOne({ token: token });
}

// adds a climb to the user's log
async function updateUserLog(username, climb) {
  const query = { username: username };
  const update = { $push: { climbs: climb } };
  return await userLogs.updateOne(query, update);
}

// update the user's stats
async function updateUserData(username, newData) {
  const query = { name: username };
  const { name, ...updatedData } = newData;
  const update = { $set: updatedData };
  return await userData.updateOne(query, update);
}

// finds a user by username in the userVerify collection
async function getUser(username) {
  const foundUser = userVerify.findOne({ username: username });
  return foundUser;
}

// gets a user's markers
async function getMarkers(username) {
  return markers.findOne({ username: username });
}

// adds a marker to a user's markers
async function addMarker(username, marker) {
  const query = { username: username };
  const update = { $push: { markers: marker } };
  return await markers.updateOne(query, update);
}


module.exports = {
  getUserData,
  addData,
  addVerify,
  addMarkers,
  addLog,
  findAllUserData,
  getUserLog,
  updateUserLog,
  updateUserData,
  getMarkers,
  addMarker,
  getUser,
  createUser,
  getUserByToken
};
