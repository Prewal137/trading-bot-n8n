import { SUPPORTED_ASSETS } from "@/components/TriggerSheet";
import { Handle, Position } from "@xyflow/react";

export type TradingMetadata = {
  type: "LONG" | "SHORT";
  qty: number;
  symbol: typeof SUPPORTED_ASSETS;
};

export function Lighter({ data, isConnectable }: {
  data: {
    metadata: TradingMetadata;
  };
  isConnectable?: boolean;
}) {
  return (
    <div className="bg-white border rounded-md shadow-sm min-w-[150px] text-sm">
      <div className="px-3 py-2 border-b bg-gray-50 font-semibold rounded-t-md text-gray-800">
        Lighter Trade
      </div>
      <div className="p-3 text-gray-600 flex flex-col gap-1">
        <div><span className="font-medium text-gray-900">{data.metadata.type}</span></div>
        <div><span className="font-medium text-gray-900">{data.metadata.qty}</span></div>
        <div><span className="font-medium text-gray-900">{data.metadata.symbol}</span></div>
      </div>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  );
}
