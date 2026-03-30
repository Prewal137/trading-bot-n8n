
export const SUPPORTED_ASSETS = ["SOL", "BTC", "ETH"]

export type TradingMetadata = {
  type: "LONG" | "SHORT";
  quantity: number;
  asset: string;
};

export type TimerNodeMetadata = {
  time: number;
};
export type PriceTriggerMetadata = {
  asset: string;
  price: number;
};