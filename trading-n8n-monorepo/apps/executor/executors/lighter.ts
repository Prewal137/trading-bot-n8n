
export function execute(asset: "SOL" | "BTC" | "ETH", quantity: number, type: "LONG" | "SHORT", API_KEY: string) {
    console.log("Executing trade on lighter")
    console.log(`${asset} ${quantity} ${type}, ${API_KEY}`)
}
