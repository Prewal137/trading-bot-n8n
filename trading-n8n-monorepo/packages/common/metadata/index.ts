
export const SUPPORTED_ASSETS = ["SOL", "BTC", "ETH"]

export type TradingMetadata = {
  type: "LONG" | "SHORT";
  qty: number;
  symbol: typeof SUPPORTED_ASSETS;
};
