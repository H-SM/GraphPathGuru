const fs = require('fs');

const fileContent = fs.readFileSync('cpp-backend/Dijkstra/output1.txt', 'utf-8');

const regex = /<adj>([\s\S]*?)<\/adj>/g;

const adjDataArray = [];

let match;
while ((match = regex.exec(fileContent)) !== null) {
    const adjData = match[1].trim();
    adjDataArray.push(adjData);
}

console.log(adjDataArray);

const result = [];
const checkNode = []; // New array to store third values
const nodesBeforeColon = [];

adjDataArray.forEach(row => {
    const lines = row.split('\n');
    const values = [];
    const thirdValues = [];

    const numbersBeforeColon = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const parts = line.split(':');
        if (parts.length === 2) {
            const beforeColon = parseInt(parts[0].trim(), 10);
            numbersBeforeColon.push(beforeColon);
        }

        if (i > 0) {
            const parts = line.split('\t')[1];
            if (parts) {
                const firstNumericValue = parseInt(parts.split(',')[0], 10);
                const thirdNumericValue = parseInt(parts.split(',')[2], 10); // Get the third value

                values.push(firstNumericValue);
                thirdValues.push(thirdNumericValue);
            }
        }
    }

    nodesBeforeColon.push(numbersBeforeColon);
    checkNode.push(values);
    result.push(thirdValues); // Store third values in the new array
});

console.log(result);
console.log(checkNode);
console.log(nodesBeforeColon);
