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
          distance_curr[currentNode].toString() +
          " + " +
          edge.label +
          " < " +
          distance[currentNode][checkNode[currentNode][index]].toString(),
      };
    } else {
      return edge;
    }
  });
};

// node visualisation starts
const visualise = async (nodes, edges, setNodes, setEdges) => {
  if (
    checkNode.length > 0 &&
    checkNode[currentNode].length === 0 &&
    currentNode >= checkNode.length - 1
  ) {
    // setting all things to default at the end
    setNodes(colorNode(nodes, curr_node[currentNode], "white"));
    setEdges(colorEdge(edges, "-1", "-1", distance_curr, distance, false));
    return;
  }

  setTimeout(() => {
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

    setTimeout(() => {
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

    visualise(nodes, edges, setNodes, setEdges);
  }, 5000);
};

const visualiseSPFA = async (nodes, edges, setNodes, setEdges) => {

  console.log("visualising spfa !");

  currentNode = 0;
  currentEdge = 1;
  index = 0;
  pathVal = 0;

  // fetching data from output.txt
  await fetch(`${host}/read-file`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // console.log('Received data:', data.distance_curr);
      result = data.result;
      checkNode = data.checkNode;
      distance = data.distance;
      distance_curr = data.distance_curr;
      curr_node = data.curr_node;
    })
    .catch((error) => {
      console.error("Error:", error);
    });


  visualise(nodes, edges, setNodes, setEdges);
};

export default visualiseSPFA;
