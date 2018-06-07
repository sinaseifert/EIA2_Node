import * as Url from "url";
import * as Http from "http";

namespace Node {
    /*Mit dem eingebunden Namespace wo die Interfaces drin sind, hat die Verlinkung scheinbar nichts funktioniert.
    Das Interface Studi wurde nicht erkannt, daher habe ich das noch einmal hier eingefügt.*/
    interface Studi {
        name: string;
        firstname: string;
        matrikel: number;
        age: number;
        gender: boolean;
        courseOfStudies: string;
    }

    // Struktur des homogenen assoziativen Arrays, bei dem ein Datensatz der Matrikelnummer zugeordnet ist
    interface Studis {
         [matrikel: string]: Studi;
    }
    
    interface AssocStringString {
        [key: string]: string | string[];
    }
    let studiHomoAssoc: Studis = {};

    let port: number = process.env.PORT;
    if (port == undefined)
        port = 8100;

    let server: Http.Server = Http.createServer();
    server.addListener("listening", handleListen);
    server.addListener("request", handleRequest);
    server.addListener("request", respond);
    server.listen(port);

    function handleListen(): void {
        console.log("Ich höre...");
    }

    function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {

        let query: AssocStringString = Url.parse(_request.url, true).query;

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

    function insert(query: AssocStringString, _response: Http.ServerResponse): void {
        let student: Studi = JSON.parse(query["matrikel"].toString());
        let name: string = student.name;
        let firstname: string = student.firstname;
        let matrikel: string = student.matrikel.toString();
        let age: number = student.age;
        let gender: boolean = student.gender;
        let courseOfStudies: string = student.courseOfStudies;

        let studis: Studi;

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

    function refresh(_response: Http.ServerResponse): void {
        for (let matrikel in studiHomoAssoc) {
            let studi: Studi = studiHomoAssoc[matrikel];
            let line: string = matrikel + ":";
            line += studi.name + ", " + studi.firstname + ", " + studi.age + " Jahre ";
            line += studi.gender ? "(M)" : "(F)" + ", ";
            line += studi.courseOfStudies;
            _response.write(line + "\n");
        }
    }

    function search(query: AssocStringString, _response: Http.ServerResponse): void {
        let studi: Studi = studiHomoAssoc[query["searchStudent"].toString()];
        if (studi) {
            let line: string = query["searchStudent"] + ":";
            line += studi.name + ", " + studi.firstname + ", " + studi.age + " Jahre ";
            line += studi.gender ? "(M)" : "(F)" + ", ";
            line += studi.courseOfStudies;
            _response.write(line);
        } else {
            _response.write("Keine passenden Informationen gefunden.");
        }
    }
    
    function respond(_response: Http.ServerResponse, _text: string): void {
        _response.setHeader("Access-Control-Allow-Origin", "*");
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.write(_text);
        _response.end();
    }    
}