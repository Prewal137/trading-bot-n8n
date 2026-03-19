import React from "react";
import { useParams } from "react-router-dom";

const WorkflowDetail = () => {
  const { workflowId } = useParams();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Workflow Detail</h1>
      <p className="mt-2 text-muted-foreground">Viewing Workflow ID: {workflowId}</p>
    </div>
  );
};

export default WorkflowDetail;
