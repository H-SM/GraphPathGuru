const express = require("express");
var cors = require("cors");
const connectToMongo = require("./db");
const algos = require("./rust_algos/pkg/graphpathguru_algos.js");

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

// Builds the adjacency list (indexed by node id, matching the existing
// convention that node ids are sequential "0".."V-1" strings) and a
// human-readable display string for the saved-graph history feature.
function buildGraph(nodes, edges) {
  const V = nodes.length;
  const adj = Array.from({ length: V }, () => []);
  let graph = "";

  for (const edge of edges) {
    // The frontend's own animation code temporarily overwrites edge.label
    // with a descriptive string (e.g. "0 + -1 < -1") while visualizing, and
    // that mutated state can still be present on a later Save. parseInt
    // (like the old C++ pipeline's stoi) reads the leading numeric prefix
    // and tolerates that; a label with no numeric prefix at all falls back
    // to the existing "unweighted" sentinel.
    const parsed = edge.label === undefined ? NaN : parseInt(edge.label, 10);
    const weight = Number.isNaN(parsed) ? -1 : parsed;
    adj[parseInt(edge.source, 10)].push([parseInt(edge.target, 10), weight]);
  }

  for (const node of nodes) {
    graph +=
      node.id +
      " " +
      Math.floor(node.position.x).toString() +
      " " +
      Math.floor(node.position.y).toString() +
      ": ";
    for (const [target, weight] of adj[parseInt(node.id, 10)]) {
      graph += target + "," + weight + " ";
    }
    graph += "\n";
  }

  return { adj, graph };
}

function extractResult(output) {
  const match = output.match(/<result>([\s\S]*?)<\/result>/);
  return match ? match[1].trim() : "";
}

// Shared by Dijkstra, Bellman-Ford, and SPFA: all three emit the same
// <ds>/<adj> tag shape, so a single parser covers all three algorithms.
function parseGenericOutput(fileContent) {
  const adjDataArray = [];
  const regex = /<adj>([\s\S]*?)<\/adj>/g;
  let match;
  while ((match = regex.exec(fileContent)) !== null) {
    adjDataArray.push(match[1].trim());
  }

  const result = [];
  const checkNode = [];
  const distance_curr = [];
  const curr_node = [];

  for (const line of adjDataArray) {
    const m = line.match(/^(\d+)/);
    if (m) curr_node.push(parseInt(m[1], 10));
  }

  adjDataArray.forEach((row) => {
    const lines = row.split("\n");
    const values = [];
    const thirdValues = [];
    const numbersBeforeColon = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const m = line.match(/(\d+):/);
      if (m) numbersBeforeColon.push(parseInt(m[1], 10));

      if (i > 0) {
        const parts = lines[i].split("\t")[1];
        if (parts) {
          values.push(parseInt(parts.split(",")[0], 10));
          thirdValues.push(parseInt(parts.split(",")[2], 10));
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
      return dsContent.split("\n").map((line) =>
        line
          .trim()
          .split(/\s+/)
          .map((val) => (val === "INF" ? "INF" : parseInt(val, 10)))
      );
    });
    for (const ds of dsArray) distance.push(ds[1]);
  }

  // to remove the undefined (0) error due to timeout function
  checkNode.push([]);
  result.push([]);

  return { result, checkNode, distance, distance_curr, curr_node };
}

function parseYenOutput(fileContent) {
  const base = parseGenericOutput(fileContent);

  // <result> content is "\t{time V E S k}\n\t\n\t{path1}\n\t{path2}...\n" —
  // the first "\n\t"-delimited line is the summary, not a path.
  const resultMatch = fileContent.match(/<result>([\s\S]*?)<\/result>/);
  const lines = (resultMatch ? resultMatch[1] : "")
    .split("\n\t")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  const path = lines
    .slice(1)
    .map((line) => line.split(" ").filter(Boolean).map(Number));

  return { ...base, path };
}

function parseFloydOutput(fileContent) {
  const adjDataArray = [];
  const regex = /<adj>([\s\S]*?)<\/adj>/g;
  let match;
  while ((match = regex.exec(fileContent)) !== null) {
    adjDataArray.push(match[1].trim());
  }

  const result = [];
  const checkNode = [];
  const distance_curr = [];
  const curr_node = [];

  for (const line of adjDataArray) {
    const m = line.match(/^(\d+)/);
    if (m) curr_node.push(parseInt(m[1], 10));
  }

  adjDataArray.forEach((row) => {
    const lines = row.split("\n");
    const values = [];
    const thirdValues = [];
    const numbersBeforeColon = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const m = line.match(/(\d+):/);
      if (m) numbersBeforeColon.push(parseInt(m[1], 10));

      if (i > 0) {
        const parts = lines[i].split("\t")[1];
        if (parts) {
          values.push(parseInt(parts.split(",")[0], 10));
          thirdValues.push(parseInt(parts.split(",")[2], 10));
        }
      }
    }

    checkNode.push(values);
    result.push(thirdValues);
    distance_curr.push(numbersBeforeColon);
  });

  const dsMatches = fileContent.match(/<ds>[\s\S]*?<\/ds>/g) || [];
  const distance = dsMatches.map((str) => {
    const lines = str.split("\n\t");
    lines.shift();
    lines.pop();
    return lines.map((line) => line.split(" ").filter((val) => val !== ""));
  });

  checkNode.push([]);
  result.push([]);

  return { result, checkNode, distance, distance_curr, curr_node };
}

