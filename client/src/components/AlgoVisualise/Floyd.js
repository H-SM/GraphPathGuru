var currentNode = 0;
var currentEdge = 1;
var index = 0;
var nodeVal = -1;
var temp = -1;

const host = process.env.REACT_APP_BACKEND_LOCALHOST;

var checkNode = []; // the nodes to check
var result = []; // result whether 1 or 0
var distance = []; // it is the adjacency matrix after each iteration of k
var distance_curr = []; // distance of the current node from k
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
      return {
        ...node,
      };
    }
  });
};

// coloring the edges of the graph
const colorEdge = (
  edges,
  intermediate,
  sourceEdge,
  destinationEdge,
  distance,
  animated
) => {

  return edges.map((edge) => {
    if (
      edge.id === sourceEdge + "_" + intermediate ||
      edge.id === intermediate + "_" + sourceEdge ||
      edge.id === intermediate + "_" + destinationEdge ||
      edge.id === destinationEdge + "_" + intermediate
    ) {
      return {
        ...edge,
        animated: animated,
        label:
          distance[parseInt(sourceEdge, 10)][
            parseInt(intermediate, 10)
          ].toString() +
          " + " +
          distance[parseInt(intermediate, 10)][
            parseInt(destinationEdge, 10)
          ].toString() +
          " < " +
          distance[parseInt(sourceEdge, 10)][
            parseInt(destinationEdge, 10)
          ].toString(),
      };
    } else {
      return edge;
    }
  });
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

const visualise = async (nodes, edges, setNodes, setEdges) => {
  // fetching data from output.txt

  if (
    checkNode.length > 0 &&
    checkNode[currentNode].length === 0 &&
    currentNode >= checkNode.length - 1
  ) {
    // setting all things to default at the end
    console.log("completed");
    const updatedNodes = highlightNode(nodes, "-1");
    setNodes(colorNode(updatedNodes, "-1", "white"));
    setEdges(
      colorEdge(edges, nodeVal.toString(), "-1", "-1", distance[0], false)
    );
    return;
  }

  setTimeout(() => {
    console.log("hello", curr_node[currentNode]);
    if (curr_node[currentNode] === 0 && temp !== currentNode) {
      temp = currentNode;
      nodeVal++;
    }

    // changing the color to red and blue
    const updatedNodes1 = colorNode(nodes, curr_node[currentNode], "red");
    const updatedNodes2 = highlightNode(updatedNodes1, nodeVal);
    setNodes(colorNode(updatedNodes2, checkNode[currentNode][index], "blue"));

    // changing edge to animated and adding labels
    if (checkNode[currentNode][index] != undefined) {
      try {
        setEdges(
          colorEdge(
            edges,
            nodeVal.toString(), // intermediate
            curr_node[currentNode].toString(), // source
            checkNode[currentNode][index].toString(), // destinatoin
            distance[nodeVal],
            true
          )
        );
      } catch (err) {
        console.log("error", err);
      }
    } else {
      // to set it to default
      setEdges(colorEdge(edges, nodeVal.toString(), "-1", "-1", distance[0], true));
    }

    setTimeout(() => {

      // setting color to green and black
      if (result[currentNode][index] === 1) {
        const updatedNodes1 = colorNode(nodes, curr_node[currentNode], "green");
        const updatedNodes2 = highlightNode(updatedNodes1, nodeVal);
        setNodes(
          colorNode(updatedNodes2, checkNode[currentNode][index], "green")
        );
      } else if (result[currentNode][index] === 0) {
        const updatedNodes1 = colorNode(nodes, curr_node[currentNode], "black");
        const updatedNodes2 = highlightNode(updatedNodes1, nodeVal);
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

    visualise(nodes, edges, setNodes, setEdges);
  }, 5000);
};

const visualiseFloyd = async (nodes, edges, setNodes, setEdges) => {
  currentNode = 0;
  currentEdge = 1;
  index = 0;
  nodeVal = -1;
  temp = -1;

  await fetch(`${host}/read-file-Floyd`)
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

export default visualiseFloyd;
