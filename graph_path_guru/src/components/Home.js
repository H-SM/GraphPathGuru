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
import imager from '../assests/beams-pricing.png';

import Navbar from './Navbar';
import HeroSection from './HeroSection';

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

        fetch('http://localhost:8000/read-file') 
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); 
            })
            .then((data) => {
                console.log('Received data:', data.result);
                result = data.result;
                checkNode = data.checkNode;
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
                if (parseInt(node.id) === currentNode) {
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

                if (checkNode[currentNode][index] && edge.id === currentNode.toString() + '_' + checkNode[currentNode][index].toString()) {

                    updatedEdges.push({
                        ...edge,
                        animated: true,
                        label: "dist[red] + weight[node] < dist[blue]"
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
                    if ((parseInt(node.id) === currentNode || parseInt(node.id) === checkNode[currentNode][index]) && result[currentNode][index] === 1) {
                        updatedNodes.push({
                            ...node,
                            style: {
                                ...node.style,
                                backgroundColor: 'green',
                            }
                        });
                    }
                    else if ((parseInt(node.id) === currentNode || checkNode[currentNode][index] === parseInt(node.id)) && result[currentNode][index] === 0) {
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

        fetch('http://localhost:8000/write-file', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
    }

    const performDijktra = () => {

        fetch('http://localhost:8000/perform-dijktra', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }

    const flipNode = () => {
        const updatedNodes = [];

        nodes.forEach(node => {
            if (node.id === selectedNode[0]) {
                updatedNodes.push({
                    ...node,
                    targetPosition: 'right',
                    sourcePosition: 'right',

                });
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

    return (
        <>
        <div className='flex justify-center items-center'>
        <section class="grid grid-cols-1 gap-x-8 gap-y-6 pb-20 xl:grid-cols-4"><h2 class="text-3xl font-bold tracking-tight text-slate-900">Start Looking into it!</h2><div class="col-span-3"><div class="max-w-[54rem] text-lg leading-8 text-slate-600"><p>Welcome to our playground! You could look into your graph learning from visualizing them below using the variable features there is to offer.</p><p class="mt-6">We provide a platform for researchers to experiment, validate, and gain insights into the performance of various shortest path algorithms, fostering algorithmic innovation.</p></div></div></section>
        </div>
        <div className='flex justify-center items-center'>
            <div className="wrapper w-[80%] h-[90vh] ring-2 ring-zinc-200 ring-offset-2" 
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
            
                <button onClick={startProcess} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-1 rounded">
                    Visualise
                </button>

                <div className='m-4 p-4 gap-5 flex flex-col'>
                    <div>
                        <label htmlFor="select1"> From: </label>
                        <select id="select1" value={node1} onChange={handleSelectChange1}>
                            {options}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="select2">To : </label>
                        <select id="select2" value={node2} onChange={handleSelectChange2}>
                            {options}
                        </select>
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

                    <button onClick={() => changeWeights(node1, node2, val)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Change
                    </button>

                    <button onClick={() => writeFile()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Save
                    </button>

                    <button onClick={flipNode} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Flip node
                    </button>

                    <button onClick={performDijktra} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Perform Dijktra
                    </button>


                </div>
                </div>
            </div>



        </>
    );
};

export default () => (
    <>
    <div>
    <img src={imager} alt="" class="absolute left-0 top-0 z-[-1] w-full max-w-none "/>
    <div className='z-10'>
    <Navbar/>
    <HeroSection/>
    </div>
    </div>
   
    <ReactFlowProvider>
        <AddNodeOnEdgeDrop />
    </ReactFlowProvider>

    </>
);
