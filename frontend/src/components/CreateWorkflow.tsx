import { useState, useCallback } from "react";
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { TriggerSheet } from './TriggerSheet';
import { PriceTrigger } from '@/nodes/triggers/PriceTrigger';
import type { PriceTriggerMetadata } from '@/nodes/triggers/PriceTrigger';
import { Timer } from '@/nodes/triggers/Timer';
import type { TimerNodeMetadata as Metadata, TimerNodeMetadata } from '@/nodes/triggers/Timer';
import type { TradingMetadata } from '@/nodes/actions/Lighter';

const nodeTypes = {
  "price-trigger": PriceTrigger,
  "timer-trigger": Timer
};

export type NodeKind = "price-trigger" | "timer" | "hyperliquid" | "backpack" | "lighter";

interface NodeType {
  type: NodeKind,
  data: {
    kind: "action" | "trigger",
    metadata: NodeMetadata,
  },
  id: string,
  position: { x: number, y: number },
}

export type NodeMetadata = TradingMetadata | PriceTriggerMetadata | TimerNodeMetadata;
interface Edge {
  id: string,
  source: string,
  target: string,
}


export function CreateWorkflow() {
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectAction, setSelectAction] = useState<{
    position: {
      x: number;
      y: number;
    };
  } | null>(null);
  const onNodesChange = useCallback(
    (changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );

  const onConnect = useCallback(
    (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );
  const onConnectEnd = useCallback(
    (params: any, connectionInfo: any) => {
      if (!connectionInfo.isValid) {
        console.log(connectionInfo.fromNode.id);
        console.log(connectionInfo.fromNode.to);
      }
    },
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
        onConnectEnd={onConnectEnd}
        fitView
      />

    </div>
  );
}