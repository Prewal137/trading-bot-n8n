export type NodeKind =
  | "price-trigger"
  | "timer-trigger"
  | "hyperliquid"
  | "backpack"
  | "lighter";

export type NodeMetadata = Record<string, any>;
export * from "./metadata";
export * from "./types";
