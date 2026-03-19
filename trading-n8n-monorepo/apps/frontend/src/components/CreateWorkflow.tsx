import { useState, useCallback } from "react";
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useNavigate } from "react-router-dom";
import { TriggerSheet } from './TriggerSheet';
import { ActionSheet } from './ActionSheet';
import { Button } from "@/components/ui/button";
import { PriceTrigger } from '@/nodes/triggers/PriceTrigger';
import { Timer } from '@/nodes/triggers/Timer';
import { type TimerNodeMetadata, type TradingMetadata, type PriceTriggerMetadata } from "@repo/common"
import { Lighter } from '@/nodes/actions/Lighter';
import { Backpack } from '@/nodes/actions/Backpack';
import { Hyperliquid } from '@/nodes/actions/Hyperliquid';
import { apiCreateWorkflow } from "@/lib/api";
import { Save } from "lucide-react";

const nodeTypes = {
  "price-trigger": PriceTrigger,
  "timer": Timer,
  "lighter": Lighter,
  "backpack": Backpack,
  "hyperliquid": Hyperliquid
};


export type NodeKind = "price-trigger" | "timer" | "hyperliquid" | "backpack" | "lighter";

interface NodeType {
  type: NodeKind,
  data: {
    kind: "action" | "trigger",
    metadata: NodeMetadata,
  },
  id: string,
  credentials?: any; // Added credentials
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (nodes.length === 0) return;
    setLoading(true);
    try {
      const formattedNodes = nodes.map(n => ({
        id: n.id,
        nodeId: n.type,
        position: n.position,
        data: n.data,
        credentials: n.credentials // Send credentials
      }));

      await apiCreateWorkflow({
        nodes: formattedNodes,
        edges: edges
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to save workflow", err);
    } finally {
      setLoading(false);
    }
  };

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
    (_: any, connectionInfo: any) => {
      if (!connectionInfo.isValid) {
        setSelectAction({
          startingNodeId: connectionInfo.fromNode?.id,
          position: connectionInfo.fromNode?.position ? {
            x: connectionInfo.fromNode.position.x + 250,
            y: connectionInfo.fromNode.position.y
          } : { x: 250, y: 250 }
        });
      }
    },
    []
  );
  const [showTriggerSheet, setShowTriggerSheet] = useState(true);

  return (
    <div className="w-screen h-screen relative bg-background overflow-hidden">
      {/* Header matching screenshot style */}
      <div className="absolute top-0 left-0 right-0 h-20 border-b bg-background/50 backdrop-blur-md z-30 flex items-center justify-between px-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Create workflow</h1>
        <Button onClick={handleSave} disabled={loading || nodes.length === 0} className="rounded-full px-6 shadow-md hover:shadow-lg transition-all">
          <Save className="mr-2 h-4 w-4" /> {loading ? "Saving..." : "Save Workflow"}
        </Button>
      </div>

      <div className="w-full h-full pt-20">
        {(!nodes.length && showTriggerSheet) && <TriggerSheet 
          onSelect={(type, metadata) => {
            setNodes((nds) => [...nds, {
              id: Math.random().toString(),
              type,
              data: {
                kind: "trigger",
                metadata,
              },
              position: { x: 100, y: 100 },
            }]);
            setShowTriggerSheet(false);
          }} 
          onClose={() => setShowTriggerSheet(false)}
        />}
        {selectAction && <ActionSheet 
          onSelect={(type, metadata, credentials) => {
            const nodeId = Math.random().toString()
            setNodes((nds) => [...nds, {
              id: nodeId,
              type,
              data: {
                kind: "action",
                metadata,
              },
              credentials, // Store credentials
              position: selectAction.position || { x: 400, y: 100 }
            }]);
            setEdges((eds) => [...eds, {
              id: `${selectAction.startingNodeId}-${nodeId}`,
              source: selectAction.startingNodeId,
              target: nodeId,
            }]);
            setSelectAction(null);
          }} 
          onClose={() => setSelectAction(null)}
        />}

        {!nodes.length && !showTriggerSheet && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-4">
            <p className="text-muted-foreground font-medium">No steps added yet</p>
            <Button onClick={() => setShowTriggerSheet(true)} size="lg" className="rounded-full shadow-2xl hover:scale-105 transition-all">
              Add Trigger to Start
            </Button>
          </div>
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
          className="bg-secondary/5"
        >
          <Background variant={"dots" as any} gap={12} size={1} color="#cbd5e1" />
          <Controls className="bg-background border shadow-md rounded-md p-1 fill-foreground" />
        </ReactFlow>
      </div>
    </div>
  );
}
