import { WorkflowModel } from "@repo/db";

async function main(){

while(1){
   await WorkflowModel.find({});
}



}

main()