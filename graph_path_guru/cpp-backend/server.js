
const express = require("express");
const app = express();
const path = require('path');
app.use(express.json());
const fs = require('fs');
const cors = require('cors');

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

            output += ' ' + node.position.x.toString().slice(0,5) + ' ' + node.position.y.toString().slice(0,5) +':';
            if (mp)
                for (let j = 0; j < mp[node.id].length; j++) {
                    output += mp[node.id][j][0] + ',' + mp[node.id][j][1] + ' ';
                }
            output += '\n'
        }
        console.log(output);
        fs.writeFileSync('./input.txt', output);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to save data to file' });
    }
});


app.post('/perform-dijktra', (req, res) => {

    console.log("hello i am here")

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
    const data = fs.readFileSync('./Output.txt', 'utf-8');
    res.send(data);
});