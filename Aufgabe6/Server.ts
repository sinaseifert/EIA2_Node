import * as Url from "url";
import * as Http from "http";

namespace Node {
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
        console.log("Ich höre...");
    }

    function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {
        _response.setHeader("Access-Control-Allow-Origin", "*");
        _response.setHeader("Access-Control-Request-Method", "*");

        _response.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
        _response.setHeader("Access-Control-Allow-Headers", "*");

        let query: AssocStringString = Url.parse(_request.url, true).query;
        
        _response.write("");
        
        if (query["method"] == "addedStudent") {
            console.log("addedStudent");
            let student: L04_Interfaces.Studi = <L04_Interfaces.Studi>JSON.parse(query["matrikel"].toString());
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
}          