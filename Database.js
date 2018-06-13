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
    databaseName = "database_mongodb_sinaseifert";
}
// handleConnect wird aufgerufen wenn der Versuch, die Connection zur Datenbank herzustellen, erfolgte
Mongo.MongoClient.connect(databaseURL, handleConnect);
function handleConnect(_e, _db) {
    if (_e)
        console.log("Unable to connect to database, error: ", _e);
    else {
        console.log("Connected to database!");
        db = _db.db(databaseName);
        database_mongodb = db.collection("database_mongodb");
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
            //            let line: string = "";
            //            for (let i: number = 0; i < studentArray.length; i++) {
            //                line += studentArray[i].matrikel + ":" + studentArray[i].name + "," + studentArray[i].firstname + ",";
            //                line += studentArray[i].age + "," + studentArray[i].gender ? "male" : "female" + "," + studentArray[i].courseOfStudies + ",";
            //                line += "\n";
            //            }
            //            _callback(line);
            _callback(JSON.stringify(studentArray));
        //}
    }
}
exports.findAll = findAll;
function find(_callback, matrikel) {
    var cursor = database_mongodb.find({ "matrikel": matrikel }).limit(1);
    cursor.next(prepareAnswer);
    function prepareAnswer(_e, student) {
        if (_e)
            _callback("Error" + _e);
        if (student) {
            console.log(JSON.stringify(student));
            let line = student.matrikel + ":" + student.name + "," + student.firstname + ","
                + student.age + "," + student.gender ? "male" : "female" + "," + student.courseOfStudies;
            console.log(line);
            _callback(line);
        }
        else {
            _callback("Keine Informationen gefunden!");
        }
        //            _callback(JSON.stringify(studentArray[matrikel]));
    }
}
exports.find = find;
//# sourceMappingURL=Database.js.map