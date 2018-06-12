"use strict";
/**
 * Simple database insertion and query for MongoDB
 */
const Mongo = require("mongodb");
//import * as Server from "./Server";
console.log("Database starting");
let databaseURL = "mongodb://localhost:27017";
let databaseName = "database_mongodb";
let db;
let database_mongodb;
// wenn wir auf heroku sind...
if (process.env.NODE_ENV == "production") {
    //    databaseURL = "mongodb://username:password@hostname:port/database";
    databaseURL = "mongodb://testuser:testpasswort1@ds123695.mlab.com:23695/database_mongodb_sinaseifert";
    databaseName = "database_mongodb";
}
// handleConnect wird aufgerufen wenn der Versuch, die Connection zur Datenbank herzustellen, erfolgte
Mongo.MongoClient.connect(databaseURL, handleConnect);
function handleConnect(_e, _db) {
    if (_e)
        console.log("Unable to connect to database, error: ", _e);
    else {
        console.log("Connected to database!");
        db = _db.db(databaseName);
        database_mongodb = db.collection("students");
    }
}
function insert(_doc) {
    database_mongodb.insertOne(_doc, handleInsert);
}
exports.insert = insert;
function handleInsert(_e) {
    console.log("Database insertion returned -> " + _e);
}
function findAll(_callback) {
    var cursor = database_mongodb.find();
    cursor.toArray(prepareAnswer);
    function prepareAnswer(_e, studentArray) {
        if (_e)
            _callback("Error" + _e);
        else
            _callback(JSON.stringify(studentArray));
    }
}
exports.findAll = findAll;
function find(_callback, matrikel) {
    var cursor = database_mongodb.find({ "matrikel": matrikel });
    cursor.toArray(prepareAnswer);
    function prepareAnswer(_e, _matrikel) {
        if (_e)
            _callback("Error" + _e, false);
        else {
            if (_matrikel.length >= 1) {
                _callback(JSON.stringify(_matrikel[0]), true);
            }
        }
    }
}
exports.find = find;
//# sourceMappingURL=Database.js.map