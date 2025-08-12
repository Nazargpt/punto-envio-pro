import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Index from "./pages/Index";
import Ordenes from "./pages/Ordenes";
import HojasRuta from "./pages/HojasRuta";
import Transportistas from "./pages/Transportistas";
import Tarifas from "./pages/Tarifas";
import Incidencias from "./pages/Incidencias";
import CrearOrden from "./pages/CrearOrden";
import Seguimiento from "./pages/Seguimiento";
import Admin from "./pages/Admin";
import Agencias from "./pages/Agencias";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/crear-orden" element={<Layout><CrearOrden /></Layout>} />
          <Route path="/ordenes" element={<Layout><Ordenes /></Layout>} />
          <Route path="/hojas-ruta" element={<Layout><HojasRuta /></Layout>} />
          <Route path="/transportistas" element={<Layout><Transportistas /></Layout>} />
          <Route path="/tarifas" element={<Layout><Tarifas /></Layout>} />
          <Route path="/incidencias" element={<Layout><Incidencias /></Layout>} />
          <Route path="/seguimiento" element={<Layout><Seguimiento /></Layout>} />
          <Route path="/admin" element={<Layout><Admin /></Layout>} />
          <Route path="/admin/agencias" element={<Layout><Agencias /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
