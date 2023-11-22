const fs = require("fs");

const fileContent = fs.readFileSync("server/file io/output.txt", "utf-8");

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
const distance_curr = [];
const curr_node = [];

for (const line of adjDataArray) {
  const match = line.match(/^(\d+)/); // Regular expression to match the first number
  if (match) {
    const firstNumber = parseInt(match[1], 10);
    curr_node.push(firstNumber);
  }
}

adjDataArray.forEach((row) => {
  const lines = row.split("\n");
  const values = [];
  const thirdValues = [];

  const numbersBeforeColon = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/(\d+):/); // Regular expression to match the number before ':'
    if (match) {
      const number = parseInt(match[1], 10); // Extract and convert to an integer
      numbersBeforeColon.push(number);
    }

    if (i > 0) {
      const parts = lines[i].split("\t")[1];
      if (parts) {
        const firstNumericValue = parseInt(parts.split(",")[0], 10);
        const thirdNumericValue = parseInt(parts.split(",")[2], 10);
        values.push(firstNumericValue);
        thirdValues.push(thirdNumericValue);
      }
    }
  }

  checkNode.push(values);
  result.push(thirdValues);
  distance_curr.push(numbersBeforeColon);
});


const dsMatches = fileContent.match(/<ds>[\s\S]*?<\/ds>/g);


const distance = dsMatches.map(str => {
  const lines = str.split('\r\n\t'); // Split by '\r\n\t' to get individual lines

  // Remove first and last empty elements
  lines.shift();
  lines.pop();

  return lines.map(line => {
    const values = line.split(' '); // Split each line by space
    return values.filter(val => val !== ''); // Remove empty values
  });
});


// to remove the undefined (0) error due to timeout function
checkNode.push([]);
result.push([]);

console.log(distance[0]);
console.log(checkNode);
console.log(result);
console.log(distance_curr);
console.log(curr_node);

const responseData = {
  result,
  checkNode,
  distance,
  distance_curr,
  curr_node,
};
