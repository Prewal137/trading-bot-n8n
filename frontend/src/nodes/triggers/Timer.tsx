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
    <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl min-w-[200px] text-sm overflow-hidden transition-all hover:shadow-2xl">
      <div className="px-4 py-3 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-indigo-100/50">
        <div className="font-semibold text-indigo-900 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
          Timer Trigger
        </div>
      </div>
      <div className="p-4 text-gray-600 bg-white/40">
        Run every <span className="font-bold text-gray-900 bg-indigo-50 px-2 py-0.5 rounded-md">{data.metadata.time / 3600}</span> hours
      </div>
      <Handle 
        type="source" 
        position={Position.Right} 
        isConnectable={isConnectable} 
        className="w-3 h-3 bg-indigo-500 border-2 border-white shadow-sm"
      />
    </div>
  );
}