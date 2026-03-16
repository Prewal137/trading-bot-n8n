import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CreateWorkflow } from "./components/CreateWorkflow";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/create-workflow" element={<CreateWorkflow />} />
      </Routes>
    </BrowserRouter>
  );
}