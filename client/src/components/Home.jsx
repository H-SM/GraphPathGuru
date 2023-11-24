/*
TODO:
- Have vinay refactor this entire file; do arrangements of code 
- make a functinoal API b/w our js script and react flow:
 example: we need functions like this: 
 color_node(nodes, edges, node_id, color_hex)
 change_edge(nodes, edges, edge_id, edge_to_change, new_label)
 and so on
 this will make our animations far more modular and will allow us to make the animations for all the algos much more easily
 also the code will look pretty :)
*/

import React, {
  useCallback,
  useRef,
  useEffect,
  useState,
  useContext,
} from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  MarkerType,
  useOnSelectionChange,
  Background,
  Controls,
} from "reactflow";

import "reactflow/dist/style.css";
import imager from "../assets/beams-pricing.png";
import userContext from "../context/User/userContext";
import graphContext from "../context/Graph/graphContext";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import AboutUs from "./aboutUs";
import Footer from "./Footer";
import TechStack from "./techStack";
import History from "./History";
import { useLocation, useNavigate } from "react-router-dom";
import UserSection from "./UserSection";

import visualiseYenK from "./AlgoVisualise/YenK";
import visualiseDjikstra from "./AlgoVisualise/Djikstra";
import visualiseBellman from "./AlgoVisualise/BellmanFord";
import visualiseFloyd from "./AlgoVisualise/Floyd";

const host = process.env.REACT_APP_BACKEND_LOCALHOST;

const initialNodes = [
  {
    id: "0",
    data: { label: "0" },
    position: { x: 0, y: 50 },
    style: { height: "50px", width: "50px", borderRadius: "100px" },
    targetPosition: "right",
    sourcePosition: "right",
  },
];
let id = 1;

// change id when new node is added
const getId = () => `${id++}`;
const setId = () => `${id--}`;

const fitViewOptions = {
  padding: 3,
};

