import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import CreateWorkflow from "@/pages/CreateWorkflow";
import WorkflowDetail from "@/pages/WorkflowDetail";
import WorkflowExecutions from "@/pages/WorkflowExecutions";
import { Button } from "@/components/ui/button";
import { removeAuthToken, getAuthToken } from "@/lib/api";
import { LayoutDashboard } from "lucide-react";

// Auth Guard Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = getAuthToken();
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
}

function Navigation() {
  const navigate = useNavigate();
  const location = window.location.pathname;
  const isAuthenticated = !!getAuthToken();
  
  // Hide navigation on Auth page
  if (location === "/auth") return null;

  return (
    <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <span>TradingBot</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <Button variant="ghost" asChild className={location === "/" ? "bg-secondary" : ""}>
              <Link to="/">Home</Link>
            </Button>
            {isAuthenticated && (
              <Button variant="ghost" asChild className={location === "/dashboard" ? "bg-secondary" : ""}>
                <Link to="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                removeAuthToken();
                navigate("/auth");
              }}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              Logout
            </Button>
          ) : (
            location !== "/auth" && (
              <Button size="sm" onClick={() => navigate("/auth")} className="rounded-full px-6">
                Sign In
              </Button>
            )
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-secondary/10 font-sans antialiased text-foreground">
      <BrowserRouter>
        <Navigation />
        <main className="relative">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/createworkflow" element={<ProtectedRoute><CreateWorkflow /></ProtectedRoute>} />
            <Route path="/workflow/:workflowId" element={<ProtectedRoute><WorkflowDetail /></ProtectedRoute>} />
            <Route path="/workflow/:workflowId/executions" element={<ProtectedRoute><WorkflowExecutions /></ProtectedRoute>} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}


export default App;