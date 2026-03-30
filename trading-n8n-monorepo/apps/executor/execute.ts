import { NodesModel } from "@repo/db";
import { execute as executeLighter } from "./executors/lighter.js";
export type NodeDocument = {
    id: string;
    type: string;
    credentials?: any;
    data?: {
        metadata?: any;
        kind?: "ACTION" | "TRIGGER" | null | undefined;
    } | null | undefined;
    nodeId: string;
};

type EdgeDocument = {
    source: string;
    target: string;
};

export async function execute(nodes: NodeDocument[], edges: EdgeDocument[]) {
    // 1. Find the trigger node
    const trigger = nodes.find(x => x.data?.kind === "TRIGGER");
    if (!trigger) {
        return;
    }

    // Start recursive execution from the trigger node
    await executeRecursive(trigger.id, nodes, edges);
}

export async function executeRecursive(sourceId: string, nodes: NodeDocument[], edges: EdgeDocument[]) {
    // 1. Find all target node IDs that originate from the current sourceId
    const nodesToExecute = edges
        .filter(({ source }) => source === sourceId)
        .map(({ target }) => target);

    // 2. Execute the logic for all next nodes at this level
    await Promise.all(nodesToExecute.map(async (nodeClientId) => {
        const node = nodes.find(({ id }) => id === nodeClientId);
        if (!node) {
            return;
        }

        switch (node.type) {
            case "lighter":
                if (node.data?.metadata) {
                    executeLighter(
                        node.data.metadata.asset,
                        node.data.metadata.quantity,
                        node.data.metadata.type,
                        node.credentials?.apiKey
                    );
                }
                console.log(`Executing 'lighter' logic for node ${node.id}`);
                break;
        }
    }));

    // 3. Recurse into the next level of the graph in parallel
    await Promise.all(
        nodesToExecute.map(id => executeRecursive(id, nodes, edges))
    );
}




