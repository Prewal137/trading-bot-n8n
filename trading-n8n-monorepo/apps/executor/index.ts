import { WorkflowModel, ExecutionModel, NodesModel } from "db/client";
import { execute, NodeDocument } from "./execute.js";
import mongoose from "mongoose";

async function main() {
    await mongoose.connect(process.env.MONGO_URL!);
    while (1) {
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
                    const execution = await ExecutionModel.create({
                        workflowId: workflow._id,
                        status: "PENDING",
                        startTime: new Date(),
                    });

                    const nodes: NodeDocument[] = workflow.nodes.map((node: any) => ({
                        id: node.id,
                        type: node.nodeId?.type || "",
                        credentials: node.credentials,
                        data: node.data,
                        nodeId: node.nodeId?._id?.toString() || node.nodeId?.toString() || ""
                    }));

                    await execute(nodes, workflow.edges as any);

                    execution.status = "SUCCESS";
                    execution.endTime = new Date();
                    await execution.save();
                }
            }
        }
        await new Promise(r => setTimeout(r, 5000));
    }
}

main();



