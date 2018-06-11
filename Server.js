"use strict";
const Url = require("url");
const Http = require("http");
var Node;
(function (Node) {
    console.log("Server starting");
    let studis = {};
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
        let command = query["command"].toString();
        let student;
        switch (command) {
            case "addStudent":
                console.log("addStudent");
                student = JSON.parse(query["data"].toString());
                studis[student.matrikel.toString()] = student;
                respond(_response, "Student hinzugefügt");
                break;
            case "studentsRefresh":
                console.log("studentsRefresh");
                respond(_response, JSON.stringify(studis));
                break;
            case "searchStudent":
                console.log("searchStudent");
                let matrikel = query["data"].toString();
                student = studis[matrikel];
                console.log(student);
                if (student != undefined) {
                    respond(_response, JSON.stringify(student));
                }
                else {
                    respond(_response, "Keine passenden Informationen gefunden!");
                }
                break;
            default:
                respond(_response, "unknown command: " + command);
                break;
        }
    }
    function respond(_response, _text) {
        //console.log("Preparing response: " + _text);
        //        _response.setHeader("Access-Control-Request-Method", "*");
        //        _response.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.write(_text);
        console.log("Ich habe geantwortet!");
        _response.end();
    }
})(Node || (Node = {}));
//# sourceMappingURL=Server.js.map