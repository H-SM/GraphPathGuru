import ReactFlow, { MarkerType } from "reactflow";

var currentNode = 0;
var currentEdge = 1;
var index = 0;
var pathVal = 0;

const host = process.env.REACT_APP_BACKEND_LOCALHOST;

var checkNode = []; // the nodes to check
var result = []; // result whether 1 or 0
var distance = []; // distance of current node from source
var distance_curr = []; // distance of the current node
var curr_node = []; // current node from which the distance of all adjacent nodes is calculated
var path = [];
var source = [];

// coloring the nodes of the graph
const colorNode = (nodes, nodeId, color) => {
  return nodes.map((node) => {
    if (parseInt(node.id) === nodeId) {
      return {
        ...node,
        style: {
          ...node.style,
          backgroundColor: color,
        },
      };
    } else {
      return node;
    }
  });
};

// coloring the edges of the graph
const colorEdge = (edges, sourceEdge, destinationEdge, animated) => {
  return edges.map((edge) => {
    if (edge.id === sourceEdge + "_" + destinationEdge) {
      return {
        ...edge,
        animated: animated,
        label:
          (distance_curr[currentNode] == 1e9
            ? "INF"
            : distance_curr[currentNode].toString()) +
          " + " +
          edge.label +
          " < " +
          (distance[currentNode][checkNode[currentNode][index]] == 1e9
            ? "INF"
            : distance[currentNode][checkNode[currentNode][index]].toString()),
      };
    } else {
      return edge;
    }
  });
};

// Logic to calculate the position based on existing nodes
const calculateNewNodePosition = (existingPositions) => {
  const defaultNodePosition = { x: 50, y: 50 }; // Default position if no nodes exist

  if (existingPositions.length === 0) {
    return defaultNodePosition;
  }

  // You can implement your logic here to position the new node appropriately
  // For example, you could find the average position or calculate a position that doesn't overlap existing nodes.

  // For simplicity, let's find the maximum X and Y coordinates and add some offset
  const maxX = Math.max(...existingPositions.map((pos) => pos.x));
  const maxY = Math.max(...existingPositions.map((pos) => pos.y));

  const newNodeX = maxX + 50; // Add an offset from the maximum X coordinate
  const newNodeY = maxY + 10; // Add an offset from the maximum Y coordinate

  return { x: newNodeX, y: newNodeY };
};

const addExtraNode = async (nodes, edges, setNodes, setEdges) => {
  const newNodeId = nodes.length.toString();

  // Calculate position for the new node
  const existingPositions = nodes.map((node) => node.position);
  const newNodePosition = calculateNewNodePosition(existingPositions);

  const newNode = {
    id: newNodeId,
    style: { height: "50px", width: "50px", borderRadius: "100px" },
    data: {
      label: newNodeId,
    },
    targetPosition: "right",
    sourcePosition: "right",
    position: newNodePosition,
  };

  const updatedNodes = [...nodes, newNode];

  const newEdges = [...edges];
  nodes.forEach((node) => {
    if (node.id !== newNodeId) {
      const newEdge = {
        id: `${newNodeId}_${node.id}`,
        source: newNodeId,
        target: node.id,
        label: "0",
        animated: false,
        style: { stroke: "red", strokeWidth: 1 },
        type: "straight",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 30,
          height: 20,
          color: "green",
        },
      };
      newEdges.push(newEdge);
    }
  });

  return { updatedNodes, newEdges };
};

// for coloring the path that is getting removed
const highlightNode = (nodes, nodeId) => {
  return nodes.map((node) => {
    if (parseInt(node.id) === nodeId) {
      return {
        ...node,
        style: {
          ...node.style,
          borderColor: "gray",
          borderWidth: "5px",
        },
      };
    } else {
      return {
        ...node,
      };
    }
  });
};

// for reweighting the graphs
const reweightGraph = async (edges) => {
  const updatedEdges = edges.map((edge) => {
    const [sourceId, targetId] = edge.id.split("_");
    const i = parseInt(sourceId);
    const j = parseInt(targetId);

    // Calculate the new label based on the provided formula
    const oldLabel = parseInt(edge.label);
    const newLabel =
      oldLabel +
      distance_curr[distance_curr.length - 1][i] -
      distance_curr[distance_curr.length - 1][j];

    return {
      ...edge,
      label: newLabel ? newLabel.toString() : "0",
    };
  });

  return updatedEdges;
};

