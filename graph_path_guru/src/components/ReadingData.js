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

adjDataArray.forEach(row => {
    const lines = row.split('\n');
    const values = [];

    for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split('\t')[1]; 
        if (parts) {
            const firstNumericValue = parseInt(parts.split(',')[0], 10);
            values.push(firstNumericValue);
        }
    }

    result.push(values);
});

console.log(result[0]);
