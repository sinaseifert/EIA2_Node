import * as Http from "http";
import * as Url from "url";

namespace Server {
    interface AssocStringString {
        [key: string]: string;
    }

    let port: number = process.env.PORT;
    if (port == undefined)
        port = 8100;

    let server: Http.Server = Http.createServer();
    server.addListener("listening", handleListen);
    server.addListener("request", handleRequest);
    server.listen(port);

    function handleListen(): void {
        console.log("Ich höre?");
    }

    function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        console.log("Ich höre Stimmen!");
        _response.write("Ich höre Stimmen!<br/>");

        let query: AssocStringString = Url.parse(_request.url, true).query;
        let a: number = parseInt(query["a"]);
        let b: number = parseInt(query["b"]);
        
        _response.write("Ich habe dich verstanden.<br/>");

        for (let key in query){
            console.log(query[key]);               
            _response.write("Die eingebene Query-Information ist: "+ (query[key]) + "<br/>");
        }
        
        _response.write("Das Ergebnis ist: " + (a + b));

        _response.end();
    }
}