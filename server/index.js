const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");
const express = require("express");
var cors = require("cors");
const connectToMongo = require("./db");

connectToMongo();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/graph", require("./routes/graph"));

app.post("/write-file", (req, res) => {
  let output = "";
  try {
    const { nodes, edges } = req.body;

    const mp = {};
    let w = 0;
    for (var i = 0; i < nodes.length; i++) {
      let node = nodes[i];
      mp[node.id] = [];
    }
    for (var i = 0; i < edges.length; i++) {
      let edge = edges[i];
      w = edge.label == undefined ? -1 : edge.label;
      mp[edge.source].push([edge.target, w]);
    }
    console.log(mp);
    for (var i = 0; i < nodes.length; i++) {
      let node = nodes[i];
      output += node.id;

      output +=
        " " +
        Math.floor(node.position.x).toString() +
        " " +
        Math.floor(node.position.y).toString() +
        ": ";
      if (mp)
        for (let j = 0; j < mp[node.id].length; j++) {
          output += mp[node.id][j][0] + "," + mp[node.id][j][1] + " ";
        }
      output += "\n";
    }
    fs.writeFileSync("./file io/input.txt", output);
    res.status(200).json({ success: true, graph: output });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to save data to file" });
  }
});


// run c++ backend
app.post("/perform-algo", (req, res) => {
  // Specify the path to your C++ executable
  console.log("I made the perform-algo POST call!");
  const id = req.body.algoID;
  console.log("The algo ID is ", id);
  const algo_execs = [
    "./Dijkstra/Dijkstra.exe",
    "./Bellman_Ford/Bellman.exe",
    "./SPFA/SPFA.exe",
    "./Floyd_Warshall/Floyd_warshall.exe",
    "./Johnson/Johnson.exe",
    "./Yen/Yen.exe",
  ];
  let algoExecutable = algo_execs[id];
  console.log("Executing the algo:", algoExecutable);
  // Execute the C++ program
  execFile(algoExecutable, (error, stdout, stderr) => {
    if (error) {
      console.error("Error:", error);
      res.status(500).send("An error occurred during execution.");
      return;
    }

    if (stderr) {
      console.error("StdError:", stderr);
      res.status(500).send("An error occurred during execution.");
      return;
    }

    // Process the output if needed
    console.log("C++ program output:", stdout);
    let res_string = "";
    const lines = fs.readFileSync("./file io/output.txt", "utf-8");
    let f = 1;
    console.log("LINES BEGIN HERE");
    let temp = "";
    for (let i = lines.length-1; i >= 0; i--) {
      temp += lines[i];
      if (i > 6 && lines.slice(i,i+6) === "result") {
        if (f === 1) {
          f -= 1;
          continue;
        }
        temp += lines[i-1];
        res_string = temp.split('').reverse().join('');
        // console.log(res_string);
        break;
      }
    }
    
    // Send a response to the client
    res.status(200).json({ success: true, result: res_string });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// app.get("/read-file", (req, res) => {
//     const lines = fs.readFileSync("./file io/output.txt", "utf-8");

// }

app.get("/read-file", (req, res) => {
  const fileContent = fs.readFileSync("./file io/output.txt", "utf-8");

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

  const distance = [];

  const dsMatches = fileContent.match(/<ds>[\s\S]*?<\/ds>/g);

  if (dsMatches) {
    const dsArray = dsMatches.map((ds) => {
      const dsContent = ds.match(/<ds>([\s\S]*?)<\/ds>/)[1].trim();
      const dsLines = dsContent.split("\n");
      return dsLines.map((line) =>
        line
          .trim()
          .split(/\s+/)
          .map((val) => (val === "INF" ? "INF" : parseInt(val, 10)))
      );
    });

    for (let i = 0; i < dsArray.length; i++) {
      distance.push(dsArray[i][1]);
    }
  }

  // to remove the undefined (0) error due to timeout function
  checkNode.push([]);
  result.push([]);

  console.log(distance);
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

  res.json(responseData);
});

app.get("/read-file-YenK", (req, res) => {
  const fileContent = fs.readFileSync("./file io/output.txt", "utf-8");

  const regex = /<adj>([\s\S]*?)<\/adj>/g;

  const adjDataArray = [];

  let match;
  while ((match = regex.exec(fileContent)) !== null) {
    const adjData = match[1].trim();
    adjDataArray.push(adjData);
  }

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

  const distance = [];

  const dsMatches = fileContent.match(/<ds>[\s\S]*?<\/ds>/g);

  if (dsMatches) {
    const dsArray = dsMatches.map((ds) => {
      const dsContent = ds.match(/<ds>([\s\S]*?)<\/ds>/)[1].trim();
      const dsLines = dsContent.split("\n");
      return dsLines.map((line) =>
        line
          .trim()
          .split(/\s+/)
          .map((val) => (val === "INF" ? "INF" : parseInt(val, 10)))
      );
    });

    for (let i = 0; i < dsArray.length; i++) {
      distance.push(dsArray[i][1]);
    }
  }

  const pathData = fileContent.match(/<result>[\s\S]*?<\/result>/g);

  const matches = pathData[0].match(/\t(.*?)\r/g);

  const path = matches.map((match) => match.trim().split(" ").map(Number));

  // to remove the undefined (0) error due to timeout function
  checkNode.push([]);
  result.push([]);

  console.log(distance);
  console.log(checkNode);
  console.log(result);

  console.log(curr_node);
  console.log(path);

  const responseData = {
    result,
    checkNode,
    distance,
    distance_curr,
    curr_node,
    path,
  };

  res.json(responseData);
});

app.get("/read-file-Floyd", (req, res) => {
  const fileContent = fs.readFileSync("./file io/output.txt", "utf-8");

  const regex = /<adj>([\s\S]*?)<\/adj>/g;

  const adjDataArray = [];

  let match;
  while ((match = regex.exec(fileContent)) !== null) {
    const adjData = match[1].trim();
    adjDataArray.push(adjData);
  }

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

  const distance = dsMatches.map((str) => {
    const lines = str.split("\r\n\t"); // Split by '\r\n\t' to get individual lines

    // Remove first and last empty elements
    lines.shift();
    lines.pop();

    return lines.map((line) => {
      const values = line.split(" "); // Split each line by space
      return values.filter((val) => val !== ""); // Remove empty values
    });
  });

  // to remove the undefined (0) error due to timeout function
  checkNode.push([]);
  result.push([]);

  console.log(distance);
  console.log(checkNode);
  console.log(result);

  console.log(curr_node);
  console.log(path);

  const responseData = {
    result,
    checkNode,
    distance,
    distance_curr,
    curr_node,
  };

  res.json(responseData);
});

app.get("/read-file-Johnson", (req, res) => {
  const fileContent = fs.readFileSync("./file io/output.txt", "utf-8");

  const regex = /<adj2>([\s\S]*?)<\/adj2>/g;

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

  const distance = [];

  const dsMatches = fileContent.match(/<ds2>[\s\S]*?<\/ds2>/g);

  if (dsMatches) {
    const dsArray = dsMatches.map((ds) => {
      const dsContent = ds.match(/<ds2>([\s\S]*?)<\/ds2>/)[1].trim();
      const dsLines = dsContent.split("\n");
      return dsLines.map((line) =>
        line
          .trim()
          .split(/\s+/)
          .map((val) => (val === "INF" ? "INF" : parseInt(val, 10)))
      );
    });

    for (let i = 0; i < dsArray.length; i++) {
      distance.push(dsArray[i][1]);
    }
  }

  const dsMatches1 = fileContent.match(/<source>[\s\S]*?<\/source>/g);

  const source = dsMatches1.map((str) => {
    const match = str.match(/\t(\d+)\r/);
    if (match && match[1]) {
      return parseInt(match[1]);
    }
    return null;
  });

  // to remove the undefined (0) error due to timeout function
  checkNode.push([]);
  result.push([]);

  console.log(distance);
  console.log(checkNode);
  console.log(result);
  console.log(distance_curr);
  console.log(curr_node);
  console.log(source);

  const responseData = {
    result,
    checkNode,
    distance,
    distance_curr,
    curr_node,
    source,
  };

  res.json(responseData);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
