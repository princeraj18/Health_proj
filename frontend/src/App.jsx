import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ReportSummarizer from "./pages/ReportSummarizer";
import MedicineInfo from "./pages/MedicineInfo";
import DiseaseIdentification from "./pages/DiseaseIdentification";
import NutritionAnalysis from "./pages/NutritionAnalysis";
import Services from "./pages/Services";
import Camps from "./pages/Camps";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import Navbar from "@/components/ui/Navbar";
const queryClient = new QueryClient();
const App = () => <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/reports" element={<ReportSummarizer />} />
          <Route path="/medicine" element={<MedicineInfo />} />
          <Route path="/diagnosis" element={<DiseaseIdentification />} />
          <Route path="/services" element={<Services />} />
          <Route path="/camps" element={<Camps />} />
          <Route path="/about" element={<About />} />
          <Route path="/nutrition" element={<NutritionAnalysis />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
              {/* <Route path="/services" element={< />} /> */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>;
export default App;