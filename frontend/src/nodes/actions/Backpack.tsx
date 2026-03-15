import { Handle, Position } from "@xyflow/react";
import type { TradingMetadata } from "./Lighter";

export function Backpack({ data, isConnectable }: {
  data: {
    metadata: TradingMetadata;
  };
  isConnectable?: boolean;
}) {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl min-w-[200px] text-sm overflow-hidden transition-all hover:shadow-2xl">
      <div className="px-4 py-3 bg-gradient-to-r from-orange-500/10 to-rose-500/10 border-b border-rose-100/50">
        <div className="font-semibold text-rose-900 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
          Backpack Trade
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2 bg-white/40">
        <div className="flex justify-between items-center text-gray-600">
          <span>Type</span>
          <span className={`font-bold px-2 py-0.5 rounded-md ${data.metadata.type === "LONG" ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"}`}>
            {data.metadata.type}
          </span>
        </div>
        <div className="flex justify-between items-center text-gray-600">
          <span>Symbol</span>
          <span className="font-bold text-gray-900 bg-rose-50 px-2 py-0.5 rounded-md">{data.metadata.symbol}</span>
        </div>
        <div className="flex justify-between items-center text-gray-600">
          <span>Quantity</span>
          <span className="font-bold text-gray-900">{data.metadata.qty}</span>
        </div>
      </div>
      <Handle 
        type="target" 
        position={Position.Left} 
        isConnectable={isConnectable} 
        className="w-3 h-3 bg-rose-500 border-2 border-white shadow-sm"
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        isConnectable={isConnectable} 
        className="w-3 h-3 bg-rose-500 border-2 border-white shadow-sm"
      />
    </div>
  );
}
