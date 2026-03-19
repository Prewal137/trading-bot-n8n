import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiListExecutions } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, XCircle, Clock } from "lucide-react";

const WorkflowExecutions = () => {
  const { workflowId } = useParams();
  const [executions, setExecutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExecutions = async () => {
      if (!workflowId) return;
      try {
        const data = await apiListExecutions(workflowId);
        setExecutions(data.executions);
      } catch (err: any) {
        setError("Failed to load executions");
      } finally {
        setLoading(false);
      }
    };

    fetchExecutions();
  }, [workflowId]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Button variant="ghost" onClick={() => navigate(`/workflow/${workflowId}`)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Workflow
      </Button>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Execution History</h1>
          <p className="text-muted-foreground mt-1">Review the performance and logs of your workflow.</p>
        </div>
      </div>

      {error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md text-center">
          {error}
        </div>
      ) : executions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-xl bg-secondary/10">
          <Clock className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
          <p className="text-lg font-medium text-muted-foreground">No executions yet</p>
          <p className="text-sm text-muted-foreground mt-1">Executions will appear here once the workflow is triggered.</p>
        </div>
      ) : (
        <div className="bg-background border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-secondary/50 border-b">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-sm font-semibold">Execution ID</th>
                <th className="px-6 py-4 text-sm font-semibold">Time</th>
                <th className="px-6 py-4 text-sm font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {executions.map((execution) => (
                <tr key={execution._id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4">
                    {execution.status === "COMPLETED" ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    ) : execution.status === "FAILED" ? (
                      <div className="flex items-center text-destructive">
                        <XCircle className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Failed</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-amber-500">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Pending</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-muted-foreground">
                    {execution._id.slice(-8)}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(execution.createdAt || Date.now()).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="link" size="sm" className="p-0 h-auto">View Logs</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WorkflowExecutions;

