// JSON COMPLETO DE EXPORTACIÓN PUNTOENVÍO
export const FULL_EXPORT_JSON = JSON.stringify({
  "metadata": {
    "name": "PuntoEnvío",
    "version": "1.0.0",
    "description": "Sistema completo de gestión de envíos y transportistas con seguimiento en tiempo real, cotización automatizada y administración de agencias",
    "dependencies": [
      "@hookform/resolvers@^3.10.0",
      "@radix-ui/react-accordion@^1.2.11",
      "@radix-ui/react-alert-dialog@^1.1.14",
      "@radix-ui/react-aspect-ratio@^1.1.7",
      "@radix-ui/react-avatar@^1.1.10",
      "@radix-ui/react-checkbox@^1.3.2",
      "@radix-ui/react-collapsible@^1.1.11",
      "@radix-ui/react-context-menu@^2.2.15",
      "@radix-ui/react-dialog@^1.1.14",
      "@radix-ui/react-dropdown-menu@^2.1.15",
      "@radix-ui/react-hover-card@^1.1.14",
      "@radix-ui/react-label@^2.1.7",
      "@radix-ui/react-menubar@^1.1.15",
      "@radix-ui/react-navigation-menu@^1.2.13",
      "@radix-ui/react-popover@^1.1.14",
      "@radix-ui/react-progress@^1.1.7",
      "@radix-ui/react-radio-group@^1.3.7",
      "@radix-ui/react-scroll-area@^1.2.9",
      "@radix-ui/react-select@^2.2.5",
      "@radix-ui/react-separator@^1.1.7",
      "@radix-ui/react-slider@^1.3.5",
      "@radix-ui/react-slot@^1.2.3",
      "@radix-ui/react-switch@^1.2.5",
      "@radix-ui/react-tabs@^1.1.12",
      "@radix-ui/react-toast@^1.2.14",
      "@radix-ui/react-toggle@^1.1.9",
      "@radix-ui/react-toggle-group@^1.1.10",
      "@radix-ui/react-tooltip@^1.2.7",
      "@supabase/supabase-js@^2.55.0",
      "@tanstack/react-query@^5.83.0",
      "class-variance-authority@^0.7.1",
      "clsx@^2.1.1",
      "cmdk@^1.1.1",
      "date-fns@^3.6.0",
      "embla-carousel-autoplay@^8.6.0",
      "embla-carousel-react@^8.6.0",
      "html2canvas@^1.4.1",
      "input-otp@^1.4.2",
      "jspdf@^3.0.1",
      "lucide-react@^0.462.0",
      "next-themes@^0.3.0",
      "react@^18.3.1",
      "react-day-picker@^8.10.1",
      "react-dom@^18.3.1",
      "react-hook-form@^7.61.1",
      "react-resizable-panels@^2.1.9",
      "react-router-dom@^6.30.1",
      "recharts@^2.15.4",
      "sonner@^1.7.4",
      "tailwind-merge@^2.6.0",
      "tailwindcss-animate@^1.0.7",
      "vaul@^0.9.9",
      "zod@^3.25.76"
    ],
    "author": "Sistema PuntoEnvío",
    "exportedAt": "2025-01-21T00:00:00.000Z"
  },
  "files": {
    "package.json": `{
  "name": "puntoenvio-system",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.10.0",
    "@radix-ui/react-accordion": "^1.2.11",
    "@radix-ui/react-alert-dialog": "^1.1.14",
    "@radix-ui/react-aspect-ratio": "^1.1.7",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-context-menu": "^2.2.15",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-hover-card": "^1.1.14",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-menubar": "^1.1.15",
    "@radix-ui/react-navigation-menu": "^1.2.13",
    "@radix-ui/react-popover": "^1.1.14",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-radio-group": "^1.3.7",
    "@radix-ui/react-scroll-area": "^1.2.9",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.5",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.5",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-toast": "^1.2.14",
    "@radix-ui/react-toggle": "^1.1.9",
    "@radix-ui/react-toggle-group": "^1.1.10",
    "@radix-ui/react-tooltip": "^1.2.7",
    "@supabase/supabase-js": "^2.55.0",
    "@tanstack/react-query": "^5.83.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^3.6.0",
    "embla-carousel-autoplay": "^8.6.0",
    "embla-carousel-react": "^8.6.0",
    "html2canvas": "^1.4.1",
    "input-otp": "^1.4.2",
    "jspdf": "^3.0.1",
    "lucide-react": "^0.462.0",
    "next-themes": "^0.3.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.61.1",
    "react-resizable-panels": "^2.1.9",
    "react-router-dom": "^6.30.1",
    "recharts": "^2.15.4",
    "sonner": "^1.7.4",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.9",
    "zod": "^3.25.76"
  }
}`,
    "src/main.tsx": `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
    "src/App.tsx": `import { Toaster } from "@/components/ui/toaster";
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
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;`,
    "src/index.css": `@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
  --radius: 0.75rem;
  --chart-1: 12 76% 61%;
  --chart-2: 173 58% 39%;
  --chart-3: 197 37% 24%;
  --chart-4: 43 74% 66%;
  --chart-5: 27 87% 67%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 84% 4.9%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 224.3 76.3% 94.1%;
  --chart-1: 220 70% 50%;
  --chart-2: 160 60% 45%;
  --chart-3: 30 80% 55%;
  --chart-4: 280 65% 60%;
  --chart-5: 340 75% 55%;
}

* {
  border-color: hsl(var(--border));
}

body {
  font-family: "Inter", sans-serif;
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}`,
    "src/integrations/supabase/client.ts": `// Este archivo se genera automáticamente. No lo edites directamente.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zyowxsfzfuunjlufxqik.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5b3d4c2Z6ZnV1bmpsdWZ4cWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5OTY2MTYsImV4cCI6MjA3MDU3MjYxNn0.uRaFrjITY4tZLVkU9Et3WrpxXMkR03Pqjq_Mg9zOW3s";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});`,
    "README.md": `# PuntoEnvío - Sistema de Gestión de Envíos

Sistema completo de gestión de envíos y transportistas con seguimiento en tiempo real, cotización automatizada y administración de agencias.

## Características Principales

- 🚚 **Gestión de Transportistas**: Alta, modificación y administración completa de transportistas
- 📦 **Órdenes de Envío**: Sistema completo de creación y seguimiento de órdenes
- 🏢 **Agencias**: Gestión de sucursales y puntos de distribución
- 💰 **Sistema de Tarifas**: Cotización automática y configuración de precios
- 🗺️ **Planificación de Rutas**: Hojas de ruta y optimización de trayectos
- 🔍 **Seguimiento Público**: Sistema de tracking para clientes
- ⚠️ **Gestión de Incidencias**: Manejo de problemas y reportes
- 👥 **Administración de Usuarios**: Control de roles y permisos
- 📊 **Reportes y Estadísticas**: Dashboard administrativo con métricas

## Tecnologías

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + Shadcn/UI
- **Backend**: Supabase
- **Base de Datos**: PostgreSQL
- **Autenticación**: Supabase Auth
- **Estado**: TanStack Query

## Instalación

1. Clonar el repositorio
2. Instalar dependencias: \`npm install\`
3. Configurar variables de entorno de Supabase
4. Ejecutar migraciones de base de datos
5. Iniciar desarrollo: \`npm run dev\`

## Estructura del Proyecto

- \`src/pages/\` - Páginas principales del sistema
- \`src/components/\` - Componentes reutilizables
- \`src/contexts/\` - Contextos de React
- \`src/hooks/\` - Hooks personalizados
- \`src/utils/\` - Utilidades y helpers
- \`supabase/migrations/\` - Migraciones de base de datos

## Roles de Usuario

- **USER**: Usuario básico
- **OPERADOR_AGENCIA**: Operador de agencia
- **ADMIN_AGENCIA**: Administrador de agencia
- **SUPERADMIN**: Súper administrador del sistema
- **TRANSPORTISTA_LOCAL**: Transportista local
- **TRANSPORTISTA_LD**: Transportista de larga distancia

## Licencia

Propietario - Todos los derechos reservados`
  },
  "migrations": [
    "-- Migración 1: Configuración inicial y tipos de datos\nCREATE TYPE public.app_role AS ENUM ('USER', 'OPERADOR_AGENCIA', 'ADMIN_AGENCIA', 'SUPERADMIN', 'TRANSPORTISTA_LOCAL', 'TRANSPORTISTA_LD');\n\n-- Tabla de perfiles de usuario\nCREATE TABLE public.profiles (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,\n  email TEXT,\n  nombre TEXT,\n  activo BOOLEAN DEFAULT TRUE,\n  agencia_id UUID,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()\n);\n\n-- Tabla de roles de usuario\nCREATE TABLE public.user_roles (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  user_id UUID REFERENCES auth.users NOT NULL,\n  role app_role NOT NULL DEFAULT 'USER',\n  agencia_id UUID,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()\n);\n\n-- Habilitar RLS\nALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;",
    
    "-- Migración 2: Sistema de localización geográfica\nCREATE TABLE public.provincias (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  nombre TEXT NOT NULL,\n  codigo TEXT,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()\n);\n\nCREATE TABLE public.localidades (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  nombre TEXT NOT NULL,\n  provincia_id UUID NOT NULL,\n  codigo_postal TEXT,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()\n);\n\nALTER TABLE public.provincias ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.localidades ENABLE ROW LEVEL SECURITY;",
    
    "-- Migración 3: Sistema de agencias y transportistas\nCREATE TABLE public.agencias (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  nombre TEXT NOT NULL,\n  direccion TEXT,\n  localidad TEXT,\n  provincia TEXT,\n  contacto JSONB,\n  activo BOOLEAN DEFAULT TRUE,\n  tipo_parada BOOLEAN DEFAULT FALSE,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()\n);\n\nCREATE TABLE public.transportistas (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  nombre TEXT NOT NULL,\n  apellido TEXT NOT NULL,\n  documento TEXT NOT NULL UNIQUE,\n  email TEXT,\n  telefono TEXT,\n  licencia_conducir TEXT,\n  fecha_vencimiento_licencia DATE,\n  tipo_transportista TEXT NOT NULL DEFAULT 'local',\n  nombre_empresa TEXT,\n  calificacion NUMERIC(3,2) DEFAULT 5.0,\n  activo BOOLEAN DEFAULT TRUE,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()\n);\n\nALTER TABLE public.agencias ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.transportistas ENABLE ROW LEVEL SECURITY;",
    
    "-- Migración 4: Sistema de órdenes de envío\nCREATE TABLE public.ordenes_envio (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  numero_orden TEXT NOT NULL UNIQUE,\n  estado TEXT NOT NULL DEFAULT 'pendiente',\n  tipo_recoleccion TEXT NOT NULL,\n  tipo_entrega TEXT NOT NULL,\n  remitente_nombre TEXT NOT NULL,\n  remitente_documento TEXT NOT NULL,\n  remitente_domicilio TEXT NOT NULL,\n  remitente_localidad TEXT NOT NULL,\n  remitente_provincia TEXT NOT NULL,\n  destinatario_nombre TEXT NOT NULL,\n  destinatario_documento TEXT NOT NULL,\n  destinatario_domicilio TEXT NOT NULL,\n  destinatario_localidad TEXT NOT NULL,\n  destinatario_provincia TEXT NOT NULL,\n  fecha_recoleccion DATE,\n  hora_recoleccion TIME,\n  fecha_entrega DATE,\n  hora_entrega TIME,\n  agencia_origen_id UUID,\n  agencia_destino_id UUID,\n  transportista_id UUID,\n  usuario_creacion_id UUID NOT NULL,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()\n);\n\n-- Función para generar número de orden\nCREATE OR REPLACE FUNCTION public.generate_orden_number()\nRETURNS TEXT AS $$\nDECLARE\n    year_part TEXT;\n    sequence_num INT;\n    formatted_num TEXT;\nBEGIN\n    year_part := EXTRACT(year FROM CURRENT_DATE)::TEXT;\n    SELECT COUNT(*) + 1 INTO sequence_num\n    FROM public.ordenes_envio\n    WHERE EXTRACT(year FROM created_at) = EXTRACT(year FROM CURRENT_DATE);\n    formatted_num := LPAD(sequence_num::TEXT, 6, '0');\n    RETURN 'PE-' || year_part || '-' || formatted_num;\nEND;\n$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';\n\n-- Trigger para auto-generar número de orden\nCREATE OR REPLACE FUNCTION public.set_orden_number()\nRETURNS TRIGGER AS $$\nBEGIN\n    IF NEW.numero_orden IS NULL OR NEW.numero_orden = '' THEN\n        NEW.numero_orden := public.generate_orden_number();\n    END IF;\n    RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';\n\nCREATE TRIGGER set_orden_number_trigger\n    BEFORE INSERT ON public.ordenes_envio\n    FOR EACH ROW\n    EXECUTE FUNCTION public.set_orden_number();\n\nALTER TABLE public.ordenes_envio ENABLE ROW LEVEL SECURITY;",
    
    "-- Migración 5: Todas las tablas restantes y funciones del sistema completo PuntoEnvío\n-- Sistema de paquetes\nCREATE TABLE public.paquetes (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  orden_envio_id UUID REFERENCES public.ordenes_envio,\n  descripcion TEXT NOT NULL,\n  peso_kg NUMERIC(8,3),\n  largo_cm NUMERIC(8,2),\n  ancho_cm NUMERIC(8,2),\n  alto_cm NUMERIC(8,2),\n  valor_declarado NUMERIC(10,2),\n  fragil BOOLEAN DEFAULT FALSE,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()\n);\n\n-- Sistema de tarifas\nCREATE TABLE public.zonas_tarifarias (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  nombre TEXT NOT NULL,\n  descripcion TEXT,\n  precio_base_0_5kg NUMERIC(10,2) NOT NULL DEFAULT 0,\n  precio_base_5_10kg NUMERIC(10,2) NOT NULL DEFAULT 0,\n  precio_base_10_15kg NUMERIC(10,2) NOT NULL DEFAULT 0,\n  precio_base_15_20kg NUMERIC(10,2) NOT NULL DEFAULT 0,\n  precio_base_20_25kg NUMERIC(10,2) NOT NULL DEFAULT 0,\n  multiplicador NUMERIC(3,2) NOT NULL DEFAULT 1.0,\n  activo BOOLEAN NOT NULL DEFAULT TRUE,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()\n);\n\nCREATE TABLE public.matriz_provincias_zonas (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  provincia_origen TEXT NOT NULL,\n  provincia_destino TEXT NOT NULL,\n  zona_id UUID REFERENCES public.zonas_tarifarias,\n  activo BOOLEAN NOT NULL DEFAULT TRUE,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()\n);\n\nCREATE TABLE public.tarifas (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  provincia_origen TEXT NOT NULL,\n  provincia_destino TEXT NOT NULL,\n  localidad_origen TEXT,\n  localidad_destino TEXT,\n  precio_base NUMERIC(10,2) NOT NULL,\n  precio_por_kg NUMERIC(10,2) DEFAULT 0,\n  precio_por_km NUMERIC(10,2) DEFAULT 0,\n  tiempo_estimado_horas INTEGER DEFAULT 24,\n  activo BOOLEAN DEFAULT TRUE,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()\n);\n\n-- Sistema de seguimiento\nCREATE TABLE public.seguimiento_detallado (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  orden_envio_id UUID REFERENCES public.ordenes_envio,\n  fecha_hora TIMESTAMP WITH TIME ZONE DEFAULT now(),\n  estado TEXT NOT NULL,\n  descripcion TEXT,\n  ubicacion TEXT,\n  transportista_id UUID REFERENCES public.transportistas,\n  observaciones TEXT,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()\n);\n\n-- Sistema de rutas y hojas de ruta\nCREATE TABLE public.hojas_ruta (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  fecha DATE NOT NULL,\n  transportista_id UUID REFERENCES public.transportistas,\n  vehiculo_id UUID,\n  km_inicial NUMERIC(10,2),\n  km_final NUMERIC(10,2),\n  estado TEXT DEFAULT 'planificada',\n  observaciones TEXT,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()\n);\n\nCREATE TABLE public.rutas_paradas (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  ruta_id UUID NOT NULL,\n  orden_parada INTEGER NOT NULL,\n  provincia TEXT NOT NULL,\n  localidad TEXT,\n  tipo_parada TEXT NOT NULL,\n  es_cabecera BOOLEAN DEFAULT FALSE,\n  tiempo_estimado_minutos INTEGER DEFAULT 30,\n  observaciones TEXT,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()\n);\n\nCREATE TABLE public.ordenes_hoja_ruta (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  orden_envio_id UUID REFERENCES public.ordenes_envio,\n  hoja_ruta_id UUID REFERENCES public.hojas_ruta,\n  orden_visita INTEGER NOT NULL,\n  tipo_visita TEXT NOT NULL,\n  hora_planificada TIME,\n  hora_real TIME,\n  completado BOOLEAN DEFAULT FALSE,\n  observaciones TEXT,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()\n);\n\n-- Sistema de incidencias\nCREATE TABLE public.incidencias (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  orden_envio_id UUID REFERENCES public.ordenes_envio,\n  tipo_incidencia TEXT NOT NULL,\n  descripcion TEXT NOT NULL,\n  estado TEXT DEFAULT 'abierta',\n  prioridad TEXT DEFAULT 'media',\n  reportado_por TEXT,\n  asignado_a TEXT,\n  fecha_resolucion TIMESTAMP WITH TIME ZONE,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()\n);\n\n-- Tablas complementarias\nCREATE TABLE public.vehiculos (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  transportista_id UUID REFERENCES public.transportistas,\n  patente TEXT NOT NULL,\n  marca TEXT NOT NULL,\n  modelo TEXT NOT NULL,\n  año INTEGER,\n  tipo_vehiculo TEXT NOT NULL,\n  capacidad_kg NUMERIC(8,2),\n  capacidad_m3 NUMERIC(6,3),\n  activo BOOLEAN DEFAULT TRUE,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()\n);\n\nCREATE TABLE public.transportistas_rutas (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  transportista_id UUID NOT NULL,\n  nombre_ruta TEXT NOT NULL,\n  provincia_origen TEXT NOT NULL,\n  provincia_destino TEXT NOT NULL,\n  localidad_origen TEXT,\n  localidad_destino TEXT,\n  distancia_km NUMERIC(8,2),\n  tiempo_estimado_horas INTEGER DEFAULT 24,\n  activo BOOLEAN DEFAULT TRUE,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()\n);\n\nCREATE TABLE public.transportistas_zonas_cobertura (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  transportista_id UUID NOT NULL,\n  provincia TEXT NOT NULL,\n  localidad TEXT,\n  activo BOOLEAN DEFAULT TRUE,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()\n);\n\nCREATE TABLE public.servicios_transportistas (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  transportista_id UUID NOT NULL,\n  tipo_servicio TEXT NOT NULL,\n  peso_minimo NUMERIC(8,3) NOT NULL DEFAULT 0,\n  peso_maximo NUMERIC(8,3) NOT NULL DEFAULT 5,\n  precio_adicional NUMERIC(10,2) NOT NULL DEFAULT 0,\n  multiplicador NUMERIC(3,2) NOT NULL DEFAULT 1.0,\n  activo BOOLEAN NOT NULL DEFAULT TRUE,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()\n);\n\n-- Sistema de auditoría\nCREATE TABLE public.order_access_logs (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  user_id UUID REFERENCES auth.users,\n  order_id UUID,\n  orden_numero TEXT,\n  access_type TEXT,\n  accessed_fields TEXT[],\n  user_role TEXT,\n  user_agent TEXT,\n  ip_address INET,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()\n);\n\nCREATE TABLE public.sensitive_data_audit (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  user_id UUID REFERENCES auth.users,\n  table_name TEXT NOT NULL,\n  record_id UUID,\n  field_name TEXT NOT NULL,\n  access_type TEXT NOT NULL,\n  access_reason TEXT,\n  ip_address INET,\n  user_agent TEXT,\n  session_duration_minutes INTEGER,\n  approved_by_user_id UUID,\n  approval_timestamp TIMESTAMP WITH TIME ZONE,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()\n);\n\n-- Habilitar RLS en todas las tablas\nALTER TABLE public.paquetes ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.zonas_tarifarias ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.matriz_provincias_zonas ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.tarifas ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.seguimiento_detallado ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.hojas_ruta ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.rutas_paradas ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.ordenes_hoja_ruta ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.incidencias ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.vehiculos ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.transportistas_rutas ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.transportistas_zonas_cobertura ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.servicios_transportistas ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.order_access_logs ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.sensitive_data_audit ENABLE ROW LEVEL SECURITY;",
    
    "-- Migración 6: Funciones de utilidad y seguridad del sistema PuntoEnvío\n-- Función para verificar roles\nCREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)\nRETURNS BOOLEAN AS $$\nBEGIN\n  RETURN EXISTS (\n    SELECT 1 FROM public.user_roles\n    WHERE user_id = _user_id AND role = _role\n  );\nEND;\n$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;\n\n-- Función para obtener rol de usuario\nCREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)\nRETURNS app_role AS $$\nBEGIN\n  RETURN (SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1);\nEND;\n$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;\n\n-- Función para manejo de nuevos usuarios\nCREATE OR REPLACE FUNCTION public.handle_new_user()\nRETURNS TRIGGER AS $$\nBEGIN\n  INSERT INTO public.profiles (user_id, email, nombre)\n  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data ->> 'nombre', ''));\n  \n  INSERT INTO public.user_roles (user_id, role)\n  VALUES (NEW.id, 'USER'::app_role);\n  \n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';\n\n-- Trigger para nuevos usuarios\nCREATE TRIGGER on_auth_user_created\n  AFTER INSERT ON auth.users\n  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();\n\n-- Función para actualizar timestamps\nCREATE OR REPLACE FUNCTION public.update_updated_at_column()\nRETURNS TRIGGER AS $$\nBEGIN\n  NEW.updated_at = NOW();\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;\n\n-- Función pública para obtener seguimiento\nCREATE OR REPLACE FUNCTION public.get_tracking_info(order_number TEXT)\nRETURNS TABLE(\n  fecha_hora TIMESTAMP WITH TIME ZONE,\n  estado TEXT,\n  descripcion TEXT,\n  ubicacion TEXT\n) AS $$\nBEGIN\n  RETURN QUERY\n  SELECT s.fecha_hora, s.estado, s.descripcion, s.ubicacion\n  FROM public.seguimiento_detallado s\n  JOIN public.ordenes_envio o ON s.orden_envio_id = o.id\n  WHERE o.numero_orden = order_number\n  ORDER BY s.fecha_hora DESC;\nEND;\n$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';\n\n-- Función para información pública de órdenes\nCREATE OR REPLACE FUNCTION public.get_order_public_info(order_number TEXT)\nRETURNS TABLE(\n  numero_orden TEXT,\n  estado TEXT,\n  remitente_nombre_publico TEXT,\n  destinatario_nombre_publico TEXT,\n  remitente_localidad TEXT,\n  destinatario_localidad TEXT,\n  created_at TIMESTAMP WITH TIME ZONE\n) AS $$\nBEGIN\n  RETURN QUERY\n  SELECT o.numero_orden, o.estado,\n    split_part(o.remitente_nombre, ' ', 1) as remitente_nombre_publico,\n    split_part(o.destinatario_nombre, ' ', 1) as destinatario_nombre_publico,\n    o.remitente_localidad, o.destinatario_localidad, o.created_at\n  FROM public.ordenes_envio o\n  WHERE o.numero_orden = order_number;\nEND;\n$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';"
  ],
  "modifications": {
    "src/App.tsx": {
      "imports": [
        "import { Toaster } from '@/components/ui/toaster';",
        "import { Toaster as Sonner } from '@/components/ui/sonner';",
        "import { TooltipProvider } from '@/components/ui/tooltip';",
        "import { QueryClient, QueryClientProvider } from '@tanstack/react-query';",
        "import { BrowserRouter, Routes, Route } from 'react-router-dom';",
        "import Layout from '@/components/layout/Layout';",
        "import HomeLayout from '@/components/layout/HomeLayout';",
        "import ProtectedRoute from '@/components/ProtectedRoute';",
        "import { AuthProvider } from '@/contexts/AuthContext';"
      ],
      "routes": [
        "<Route path='/' element={<HomeLayout><Index /></HomeLayout>} />",
        "<Route path='/auth' element={<Auth />} />",
        "<Route path='/cotizador' element={<ProtectedRoute><Layout><Cotizador /></Layout></ProtectedRoute>} />",
        "<Route path='/crear-orden' element={<ProtectedRoute><Layout><CrearOrden /></Layout></ProtectedRoute>} />",
        "<Route path='/ordenes' element={<ProtectedRoute><Layout><Ordenes /></Layout></ProtectedRoute>} />",
        "<Route path='/seguimiento' element={<Layout><Seguimiento /></Layout>} />",
        "<Route path='/transportistas' element={<ProtectedRoute requireAdmin><Layout><Transportistas /></Layout></ProtectedRoute>} />",
        "<Route path='/agencias' element={<ProtectedRoute requireAdmin><Layout><Agencias /></Layout></ProtectedRoute>} />",
        "<Route path='/tarifas' element={<ProtectedRoute><Layout><Tarifas /></Layout></ProtectedRoute>} />",
        "<Route path='/hojas-ruta' element={<ProtectedRoute requireAdmin><Layout><HojasRuta /></Layout></ProtectedRoute>} />",
        "<Route path='/incidencias' element={<ProtectedRoute><Layout><Incidencias /></Layout></ProtectedRoute>} />",
        "<Route path='/admin' element={<ProtectedRoute requireAdmin><Layout><Admin /></Layout></ProtectedRoute>} />",
        "<Route path='/admin/usuarios' element={<ProtectedRoute requireSuperAdmin><Layout><AdminUsuarios /></Layout></ProtectedRoute>} />",
        "<Route path='/admin/reportes' element={<ProtectedRoute requireAdmin><Layout><AdminReportes /></Layout></ProtectedRoute>} />",
        "<Route path='/admin/configuracion' element={<ProtectedRoute requireSuperAdmin><Layout><AdminConfiguracion /></Layout></ProtectedRoute>} />"
      ]
    }
  },
  "featureFlags": [
    {
      "key": "SECURITY_AUDIT_ENABLED",
      "value": "true",
      "scope": "global"
    },
    {
      "key": "ADVANCED_REPORTING",
      "value": "true",
      "scope": "admin"
    },
    {
      "key": "REAL_TIME_TRACKING",
      "value": "true",
      "scope": "global"
    },
    {
      "key": "MULTI_AGENCY_SUPPORT",
      "value": "true",
      "scope": "global"
    },
    {
      "key": "PDF_REPORTS",
      "value": "true",
      "scope": "admin"
    }
  ],
  "instructions": [
    "1. Ejecutar todas las migraciones de base de datos en orden secuencial (1-6)",
    "2. Instalar todas las dependencias NPM listadas usando: npm install",
    "3. Configurar las variables de entorno de Supabase en el archivo .env.local",
    "4. Verificar que la configuración de RLS esté correcta en todas las tablas",
    "5. Configurar los permisos de roles de usuario (USER, OPERADOR_AGENCIA, ADMIN_AGENCIA, SUPERADMIN, TRANSPORTISTA_LOCAL, TRANSPORTISTA_LD)",
    "6. Verificar el trigger para auto-generación de números de orden",
    "7. Probar la funcionalidad de seguimiento público con get_tracking_info()",
    "8. Configurar el sistema de auditoría de acceso a datos sensibles",
    "9. Verificar todas las funciones de seguridad y autenticación",
    "10. Probar el sistema completo de gestión de envíos",
    "11. Configurar backup y monitoreo de la base de datos",
    "12. Establecer políticas RLS para todos los roles y tablas",
    "13. Verificar la funcionalidad de reportes PDF",
    "14. Probar el sistema de cotización automática",
    "15. Configurar notificaciones y alertas del sistema"
  ]
}, null, 2);

// Función para copiar al portapapeles
export function copyToClipboard() {
  navigator.clipboard.writeText(FULL_EXPORT_JSON)
    .then(() => console.log('JSON copiado al portapapeles'))
    .catch(err => console.error('Error copiando:', err));
}

// Función para descargar como archivo
export function downloadJson() {
  const blob = new Blob([FULL_EXPORT_JSON], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'puntoenvio-export-complete.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

console.log('🚚 PuntoEnvío Export JSON generado:', FULL_EXPORT_JSON.length, 'caracteres');