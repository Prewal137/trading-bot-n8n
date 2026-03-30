export class SignerClient {
    static async create(options: any) {
        console.log("SignerClient created with options:", options);
        return new SignerClient();
    }

    async createOrder(params: any): Promise<any> {
        console.log("Creating order through stubbed SignerClient:", params);
        return { txInfo: "stubbed-tx-info", error: null };
    }
}
