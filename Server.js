"use strict";
const Url = require("url");
const Http = require("http");
var Node;
(function (Node) {
    let studis = {};
    let port = process.env.PORT;
    if (port == undefined)
        port = 8100;
    let server = Http.createServer();
    server.addListener("listening", handleListen);
    server.addListener("request", handleRequest);
    server.listen(port);
    function handleListen() {
        console.log("Ich höre...");
    }
    function handleRequest(_request, _response) {
        _response.setHeader("Access-Control-Allow-Origin", "*");
        _response.setHeader("Access-Control-Request-Method", "*");
        _response.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
        _response.setHeader("Access-Control-Allow-Headers", "*");
        let query = Url.parse(_request.url, true).query;
        _response.write("");
        if (query["method"] == "addedStudent") {
            console.log("addedStudent");
            let student = JSON.parse(query["matrikel"].toString());
            studis[student.matrikel.toString()] = student;
            _response.write("Student hinzugefügt");
        }
        if (query["method"] == "studentsRefresh") {
            console.log("studentsRefresh");
            _response.write(JSON.stringify(studis));
        }
        console.log("Ich habe geantwortet!");
        _response.end();
    }
})(Node || (Node = {}));
//# sourceMappingURL=Server.js.map