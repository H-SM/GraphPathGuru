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

import React, { useCallback, useRef, useEffect, useState, useContext } from 'react';
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
    Controls
} from 'reactflow';

import 'reactflow/dist/style.css';
import imager from '../assets/beams-pricing.png';
import userContext from "../context/User/userContext";

import Navbar from './Navbar';
import HeroSection from './HeroSection';
import AboutUs from './aboutUs';
import Footer from './Footer';
import TechStack from './techStack';
import History from './History';
import { useLocation, useNavigate } from 'react-router-dom';
import UserSection from './UserSection';

// TODO: can't ping up the .env file here 
// const host = "http://localhost:5000";
const host = process.env.REACT_APP_BACKEND_LOCALHOST;
console.log("host:", host);

const initialNodes = [
    {
        id: '0',
        data: { label: '0' },
        position: { x: 0, y: 50 },
        style: { height: "50px", width: "50px", borderRadius: "100px" },
        targetPosition: 'right',
        sourcePosition: 'right',
    },
];
let id = 1;

// change id when new node is added
const getId = () => `${id++}`;
const setId = () => `${id--}`;

const fitViewOptions = {
    padding: 3,
};

let currentNode = 0;
let currentEdge = 1;
let index = 0;

const AddNodeOnEdgeDrop = () => {

    const reactFlowWrapper = useRef(null);
    const connectingNodeId = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { project } = useReactFlow();

    const [algoID, setAlgoID] = useState('');


    var checkNode = [];    // the nodes to check 
    var result = [];      // result whether 1 or 0
    var distance = [];    // distance of current node from source
    var distance_curr = [];  // distance of the current node
    var curr_node = [];   // current node from which the distance of all adjacent nodes is calculated

    const [isProcessing, setIsProcessing] = useState(false);
    const startProcess = () => {
        // to set them to default everytime we press visualise button
        currentNode = 0;
        currentEdge = 1;
        index = 0;
        setIsProcessing(true);
        visualise();
    };

    useEffect(() => {
        console.log(edges);
    }, [edges])

    // coloring the nodes of the graph
    const colorNode = (nodes, nodeId, color) => {
        return nodes.map(node => {
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
        return edges.map(edge => {
            if (edge.id === sourceEdge + "_" + destinationEdge) {
                return {
                    ...edge,
                    animated: animated,
                    label: distance_curr[currentNode].toString() + " + " + edge.label + " < " + distance[currentNode][checkNode[currentNode][index]].toString(),
                };
            } else {
                return edge;
            }
        });
    };


    // node visualisation starts
    const visualise = () => {

        // fetching data from output.txt
        fetch(`${host}/read-file`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
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
                console.error('Error:', error);
            });

        console.log(currentNode, index);

        if (checkNode.length > 0 && checkNode[currentNode].length === 0 && currentNode >= checkNode.length - 1) {

            // setting all things to default at the end
            setNodes(colorNode(nodes, curr_node[currentNode], 'white'));
            setEdges(
                colorEdge(
                    edges,
                    '-1',
                    '-1',
                    distance_curr,
                    distance,
                    false,
                )
            );
            setIsProcessing(false);
            return;
        }

        setTimeout(() => {

            // changing the color to red and blue
            const updatedNodes = colorNode(nodes, curr_node[currentNode], 'red');
            setNodes(colorNode(updatedNodes, checkNode[currentNode][index], 'blue'));

            // changing edge to animated and adding labels
            if (checkNode[currentNode][index] != undefined) {
                setEdges(
                    colorEdge(
                        edges,
                        curr_node[currentNode].toString(),
                        checkNode[currentNode][index].toString(),
                        distance_curr,
                        distance,
                        true,
                    )
                );
            }
            else {
                // to set it to default
                setEdges(
                    colorEdge(
                        edges,
                        '-1',
                        '-1',
                        distance_curr,
                        distance,
                        true,
                    )
                );
            }

            setTimeout(() => {

                // setting color to green and black
                if (result[currentNode][index] === 1) {
                    const updatedNodes = colorNode(nodes, curr_node[currentNode], 'green');
                    setNodes(colorNode(updatedNodes, checkNode[currentNode][index], 'green'));
                }
                else if (result[currentNode][index] === 0) {
                    const updatedNodes = colorNode(nodes, curr_node[currentNode], 'black');
                    setNodes(colorNode(updatedNodes, checkNode[currentNode][index], 'black'));
                }

                if (checkNode[currentNode].length == 0 || index == checkNode[currentNode].length - 1) {
                    index = 0;
                    currentNode++;
                } else {
                    index++;
                }

                currentEdge++;

            }, 2000);

            visualise();

        }, 5000);

    };

    // runs everytime we connect two nodes
    const onConnect = useCallback(
        (params) => {
            const redEdge = {
                ...params,
                id: `${connectingNodeId.current}_${params.target}`,
                style: { stroke: 'red', strokeWidth: 1 },
                type: "straight",
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 30,
                    height: 20,
                    color: 'green',
                },
            };
            setEdges((els) => addEdge(redEdge, els));
            console.log(edges);
        },
        []
    );

    // it runs when we start the connection of edge from source node
    const onConnectStart = useCallback((_, { nodeId }) => {
        connectingNodeId.current = nodeId;
    }, []);

    // it runs when new node is created by dragging and dropping
    const onConnectEnd = useCallback(
        (event) => {
            const targetIsPane = event.target.classList.contains('react-flow__pane');

            if (targetIsPane) {
                const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
                const id = getId();
                const newNode = {
                    id,
                    position: project({ x: event.clientX - left - 75, y: event.clientY - top }),
                    style: { height: "50px", width: "50px", borderRadius: "100px" },
                    data: { label: `${id}` },
                    targetPosition: 'left',
                    sourcePosition: 'left',
                };

                setNodes((nds) => nds.concat(newNode));
                setEdges((eds) => eds.concat({
                    id: `${connectingNodeId.current}_${id}`, source: connectingNodeId.current, type: "straight", target: id,
                    style: { stroke: "red", strokeWidth: 1 },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        width: 30,
                        height: 20,
                        color: 'green',
                    },
                }));
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

                    const remainingEdges = acc.filter((edge) => !connectedEdges.includes(edge));

                    const createdEdges = incomers.flatMap(({ id: source }) =>
                        outgoers.map(({ id: target }) => ({ id: `${source}->${target}`, source, target }))
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
    const [node1, setnode1] = useState('0');
    const [node2, setnode2] = useState('0');

    const handleSelectChange1 = (event) => {
        setnode1(event.target.value);
    };

    const handleSelectChange2 = (event) => {
        setnode2(event.target.value);
    };

    const [val, setval] = useState('');

    const handleValChange = (event) => {
        setval(event.target.value);
    };

    // changing the weights of each node
    const changeWeights = (node1, node2, val) => {
        const updatedEdges = [];

        const check = node1 + '_' + node2;

        edges.forEach(edge => {
            if (edge.id === check) {

                updatedEdges.push({
                    ...edge,
                    label: val.toString()
                });
            }
            else {
                updatedEdges.push({
                    ...edge,
                });
            }
        });

        setEdges(updatedEdges);
    }

    // writing data to file
    const writeFile = () => {
        const data = {
            nodes: nodes,
            edges: edges,
        };
        console.log("this is data\n", data);
        fetch(`${host}/write-file`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(() => {
                console.log(`${host}/write-file`, "pinged");
            })
            performAlgo();
    }
    
    // Object to map the correct algo ID for back end
    const algoMap = {
        'Dijkstra': 0,
        'Bellman Ford': 1,
        'SPFA': 2,
        'Floyd Warshall': 3,
        "Johnson's Algorithm": 4,
        "Yen's K shortest Paths": 5
        };

    // Drop down menu logic
    const selectAlgo = (event) => {
        const selectedValue = event.target.value;
        setAlgoID(selectedValue);
        console.log("This is val:", selectedValue, algoMap[algoID]);
    };

    // Algo POST call. Uses algoID use state variable to call the correct algorithm in backend
    const performAlgo = () => {
        console.log(algoID);
        if (algoID === '') {
            return;
        }
        console.log(algoMap[algoID]);
        fetch(`${host}/perform-algo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ algoID: algoMap[algoID] }),
        })
            .then(() => {
                console.log(`${host}/perform-dijktra`, "pinged");
            })
    }
    
    // for flipping the node
    const flipNode = () => {
        const updatedNodes = [];
        nodes.forEach(node => {
            if (node.id === selectedNode[0]) {
                if (node.targetPosition === 'right') {
                    updatedNodes.push({
                        ...node,
                        targetPosition: 'left',
                        sourcePosition: 'left',

                    });
                }
                else {
                    updatedNodes.push({
                        ...node,
                        targetPosition: 'right',
                        sourcePosition: 'right',

                    });
                }
            }
            else {
                updatedNodes.push({
                    ...node,
                });
            }
        });

        setNodes(updatedNodes);

    }

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
        console.log(sectionToScroll);

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
            <div className='flex justify-center items-center'>
                <section class="grid grid-cols-1 gap-x-8 gap-y-6 pb-20 xl:grid-cols-4"><h2 class="text-3xl font-bold tracking-tight text-slate-900">Start Looking into it!</h2><div class="col-span-3"><div class="max-w-[54rem] text-lg leading-8 text-slate-600"><p>Welcome to our playground! You could look into your graph learning from visualizing them below using the variable features there is to offer.</p><p class="mt-6">We provide a platform for researchers to experiment, validate, and gain insights into the performance of various shortest path algorithms, fostering algorithmic innovation.</p></div></div></section>
            </div>
            <div id="graph" className='flex flex-row justify-center items-center gap-3'>
                <div className="wrapper w-[70%] h-[80vh] ring-2 ring-zinc-200 ring-offset-2 rounded-sm"
                    // style={{ 
                    //     width: "80%", 
                    //     height: "100vh", 
                    //     // borderColor: "black", 
                    //     // borderWidth: "3px" 
                    // }} 
                    ref={reactFlowWrapper}>
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
                <div className='w-[20%] h-[80vh] flex flex-col justify-start gap-4 mt-[35px]'>
                    <button onClick={startProcess} class="relative px-5 py-3 overflow-hidden font-medium text-gray-600 bg-gray-100 border border-gray-100 rounded-lg shadow-inner group">
                        <span class="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-gray-600 group-hover:w-full ease"></span>
                        <span class="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-gray-600 group-hover:w-full ease"></span>
                        <span class="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
                        <span class="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
                        <span class="absolute inset-0 w-full h-full duration-300 delay-300 bg-gray-900 opacity-0 group-hover:opacity-100"></span>
                        <span class="relative transition-colors duration-300 delay-200 group-hover:text-white ease font-bold">Visualize</span>
                    </button>
                    <button onClick={() => writeFile()} class="relative px-5 py-3 overflow-hidden font-medium text-gray-600 bg-gray-100 border border-gray-100 rounded-lg shadow-inner group">
                        <span class="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-gray-600 group-hover:w-full ease"></span>
                        <span class="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-gray-600 group-hover:w-full ease"></span>
                        <span class="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
                        <span class="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
                        <span class="absolute inset-0 w-full h-full duration-300 delay-300 bg-gray-900 opacity-0 group-hover:opacity-100"></span>
                        <span class="relative transition-colors duration-300 delay-200 group-hover:text-white ease font-bold">Save</span>
                    </button>
                    <button onClick={flipNode} class="relative px-5 py-3 overflow-hidden font-medium text-gray-600 bg-gray-100 border border-gray-100 rounded-lg shadow-inner group">
                        <span class="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-gray-600 group-hover:w-full ease"></span>
                        <span class="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-gray-600 group-hover:w-full ease"></span>
                        <span class="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
                        <span class="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
                        <span class="absolute inset-0 w-full h-full duration-300 delay-300 bg-gray-900 opacity-0 group-hover:opacity-100"></span>
                        <span class="relative transition-colors duration-300 delay-200 group-hover:text-white ease font-bold">Flip Node</span>
                    </button>
                    {/* <button onClick={performDijktra} class="relative px-5 py-3 overflow-hidden font-medium text-gray-600 bg-gray-100 border border-gray-100 rounded-lg shadow-inner group">
                        <span class="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-gray-600 group-hover:w-full ease"></span>
                        <span class="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-gray-600 group-hover:w-full ease"></span>
                        <span class="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
                        <span class="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
                        <span class="absolute inset-0 w-full h-full duration-300 delay-300 bg-gray-900 opacity-0 group-hover:opacity-100"></span>
                        <span class="relative transition-colors duration-300 delay-200 group-hover:text-white ease font-bold">Perform Dijktra</span>
                    </button> */}
                    <label htmlFor="dropdown">Select an Algorithm:</label>
                    <select id="dropdown" onChange={selectAlgo} value={algoID || ''}>
                        <option value="" disabled>Select an option</option>
                        <option value="Dijkstra">Dijkstra</option>
                        <option value="Bellman Ford">Bellman Ford</option>
                        <option value="SPFA">SPFA</option>
                        <option value="Floyd Warshall">Floyd Warshall</option>
                        <option value="Johnson's Algorithm">Johnson's Algorithm</option>
                        <option value="Yen's K shortest Paths">Yen's K shortest Paths</option>
                    </select>


                    <div className='gap-3 flex w-full justify-evenly'>
                        <div>
                            <label htmlFor="select1" className=" text-gray-700 text-sm font-bold "> From: </label>
                            <select id="select1" className='inline-flex w-[100px] justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50' value={node1} onChange={handleSelectChange1}>
                                {options}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="select1" className=" text-gray-700 text-sm font-bold "> To: </label>
                            <select id="select1" className='inline-flex w-[100px] justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50' value={node2} onChange={handleSelectChange2}>
                                {options}
                            </select>
                        </div>
                    </div>

                    <div >
                        <label className=" text-gray-700 text-sm font-bold ">
                            Enter Weight
                        </label>
                        <input
                            value={val}
                            onChange={handleValChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="val"
                            type="text" />
                    </div>

                    <button onClick={() => changeWeights(node1, node2, val)} class="relative px-5 py-3 overflow-hidden font-medium text-gray-600 bg-gray-100 border border-gray-100 rounded-lg shadow-inner group">
                        <span class="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-gray-600 group-hover:w-full ease"></span>
                        <span class="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-gray-600 group-hover:w-full ease"></span>
                        <span class="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
                        <span class="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
                        <span class="absolute inset-0 w-full h-full duration-300 delay-300 bg-gray-900 opacity-0 group-hover:opacity-100"></span>
                        <span class="relative transition-colors duration-300 delay-200 group-hover:text-white ease font-bold">Change</span>
                    </button>

                </div>
            </div>
        </>
    );
};

const Home = () => {
    let navigate = useNavigate();
    useEffect(()=>{
        if(localStorage.getItem('token')){
          
        }else{
          navigate('/login');
        }
        // eslint-disable-next-line
      },[]);
      const context = useContext(userContext);
      const { getuserinfo } = context;

      useEffect(() => {
        getuserinfo();
      }, []);
  return (
    <>
        <div>
            <img src={imager} alt="" class="absolute left-0 top-0 z-[-1] w-full max-w-none opacity-[90%]" />

            <div className='z-10'>
                <Navbar />
                <HeroSection />
            </div>
        </div>
        <ReactFlowProvider>
            <AddNodeOnEdgeDrop />
        </ReactFlowProvider>

        <div className='w-full h-[20vh]'></div>
        <History/>
        <AboutUs />
        <TechStack />
        <Footer />
        <UserSection/>
    </>
  )
}

export default Home;
