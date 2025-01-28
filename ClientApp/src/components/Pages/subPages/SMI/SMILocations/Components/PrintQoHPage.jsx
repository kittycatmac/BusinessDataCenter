
export const handlePrint = ({checkRows}) => {
    // Open a new tab
    const newTab = window.open('', '_blank');
    const jsxTable = `
            <html>
            <head>
            <title>Print</title>
            </head>
                <body>
                <table border="1">
                    <thead>
                    <tr>
                        <th>Inv #</th>
                        <th>JMS Qoh</th>
                        <th>New Qoh</th>
                        <th>Difference</th>
                    </tr>
                    </thead>
                    <tbody>
                    ${checkRows.map((val) => {
                        return (
                            `<tr>
                                <td>${val.smiId}</td>
                                <td>${val.smiQoh}</td>
                                <td>${val.totalOh}</td>
                                <td>${val.Diff}</td>
                            </tr>`
                        );
                    }).join('')}
                    </tbody>
                </table>
                </body>
        </html>`;

    newTab.document.write(jsxTable);

    // Wait for the new tab to finish loading
    newTab.onload = () => {
      // Print the content
      newTab.print();
    };
};