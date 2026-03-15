import { Handle, Position } from "@xyflow/react";

export type PriceTriggerMetadata = {
  asset: string;
  price: number;
};

export function PriceTrigger({ data, isConnectable }: {
  data: {
    metadata: PriceTriggerMetadata;
  };
  isConnectable: boolean;
}) {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl min-w-[200px] text-sm transition-all hover:shadow-2xl">
      <div className="px-4 py-3 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-indigo-100/50 rounded-t-2xl">
        <div className="font-semibold text-indigo-900 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
          Price Trigger
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2 bg-white/40 rounded-b-2xl">
        <div className="flex justify-between items-center text-gray-600">
          <span>Asset</span>
          <span className="font-bold text-gray-900 bg-indigo-50 px-2 py-0.5 rounded-md">{data.metadata.asset}</span>
        </div>
        <div className="flex justify-between items-center text-gray-600">
          <span>Price</span>
          <span className="font-bold text-gray-900 bg-indigo-50 px-2 py-0.5 rounded-md">${data.metadata.price}</span>
        </div>
      </div>
      <Handle 
        type="source" 
        position={Position.Right} 
        isConnectable={isConnectable} 
        className="w-3 h-3 rounded-full bg-indigo-500 border-2 border-white shadow-sm"
      />
    </div>
  );
}