import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import HomeLayout from "@/components/layout/HomeLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Ordenes from "./pages/Ordenes";
import HojasRuta from "./pages/HojasRuta";
import Transportistas from "./pages/Transportistas";
import Tarifas from "./pages/Tarifas";
import Incidencias from "./pages/Incidencias";
import CrearOrden from "./pages/CrearOrden";
import Cotizador from "./pages/Cotizador";
import Seguimiento from "./pages/Seguimiento";
import Admin from "./pages/Admin";
import AdminUsuarios from "./pages/AdminUsuarios";
import AdminReportes from "./pages/AdminReportes";
import AdminConfiguracion from "./pages/AdminConfiguracion";
import AdminTarifario from "./pages/AdminTarifario";
import ServiciosTransportistas from "./components/admin/ServiciosTransportistas";
import Agencias from "./pages/Agencias";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomeLayout><Index /></HomeLayout>} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/cotizador" element={<ProtectedRoute><Layout><Cotizador /></Layout></ProtectedRoute>} />
            <Route path="/crear-orden" element={<ProtectedRoute><Layout><CrearOrden /></Layout></ProtectedRoute>} />
            <Route path="/ordenes" element={<ProtectedRoute><Layout><Ordenes /></Layout></ProtectedRoute>} />
            <Route path="/hojas-ruta" element={<ProtectedRoute requireAdmin><Layout><HojasRuta /></Layout></ProtectedRoute>} />
            <Route path="/transportistas" element={<ProtectedRoute requireAdmin><Layout><Transportistas /></Layout></ProtectedRoute>} />
            <Route path="/tarifas" element={<ProtectedRoute><Layout><Tarifas /></Layout></ProtectedRoute>} />
            <Route path="/incidencias" element={<ProtectedRoute><Layout><Incidencias /></Layout></ProtectedRoute>} />
            <Route path="/seguimiento" element={<Layout><Seguimiento /></Layout>} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin><Layout><Admin /></Layout></ProtectedRoute>} />
            <Route path="/admin/agencias" element={<ProtectedRoute requireAdmin><Layout><Agencias /></Layout></ProtectedRoute>} />
            <Route path="/admin/usuarios" element={<ProtectedRoute requireSuperAdmin><Layout><AdminUsuarios /></Layout></ProtectedRoute>} />
            <Route path="/admin/reportes" element={<ProtectedRoute requireAdmin><Layout><AdminReportes /></Layout></ProtectedRoute>} />
            <Route path="/admin/tarifario" element={<ProtectedRoute requireAdmin><Layout><AdminTarifario /></Layout></ProtectedRoute>} />
            <Route path="/admin/servicios-transportistas" element={<ProtectedRoute requireAdmin><Layout><ServiciosTransportistas /></Layout></ProtectedRoute>} />
            <Route path="/admin/configuracion" element={<ProtectedRoute requireSuperAdmin><Layout><AdminConfiguracion /></Layout></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
