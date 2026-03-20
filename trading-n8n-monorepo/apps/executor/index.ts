import { WorkflowModel, ExecutionModel } from "@repo/db";
import { execute, NodeDocument } from "./execute.js";

async function main() {
    while (true) {
        // ... (rest of the file remains same, but I'll update the call)
        const workflows = await WorkflowModel.find({}).populate("nodes.nodeId");
        
        for (const workflow of workflows) {
            const trigger = workflow.nodes.find(x => x.data?.kind === "TRIGGER");
            if (!trigger) continue;

            const nodeInfo = trigger.nodeId as any;
            const type = nodeInfo?.type;

            if (type === "timer") {
                const timeInS = trigger.data?.metadata?.time;
                const execution = await ExecutionModel.findOne({
                    workflowId: workflow._id,
                }).sort({ startTime: -1 });

                if (!execution || (execution.startTime.getTime() + (timeInS * 1000) <= Date.now())) {
                    // Create execution record here since execute() signature changed in the tutorial
                    await ExecutionModel.create({
                        workflowId: workflow._id,
                        status: "PENDING",
                        startTime: new Date(),
                        endTime: new Date()
                    });

                    const nodes: NodeDocument[] = workflow.nodes.map((node: any) => ({
                        id: node.id,
                        type: node.nodeId?.type || "",
                        credentials: node.credentials,
                        data: node.data,
                        nodeId: node.nodeId?._id?.toString() || node.nodeId?.toString() || ""
                    }));

                    await execute(nodes, workflow.edges as any);

                    await ExecutionModel.findOneAndUpdate({ workflowId: workflow._id }, {
                        status: "SUCCESS",
                        endTime: new Date()
                    }, { sort: { startTime: -1 } });
                }
            }
        }
        await new Promise(r => setTimeout(r, 5000));
    }
}

main();



