import { useState, useCallback } from "react";
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { TriggerSheet } from "./TriggerSheet";

export type NodeKind =
  | "price-trigger"
  | "timer-trigger"
  | "hyperliquid"
  | "backpack"
  | "lighter";

interface NodeType {
  data: {
    type: "action" | "trigger";
    kind: NodeKind;
  };
  id: string;
  position: { x: number; y: number };
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

export function CreateWorkflow() {
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>

      {!nodes.length && (
        <TriggerSheet
          onSelect={(kind, metadata) =>
            setNodes([
              ...nodes,
              {
                id: Math.random().toString(),
                position: { x: 0, y: 0 },
                data: { type: "trigger", kind },
              },
            ])
          }
        />
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />

    </div>
  );
}