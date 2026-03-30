export type NodeKind =
  | "price-trigger"
  | "timer"
  | "hyperliquid"
  | "backpack"
  | "lighter";

export type NodeMetadata = Record<string, any>;
export * from "./metadata/index";
export * from "./types/index";
