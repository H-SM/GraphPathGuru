// Applied once an algorithm's step-by-step animation finishes, to trace the
// actual shortest path (computed server-side, see server/index.js's
// computeShortestPath) in a color distinct from the relax/no-relax colors
// used during the animation itself.
const PATH_COLOR = "#f59e0b"; // amber

export function highlightShortestPath(shortestPath, setNodes, setEdges) {
  if (!shortestPath || shortestPath.length === 0) return;

  const pathNodeIds = new Set(shortestPath.map((n) => n.toString()));
  const pathEdgeIds = new Set();
  for (let i = 0; i < shortestPath.length - 1; i++) {
    pathEdgeIds.add(`${shortestPath[i]}_${shortestPath[i + 1]}`);
  }

  setNodes((nds) =>
    nds.map((node) =>
      pathNodeIds.has(node.id)
        ? { ...node, style: { ...node.style, backgroundColor: PATH_COLOR } }
        : node
    )
  );

  setEdges((eds) =>
    eds.map((edge) =>
      pathEdgeIds.has(edge.id)
        ? {
            ...edge,
            animated: false,
            style: { ...edge.style, stroke: PATH_COLOR, strokeWidth: 3 },
          }
        : edge
    )
  );
}
