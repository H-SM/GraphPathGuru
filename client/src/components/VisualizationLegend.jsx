import React, { useState } from "react";

const NODE_COLORS = [
  { color: "#ffffff", border: true, label: "Unvisited", desc: "not reached by the algorithm yet" },
  { color: "#ef4444", label: "Current", desc: "the node currently being expanded" },
  { color: "#3b82f6", label: "Comparing", desc: "a neighbor whose distance is being checked" },
  { color: "#22c55e", label: "Relaxed", desc: "distance to this node just improved" },
  { color: "#000000", label: "No improvement", desc: "checked, but the existing distance was already better" },
];

const ALGO_BLURBS = [
  { name: "Dijkstra", desc: "Greedy single-source shortest paths using a priority queue. Requires non-negative edge weights." },
  { name: "Bellman Ford", desc: "Single-source shortest paths that tolerate negative weights, by relaxing every edge V-1 times." },
  { name: "SPFA", desc: "A queue-based optimization of Bellman-Ford that only re-checks edges out of nodes whose distance just changed." },
  { name: "Floyd Warshall", desc: "All-pairs shortest paths via dynamic programming over every possible intermediate node k." },
  { name: "Johnson's Algorithm", desc: "All-pairs shortest paths on sparse graphs: reweights edges with one Bellman-Ford pass so they're all non-negative, then runs Dijkstra from every node." },
  { name: "Yen's K shortest Paths", desc: "Finds the k best simple paths between a source and destination by repeatedly running Dijkstra and removing edges already used." },
];

const VisualizationLegend = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto mt-4 border border-gray-200 rounded-lg bg-gray-50">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left text-gray-700 font-bold text-sm"
      >
        <span>How to read the visualization</span>
        <span className="text-gray-400">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 text-sm text-gray-700 flex flex-col gap-4">
          <div>
            <p className="font-semibold mb-2">Node colors</p>
            <ul className="flex flex-col gap-1">
              {NODE_COLORS.map((c) => (
                <li key={c.label} className="flex items-center gap-2">
                  <span
                    className="inline-block w-4 h-4 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: c.color,
                      border: c.border ? "1px solid #9ca3af" : "none",
                    }}
                  />
                  <span>
                    <strong>{c.label}</strong> — {c.desc}
                  </span>
                </li>
              ))}
              <li className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded-full flex-shrink-0 bg-white border-[3px] border-gray-500" />
                <span>
                  <strong>Thick gray border</strong> — the reference node for the
                  current step (the source, or Floyd-Warshall's current
                  intermediate pivot k)
                </span>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-1">Edges</p>
            <p>
              A dashed, animated edge with a label like{" "}
              <code className="bg-gray-200 px-1 rounded">3 + 2 &lt; 6</code>{" "}
              means the algorithm is comparing "distance so far + this edge's
              weight" against the best distance known for the far end — the
              comparison that decides whether to relax it.
            </p>
          </div>

          <div>
            <p className="font-semibold mb-2">What each algorithm computes</p>
            <ul className="flex flex-col gap-2">
              {ALGO_BLURBS.map((a) => (
                <li key={a.name}>
                  <strong>{a.name}</strong> — {a.desc}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualizationLegend;
