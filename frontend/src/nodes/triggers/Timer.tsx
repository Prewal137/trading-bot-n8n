import { Handle, Position } from "@xyflow/react";

export type TimerNodeMetadata = {
  time: number;
};

export function Timer({ data, isConnectable }: {
  data: {
    metadata: TimerNodeMetadata;
  };
  isConnectable: boolean;
}) {
  return (
    <div className="bg-white border rounded-md shadow-sm min-w-[150px] text-sm">
      <div className="px-3 py-2 border-b bg-gray-50 font-semibold rounded-t-md text-gray-800">
        Timer Trigger
      </div>
      <div className="p-3 text-gray-600">
        Every <span className="font-medium text-gray-900">{data.metadata.time / 3600}</span> hours
      </div>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  );
}