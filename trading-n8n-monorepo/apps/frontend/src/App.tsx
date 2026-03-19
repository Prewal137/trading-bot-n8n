import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import CreateWorkflow from "@/pages/CreateWorkflow";
import WorkflowDetail from "@/pages/WorkflowDetail";
import WorkflowExecutions from "@/pages/WorkflowExecutions";
import Loading from "@/pages/Loading";

function App() {
  return (
    <div className="min-h-screen bg-secondary/40">
      <BrowserRouter>
        <Routes>
          {/* Main Landing / Loading */}
          <Route path="/" element={<Loading />} />
          
          {/* Authentication */}
          <Route path="/auth" element={<Auth />} />
          
          {/* Protected Routes (Dashboard) */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Workflow Management */}
          <Route path="/createworkflow" element={<CreateWorkflow />} />
          <Route path="/workflow/:workflowId" element={<WorkflowDetail />} />
          <Route path="/workflow/:workflowId/executions" element={<WorkflowExecutions />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;