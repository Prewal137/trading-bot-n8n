import { SignerClient } from "./lighter-sdk-ts/signer.js";
import { NonceManagerType } from "./lighter-sdk-ts/nonce_manager.js";

export const MARKETS: any = {
    "BTC": {
        "marketId": 1,
        "qtyDecimals": 100000,
    },
    "ETH": {
        "marketId": 0,
        "qtyDecimals": 10000,
    },
    "SOL": {
        "marketId": 2,
        "qtyDecimals": 1000,
    }
}

const BASE_URL = process.env.LIGHTER_BASE_URL || "https://mainnet.zklighter.elliot.ai";

export async function execute(asset: "SOL" | "BTC" | "ETH", qty: number, type: "LONG" | "SHORT", API_KEY: string, ACCOUNT_INDEX?: number, API_KEY_INDEX?: number) {
    const marketIndex = MARKETS[asset].marketId;
    const client = await SignerClient.create({
        url: BASE_URL,
        privateKey: API_KEY,
        apiKeyIndex: API_KEY_INDEX,
        accountIndex: ACCOUNT_INDEX,
        nonceManagementType: NonceManagerType.OPTIMISTIC
    });

    const isAsk = type === "SHORT";
    const baseAmount = Math.round(qty * MARKETS[asset].qtyDecimals);
    
    // Remaining logic for execution would go here
    console.log(`Executing trade for ${asset} on Lighter: ${type} ${qty}`);
}
