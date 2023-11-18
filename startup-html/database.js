const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

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

// findAll for userData
async function findAllUserData() {
  const projection = { _id: 0 };
  const cursor = userData.find({}, { projection });
  return cursor.toArray();
}

async function addData(score) {
  const result = await userData.insertOne(score);
  return result;
}

async function addVerify(score) {
  const result = await userVerify.insertOne(score);
  return result;
}

async function addMarkers(score) {
  const result = await markers.insertOne(score);
  return result;
}

async function addLog(score) {
  const result = await userLogs.insertOne(score);
  return result;
}

async function getUserData(username) {
  const query = { name: username };
  const cursor = userData.findOne(query);
  return cursor;
}

async function getUserLog(username) {
  const query = { username: username };
  const userLog = userLogs.findOne(query);
  return userLog;
}

// adds a climb to the user's log
async function updateUserLog(username, climb) {
  const query = { username: username };
  const update = { $push: { climbs: climb } };
  const result = await userLogs.updateOne(query, update);
  return result;
}

// update the user's stats
async function updateUserData(username, newData) {
  const query = { name: username };
  const { name, ...updatedData } = newData;
  const update = { $set: updatedData };
  const result = await userData.updateOne(query, update);
  return result;
}

// verifies a user
async function verifyUser(username, password) {
  const query = { username: username, password: password };
  const cursor = userVerify.findOne(query);
  return cursor;
}

async function userExists(username) {
  const query = { username: username };
  const cursor = userVerify.findOne(query);
  return cursor;
}

// gets a user's markers
async function getMarkers(username) {
  const query = { username: username };
  const cursor = markers.findOne(query);
  return cursor;
}

// adds a marker to a user's markers
async function addMarker(username, marker) {
  const query = { username: username };
  const update = { $push: { markers: marker } };
  const result = await markers.updateOne(query, update);
  return result;
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
  verifyUser,
  getMarkers,
  addMarker,
  userExists
};
