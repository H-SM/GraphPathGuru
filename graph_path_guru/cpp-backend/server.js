
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
// app.use(express.static(__dirname+'/views'));
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

        console.log(nodes, edges);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to save data to file' });
    }
});


// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/views/index.html');
// });

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