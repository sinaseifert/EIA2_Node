"use strict";
const Url = require("url");
const Http = require("http");
var Node;
(function (Node) {
    let studiHomoAssoc = {};
    let port = process.env.PORT;
    if (port == undefined)
        port = 8100;
    let server = Http.createServer();
    server.addListener("listening", handleListen);
    server.addListener("request", handleRequest);
    server.addListener("request", respond);
    server.listen(port);
    function handleListen() {
        console.log("Ich höre...");
    }
    function handleRequest(_request, _response) {
        let query = Url.parse(_request.url, true).query;
        if (query["method"]) {
            switch (query["method"]) {
                case "insert":
                    insert(query, _response);
                    break;
                case "refresh":
                    refresh(_response);
                    break;
                case "search":
                    search(query, _response);
                    break;
                default:
                    respond(_response, "Fehler aufgetreten");
            }
        }
        _response.end();
    }
    function insert(query, _response) {
        let student = JSON.parse(query["matrikel"].toString());
        let name = student.name;
        let firstname = student.firstname;
        let matrikel = student.matrikel.toString();
        let age = student.age;
        let gender = student.gender;
        let courseOfStudies = student.courseOfStudies;
        let studis;
        studis = {
            name: name,
            firstname: firstname,
            matrikel: parseInt(matrikel),
            age: age,
            gender: gender,
            courseOfStudies: courseOfStudies
        };
        studiHomoAssoc[matrikel] = studis;
        _response.write("addedStudent");
    }
    function refresh(_response) {
        for (let matrikel in studiHomoAssoc) {
            let studi = studiHomoAssoc[matrikel];
            let line = matrikel + ":";
            line += studi.name + ", " + studi.firstname + ", " + studi.age + " Jahre ";
            line += studi.gender ? "(M)" : "(F)" + ", ";
            line += studi.courseOfStudies;
            _response.write(line + "\n");
        }
    }
    function search(query, _response) {
        let studi = studiHomoAssoc[query["searchStudent"].toString()];
        if (studi) {
            let line = query["searchStudent"] + ":";
            line += studi.name + ", " + studi.firstname + ", " + studi.age + " Jahre ";
            line += studi.gender ? "(M)" : "(F)" + ", ";
            line += studi.courseOfStudies;
            _response.write(line);
        }
        else {
            _response.write("Keine passenden Informationen gefunden.");
        }
    }
    function respond(_response, _text) {
        _response.setHeader("Access-Control-Allow-Origin", "*");
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.write(_text);
        _response.end();
    }
})(Node || (Node = {}));
//# sourceMappingURL=Server.js.map