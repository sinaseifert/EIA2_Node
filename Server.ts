import * as Url from "url";
import * as Http from "http";

namespace Node {
    console.log("Server starting");

    let studis: L04_Interfaces.Studis = {};

    interface AssocStringString {
        [key: string]: string | string[];
    }

    let port: number = process.env.PORT;
    if (port == undefined)
        port = 8100;

    let server: Http.Server = Http.createServer();
    server.addListener("listening", handleListen);
    server.addListener("request", handleRequest);
    server.listen(port);



    function handleListen(): void {
        console.log("Listening on port: " + port);
    }

    function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {
        console.log("Request received");
        let query: AssocStringString = Url.parse(_request.url, true).query;
        let command: string = query["command"].toString();

        switch (command) {
            case "addStudent":
                console.log("addStudent");
                let student: L04_Interfaces.Studi = <L04_Interfaces.Studi>JSON.parse(query["data"].toString());
                studis[student.matrikel.toString()] = student;
                respond(_response, "Student hinzugefügt");
                break;
            case "studentsRefresh":
                console.log("studentsRefresh");
                respond(_response, JSON.stringify(studis));
                break;
            case "searchStudent":
                console.log("searchStudent");
                let matrikel: string = query["data"].toString();
                let students: L04_Interfaces.Studi = studis[matrikel];
                if (students != undefined) {
                    respond(_response, JSON.stringify(studis[matrikel]));
                } else {
                    respond(_response, "Keine passenden Informationen gefunden!");
                }
                break;
            default:
                respond(_response, "unknown command: " + command);
                break;
        }
    }

    function respond(_response: Http.ServerResponse, _text: string): void {
        //console.log("Preparing response: " + _text);
//        _response.setHeader("Access-Control-Request-Method", "*");
//        _response.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.write(_text);
        console.log("Ich habe geantwortet!");
        _response.end();
    }
}