/**
 * Simple server managing between client and database
 * @author: Jirka Dell'Oro-Friedl
 */
"use strict";
const Http = require("http");
const Url = require("url");
const Database = require("./Database");
console.log("Server tarting");
let port = process.env.PORT;
if (port == undefined)
    port = 8100;
let server = Http.createServer();
server.addListener("listening", handleListen);
server.addListener("request", handleRequest);
server.listen(port);
function handleListen() {
    console.log("Listening on port: " + port);
}
function handleRequest(_request, _response) {
    console.log("Request received");
    let query = Url.parse(_request.url, true).query;
    var command = query["command"];
    switch (command) {
        case "insert":
            //            let student: StudentData = {
            //                name: query["name"],
            //                firstname: query["firstname"],
            //                matrikel: parseInt(query["matrikel"]),
            //                age: parseInt(query["age"]),
            //                gender: Boolean(query["gender"]),
            //                courseOfStudies: query["courseOfStudies"]
            //            };
            _response.write("addStudent");
            //            Database.insert(student);
            //            respond(_response, "storing data");
            break;
        case "refresh":
            _response.write(Database.findAll);
            //            Database.findAll(function(json: string): void {
            //                respond(_response, json);
            //            });
            break;
        case "find":
            Database.find(function (student, proof) {
                if (proof) {
                    _response.write(student);
                    _response.end();
                }
                else
                    console.log(student);
            }, parseInt(query["data"]));
            break;
        default:
            respond(_response, "unknown command: " + command);
            break;
    }
}
function respond(_response, _text) {
    //console.log("Preparing response: " + _text);
    _response.setHeader("Access-Control-Allow-Origin", "*");
    _response.setHeader("content-type", "text/html; charset=utf-8");
    _response.write(_text);
    _response.end();
}
//# sourceMappingURL=Server.js.map