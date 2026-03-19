import React from "react";
import { useParams } from "react-router-dom";

const WorkflowExecutions = () => {
  const { workflowId } = useParams();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Workflow Executions</h1>
      <p className="mt-2 text-muted-foreground">Executions for Workflow ID: {workflowId}</p>
    </div>
  );
};

export default WorkflowExecutions;
