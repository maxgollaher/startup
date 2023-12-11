import React, { useState, useEffect } from 'react';

export function ClimbLog({ apiPath, reload }) {
    const [tableData, setTableData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isAscending, setIsAscending] = useState(true);
    const pageSize = 10;

    useEffect(() => {
        loadClimbLog();
    }, [apiPath, reload]);

    const loadClimbLog = async () => {
        try {
            const response = await fetch(apiPath);
            const data = await response.json();
            setTableData(data.climbs ? data.climbs : data);
        } catch (error) {
            console.log(error);
        }
    };

    const showPrevious = () => {
        if (currentPage !== 0) {
            setCurrentPage(prevPage => prevPage - pageSize);
        }
    };

    const showNext = () => {
        if (currentPage < tableData.length - pageSize) {
            setCurrentPage(prevPage => prevPage + pageSize);
        }
    };

    const sortTable = (column) => {
        const attr = column.toLowerCase();

        let updatedData;
        if (
            attr === "grade" ||
            attr === "top send" ||
            attr === "top flash" ||
            attr === "top onsight"
        ) {
            updatedData = tableData.sort((a, b) =>
                yosemiteSort(a[attr], b[attr]) * (isAscending ? 1 : -1)
            );
        } else {
            updatedData = tableData.sort((a, b) =>
                a[attr] > b[attr] ? (isAscending ? 1 : -1) : b[attr] > a[attr] ? (isAscending ? -1 : 1) : 0
            );
        }

        setTableData([...updatedData]);
        setIsAscending(prevIsAscending => !prevIsAscending);
        setCurColumn(column);
    };

    const yosemiteSort = (a, b) => {
        const regex = /^(\d+\.)(\d+)([a-z]*)?$/;
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
    };

    const renderTable = () => {
        const headers = tableData.length > 0 ? Object.keys(tableData[0]) : [];

        const sortedDataSlice = tableData.slice(currentPage, currentPage + pageSize);

        const tableRows = sortedDataSlice.map((row, rowIndex) => (
            <tr key={rowIndex}>
                {Object.values(row).map((value, cellIndex) => (
                    <td key={cellIndex}>{value}</td>
                ))}
            </tr>
        ));

        return (
            <>
                <table className='table table-dark table-striped table-hover'>
                    <thead>
                        <tr>
                            {headers.map((header, index) => (
                                <th key={index} onClick={() => sortTable(header)}>
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tableRows}
                    </tbody>
                </table>
                <div>
                    <button onClick={showPrevious} className="btn btn-primary m-2">
                        Previous
                    </button>
                    <button onClick={showNext} className="btn btn-primary m-2">
                        Next
                    </button>
                </div>
            </>
        );
    };

    return (
        <div>
            {renderTable()}
            <div id="output"></div>
        </div>
    );
}