// node visualisation starts
const visualise = async (nodes, edges, setNodes, setEdges, updatedEdges) => {
  if (
    checkNode.length > 0 &&
    checkNode[currentNode].length === 0 &&
    currentNode >= checkNode.length - 1
  ) {
    // setting all things to default at the end
    const lastNodeId = nodes.length - 1;
    const updatedNodes = nodes.filter(
      (node) => node.id !== lastNodeId.toString()
    );

    await setNodes(colorNode(updatedNodes, "-1", "white"));

    await setEdges(
      colorEdge(updatedEdges, "-1", "-1", distance_curr, distance, false)
    );

    setTimeout(async () => {
      await visualiseJ(updatedNodes, updatedEdges, setNodes, setEdges);
    }, 3000);

    return;
  }

  setTimeout(async () => {
    // changing the color to red and blue
    const updatedNodes = colorNode(nodes, curr_node[currentNode], "red");
    setNodes(colorNode(updatedNodes, checkNode[currentNode][index], "blue"));

    // changing edge to animated and adding labels
    if (checkNode[currentNode][index] != undefined) {
      setEdges(
        colorEdge(
          edges,
          curr_node[currentNode].toString(),
          checkNode[currentNode][index].toString(),
          distance_curr,
          distance,
          true
        )
      );
    } else {
      // to set it to default
      setEdges(colorEdge(edges, "-1", "-1", distance_curr, distance, true));
    }

    setTimeout(async () => {
      // setting color to green and black
      if (result[currentNode][index] === 1) {
        const updatedNodes = colorNode(nodes, curr_node[currentNode], "green");
        setNodes(
          colorNode(updatedNodes, checkNode[currentNode][index], "green")
        );
      } else if (result[currentNode][index] === 0) {
        const updatedNodes = colorNode(nodes, curr_node[currentNode], "black");
        setNodes(
          colorNode(updatedNodes, checkNode[currentNode][index], "black")
        );
      }

      if (
        checkNode[currentNode].length == 0 ||
        index == checkNode[currentNode].length - 1
      ) {
        index = 0;
        currentNode++;
      } else {
        index++;
      }

      currentEdge++;
    }, 2000);

    await visualise(nodes, edges, setNodes, setEdges, updatedEdges);
  }, 5000);
};

// node visualisation starts
const visualiseD = async (nodes, edges, setNodes, setEdges, source) => {
  console.log("djikstra");
  if (
    checkNode.length > 0 &&
    checkNode[currentNode].length === 0 &&
    currentNode >= checkNode.length - 1
  ) {
    // setting all things to default at the end
    console.log("completed");
    const updatedNodes = highlightNode(nodes, "-1");
    setNodes(colorNode(updatedNodes, "-1", "white"));
    setEdges(colorEdge(edges, "-1", "-1", distance_curr, distance, true));
    return;
  }

  setTimeout(async () => {
    // changing the color to red and blue
    const updatedNodes = colorNode(nodes, curr_node[currentNode], "red");
    const updatedNodes2 = highlightNode(updatedNodes, source[currentNode]);
    setNodes(colorNode(updatedNodes2, checkNode[currentNode][index], "blue"));

    // changing edge to animated and adding labels
    if (checkNode[currentNode][index] != undefined) {
      setEdges(
        colorEdge(
          edges,
          curr_node[currentNode].toString(),
          checkNode[currentNode][index].toString(),
          distance_curr,
          distance,
          true
        )
      );
    } else {
      // to set it to default
      setEdges(colorEdge(edges, "-1", "-1", distance_curr, distance, true));
    }

    setTimeout(async () => {
      // setting color to green and black
      if (result[currentNode][index] === 1) {
        const updatedNodes = colorNode(nodes, curr_node[currentNode], "green");
        const updatedNodes2 = highlightNode(updatedNodes, source[currentNode]);
        setNodes(
          colorNode(updatedNodes2, checkNode[currentNode][index], "green")
        );
      } else if (result[currentNode][index] === 0) {
        const updatedNodes = colorNode(nodes, curr_node[currentNode], "black");
        const updatedNodes2 = highlightNode(updatedNodes, source[currentNode]);
        setNodes(
          colorNode(updatedNodes2, checkNode[currentNode][index], "black")
        );
      }

      if (
        checkNode[currentNode].length == 0 ||
        index == checkNode[currentNode].length - 1
      ) {
        index = 0;
        currentNode++;
      } else {
        index++;
      }

      currentEdge++;
    }, 2000);

    await visualiseD(nodes, edges, setNodes, setEdges, source);
  }, 5000);
};

const visualiseJ = async (nodes, edges, setNodes, setEdges) => {

  console.log("johnson visualised !");

  currentNode = 0;
  currentEdge = 1;
  index = 0;
  pathVal = 0;

  // fetching data for djikstra traversal
  try {
    const data = await fetch(`${host}/read-file-Johnson`);
    if (!data.ok) {
      throw new Error("Network response was not ok");
    }

    const responseData = await data.json();
    result = responseData.result;
    checkNode = responseData.checkNode;
    distance = responseData.distance;
    distance_curr = responseData.distance_curr;
    curr_node = responseData.curr_node;
    source = responseData.source;

    await visualiseD(nodes, edges, setNodes, setEdges, source);
  } catch (error) {
    console.error("Error:", error);
  }
};

const visualiseJohnson = async (nodes, edges, setNodes, setEdges) => {
  currentNode = 0;
  currentEdge = 1;
  index = 0;
  pathVal = 0;

  // fetching data for bellmanford traversal
  try {
    const data = await fetch(`${host}/read-file`);
    if (!data.ok) {
      throw new Error("Network response was not ok");
    }

    const responseData = await data.json();
    result = responseData.result;
    checkNode = responseData.checkNode;
    distance = responseData.distance;
    distance_curr = responseData.distance_curr;
    curr_node = responseData.curr_node;

    const { updatedNodes, newEdges } = await addExtraNode(
      nodes,
      edges,
      setNodes,
      setEdges
    );

    await setNodes(updatedNodes);
    await setEdges(newEdges);

    const updatedEdges = await reweightGraph(edges);

    // visualing bellman ford
    await visualise(updatedNodes, newEdges, setNodes, setEdges, updatedEdges);
  } catch (error) {
    console.error("Error:", error);
  }
};

export default visualiseJohnson;
