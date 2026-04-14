import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/njm/ErrorBoundary";
import { AuthGuard } from "@/components/njm/AuthGuard";
import AppLayout from "@/layouts/AppLayout";
import Index from "./pages/Index";
import CEOPage from "./pages/CEOPage";
import PMPage from "./pages/PMPage";
import LibroVivoPage from "./pages/LibroVivoPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import BrandOverviewPage from "./pages/BrandOverviewPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <AuthGuard>
                <ErrorBoundary>
                  <AppLayout />
                </ErrorBoundary>
              </AuthGuard>
            }
          >
            <Route path="/" element={<Index />} />
            <Route path="/brand/:id" element={<BrandOverviewPage />} />
            <Route path="/brand/:id/ceo" element={<CEOPage />} />
            <Route path="/brand/:id/pm" element={<PMPage />} />
            <Route path="/brand/:id/libro-vivo" element={<LibroVivoPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
