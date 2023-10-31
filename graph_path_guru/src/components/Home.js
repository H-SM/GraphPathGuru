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
    useOnSelectionChange
} from 'reactflow';

import 'reactflow/dist/style.css';


const initialNodes = [
    {
        id: '0',
        data: { label: 'Node 0 -> ok' },
        position: { x: 0, y: 50 },
        style: { height: "50px", width: "80px" },
        targetPosition: 'right',
        sourcePosition: 'right',
    },
];

let id = 1;
const getId = () => `${id++}`;

const fitViewOptions = {
    padding: 3,
};



const AddNodeOnEdgeDrop = () => {

    const reactFlowWrapper = useRef(null);
    const connectingNodeId = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { project } = useReactFlow();
    // const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

    const checkNode = [
        [1], [2, 3], [], [],
    ];

    const result = [[1], [1, 0], [], []];



    const [currentNode, setCurrentNode] = useState(0);
    const [currentEdge, setCurrentEdge] = useState(1);
    const [index, setIndex] = useState(0);

    useEffect(() => {

        const updatedNodes = [];

        const timer= setTimeout(() => {

            nodes.forEach(node => {
                if (parseInt(node.id) === currentNode) {
                    console.log("hel");
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
                if (parseInt(edge.id) == currentEdge) {

                    updatedEdges.push({
                        ...edge,
                        animated: true
                    });
                }
                else {
                    updatedEdges.push({
                        ...edge,
                        animated: false
                    });
                }
            });

            setEdges(updatedEdges);

            setTimeout(() => {

                const updatedNodes = [];
                nodes.forEach(node => {
                    if ((parseInt(node.id) === currentNode || parseInt(node.id) === checkNode[currentNode][index])&& result[currentNode][index] === 1) {
                        updatedNodes.push({
                            ...node,
                            style: {
                                ...node.style,
                                backgroundColor: 'green',
                            }
                        });
                    }
                    else if((parseInt(node.id) === currentNode || checkNode[currentNode][index] === parseInt(node.id)) && result[currentNode][index] === 0){
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
                    setIndex(0);
                    setCurrentNode(prevTargetId => prevTargetId + 1);
                } else {
                    setIndex(prevIndex => prevIndex + 1)
                }

                setCurrentEdge(prevTargetId => prevTargetId + 1);

                console.log(currentNode);
            }, 2000);


        }, 5000);


        return () => clearTimeout(timer);

    }, [nodes]);


    const onConnect = useCallback(
        (params) => {
            const redEdge = {
                ...params,
                style: { stroke: 'red', strokeWidth: 1 },
            };
            setEdges((els) => addEdge(redEdge, els));
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
                    data: { label: `Node ${id}` },
                    targetPosition: 'left',
                    sourcePosition: 'left',
                };

                setNodes((nds) => nds.concat(newNode));
                setEdges((eds) => eds.concat({ id, source: connectingNodeId.current, target: id, style: { stroke: "red", strokeWidth: 1 } }));
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

    return (
        <div className="wrapper " style={{ width: "100%", height: "100vh", borderColor: "black", borderWidth: "3px" }} ref={reactFlowWrapper}>
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
            />
        </div>
    );
};

export default () => (
    <ReactFlowProvider>
        <AddNodeOnEdgeDrop />
    </ReactFlowProvider>
);
