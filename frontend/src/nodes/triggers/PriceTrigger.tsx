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
    <div className="bg-white border rounded-md shadow-sm min-w-[150px] text-sm">
      <div className="px-3 py-2 border-b bg-gray-50 font-semibold rounded-t-md text-gray-800">
        Price Trigger
      </div>
      <div className="p-3 flex flex-col gap-1">
        <div className="text-gray-600">
          Asset: <span className="font-medium text-gray-900">{data.metadata.asset}</span>
        </div>
        <div className="text-gray-600">
          Price: <span className="font-medium text-gray-900">{data.metadata.price}</span>
        </div>
      </div>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  );
}