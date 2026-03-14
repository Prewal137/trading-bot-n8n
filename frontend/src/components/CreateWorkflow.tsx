import { useState, useCallback } from "react";
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { TriggerSheet } from './TriggerSheet';
import { PriceTrigger } from '@/nodes/triggers/PriceTrigger';
import { Timer } from '@/nodes/triggers/Timer';

const nodeTypes = {
  "price-trigger": PriceTrigger,
  "timer-trigger": Timer
};

export type NodeMetadata = any;
export type NodeKind = "price-trigger" | "timer-trigger" | "hyperliquid" | "backpack" | "lighter";
interface NodeType {
  type?: NodeKind;
  data: {
    type: NodeKind,
    kind: "action" | "trigger",
    metadata: NodeMetadata,
  },
  id: string,
  position: { x: number, y: number },
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
    (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>

      {nodes.length < 6 && (
        <TriggerSheet
          onSelect={(type, metadata) => {

            setNodes((nodes) => [
              ...nodes,
              {
                id: Math.random().toString(),
                type: type,
                data: {
                  kind: "trigger",
                  type,
                  metadata,
                  
                },
                position: { x: 250, y: 200 },
              },
            ])

          }}
        />
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />

    </div>
  );
}