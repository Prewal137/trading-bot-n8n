import { WorkflowModel } from "@repo/db";

async function main(){

while(1){
   const workflows=await WorkflowModel.find({});
   workflows.map(async(workflow)=>{
    const trigger = workflow.nodes.find(x=>x.data?.kind==="TRIGGER");
    if (!trigger){
        return;
    }

    switch (trigger?.type){
        case "timer":
            const timeInS = trigger.data?.metadata.time;
            const execution = await ExecutionModel.findOne({
                workflowId: worklfow.id,
            }).sort({
                startTime: 1
            })
            if (execution.startTime <= )
    }
   })
}



}

main()