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

const nodeTypes = {
  taskNode: TaskNode,
};

const initialNodes = [
  {
    id: "1",
    type: "taskNode",
    position: { x: 100, y: 100 },
    data: { label: "Start Task" },
    style: { width: 150, height: 75 },
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
      if (event.key === "Delete") {
        setNodes((nds) => nds.filter((node) => !node.selected));
        setEdges((eds) => eds.filter((edge) => !edge.selected));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setNodes, setEdges]);

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
      style: { width: 150, height: 75 },
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeId((id) => id + 1);
  };

  const saveFlow = () => {
    const flow = { nodes, edges };
    localStorage.setItem("taskFlow", JSON.stringify(flow));
    alert("Flow saved!");
  };

  const loadFlow = () => {
    const flow = JSON.parse(localStorage.getItem("taskFlow"));
    if (flow) {
      setNodes(flow.nodes);
      setEdges(flow.edges);
      setNodeId(flow.nodes.length + 1);
    } else {
      alert("No saved flow found!");
    }
  };

  const enhancedNodes = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onChange: handleNodeChange,
    },
  }));

  return (
    <div className="w-screen h-screen relative">
      <div className="absolute z-10 top-4 left-4 flex flex-wrap gap-3 bg-white p-3 rounded-md shadow-lg">
        <button onClick={addTaskNode} className="btn">
          ➕ Add Task Node
        </button>
        <button onClick={saveFlow} className="btn">
          💾 Save
        </button>
        <button onClick={loadFlow} className="btn">
          📂 Load
        </button>
        <button onClick={() => setBackgroundType("dots")} className="btn">
          🔵 Dots
        </button>
        <button onClick={() => setBackgroundType("lines")} className="btn">
          📏 Lines
        </button>
        <button onClick={() => setBackgroundType("cross")} className="btn">
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
        nodesDraggable
        nodesConnectable
      >
        <Controls />
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

const btnClass =
  "px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded transition";
document.querySelectorAll(".btn")?.forEach((btn) => btn.classList.add(...btnClass.split(" ")));

export default App;
