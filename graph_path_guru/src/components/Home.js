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
        style: { height: "50px", width: "80px" }
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
    const [targetId, setTargetId] = useState(0);
    // useEffect to handle node color changes after 10 seconds
    useEffect(() => {

        const updatedNodes = [];

        const timer = setTimeout(() => {

            // Use map to update matching nodes and accumulate all nodes
            nodes.forEach(node => {
                if (node.id === targetId.toString()) {
                    // If the ID matches, update the style as needed
                    console.log("hel");
                    updatedNodes.push({
                        ...node,
                        style: {
                            ...node.style,
                            // Add or modify style properties here
                            backgroundColor: 'red', // For example, change the background color to red
                        }
                    });
                } else {
                    console.log("hel1");
                    // If the ID doesn't match, add the original object unchanged
                    updatedNodes.push({
                        ...node,
                        style: {
                            ...node.style,
                            // Add or modify style properties here
                            backgroundColor: 'white', // For example, change the background color to red
                        }
                    });
                }
            });

            setNodes(updatedNodes);
            setTargetId(prevTargetId => prevTargetId + 1);
            console.log(targetId);

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
                    // targetPosition: 'top',
                    // sourcePosition: 'bottom',
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
        <div className="wrapper " style={{ width: "100vw", height: "100vh" }} ref={reactFlowWrapper}>
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
