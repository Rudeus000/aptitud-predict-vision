import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import UploadScreen from "./pages/UploadScreen";
import ResultsScreen from "./pages/ResultsScreen";
import CandidateDetailsScreen from "./pages/CandidateDetailsScreen";
import RecommendationsScreen from "./pages/RecommendationsScreen";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import CandidateUpload from "./pages/candidate/CandidateUpload";
import NotFound from "./pages/NotFound";
import Vacancies from "./pages/admin/Vacancies";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<UploadScreen />} />
            <Route path="/results" element={<ResultsScreen />} />
            <Route path="/candidates/:id" element={<CandidateDetailsScreen />} />
            <Route path="/recommendations" element={<RecommendationsScreen />} />
            <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
            <Route path="/candidate/upload" element={<CandidateUpload />} />
            <Route path="/admin/vacantes" element={<Vacancies />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
