var L04_Interfaces;
(function (L04_Interfaces) {
    window.addEventListener("load", init);
    //    let address: string = "http://localhost:8100";
    let address = "https://eia2node1.herokuapp.com/";
    function init() {
        console.log("Init");
        let insertButton = document.getElementById("insert");
        let refreshButton = document.getElementById("refresh");
        let searchButton = document.getElementById("search");
        let submitButton = document.getElementById("submit");
        insertButton.addEventListener("click", insert);
        refreshButton.addEventListener("click", studentsRefresh);
        searchButton.addEventListener("click", search);
        submitButton.addEventListener("click", submit);
    }
    function insert() {
        let inputs = document.getElementsByTagName("input");
        let genderButton = document.getElementById("male");
        let matrikel = inputs[2].value;
        let studi;
        studi = {
            name: inputs[0].value,
            firstname: inputs[1].value,
            matrikel: parseInt(matrikel),
            age: parseInt(inputs[3].value),
            gender: genderButton.checked,
            courseOfStudies: inputs[6].value
        };
        // Datensatz im assoziativen Array unter der Matrikelnummer speichern
        L04_Interfaces.studiHomoAssoc[matrikel] = studi;
        sendRequestWithStudiData("addedStudent", matrikel);
    }
    function search() {
        let output = document.getElementsByTagName("textarea")[0];
        let search = document.getElementById("outputMatrikel");
        output.value = "";
        // for-in-Schleife iteriert über die Schlüssel des assoziativen Arrays
        for (let matrikel in L04_Interfaces.studiHomoAssoc) {
            let studi = L04_Interfaces.studiHomoAssoc[matrikel];
            let line = matrikel + ": ";
            if (search.value == studi.matrikel.toString()) {
                line += studi.name + ", " + studi.firstname + ", " + studi.age + " Jahre ";
                line += studi.gender ? "(M)" : "(F)" + ", ";
                line += studi.courseOfStudies;
                output.value += line + "\n";
            }
            else {
                let studi = "Keine passenden Informationen gefunden.";
                output.value += studi + "\n";
            }
        }
    }
    function studentsRefresh() {
        sendRequestWithStudiData("studentsRefresh", "");
    }
    function refresh() {
        let output = document.getElementsByTagName("textarea")[1];
        output.value = "";
        // for-in-Schleife iteriert über die Schlüssel des assoziativen Arrays
        for (let matrikel in L04_Interfaces.studiHomoAssoc) {
            let studi = L04_Interfaces.studiHomoAssoc[matrikel];
            let line = matrikel + ": ";
            line += studi.name + ", " + studi.firstname + ", " + studi.age + " Jahre ";
            line += studi.gender ? "(M)" : "(F)" + ", ";
            line += studi.courseOfStudies;
            output.value += line + "\n";
        }
    }
    function submit() {
        for (let i = 0; i < 3; i++) {
            let student = {
                name: "Nachname",
                firstname: "Vorname",
                matrikel: Math.floor(Math.random() * 111111),
                age: Math.floor(Math.random() * 60),
                courseOfStudies: "MKB",
                gender: !!Math.round(Math.random())
            };
            // Datensatz im assoziativen Array unter der Matrikelnummer speichern
            L04_Interfaces.studiHomoAssoc[student.matrikel] = student;
            sendRequestWithStudiData("addedStudent", student.matrikel.toString());
        }
    }
    function sendRequestWithStudiData(_method, matrikel) {
        let xhr = new XMLHttpRequest();
        let dataString = JSON.stringify(L04_Interfaces.studiHomoAssoc[matrikel]);
        xhr.open("GET", address + "?method=" + _method + "&matrikel=" + encodeURIComponent(dataString), true);
        if (_method == "addedStudent") {
            xhr.onload = function () {
                console.log(xhr.responseText);
            };
        }
        if (_method == "studentsRefresh") {
            xhr.onload = function () {
                console.log("Refreshing Students");
                L04_Interfaces.studiHomoAssoc = JSON.parse(xhr.responseText);
                refresh();
            };
        }
        xhr.send();
    }
})(L04_Interfaces || (L04_Interfaces = {}));
//# sourceMappingURL=ProcessForm.js.map