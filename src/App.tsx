import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthPage } from "./components/auth/AuthPage";
import { RoleSelection } from "./components/auth/RoleSelection";
import { SimpleDashboard } from "./components/dashboard/SimpleDashboard";
import { PollDetail } from "./components/poll/PollDetail";
import { SimpleAdminPanel } from "./components/admin/SimpleAdminPanel";
import { AuthCallbackHandler } from "./components/auth/AuthCallbackHandler";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthCallbackHandler />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<SimpleDashboard />} />
            <Route path="/poll/:pollId" element={<PollDetail />} />
            <Route path="/admin" element={<SimpleAdminPanel />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
