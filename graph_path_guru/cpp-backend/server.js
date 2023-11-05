const { execFile } = require('child_process');
const express = require("express");
const app = express();
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const os = require('os');

app.use(express.json());


var bodyParser = require('body-parser');
const { response } = require("express");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(__dirname + '/views'));
// let processedData = "";

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use('/static', express.static('static'))
app.use(express.urlencoded())

app.use(cors());

app.post('/write-file', (req, res) => {
    try {
        const { nodes, edges } = req.body;

        console.log(nodes);
        console.log(edges);
        let output = "";
        const mp = {};
        let w = 0;
        for (var i = 0; i < nodes.length; i++) {
            node = nodes[i];
            mp[node.id] = [];
        }
        for (var i = 0; i < edges.length; i++) {
            edge = edges[i];
            w = edge.label == undefined ? -1 : edge.label;
            mp[edge.source].push([edge.target, w]);
        }
        console.log(mp);
        for (var i = 0; i < nodes.length; i++) {
            node = nodes[i];
            output += node.id;

            output += ' ' + Math.floor(node.position.x).toString() + ' ' + Math.floor(node.position.y).toString() + ': ';
            if (mp)
                for (let j = 0; j < mp[node.id].length; j++) {
                    output += mp[node.id][j][0] + ',' + mp[node.id][j][1] + ' ';
                }
            output += '\n'
        }
        console.log(output);
        fs.writeFileSync('./file io/input.txt', output);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to save data to file' });
    }
});


app.post('/perform-dijktra', (req, res) => {
    // Specify the path to your C++ executable
    let dijkstraExecutable;

    if (os.platform() === 'win32') {
        dijkstraExecutable = './Dijkstra/Dijkstra.exe';
    } 
    else if (os.platform() === 'linux') {
        dijkstraExecutable = './Dijkstra_linux/Dijkstra'; 
    }

    // Execute the C++ program
    execFile(dijkstraExecutable, (error, stdout, stderr) => {
        if (error) {
            console.error('Error:', error);
            res.status(500).send('An error occurred during execution.');
            return;
        }

        if (stderr) {
            console.error('Error:', stderr);
            res.status(500).send('An error occurred during execution.');
            return;
        }

        // Process the output if needed
        console.log('C++ program output:', stdout);

        // Send a response to the client
        res.send('C++ program executed successfully.');
    });
});

// app.post('/process-data', (req, res) => {
//     const{ text_line }= req.body;
//     // process inputText here and generate response
//     const response = `${text_line}`;
//     // console.log(response);
//     text = response;
//     // console.log("text" + text);
//     res.send({ response });

// });

const port = 8000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});



// add ons 

// to run the blockchain code 

// const { spawn } = require('child_process');
// let output = "";

// app.post('/execute', (req, res) => {
//   const text = req.body.text;
//   const process = spawn('node', ['node_skellington.js',text]);

//   process.stdout.on('data', (data) => {
//     output = data;
//     console.log(`stdout: ${data}`);
//   });

//   process.stderr.on('data', (data) => {
//     console.error(`stderr: ${data}`);
//   });

//   process.on('close', (code) => {
//     res.send(output);
//     console.log(`child process exited with code ${code}`);
//   });
// });

app.get('/read-file', (req, res) => {

    const fileContent = fs.readFileSync('./file io/output.txt', 'utf-8');

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
    const distance = [];
    const distance_curr = [];

    adjDataArray.forEach(row => {
        const lines = row.split('\n');
        const values = [];
        const thirdValues = [];
        const secondValues = [];

        const numbersBeforeColon = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const parts = line.split(':');
            if (parts.length === 2) {
                const beforeColon = parseInt(parts[0].trim(), 10);
                numbersBeforeColon.push(beforeColon);
            }

            if (i > 0) {
                const parts = lines[i].split('\t')[1];
                if (parts) {
                    const firstNumericValue = parseInt(parts.split(',')[0], 10);
                    const secondNumericValue = parseInt(parts.split(',')[1], 10);
                    const thirdNumericValue = parseInt(parts.split(',')[2], 10);

                    values.push(firstNumericValue);
                    secondValues.push(secondNumericValue);
                    thirdValues.push(thirdNumericValue);

                }
            }
        }

        checkNode.push(values);
        result.push(thirdValues);
        distance.push(secondValues);
        distance_curr.push(numbersBeforeColon);
    });


    console.log(checkNode);
    console.log(distance);
    console.log(result);
    console.log(distance_curr);

    checkNode.push([]);

    const responseData = {
        result,
        checkNode,
        distance,
        distance_curr,
    };

    res.json(responseData);
});