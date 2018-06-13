/**
 * Simple database insertion and query for MongoDB
 */
import * as Mongo from "mongodb";
//import * as Server from "./Server";
console.log("Database starting");

let databaseURL: string = "mongodb://localhost:27017";
let databaseName: string = "database_mongodb";
let db: Mongo.Db;
let database_mongodb: Mongo.Collection;

// wenn wir auf heroku sind...
if (process.env.NODE_ENV == "production") {
    //    databaseURL = "mongodb://username:password@hostname:port/database";
    databaseURL = "mongodb://testuser:testpasswort1@ds123695.mlab.com:23695/database_mongodb_sinaseifert";
    databaseName = "database_mongodb_sinaseifert";
}

// handleConnect wird aufgerufen wenn der Versuch, die Connection zur Datenbank herzustellen, erfolgte
Mongo.MongoClient.connect(databaseURL, handleConnect);


function handleConnect(_e: Mongo.MongoError, _db: Mongo.Db): void {
    if (_e)
        console.log("Unable to connect to database, error: ", _e);
    else {
        console.log("Connected to database!");
        db = _db.db(databaseName);
        database_mongodb = db.collection("database_mongodb");
    }
}

export function insert(_doc: StudentData): void {
    database_mongodb.insertOne(_doc, handleInsert);
}

function handleInsert(_e: Mongo.MongoError): void {
    console.log("Database insertion returned -> " + _e);
}


export function findAll(_callback: Function): void {
    var cursor: Mongo.Cursor = database_mongodb.find();
    cursor.toArray(prepareAnswer);

    function prepareAnswer(_e: Mongo.MongoError, studentArray: StudentData[]): void {
        if (_e)
            _callback("Error" + _e);
       else //{
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

export function find(_callback: Function, matrikel: number): void {
    var cursor: Mongo.Cursor = database_mongodb.find({ "matrikel": matrikel }).limit(1);
    cursor.next(prepareAnswer);

    function prepareAnswer(_e: Mongo.MongoError, student: StudentData): void {
        if (_e)
            _callback("Error" + _e);
        if (student) {
            console.log(JSON.stringify(student))
            
            _callback(buildResponseString(student)); 
        }
        else {
            _callback("Keine Informationen gefunden!");
        }

            //            _callback(JSON.stringify(studentArray[matrikel]));
    }
    
}

function buildResponseString(student: StudentData): string {
    return student.matrikel + ": " + student.name + ", " + student.firstname + ", Alter: " + student.age + ", Studiengang: " + student.courseOfStudies + ", Geschlecht: " + student.gender ? "Männlich" : "Weiblich";    
}