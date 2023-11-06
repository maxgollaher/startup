// Loads a JSON file into an object
// that can be used to instantiate a table
let sortDirection = 1;

function table(data) {
    if (!!data && data.length > 1) {
        currentData = data;
        const headers = parseHeader(data);
        const tableElement = generateTable(headers, data);
        const output = document.getElementById("jsonTable");

        removeAllChildNodes(output);
        output.appendChild(tableElement);
    } else {
        outputData("invalid input", data);
    }
}

function parseHeader(data) {
    let headers = [];
    for (const [key, value] of Object.entries(data[0])) {
        headers.push({ name: key, type: typeof value });
    }
    return headers;
}

function generateTable(headers, data) {
    const tableElement = document.createElement("table");

    generateHeader(headers, tableElement);
    generateRows(data, tableElement);

    tableElement.classList.add("table", "table-dark");

    return tableElement;
}

function generateHeader(headers, tableElement) {
    const rowElement = document.createElement("tr");
    tableElement.appendChild(rowElement);

    headers.forEach((header) => {
        const cellElement = document.createElement("th");
        rowElement.appendChild(cellElement);
        cellElement.setAttribute("onclick", `sortTable(this)`);
        const textNode = document.createTextNode(header.name);
        cellElement.appendChild(textNode);
    });
}

function generateRows(data, tableElement) {
    data.forEach((dataRow) => {
        const rowElement = document.createElement("tr");
        tableElement.appendChild(rowElement);
        for (const [, value] of Object.entries(dataRow)) {
            const cellElement = document.createElement("td");
            rowElement.appendChild(cellElement);
            const textNode = document.createTextNode(value);
            cellElement.appendChild(textNode);
        }
    });
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function outputData(title, data) {
    const output = document.getElementById("output");
    output.innerHTML = `<h3>${title}</h3><pre>${JSON.stringify(
        data,
        null,
        2
    )}</pre>`;
}

function sortTable(column) {
    const attr = column.innerText.toLowerCase();
    sortDirection *= -1;

    let changedData;
    if (attr === "grade" || attr === "top send" || attr === "top flash" || attr === "top onsight") {
        console.log("yosemite sort")
        changedData = currentData.sort(function (a, b) {
            return yosemiteSort(a[attr], b[attr]) * sortDirection;
        });
    } else {
        changedData = currentData.sort(function (a, b) {
            return a[attr] > b[attr] ? sortDirection : b[attr] > a[attr] ? -sortDirection : 0;
        });
    }

    table(changedData);
}

function yosemiteSort(a, b) {
    const regex = /^(\d+\.)(\d+)([a-z]*)?$/; // ["5.10a","5.","10","a"?]
    const matchA = a.match(regex);
    const matchB = b.match(regex);

    if (matchA && matchB) {
        const numA = parseFloat(matchA[2]);
        const numB = parseFloat(matchB[2]);
        if (numA > numB) {
            return 1;
        } else if (numB > numA) {
            return -1;
        } else {
            const letterA = matchA[3];
            const letterB = matchB[3];
            return letterA > letterB ? 1 : letterB > letterA ? -1 : 0;
        }
    }
    return 0;
}

function loadJSON(file) {

    fetch(file)
        .then(response => {
            return response.json()
        })
        .then(data => {
            table(data);
        });

}