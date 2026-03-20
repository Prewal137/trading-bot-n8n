import { WorkflowModel, ExecutionModel } from "@repo/db";

async function main() {
    while (true) {
        const workflows = await WorkflowModel.find({}).populate("nodes.nodeId");
        
        for (const workflow of workflows) {
            const triggerNode = workflow.nodes.find(x => x.data?.kind === "TRIGGER");
            if (!triggerNode) {
                continue;
            }

            // The type is on the referenced Node
            const nodeInfo = triggerNode.nodeId as any; 
            const type = nodeInfo?.type;

            switch (type) {
                case "timer":
                    const timeInS = triggerNode.data?.metadata?.time;
                    const lastExecution = await ExecutionModel.findOne({
                        workflowId: workflow._id,
                    }).sort({
                        startTime: -1
                    });

                    if (!lastExecution || (Date.now() - lastExecution.startTime.getTime()) > (timeInS * 1000)) {
                        console.log(`Executing workflow ${workflow._id}`);
                        await ExecutionModel.create({
                            workflowId: workflow._id,
                            status: "PENDING",
                            startTime: new Date(),
                            endTime: new Date()
                        });
                    }
                    break;
            }
        }
        await new Promise(r => setTimeout(r, 5000)); // Sleep for 5 seconds
    }
}

main();