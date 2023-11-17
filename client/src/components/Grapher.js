import React, { useContext, useEffect, useState } from "react";
import NavbarOut from "./NavbarOut";
import { Link, useParams } from "react-router-dom";
import graphContext from "../context/Graph/graphContext.js";
import userContext from "../context/User/userContext.js";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import logo from '../assets/logo.png';

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
import Footer from "./Footer.js";

const Grapher = () => {
  const { id } = useParams();
  const contextgraph = useContext(graphContext);
  const contextuser = useContext(userContext);

  const { getgraph, viewGraph } = contextgraph;
  const { usershower, showUser, setShowUser } = contextuser;

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

  const extractEdgesAndNodes = (graphData) => {
    const lines = graphData.split("\n");

    let edgesCount = 0;
    let nodesCount = 0;

    lines.forEach((line) => {
      const parts = line.split(" ");
      if (parts.length >= 1) {
        // Assuming each line represents a node, increment nodesCount
        nodesCount++;

        // Assuming each part after the first represents an edge, increment edgesCount
        edgesCount += parts.length - 1;
      }
    });

    // Update state variables together
    setNumEdges(edgesCount);
    setNumNodes(nodesCount);
  };

  useEffect(() => {
    if (showUser.length !== 0) {
      extractEdgesAndNodes(viewGraph.graph);
        // Extract TC and SC from the result string
      const resultArray = viewGraph.result
      .split("\n")
      .filter((item) => item.trim() !== "");
      setTc(resultArray[1]?.trim() || "N/A");
      setSc(resultArray[2]?.trim() || "N/A");
      calculateThroughput(tc,sc)
    }
  }, [showUser, viewGraph, tc, sc]);
 

    
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
    const spaceInMegabytes = parseFloat(sc, 10);
    const throughputMbps =Math.ceil( spaceInMegabytes / (timeInMilliseconds / 1000));

    setThroughput(`${throughputMbps} mbps`)
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


<section class="relative h-[17vh]">
  <div class="absolute left-1/2 top-[5%] mx-auto flex w-[90%] max-w-[960px] flex-col items-center rounded-xl -translate-x-1/2 bg-gradient-to-t from-white to-sky-400 p-4 sm:justify-between sm:px-8 md:flex-row md:py-6 lg:w-full">
    <div class="flex flex-row items-center">
      <img src={logo} alt="" class="inline-block item-center w-[25vh] rounded-full object-cover" />
      <Link 
    class="group -my-2 hidden items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-xs text-slate-900 ring-1 ring-inset ring-black/[0.08] hover:bg-white/80 hover:ring-black/[0.13] ml-2 sm:flex md:hidden lg:flex xl:flex" to="/"><svg class="h-4 w-4 fill-sky-500" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clip-rule="evenodd"></path></svg>
        <span class="font-semibold">Make Your Graphs</span>
        <svg width="2" height="2" aria-hidden="true" class="fill-slate-900"><circle cx="1" cy="1" r="1"></circle></svg>
        <span class="font-medium"><span class="md:hidden">New Graphs</span><span class="hidden md:inline">Learn by visualizing your graphs</span></span>
    <svg viewBox="0 0 5 8" class="h-2 w-[5px] fill-black/30 group-hover:fill-black/60" fill-rule="evenodd" clip-rule="evenodd" aria-hidden="true"><path d="M.2.24A.75.75 0 0 1 1.26.2l3.5 3.25a.75.75 0 0 1 0 1.1L1.26 7.8A.75.75 0 0 1 .24 6.7L3.148 4 .24 1.3A.75.75 0 0 1 .2.24Z"></path>
    </svg>
    </Link>
    </div>
    <div class="mt-4 flex flex-row items-center justify-center gap-4 md:mt-0">
      <Link href="#" class="inline-block rounded-xl border border-black bg-white px-10 py-3 font-semibold text-sky-700 [box-shadow:rgb(3,_105,_161)_6px_6px] transition ease-in-out duration-200 delay-75 hover:[box-shadow:rgb(3,_105,_161)_0px_0px] hover:bg-white/80 hover:text-black" to="/login">Get Started</Link>
      
    </div>
  </div>
</section>

          <div
            id="graph"
            className="flex flex-col justify-center items-center gap-3"
          >
            <div
              className="wrapper lg:w-[120vh] w-[90vh] h-[70vh] ring-2 ring-zinc-200 ring-offset-2 rounded-sm bg-white/80"
              // ref={reactFlowWrapper}
            >
              <ReactFlow
              // nodes={nodes}
              // edges={edges}
              // onNodesChange={onNodesChange}
              // onEdgesChange={onEdgesChange}
              // onConnect={onConnect}
              // onNodesDelete={onNodesDelete}
              // onConnectStart={onConnectStart}
              // onConnectEnd={onConnectEnd}
              // fitView
              // fitViewOptions={fitViewOptions}
              >
                <Background />
                <Controls />
              </ReactFlow>
              
            </div>
            
          </div>
          <div class="mx-auto max-w-2xl text-center">
          <div class="relative z-20 mx-auto max-w-container px-4 pt-14 sm:px-6 sm:pt-20 lg:px-8"><div class="mx-auto max-w-[45rem] text-center"><h1 class="text-base font-semibold leading-7 text-sky-500">what did you make?</h1><p class="mt-4 text-5xl font-extrabold leading-[3.5rem] tracking-tight text-slate-900">Your Graph Stats.</p></div></div>
         
          <p class="mt-2 text-lg leading-8 text-gray-600">
            Further details over the graph in order to have greater insights on item.
          </p>
          
        </div>
        <div className="order-first text-3xl font-bold  tracking-tight text-gray-900 sm:text-5xl mt-[10vh]">
              {viewGraph.name}
    </div>
    <dt className="text-base leading-7 text-gray-600 mt-2">Name of the Graph</dt>
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <dl className="grid grid-cols-1 gap-x-1 gap-y-16 text-center lg:grid-cols-3">
            <div key="1" className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-gray-600">Number of Nodes</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              {numNodes}
              </dd>
            </div>
            
              
            <div key="2" className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-gray-600">Overall Throughput</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              {throughput}
              </dd>
            </div>   
            <div key="3" className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-gray-600">Number of Edges</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              {numEdges}
              </dd>
            </div> 
            <div key="4" className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-gray-600">Time Taken</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              {tc}
              </dd>
            </div> 
            <div key="5" className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-gray-600">Date of Creation</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              {formatTime(viewGraph.date)}
              </dd>
            </div> 
            <div key="6" className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-gray-600">Space taken</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              {sc}
              </dd>
            </div> 
        </dl>
      </div>
    </div>

    <Footer/>
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
