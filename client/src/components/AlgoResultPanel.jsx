import React, { useState } from "react";
import { parseGraphCounts, parseResultSummary } from "../utils/graphSummary";

const AlgoResultPanel = ({ algoData, algoName }) => {
  const [showRaw, setShowRaw] = useState(false);

  if (!algoData) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-4 border border-gray-200 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-500">
        Click <strong>Save</strong> to run an algorithm and see its result here.
      </div>
    );
  }

  const { numNodes, numEdges } = parseGraphCounts(algoData.graph);
  const { tc, sc } = parseResultSummary(algoData.resultText);
  const path = algoData.shortestPath || [];
  const hasPath = path.length > 0;
  const sameNode = algoData.source === algoData.destination;

  return (
    <div className="w-full max-w-4xl mx-auto mt-4 border border-gray-200 rounded-lg bg-gray-50 px-4 py-4 text-sm text-gray-700">
      <p className="font-bold text-gray-900 mb-3">{algoName} — last run</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        <div>
          <p className="text-gray-500">Starting Node</p>
          <p className="font-mono font-semibold">{algoData.source}</p>
        </div>
        <div>
          <p className="text-gray-500">Ending Node</p>
          <p className="font-mono font-semibold">{algoData.destination}</p>
        </div>
        <div>
          <p className="text-gray-500">Nodes / Edges</p>
          <p className="font-mono font-semibold">
            {numNodes} / {numEdges}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Time / Space (est.)</p>
          <p className="font-mono font-semibold">
            {tc}μs / ~{sc}KB
          </p>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-gray-500">Shortest Path</p>
        {sameNode ? (
          <p className="font-mono font-semibold">
            Start and end are the same node ({algoData.source})
          </p>
        ) : hasPath ? (
          <p className="font-mono font-semibold text-green-700">
            {path.join(" → ")}
          </p>
        ) : (
          <p className="font-mono font-semibold text-red-600">
            No path found from {algoData.source} to {algoData.destination}
          </p>
        )}
      </div>

      <button
        onClick={() => setShowRaw(!showRaw)}
        className="text-xs text-sky-700 hover:underline"
      >
        {showRaw ? "Hide full result" : "Show full result"}
      </button>
      {showRaw && (
        <pre className="mt-2 bg-white border border-gray-200 rounded p-2 overflow-x-auto text-xs whitespace-pre-wrap">
          {algoData.resultText}
        </pre>
      )}
    </div>
  );
};

export default AlgoResultPanel;
