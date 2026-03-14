import { useState, useCallback } from "react";
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { TriggerSheet } from './TriggerSheet';
import { ActionSheet } from './ActionSheet';
import { PriceTrigger } from '@/nodes/triggers/PriceTrigger';
import type { PriceTriggerMetadata } from '@/nodes/triggers/PriceTrigger';
import { Timer } from '@/nodes/triggers/Timer';
import type { TimerNodeMetadata as Metadata, TimerNodeMetadata } from '@/nodes/triggers/Timer';
import { Lighter, type TradingMetadata } from '@/nodes/actions/Lighter';

const nodeTypes = {
  "price-trigger": PriceTrigger,
  "timer-trigger": Timer,
  "Lighter": Lighter
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
    startingNodeId: string,
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
        setSelectAction({
          startingNodeId: connectionInfo.fromNode?.id,
          position: connectionInfo.fromNode?.position ? { 
            x: connectionInfo.fromNode.position.x + 250, 
            y: connectionInfo.fromNode.position.y 
          } : { x: 250, y: 250 }
        });
        console.log("Connect End from:", connectionInfo.fromNode?.id);
      }
    },
    []
  );
  return (
    <div style={{ width: "100vw", height: "100vh" }}>

      {!nodes.length && <TriggerSheet onSelect={(type, metadata) => {
        setNodes((nds) => [...nds, {
          id: Math.random().toString(),
          type,
          data: {
            kind: "trigger",
            metadata,
          },
          position: {x: 0, y: 0},
        }])
      }} />}
      {selectAction && <ActionSheet onSelect={(type, metadata) => {
        const nodeId =Math.random().toString()
        setNodes((nds) => [...nds, {
          id:nodeId,
          type,
          data: {
            kind: "action",
            metadata,
          },
          position: selectAction.position || { x: 250, y: 250 }
        }]);
        setEdges((eds) => [...eds, {
          id: `${selectAction.startingNodeId}-${nodeId}`,
          source: selectAction.startingNodeId,
          target: nodeId,
        }]);
        setSelectAction(null);
      }} />}

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