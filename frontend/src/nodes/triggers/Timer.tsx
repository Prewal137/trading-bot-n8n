import { Handle, Position } from "@xyflow/react";
export type TimerNodeMetadata ={
    time: string;
};


export function Timer({ data, isConnectable }: {
   data: {
      metadata: TimerNodeMetadata
   };
   isConnectable: boolean;
}) {
   return <div className="p-4 border">
         {data.metadata.time}
        <Handle type="source" position={Position.Right} isConnectable={isConnectable}></Handle>
    </div>
}