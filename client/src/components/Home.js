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

import React, { useCallback, useRef, useEffect, useState } from 'react';
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

import Navbar from './Navbar';
import HeroSection from './HeroSection';
import AboutUs from './aboutUs';
import Footer from './Footer';
import TechStack from './techStack';
import { useLocation, useNavigate } from 'react-router-dom';

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
    // const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);



    var checkNode = [];
    var result = [];
    var distance = [];
    var distance_curr = [];
    var curr_node = [];

    const [isProcessing, setIsProcessing] = useState(false);

    const startProcess = () => {
        currentNode = 0;
        currentEdge = 1;
        index = 0;
        setIsProcessing(true);
        visualise();
    };

    useEffect(() => {
        console.log(edges);


    }, [edges])


    // data visualisation

    const visualise = () => {

        fetch(`${host}/read-file`) 
            .then(() => {
                console.log(`${host}/read-file`, "pinged");
            }) 
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); 
            })
            .then((data) => {
                console.log('Received data:', data.distance_curr);
                result = data.result;
                checkNode = data.checkNode;
                distance = data.distance;
                distance_curr = data.distance_curr;
                curr_node = data.curr_node;
            
            })
            .catch((error) => {
                console.error('Error:', error);
            });

            

        if (checkNode.length > 0 && checkNode[currentNode].length === 0) {
            setIsProcessing(false);
            return;
        }

        const updatedNodes = [];

        setTimeout(() => {

            nodes.forEach(node => {
                if (parseInt(node.id) === curr_node[currentNode]) {
                    updatedNodes.push({
                        ...node,
                        style: {
                            ...node.style,
                            backgroundColor: 'red',
                        }
                    });
                }
                else if (checkNode[currentNode][index] === parseInt(node.id)) {
                    updatedNodes.push({
                        ...node,
                        style: {
                            ...node.style,
                            backgroundColor: 'blue',
                        }
                    });
                }
                else {
                    updatedNodes.push({
                        ...node,
                        style: {
                            ...node.style,
                            backgroundColor: 'white',
                        }
                    });
                }
            });

            setNodes(updatedNodes);

            const updatedEdges = [];

            edges.forEach(edge => {

                const weight = edge.label;
                // console.log(edge.id, " ", currentNode.toString() + '_' + checkNode[currentNode][index].toString());
                if (checkNode[currentNode][index] != undefined && edge.id === curr_node[currentNode].toString() + '_' + checkNode[currentNode][index].toString()) {

                    updatedEdges.push({
                        ...edge,
                        animated: true,
                        label: distance_curr[currentNode].toString() + " + " + weight + " < " + distance[currentNode][checkNode[currentNode][index]].toString()
                    });
                }
                else {
                    updatedEdges.push({
                        ...edge,
                        animated: false,
                    });
                }
            });

            setEdges(updatedEdges);

            setTimeout(() => {

                const updatedNodes = [];
                nodes.forEach(node => {
                    if ((parseInt(node.id) === curr_node[currentNode] || parseInt(node.id) === checkNode[currentNode][index]) && result[currentNode][index] === 1) {
                        updatedNodes.push({
                            ...node,
                            style: {
                                ...node.style,
                                backgroundColor: 'green',
                            }
                        });
                    }
                    else if ((parseInt(node.id) === curr_node[currentNode] || checkNode[currentNode][index] === parseInt(node.id)) && result[currentNode][index] === 0) {
                        updatedNodes.push({
                            ...node,
                            style: {
                                ...node.style,
                                backgroundColor: 'black',
                            }
                        });
                    }
                    else {
                        updatedNodes.push({
                            ...node,
                            style: {
                                ...node.style,
                                backgroundColor: 'white',
                            }
                        });
                    }
                });
                setNodes(updatedNodes);

                if (index == checkNode[currentNode].length - 1) {
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

    const onConnectStart = useCallback((_, { nodeId }) => {
        connectingNodeId.current = nodeId;
    }, []);

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

    const options = Array.from({ length: nodes.length }, (_, index) => (
        <option key={index} value={index}>
            {index}
        </option>
    ));

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
    }

    const performDijktra = () => {

        fetch(`${host}/perform-dijktra`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(() => {
            console.log(`${host}/perform-dijktra`, "pinged");
        })
    }

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

    // for flipping 
    const [selectedNode, setSelectedNode] = useState([]);

    useOnSelectionChange({
        onChange: ({ nodes, edges }) => {
            setSelectedNode(nodes.map((node) => node.id));
        },
    });
    const location = useLocation();

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
                    <button onClick={flipNode}  class="relative px-5 py-3 overflow-hidden font-medium text-gray-600 bg-gray-100 border border-gray-100 rounded-lg shadow-inner group">
                        <span class="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-gray-600 group-hover:w-full ease"></span>
                        <span class="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-gray-600 group-hover:w-full ease"></span>
                        <span class="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
                        <span class="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
                        <span class="absolute inset-0 w-full h-full duration-300 delay-300 bg-gray-900 opacity-0 group-hover:opacity-100"></span>
                        <span class="relative transition-colors duration-300 delay-200 group-hover:text-white ease font-bold">Flip Node</span>
                    </button>
                    <button onClick={performDijktra}  class="relative px-5 py-3 overflow-hidden font-medium text-gray-600 bg-gray-100 border border-gray-100 rounded-lg shadow-inner group">
                        <span class="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-gray-600 group-hover:w-full ease"></span>
                        <span class="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-gray-600 group-hover:w-full ease"></span>
                        <span class="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
                        <span class="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
                        <span class="absolute inset-0 w-full h-full duration-300 delay-300 bg-gray-900 opacity-0 group-hover:opacity-100"></span>
                        <span class="relative transition-colors duration-300 delay-200 group-hover:text-white ease font-bold">Perform Dijktra</span>
                    </button>

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
  return (
    <>
    <div>
    <img src={imager} alt="" class="absolute left-0 top-0 z-[-1] w-full max-w-none opacity-[90%]"/>
  
    <div className='z-10'>
    <Navbar/>
    <HeroSection/>
    </div>
    </div>
   
    <ReactFlowProvider>
        <AddNodeOnEdgeDrop />
    </ReactFlowProvider>

    <div className='w-full h-[20vh]'></div>
    <AboutUs/>
    <TechStack/>
    <Footer/>  
    </>
  )
}

export default Home;
