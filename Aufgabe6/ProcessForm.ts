namespace L04_Interfaces {
    window.addEventListener("load", init);

//    let address: string = "http://localhost:8100";
    let address: string = "https://eia2node1.herokuapp.com/";
    

    function init(): void {
        console.log("Init");
        let insertButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("insert");
        let refreshButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("refresh");
        let searchButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("search");
        let submitButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("submit");
        insertButton.addEventListener("click", insert);
        refreshButton.addEventListener("click", studentsRefresh);
        searchButton.addEventListener("click", search);
        submitButton.addEventListener("click", submit);
    }

    function insert(): void {
        let inputs: NodeListOf<HTMLInputElement> = document.getElementsByTagName("input");
        let genderButton: HTMLInputElement = <HTMLInputElement>document.getElementById("male");
        let matrikel: string = inputs[2].value;
        let studi: Studi;
        studi = {
            name: inputs[0].value,
            firstname: inputs[1].value,
            matrikel: parseInt(matrikel),
            age: parseInt(inputs[3].value),
            gender: genderButton.checked,
            courseOfStudies: inputs[6].value
        };

        // Datensatz im assoziativen Array unter der Matrikelnummer speichern
        studiHomoAssoc[matrikel] = studi;

        sendRequestWithStudiData("addedStudent", matrikel);
    }

    function search(): void {
        let output: HTMLTextAreaElement = document.getElementsByTagName("textarea")[0];
        let search: HTMLInputElement = <HTMLInputElement>document.getElementById("outputMatrikel");
        output.value = "";
        // for-in-Schleife iteriert über die Schlüssel des assoziativen Arrays
        for (let matrikel in studiHomoAssoc) {  // Besonderheit: Type-Annotation nicht erlaubt, ergibt sich aus der Interface-Definition
            let studi: Studi = studiHomoAssoc[matrikel];
            let line: string = matrikel + ": ";

            if (search.value == studi.matrikel.toString()) {
                line += studi.name + ", " + studi.firstname + ", " + studi.age + " Jahre ";
                line += studi.gender ? "(M)" : "(F)" + ", ";
                line += studi.courseOfStudies;
                output.value += line + "\n";
            } else {
                let studi: string = "Keine passenden Informationen gefunden.";
                output.value += studi + "\n";
            }
        }
    }

    function studentsRefresh(): void {
        sendRequestWithStudiData("studentsRefresh","");
    }

    function refresh(): void {
        let output: HTMLTextAreaElement = document.getElementsByTagName("textarea")[1];
        output.value = "";
        // for-in-Schleife iteriert über die Schlüssel des assoziativen Arrays
        for (let matrikel in studiHomoAssoc) {  // Besonderheit: Type-Annotation nicht erlaubt, ergibt sich aus der Interface-Definition
            let studi: Studi = studiHomoAssoc[matrikel];
            let line: string = matrikel + ": ";
            line += studi.name + ", " + studi.firstname + ", " + studi.age + " Jahre ";
            line += studi.gender ? "(M)" : "(F)" + ", ";
            line += studi.courseOfStudies;
            output.value += line + "\n";
        }
    }

    function submit(): void {
        for (let i: number = 0; i < 3; i++) {
            let student: L04_Interfaces.Studi = {
                name: "Nachname",
                firstname: "Vorname",
                matrikel: Math.floor(Math.random() * 111111),
                age: Math.floor(Math.random() * 60),
                courseOfStudies: "MKB",
                gender: !!Math.round(Math.random())
            };

            // Datensatz im assoziativen Array unter der Matrikelnummer speichern
            studiHomoAssoc[student.matrikel] = student;

            sendRequestWithStudiData("addedStudent", student.matrikel.toString());
        }
    }

    function sendRequestWithStudiData(_method: string, matrikel: string): void {
        let xhr: XMLHttpRequest = new XMLHttpRequest();
        let dataString: string = JSON.stringify(studiHomoAssoc[matrikel]);

        xhr.open("GET", address + "?method=" + _method + "&matrikel=" + encodeURIComponent(dataString), true);

        if (_method == "addedStudent") {
            xhr.onload = function(): void {
                console.log(xhr.responseText);
            };
        }
        if (_method == "studentsRefresh") {
            xhr.onload = function(): void {
                console.log("Refreshing Students");
                studiHomoAssoc = JSON.parse(xhr.responseText);
                refresh();
            };
        }
        xhr.send();
    }
}