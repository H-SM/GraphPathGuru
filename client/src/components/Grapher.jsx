import React, { useCallback, useRef, useContext, useEffect, useState } from "react";
import NavbarOut from "./NavbarOut.jsx";
import { useParams } from "react-router-dom";
import graphContext from "../context/Graph/graphContext.js";
import userContext from "../context/User/userContext.js";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { UserCircleIcon } from "@heroicons/react/24/solid";

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
import Footer from "./Footer";



const fitViewOptions = {
  padding: 3,
};


const Graphlet = () => {
  const contextgraph = useContext(graphContext);
  const { viewGraph } = contextgraph;


  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { project } = useReactFlow();
  const [nid, setNid] = useState(0);

  console.log("I am alive, Graphlet", nodes);

  // change id when new node is added
  const getId = () => {
    setNid(prevNid => prevNid + 1);
    return `${nid - 1}`;
  }

  const setId = () => {
    setNid(prevNid => prevNid - 1);
    return `${nid + 1}`;
  }
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

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  // it runs when new node is created by dragging and dropping
  const onConnectEnd = useCallback(
    (event) => {
      const targetIsPane = event.target.classList.contains("react-flow__pane");

      if (targetIsPane) {
        const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
        getId();
        const newNode = {
          nid,
          position: project({
            x: event.clientX - left - 75,
            y: event.clientY - top,
          }),
          style: { height: "50px", width: "50px", borderRadius: "100px" },
          data: { label: `${nid}` },
          targetPosition: "left",
          sourcePosition: "left",
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({
            nid: `${connectingNodeId.current}_${nid}`,
            source: connectingNodeId.current,
            type: "straight",
            target: nid,
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

  const makeNodesEdges = useCallback((gdata, nodes, edges) => {
    const lines = gdata.split('\n');
    console.log("THIS IS THFCISJOIJDIOWQJDOI", lines);
    const adj = [];

    for (const line of lines) {
      let pointer = 0;
      let temp = '';

      while (pointer < line.length && line[pointer] === ' ') {
        pointer++;
      }

      let nodeInfo = "";
      while (pointer < line.length && line[pointer] !== ':') {
        nodeInfo += line[pointer];
        pointer++;
      }
      nodeInfo = nodeInfo.split(' ')

      pointer += 2; // Skip ": "

      const connectedNodes = [];
      while (pointer < line.length) {
        // Get connected node and weight
        while (pointer < line.length && line[pointer] !== ',') {
          temp += line[pointer];
          pointer++;
        }
        const connectedNode = parseInt(temp, 10);
        temp = '';

        pointer++; // Skip the comma

        while (pointer < line.length && line[pointer] !== ' ' && line[pointer] !== undefined) {
          temp += line[pointer];
          pointer++;
        }
        const weight = parseInt(temp, 10);
        temp = '';

        if (!isNaN(connectedNode) && !isNaN(weight)) {
          connectedNodes.push([connectedNode, weight]);
        }
      }
      console.log("THIS IS SPARTA", nodeInfo);
      if (nodeInfo.length !== 3) {
        continue;
      }
      adj.push([nodeInfo, ...connectedNodes]);
    }

    console.log("Amazing adj", adj);

    const sx = adj[0][0][0], sy = adj[0][0][1];
    adj.forEach((nodeInfo, index) => {
      console.log(" bruht", nodeInfo)
      const nodeId = nodeInfo[0][0];
      const position = { x: nodeInfo[0][1], y: nodeInfo[0][2] };

      // Create a node object
      const node = {
        id: nodeId.toString(),
        type: 'default',
        position: position,
        style: { height: '50px', width: '50px', borderRadius: '100px' },
        data: {
          label: nodeId.toString(),
        },
        targetPosition: 'right',
        sourcePosition: 'right',
      };


      setNodes((nds) => nds.concat(node))


      // Create edges for connected nodes
      for (let i = 1; i < nodeInfo.length; i++) {
        const [connectedNode, weight] = nodeInfo[i];
        const edgeId = `${nodeId}_${connectedNode}`;
        const edge = {
          id: edgeId,
          source: nodeId.toString(),
          target: connectedNode.toString(),
          type: 'straight',
          label: weight.toString(),
          style: { stroke: 'red', strokeWidth: 1 },
          markerEnd: { type: 'arrowclosed', width: 30, height: 20, color: 'green' },
        };
        console.log("THIS IS A  edge", edge);


        setEdges((els) => addEdge(edge, els));

      }
    });

    console.log("THIS IS NODES: ", nodes);
    console.log("THIS IS edges: ", edges);
    return;
  }, [setNodes, setEdges]);

  useEffect(() => {
    setTimeout(() => {
    }, 1000);
    if (nodes.length === 0) {
      makeNodesEdges(viewGraph.graph, nodes, edges, nid);
    }
    // if (nodes.length !== 0) {
    setNid(nodes.length);
    // }
  }, []);

  return (
    <>
      <div
        id="graph"
        className="flex flex-col justify-center items-center gap-3 bg-blue/30"
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
      </div>
    </>
  );
};


const Grapher = () => {
  const { id } = useParams();
  const contextgraph = useContext(graphContext);
  const contextuser = useContext(userContext);

  const { getgraph, viewGraph } = contextgraph;
  const { usershower, showUser } = contextuser;

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        await getgraph(id);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGraph();
  }, [id]);
  const [numEdges, setNumEdges] = useState(0);
  const [numNodes, setNumNodes] = useState(0);
  const [tc, setTc] = useState("");
  const [sc, setSc] = useState("");
  const [throughput, setThroughput] = useState("");


  useEffect(() => {
    if (showUser.length !== 0) {
      // Extract TC and SC from the result string
      // const resultArray = viewGraph.result
      //   .split("\n")
      //   .filter((item) => item.trim() !== "");
      // setTc(resultArray[1]?.trim() || "N/A");
      // setSc(resultArray[2]?.trim() || "N/A");
      // calculateThroughput(tc, sc);
      const resultArray = viewGraph.result
        .split("\n")[1].split(' ');
      setTc(resultArray[0] || "N/A");
      setNumNodes(resultArray[1] || "N/A");
      setNumEdges(resultArray[2] || "N/A");
      setSc(resultArray[3] || "N/A");
    }
  }, [showUser, viewGraph, tc, sc]);

  function calculateTimeAgo(dateString) {
    const showUserDate = new Date(dateString);
    const currentDate = new Date();

    const timeDifference = currentDate - showUserDate;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
      return `Joined ${years} ${years === 1 ? "year" : "years"} ago`;
    } else if (months > 0) {
      return `Joined ${months} ${months === 1 ? "month" : "months"} ago`;
    } else if (days > 0) {
      return `Joined ${days} ${days === 1 ? "day" : "days"} ago`;
    } else if (hours > 0) {
      return `Joined ${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (minutes > 0) {
      return `Joined ${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else {
      return `Joined just now`;
    }
  }

  useEffect(() => {
    // Ensure viewGraph.user is available and not undefined
    if (viewGraph && viewGraph.user) {
      const fetchUser = async () => {
        try {
          await usershower(viewGraph.user);
        } catch (error) {
          console.error(error);
        }
      };

      fetchUser();
    }
  }, [viewGraph]);

  //   useEffect(() => {
  //     // Use a conditional check to prevent recursive calls
  //     if (!viewGraph || viewGraph._id !== id) {
  //       getgraph(id);
  //     }

  //     // Cleanup function
  //     return ;
  //   }, [id, viewGraph, getgraph]);
  const formatTime = (isoTime) => {
    const date = new Date(isoTime);
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    };

    return date.toLocaleString("en-US", options);
  };
  //get no. of nodes and edges
  function calculateThroughput(tc, sc) {
    // Calculate throughput in Mbps
    const timeInMilliseconds = parseFloat(tc, 10);
    const spaceInMegabytes = parseFloat(sc, 10);  // when I do this thing, it would be Kb
    const throughputMbps = Math.ceil(
      (spaceInMegabytes + 1) / (timeInMilliseconds / 1000)
    );

    setThroughput(`${throughputMbps} mbps`);
  }
  return (
    <>
      {showUser.length !== 0 ? (
        <>
          <NavbarOut />
          <div
            className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
            aria-hidden="true"
          >
            {/* <div
            className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-white sm:left-[calc(50%-40rem)] sm:w-[72.1875rem] opacity-25"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          ></div> */}
          </div>
          <ReactFlowProvider>
            <Graphlet />
          </ReactFlowProvider>
          <div
            id="userInfo"
            className="flex flex-col justify-center items-center gap-3 bg-blue/30"
          >
            <div className="w-[60vh] flex flex-col items-center">
              <p className="mt-4 text-3xl font-bold leading-[3.5rem] tracking-tight text-slate-900">
                Made By
              </p>
              <div className="w-[80vh] h-[15vh] bg-sky-700/10 my-2 rounded-xl ring-1 ring-sky-700 flex flex-row justify-center items-center gap-9 relative overflow-hidden">
                {showUser?.image ? (
                  <img
                    alt="avatar"
                    src={showUser?.image}
                    className="w-[13vh]"
                  />
                ) : (
                  <UserCircleIcon
                    className="w-[13vh] text-cyan-600"
                    aria-hidden="true"
                  />
                )}
                <div className="flex items-center flex-col justify-center h-full w-fit">
                  <p className="text-sky-900 font-mono font-bold text-[22px] xl:text-[25px]">
                    {showUser.name}
                  </p>
                  <p className="text-sky-900/80 font-mono text-[15px]">
                    {calculateTimeAgo(showUser.date)}
                  </p>
                </div>
              </div>
              <p className="font-medium text-[15px] mt-2 flex flex-row gap-1">
                Share this graph with others<span aria-hidden="true">→ </span>
                <a onClick={() => navigator.clipboard.writeText(`http://localhost:3000/graph/${id}`)} className="font-medium text-sky-700 hover:underline hover:cursor-pointer select-none flex flex-row items-center opacity-90 hover:opacity-100">
                  click here <svg viewBox="0 0 25 25" fill="none" width="20" height="20" xmlns="http://www.w3.org/2000/svg" ><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.5 6.25C12.9142 6.25 13.25 5.91421 13.25 5.5C13.25 5.08579 12.9142 4.75 12.5 4.75V6.25ZM20.25 12.5C20.25 12.0858 19.9142 11.75 19.5 11.75C19.0858 11.75 18.75 12.0858 18.75 12.5H20.25ZM19.5 6.25C19.9142 6.25 20.25 5.91421 20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75V6.25ZM15.412 4.75C14.9978 4.75 14.662 5.08579 14.662 5.5C14.662 5.91421 14.9978 6.25 15.412 6.25V4.75ZM20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75C19.0858 4.75 18.75 5.08579 18.75 5.5H20.25ZM18.75 9.641C18.75 10.0552 19.0858 10.391 19.5 10.391C19.9142 10.391 20.25 10.0552 20.25 9.641H18.75ZM20.0303 6.03033C20.3232 5.73744 20.3232 5.26256 20.0303 4.96967C19.7374 4.67678 19.2626 4.67678 18.9697 4.96967L20.0303 6.03033ZM11.9697 11.9697C11.6768 12.2626 11.6768 12.7374 11.9697 13.0303C12.2626 13.3232 12.7374 13.3232 13.0303 13.0303L11.9697 11.9697ZM12.5 4.75H9.5V6.25H12.5V4.75ZM9.5 4.75C6.87665 4.75 4.75 6.87665 4.75 9.5H6.25C6.25 7.70507 7.70507 6.25 9.5 6.25V4.75ZM4.75 9.5V15.5H6.25V9.5H4.75ZM4.75 15.5C4.75 18.1234 6.87665 20.25 9.5 20.25V18.75C7.70507 18.75 6.25 17.2949 6.25 15.5H4.75ZM9.5 20.25H15.5V18.75H9.5V20.25ZM15.5 20.25C18.1234 20.25 20.25 18.1234 20.25 15.5H18.75C18.75 17.2949 17.2949 18.75 15.5 18.75V20.25ZM20.25 15.5V12.5H18.75V15.5H20.25ZM19.5 4.75H15.412V6.25H19.5V4.75ZM18.75 5.5V9.641H20.25V5.5H18.75ZM18.9697 4.96967L11.9697 11.9697L13.0303 13.0303L20.0303 6.03033L18.9697 4.96967Z" fill="#000000"></path> </g></svg>
                </a>
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-2xl text-center">
            <div className="relative z-20 mx-auto max-w-container px-4 pt-14 sm:px-6 sm:pt-20 lg:px-8">
              <div className="mx-auto max-w-[45rem] text-center">
                <h1 className="text-base font-semibold leading-7 text-sky-500">
                  what did you make?
                </h1>
                <p className="mt-4 text-5xl font-extrabold leading-[3.5rem] tracking-tight text-slate-900">
                  Your Graph Stats.
                </p>
              </div>
            </div>

            <p className="mt-2 text-lg leading-8 text-gray-600">
              Further details over the graph in order to have greater insights
              on item.
            </p>
          </div>
          <div className="order-first text-3xl font-bold  tracking-tight text-gray-900 sm:text-5xl mt-[10vh]">
            {viewGraph.name}
          </div>
          <dt className="text-base leading-7 text-gray-600 mt-2">
            Name of the Graph
          </dt>
          <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <dl className="grid grid-cols-1 gap-x-1 gap-y-16 text-center lg:grid-cols-3">
                <div key="1" className="mx-auto flex max-w-xs flex-col gap-y-4">
                  <dt className="text-base leading-7 text-gray-600">
                    Number of Nodes
                  </dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                    {numNodes}
                  </dd>
                </div>

                <div key="2" className="mx-auto flex max-w-xs flex-col gap-y-4">
                  <dt className="text-base leading-7 text-gray-600">
                    Overall Throughput
                  </dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                    {throughput}
                  </dd>
                </div>
                <div key="3" className="mx-auto flex max-w-xs flex-col gap-y-4">
                  <dt className="text-base leading-7 text-gray-600">
                    Number of Edges
                  </dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                    {numEdges}
                  </dd>
                </div>
                <div key="4" className="mx-auto flex max-w-xs flex-col gap-y-4">
                  <dt className="text-base leading-7 text-gray-600">
                    Time Taken
                  </dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                    {tc + "μs"}
                  </dd>
                </div>
                <div key="5" className="mx-auto flex max-w-xs flex-col gap-y-4">
                  <dt className="text-base leading-7 text-gray-600">
                    Date of Creation
                  </dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                    {formatTime(viewGraph.date)}
                  </dd>
                </div>
                <div key="6" className="mx-auto flex max-w-xs flex-col gap-y-4">
                  <dt className="text-base leading-7 text-gray-600">
                    Space taken
                  </dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                    {sc + "KB"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <Footer />
        </>
      ) : (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}
    </>
  );
};

export default Grapher;