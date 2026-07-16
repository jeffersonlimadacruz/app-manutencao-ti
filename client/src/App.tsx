import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useLocalAuth } from "./hooks/useLocalAuth";
import AccessChoice from "./pages/AccessChoice";
import LoginTecnico from "./pages/LoginTecnico";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

function Router() {
  const { isAuthenticated, isLoading, currentUser } = useLocalAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={AccessChoice} />
      <Route path="/login-tecnico" component={LoginTecnico} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