function parseJohnsonOutput(fileContent) {
  const adjDataArray = [];
  const regex = /<adj2>([\s\S]*?)<\/adj2>/g;
  let match;
  while ((match = regex.exec(fileContent)) !== null) {
    adjDataArray.push(match[1].trim());
  }

  const result = [];
  const checkNode = [];
  const distance_curr = [];
  const curr_node = [];

  for (const line of adjDataArray) {
    const m = line.match(/^(\d+)/);
    if (m) curr_node.push(parseInt(m[1], 10));
  }

  adjDataArray.forEach((row) => {
    const lines = row.split("\n");
    const values = [];
    const thirdValues = [];
    const numbersBeforeColon = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const m = line.match(/(\d+):/);
      if (m) numbersBeforeColon.push(parseInt(m[1], 10));

      if (i > 0) {
        const parts = lines[i].split("\t")[1];
        if (parts) {
          values.push(parseInt(parts.split(",")[0], 10));
          thirdValues.push(parseInt(parts.split(",")[2], 10));
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
      return dsContent.split("\n").map((line) =>
        line
          .trim()
          .split(/\s+/)
          .map((val) => (val === "INF" ? "INF" : parseInt(val, 10)))
      );
    });
    for (const ds of dsArray) distance.push(ds[1]);
  }

  const sourceMatches = fileContent.match(/<source>[\s\S]*?<\/source>/g) || [];
  const source = sourceMatches.map((str) => {
    const m = str.match(/\t(\d+)/);
    return m && m[1] ? parseInt(m[1], 10) : null;
  });

  checkNode.push([]);
  result.push([]);

  return { result, checkNode, distance, distance_curr, curr_node, source };
}

// Runs the requested algorithm entirely in-memory (no exec, no file I/O) and
// returns everything the frontend needs to render the result and animate it
// in a single response.
app.post("/perform-algo", (req, res) => {
  try {
    const { nodes, edges, algoID } = req.body;
    const V = nodes.length;
    const { adj, graph } = buildGraph(nodes, edges);
    const source = 0;

    let output;
    switch (algoID) {
      case 0:
        output = algos.run_dijkstra(V, adj, source);
        break;
      case 1:
        output = algos.run_bellman_ford(V, adj, source);
        break;
      case 2:
        output = algos.run_spfa(V, adj, source);
        break;
      case 3:
        output = algos.run_floyd_warshall(V, adj, source);
        break;
      case 4:
        output = algos.run_johnson(V, adj);
        break;
      case 5:
        output = algos.run_yen(V, adj, source, Math.max(V - 1, 0), 2);
        break;
      default:
        res.status(400).json({ error: "Unknown algoID" });
        return;
    }

    // NOTE: the parsers below each produce their own `result` field (the
    // per-step relax-outcome array the frontend animates), which is a
    // different thing from `resultText` (the human-readable <result> block,
    // used only for the saved-graph history display) — keep them under
    // distinct keys so the spread below can't clobber either.
    const resultText = extractResult(output);

    // Johnson's output interleaves two phases in one string: the plain
    // <ds>/<adj> Bellman-Ford reweighting trace (parsed generically, same
    // as Dijkstra/Bellman-Ford/SPFA) and the per-source <ds2>/<adj2>/
    // <source> Dijkstra trace (parsed separately, nested under `johnson`)
    // — the frontend animates the former first, then the latter.
    let parsed;
    if (algoID === 3) {
      parsed = parseFloydOutput(output);
    } else if (algoID === 4) {
      parsed = { ...parseGenericOutput(output), johnson: parseJohnsonOutput(output) };
    } else if (algoID === 5) {
      parsed = parseYenOutput(output);
    } else {
      parsed = parseGenericOutput(output);
    }

    res.status(200).json({ success: true, graph, resultText, ...parsed });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to run algorithm" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