const AddNodeOnEdgeDrop = () => {
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { project } = useReactFlow();

  const [algoID, setAlgoID] = useState("Dijkstra");

  //context here
  const context = useContext(userContext);
  const { userData, changegraph } = context;

  const gContext = useContext(graphContext);
  const { addgraph } = gContext;

  const startProcess = () => {
    // visualiseYenK(nodes, edges, setNodes, setEdges);
    // visualiseDjikstra(nodes, edges, setNodes, setEdges);
    // visualiseBellman(nodes, edges, setNodes, setEdges);
    visualiseFloyd(nodes, edges, setNodes, setEdges);
  };

  // runs everytime we connect two nodes
  const onConnect = useCallback((params) => {
    const redEdge = {
      ...params,
      id: `${connectingNodeId.current}_${params.target}`,
      style: { stroke: "red", strokeWidth: 1 },
      type: "straight",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 30,
        height: 20,
        color: "green",
      },
    };
    setEdges((els) => addEdge(redEdge, els));
    console.log(edges);
  }, []);

  // it runs when we start the connection of edge from source node
  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  // it runs when new node is created by dragging and dropping
  const onConnectEnd = useCallback(
    (event) => {
      const targetIsPane = event.target.classList.contains("react-flow__pane");

      if (targetIsPane) {
        const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
        const id = getId();
        const newNode = {
          id,
          position: project({
            x: event.clientX - left - 75,
            y: event.clientY - top,
          }),
          style: { height: "50px", width: "50px", borderRadius: "100px" },
          data: { label: `${id}` },
          targetPosition: "left",
          sourcePosition: "left",
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({
            id: `${connectingNodeId.current}_${id}`,
            source: connectingNodeId.current,
            type: "straight",
            target: id,
            style: { stroke: "red", strokeWidth: 1 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 30,
              height: 20,
              color: "green",
            },
          })
        );
        console.log(edges);
      }
    },
    [project]
  );

  // it runs when we delete a node or edge
  const onNodesDelete = useCallback(
    (deleted) => {
      const id = setId();
      setEdges(
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);

          const remainingEdges = acc.filter(
            (edge) => !connectedEdges.includes(edge)
          );

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({
              id: `${source}->${target}`,
              source,
              target,
            }))
          );

          return [...remainingEdges, ...createdEdges];
        }, edges)
      );
    },
    [nodes, edges]
  );

  // it is used for the selection of edges for assigning them weights
  const options = Array.from({ length: nodes.length }, (_, index) => (
    <option key={index} value={index}>
      {index}
    </option>
  ));

  // used for selecting of source and destination nodes for assigning edges
  const [node1, setnode1] = useState("0");
  const [node2, setnode2] = useState("0");

  const handleSelectChange1 = (event) => {
    setnode1(event.target.value);
  };

  const handleSelectChange2 = (event) => {
    setnode2(event.target.value);
  };

  const [val, setval] = useState("");

  const handleValChange = (event) => {
    setval(event.target.value);
  };

  // changing the weights of each node
  const changeWeights = (node1, node2, val) => {
    const updatedEdges = [];

    const check = node1 + "_" + node2;

    edges.forEach((edge) => {
      if (edge.id === check) {
        updatedEdges.push({
          ...edge,
          label: val.toString(),
        });
      } else {
        updatedEdges.push({
          ...edge,
        });
      }
    });

    setEdges(updatedEdges);
  };

  // TODO: make a POST request to take out the graph string and 
  const extract_graph = () => {
      return;
  };

  const extract_result = () => {
    return;
  };


  // writing data to file
  const writeFile = async () => {
    const data = {
      nodes: nodes,
      edges: edges,
    };
    console.log("this is data\n", data);
    const nexter = userData.graphs + 1;
    const req = await fetch(`${host}/write-file`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const response = await req.json();
    performAlgo();
    //TODO: async
    changegraph(nexter);
    const namer = `${algoID}-${userData.graphs}`;
    if (namer.length < 0 || namer.length > 25) {
      alert("name too big (0-25 characters). please make it smaller");
    } else {
      const samp_data = {
        result:
          "<result> \n 12321ms \n 12.2MB \n 3,0 \n -1 2 0 \n 0 2 1 \n </result>",
        graph: "0 -65 -3: 1,12 2,1 \n 1 118 -12: \n 2 182 134: 1,1",
        name: namer,
        favourite: false,
      };
      addgraph(
        samp_data.result,
        samp_data.graph,
        samp_data.name,
        samp_data.favourite
      );
    }
  };

  // Object to map the correct algo ID for back end
  const algoMap = {
    Dijkstra: 0,
    "Bellman Ford": 1,
    SPFA: 2,
    "Floyd Warshall": 3,
    "Johnson's Algorithm": 4,
    "Yen's K shortest Paths": 5,
  };

  // Drop down menu logic
  const selectAlgo = (event) => {
    const selectedValue = event.target.value;
    setAlgoID(selectedValue);
    console.log("This is val:", selectedValue, algoMap[algoID]);
  };

  // Algo POST call. Uses algoID use state variable to call the correct algorithm in backend
  const performAlgo = async () => {
    console.log(algoID);
    if (algoID === "") {
      return;
    }
    console.log(algoMap[algoID]);
    await fetch(`${host}/perform-algo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ algoID: algoMap[algoID] }),
    }).then(() => {
      console.log(`${host}/perform-algo`, "pinged");
    });
  };

  // for flipping the node
  const flipNode = () => {
    const updatedNodes = [];
    nodes.forEach((node) => {
      if (node.id === selectedNode[0]) {
        if (node.targetPosition === "right") {
          updatedNodes.push({
            ...node,
            targetPosition: "left",
            sourcePosition: "left",
          });
        } else {
          updatedNodes.push({
            ...node,
            targetPosition: "right",
            sourcePosition: "right",
          });
        }
      } else {
        updatedNodes.push({
          ...node,
        });
      }
    });

    setNodes(updatedNodes);
  };

  // for flipping the node
  const [selectedNode, setSelectedNode] = useState([]);

  // to get the current selected node
  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      setSelectedNode(nodes.map((node) => node.id));
    },
  });
  const location = useLocation();

  // it is used to get the location of the cursor to make the new node there
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sectionToScroll = queryParams.get("section");

    if (sectionToScroll) {
      const targetSection = document.getElementById(sectionToScroll);

      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
        // Remove the section query parameter from the URL
        queryParams.delete("section");
      }
    }
  }, [location.search]);
  return (
    <>
      <div className="flex justify-center items-center">
        <section className="grid grid-cols-1 gap-x-8 gap-y-6 pb-20 xl:grid-cols-4">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Start Looking into it!
          </h2>
          <div className="col-span-3">
            <div className="max-w-[54rem] text-lg leading-8 text-slate-600">
              <p>
                Welcome to our playground! You could look into your graph
                learning from visualizing them below using the variable features
                there is to offer.
              </p>
              <p className="mt-6">
                We provide a platform for researchers to experiment, validate,
                and gain insights into the performance of various shortest path
                algorithms, fostering algorithmic innovation.
              </p>
            </div>
          </div>
        </section>
      </div>
      <div
        id="graph"
        className="flex flex-row justify-center items-center gap-3"
      >
        <div
          className="wrapper w-[70%] h-[80vh] ring-2 ring-zinc-200 ring-offset-2 rounded-sm"
          ref={reactFlowWrapper}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodesDelete={onNodesDelete}
            onConnectStart={onConnectStart}
            onConnectEnd={onConnectEnd}
            fitView
            fitViewOptions={fitViewOptions}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        <div className="w-[20%] h-[80vh] flex flex-col justify-start gap-4 mt-[35px]">
          <button
            onClick={startProcess}
            className="relative px-5 py-3 overflow-hidden font-medium text-gray-600 bg-gray-100 border border-gray-100 rounded-lg shadow-inner group"
          >
            <span className="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-gray-600 group-hover:w-full ease"></span>
            <span className="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-gray-600 group-hover:w-full ease"></span>
            <span className="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
            <span className="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
            <span className="absolute inset-0 w-full h-full duration-300 delay-300 bg-gray-900 opacity-0 group-hover:opacity-100"></span>
            <span className="relative transition-colors duration-300 delay-200 group-hover:text-white ease font-bold">
              Visualize
            </span>
          </button>
          <button
            onClick={() => writeFile()}
            className="relative px-5 py-3 overflow-hidden font-medium text-gray-600 bg-gray-100 border border-gray-100 rounded-lg shadow-inner group"
          >
            <span className="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-gray-600 group-hover:w-full ease"></span>
            <span className="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-gray-600 group-hover:w-full ease"></span>
            <span className="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
            <span className="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
            <span className="absolute inset-0 w-full h-full duration-300 delay-300 bg-gray-900 opacity-0 group-hover:opacity-100"></span>
            <span className="relative transition-colors duration-300 delay-200 group-hover:text-white ease font-bold">
              Save
            </span>
          </button>
          <button
            onClick={flipNode}
            className="relative px-5 py-3 overflow-hidden font-medium text-gray-600 bg-gray-100 border border-gray-100 rounded-lg shadow-inner group"
          >
            <span className="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-gray-600 group-hover:w-full ease"></span>
            <span className="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-gray-600 group-hover:w-full ease"></span>
            <span className="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
            <span className="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
            <span className="absolute inset-0 w-full h-full duration-300 delay-300 bg-gray-900 opacity-0 group-hover:opacity-100"></span>
            <span className="relative transition-colors duration-300 delay-200 group-hover:text-white ease font-bold">
              Flip Node
            </span>
          </button>
          {/* <button onClick={performDijktra} className="relative px-5 py-3 overflow-hidden font-medium text-gray-600 bg-gray-100 border border-gray-100 rounded-lg shadow-inner group">
                        <span className="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-gray-600 group-hover:w-full ease"></span>
                        <span className="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-gray-600 group-hover:w-full ease"></span>
                        <span className="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
                        <span className="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
                        <span className="absolute inset-0 w-full h-full duration-300 delay-300 bg-gray-900 opacity-0 group-hover:opacity-100"></span>
                        <span className="relative transition-colors duration-300 delay-200 group-hover:text-white ease font-bold">Perform Dijktra</span>
                    </button> */}
          <label
            htmlFor="dropdown"
            className=" text-gray-700 text-sm font-bold "
          >
            Select an Algorithm:
          </label>
          <select
            id="dropdown"
            className="text-gray-700 ap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-bold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mt-[-1vh]"
            onChange={selectAlgo}
            value={algoID || ""}
          >
            <option
              className="text-gray-700 text-sm font-semibold"
              value="Dijkstra"
              defaultChecked
            >
              Dijkstra
            </option>
            <option
              className="text-gray-700 text-sm font-semibold"
              value="Bellman Ford"
            >
              Bellman Ford
            </option>
            <option
              className="text-gray-700 text-sm font-semibold"
              value="SPFA"
            >
              SPFA
            </option>
            <option
              className="text-gray-700 text-sm font-semibold"
              value="Floyd Warshall"
            >
              Floyd Warshall
            </option>
            <option
              className="text-gray-700 text-sm font-semibold"
              value="Johnson's Algorithm"
            >
              Johnson's Algorithm
            </option>
            <option
              className="text-gray-700 text-sm font-semibold"
              value="Yen's K shortest Paths"
            >
              Yen's K shortest Paths
            </option>
          </select>

          <div className="gap-3 flex w-full justify-evenly">
            <div>
              <label
                htmlFor="select1"
                className=" text-gray-700 text-sm font-bold "
              >
                {" "}
                From:{" "}
              </label>
              <select
                id="select1"
                className="inline-flex w-[100px] justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                value={node1}
                onChange={handleSelectChange1}
              >
                {options}
              </select>
            </div>

            <div>
              <label
                htmlFor="select1"
                className=" text-gray-700 text-sm font-bold "
              >
                {" "}
                To:{" "}
              </label>
              <select
                id="select1"
                className="inline-flex w-[100px] justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                value={node2}
                onChange={handleSelectChange2}
              >
                {options}
              </select>
            </div>
          </div>

          <div>
            <label className=" text-gray-700 text-sm font-bold ">
              Enter Weight
            </label>
            <input
              value={val}
              onChange={handleValChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="val"
              type="text"
            />
          </div>

          <button
            onClick={() => changeWeights(node1, node2, val)}
            className="relative px-5 py-3 overflow-hidden font-medium text-gray-600 bg-gray-100 border border-gray-100 rounded-lg shadow-inner group"
          >
            <span className="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-gray-600 group-hover:w-full ease"></span>
            <span className="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-gray-600 group-hover:w-full ease"></span>
            <span className="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
            <span className="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
            <span className="absolute inset-0 w-full h-full duration-300 delay-300 bg-gray-900 opacity-0 group-hover:opacity-100"></span>
            <span className="relative transition-colors duration-300 delay-200 group-hover:text-white ease font-bold">
              Change
            </span>
          </button>
        </div>
      </div>
    </>
  );
};
const Home = (props) => {
  const {showAlert} = props;
  let navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);
  const context = useContext(userContext);
  const { getuserinfo } = context;

  useEffect(() => {
    getuserinfo();
  }, []);
  return (
    <>
      <div>
        <img
          src={imager}
          alt=""
          className="absolute left-0 top-0 z-[-1] w-full max-w-none opacity-[90%]"
        />

        <div className="z-10">
          <Navbar />
          <HeroSection />
        </div>
      </div>
      <ReactFlowProvider>
        <AddNodeOnEdgeDrop />
      </ReactFlowProvider>

      <div className="w-full h-[20vh]"></div>
      <History showAlert={showAlert}/>
      <AboutUs />
      <TechStack />
      <Footer />
      <UserSection />
    </>
  );
};

export default Home;
