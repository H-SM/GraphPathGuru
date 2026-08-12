// Shared parsing for the saved-graph "graph" and "result" strings, used by
// both the history table (HistoryItem.jsx) and the single-graph detail page
// (Grapher.jsx).

// Node/edge counts, read from the saved "graph" display string (one line
// per node: "{id} {x} {y}: {target},{weight} ..."). This is ground truth —
// it's built directly from what was submitted — unlike the algorithm's
// <result> block, whose "edge count" field means different things per
// algorithm (e.g. Floyd-Warshall's is V², not a real edge count).
export function parseGraphCounts(graphStr) {
  const lines = (graphStr || "").split("\n").filter((line) => line.trim() !== "");
  const numNodes = lines.length;
  const numEdges = lines.reduce((count, line) => {
    const afterColon = line.split(":")[1] || "";
    return count + afterColon.trim().split(/\s+/).filter(Boolean).length;
  }, 0);
  return { numNodes, numEdges };
}

// Time taken (always the first token of the <result> block's first line,
// across every algorithm) and the space estimate (a separately tagged line
// appended by the backend: "spaceEstimateKB {value}", since no algorithm
// here ever measured real memory usage).
export function parseResultSummary(resultStr) {
  const text = resultStr || "";
  const summaryLine = text.split("\n")[0] || "";
  const tc = summaryLine.trim().split(/\s+/)[0] || "N/A";

  const spaceMatch = text.match(/spaceEstimateKB\s+([\d.]+)/);
  const sc = spaceMatch ? spaceMatch[1] : "N/A";

  return { tc, sc };
}
