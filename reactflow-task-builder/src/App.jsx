import React, { useCallback, useState, useEffect } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Background,
  getConnectedEdges,
  Controls,
} from "reactflow";
import "reactflow/dist/style.css";
import TaskNode from "./TaskNode";

// Move nodeTypes outside of the component
const nodeTypes = {
  taskNode: TaskNode,
};

const initialNodes = [
  {
    id: "1",
    type: "taskNode",
    position: { x: 100, y: 100 },
    data: { label: "Start Task" },
    style: { width: 150, height: 75 }, // Initial size of the node
  },
];

const initialEdges = [];

function App() {
  const [nodeId, setNodeId] = useState(2);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [backgroundType, setBackgroundType] = useState("dots");

  const onConnect = useCallback(
    (params) => {
      if (params.source === params.target) {
        alert("Self-looping is not allowed.");
        return;
      }
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Delete') {
        setNodes((nds) => nds.filter((node) => !node.selected));
        setEdges((eds) => eds.filter((edge) => !edge.selected));
      }
    };
  
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setNodes, setEdges]);

  // Update node label
  const handleNodeChange = useCallback(
    (id, key, value) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  [key]: value,
                  onChange: handleNodeChange,
                },
              }
            : node
        )
      );
    },
    [setNodes]
  );

  const addTaskNode = () => {
    const newNode = {
      id: `${nodeId}`,
      position: {
        x: Math.random() * 250,
        y: Math.random() * 250,
      },
      data: {
        label: `Task ${nodeId}`,
        status: "To Do",
        onChange: handleNodeChange,
      },
      type: "taskNode",
      style: { width: 150, height: 75 }, // Initial size of new nodes
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeId((id) => id + 1);
  };

  const saveFlow = () => {
    const flow = {
      nodes,
      edges,
    };
    localStorage.setItem("taskFlow", JSON.stringify(flow));
    alert("Flow saved!");
  };

  const loadFlow = () => {
    const flow = JSON.parse(localStorage.getItem("taskFlow"));
    if (flow) {
      setNodes(flow.nodes);
      setEdges(flow.edges);
      setNodeId(flow.nodes.length + 1); // ensure unique IDs
    } else {
      alert("No saved flow found!");
    }
  };

  // Ensure existing nodes also get the onChange handler
  const enhancedNodes = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onChange: handleNodeChange,
    },
  }));

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          top: 10,
          left: 10,
          display: "flex",
          gap: 10,
        }}
      >
        <button onClick={addTaskNode} style={buttonStyle}>
          ➕ Add Task Node
        </button>
        <button onClick={saveFlow} style={buttonStyle}>
          💾 Save
        </button>
        <button onClick={loadFlow} style={buttonStyle}>
          📂 Load
        </button>
        <button onClick={() => setBackgroundType("dots")} style={buttonStyle}>
          🔵 Dots
        </button>
        <button onClick={() => setBackgroundType("lines")} style={buttonStyle}>
          📏 Lines
        </button>
        <button onClick={() => setBackgroundType("cross")} style={buttonStyle}>
          ✴️ Stars
        </button>
      </div>

      <ReactFlow
        nodes={enhancedNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={true} // Enable node dragging
        nodesConnectable={true} // Allow nodes to be connected
        
      >
        <Controls />
        {/* MiniMap and Background Grid components */}
        <MiniMap
          nodeColor={(node) => (node.type === "taskNode" ? "blue" : "#FFCC00")}
          zoomable={false}
        />
        {backgroundType === "dots" && (
          <Background variant="dots" gap={16} color="#aaa" />
        )}
        {backgroundType === "lines" && (
          <Background variant="lines" gap={16} color="#aaa" />
        )}
        {backgroundType === "cross" && (
          <Background variant="cross" gap={16} color="#aaa" />
        )}
      </ReactFlow>
    </div>
  );
}

const buttonStyle = {
  padding: "8px 12px",
  background: "#3498db",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
};

export default App;
