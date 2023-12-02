// Loads a JSON file into an object
// that can be used to instantiate a table
let fullData = [];
const pageSize = 10;
let currentPage = 0;
let sortDirection = 1;

function table(data, defaultSort = false) {
    if (!!data && data.length >= 1) {
        fullData = data; // Store the full dataset

        const headers = parseHeader(fullData);
        const tableElement = generateTable(headers, fullData.slice(0, pageSize)); // Display the first page
        const output = document.getElementById("jsonTable");

        removeAllChildNodes(output);
        output.appendChild(tableElement);
        output.appendChild(createPreviousButton());
        output.appendChild(createNextButton());

        if (defaultSort) {
            // Sort by last column by default
            const lastColumnHeader = output.querySelector('th:last-child');
            if (lastColumnHeader) {
                sortTable(lastColumnHeader);
            }
        }
    } else {
        outputData("invalid input", data);
    }
}

function createNextButton() {
    let nextButton = document.createElement("button");
    nextButton.innerText = "Next";
    nextButton.classList.add("btn", "btn-primary", "m-2");
    nextButton.addEventListener("click", showNext); // Use addEventListener to bind click event
    return nextButton;
}

function createPreviousButton() {
    let previousButton = document.createElement("button");
    previousButton.innerText = "Previous";
    previousButton.classList.add("btn", "btn-primary", "m-2");
    previousButton.addEventListener("click", showPrevious); // Use addEventListener to bind click event
    return previousButton;
}

function showNext() {
    const totalElements = fullData.length;
    const totalPages = Math.ceil(totalElements / pageSize);

    currentPage++;
    if (currentPage >= totalPages) {
        currentPage = totalPages - 1;
    }

    const startIndex = currentPage * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalElements);

    const displayedData = fullData.slice(startIndex, endIndex);
    regenerateTable(displayedData);
}

function showPrevious() {
    currentPage--;
    if (currentPage < 0) {
        currentPage = 0;
    }

    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;

    const displayedData = fullData.slice(startIndex, endIndex);
    regenerateTable(displayedData);
}

function regenerateTable(data) {
    const output = document.getElementById("jsonTable");

    removeAllChildNodes(output);

    const headers = parseHeader(fullData);
    const tableElement = generateTable(headers, data);
    output.appendChild(tableElement);
    output.appendChild(createPreviousButton());
    output.appendChild(createNextButton());
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
        changedData = fullData.sort(function (a, b) {
            return yosemiteSort(a[attr], b[attr]) * sortDirection;
        });
    } else {
        changedData = fullData.sort(function (a, b) {
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

async function loadLeaderboard(defaultSort=true) {
    try {
        const response = await fetch('/api/userData');
        const data = await response.json();
        table(Object.values(data), defaultSort);
    } catch (error) {
        console.log(error);
    }
}

async function loadClimbLog(defaultSort=true) {
    const username = localStorage.getItem("user");
    try {
        const response = await fetch('/api/userLog/' + username);
        const data = await response.json();
        table(data.climbs, defaultSort);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    loadLeaderboard,
    loadClimbLog,
    yosemiteSort,
    showNext,
    showPrevious
};