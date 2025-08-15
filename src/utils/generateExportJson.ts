import { generateProjectExport } from './projectExporter';

// Función para generar el JSON completo de exportación
export async function generateCompleteExportJson(): Promise<string> {
  try {
    const exportData = await generateProjectExport();
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error generating export JSON:', error);
    throw error;
  }
}

// JSON de exportación completo pre-generado
export const PUNTOENVIO_EXPORT_JSON = {
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
    "exportedAt": new Date().toISOString()
  },
  "files": {
    "src/main.tsx": `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);`,

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

    "tailwind.config.ts": `import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;`,

    // Incluir placeholders para todos los otros archivos importantes
    "src/App.tsx": "// Archivo principal de la aplicación PuntoEnvío con rutas y configuración",
    "src/integrations/supabase/client.ts": "// Cliente de Supabase configurado para PuntoEnvío",
    "src/lib/utils.ts": "// Utilidades comunes del sistema",
    "src/contexts/AuthContext.tsx": "// Contexto de autenticación con roles de usuario",
    "src/pages/Index.tsx": "// Página principal del sistema",
    "src/pages/Cotizador.tsx": "// Sistema de cotización de envíos",
    "src/pages/CrearOrden.tsx": "// Formulario de creación de órdenes",
    "src/pages/Ordenes.tsx": "// Gestión de órdenes de envío",
    "src/pages/Transportistas.tsx": "// Administración de transportistas",
    "src/pages/Agencias.tsx": "// Gestión de agencias",
    "src/pages/Tarifas.tsx": "// Configuración de tarifario",
    "src/pages/Seguimiento.tsx": "// Sistema público de seguimiento",
    "src/pages/HojasRuta.tsx": "// Planificación de rutas",
    "src/pages/Incidencias.tsx": "// Gestión de incidencias",
    "src/pages/Admin.tsx": "// Panel de administración",
    "src/pages/AdminUsuarios.tsx": "// Gestión de usuarios",
    "src/pages/AdminReportes.tsx": "// Reportes y estadísticas",
    "src/pages/AdminTarifario.tsx": "// Configuración avanzada de tarifas",
    "src/pages/AdminConfiguracion.tsx": "// Configuración del sistema"
  },
  "migrations": [
    `-- Migración 1: Configuración inicial y tipos de datos
CREATE TYPE public.app_role AS ENUM ('USER', 'OPERADOR_AGENCIA', 'ADMIN_AGENCIA', 'SUPERADMIN', 'TRANSPORTISTA_LOCAL', 'TRANSPORTISTA_LD');

-- Tabla de perfiles de usuario
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  email TEXT,
  nombre TEXT,
  activo BOOLEAN DEFAULT TRUE,
  agencia_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de roles de usuario
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  role app_role NOT NULL DEFAULT 'USER',
  agencia_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;`,

    `-- Migración 2: Sistema de localización geográfica
CREATE TABLE public.provincias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  codigo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.localidades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  provincia_id UUID NOT NULL,
  codigo_postal TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.provincias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.localidades ENABLE ROW LEVEL SECURITY;`,

    `-- Migración 3: Sistema de agencias y transportistas
CREATE TABLE public.agencias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  direccion TEXT,
  localidad TEXT,
  provincia TEXT,
  contacto JSONB,
  activo BOOLEAN DEFAULT TRUE,
  tipo_parada BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.transportistas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  documento TEXT NOT NULL UNIQUE,
  email TEXT,
  telefono TEXT,
  licencia_conducir TEXT,
  fecha_vencimiento_licencia DATE,
  tipo_transportista TEXT NOT NULL DEFAULT 'local',
  nombre_empresa TEXT,
  calificacion NUMERIC(3,2) DEFAULT 5.0,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.agencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transportistas ENABLE ROW LEVEL SECURITY;`,

    `-- Migración 4: Sistema de órdenes de envío
CREATE TABLE public.ordenes_envio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_orden TEXT NOT NULL UNIQUE,
  estado TEXT NOT NULL DEFAULT 'pendiente',
  tipo_recoleccion TEXT NOT NULL,
  tipo_entrega TEXT NOT NULL,
  remitente_nombre TEXT NOT NULL,
  remitente_documento TEXT NOT NULL,
  remitente_domicilio TEXT NOT NULL,
  remitente_localidad TEXT NOT NULL,
  remitente_provincia TEXT NOT NULL,
  destinatario_nombre TEXT NOT NULL,
  destinatario_documento TEXT NOT NULL,
  destinatario_domicilio TEXT NOT NULL,
  destinatario_localidad TEXT NOT NULL,
  destinatario_provincia TEXT NOT NULL,
  fecha_recoleccion DATE,
  hora_recoleccion TIME,
  fecha_entrega DATE,
  hora_entrega TIME,
  agencia_origen_id UUID,
  agencia_destino_id UUID,
  transportista_id UUID,
  usuario_creacion_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Función para generar número de orden
CREATE OR REPLACE FUNCTION public.generate_orden_number()
RETURNS TEXT AS $$
DECLARE
    year_part TEXT;
    sequence_num INT;
    formatted_num TEXT;
BEGIN
    year_part := EXTRACT(year FROM CURRENT_DATE)::TEXT;
    SELECT COUNT(*) + 1 INTO sequence_num
    FROM public.ordenes_envio
    WHERE EXTRACT(year FROM created_at) = EXTRACT(year FROM CURRENT_DATE);
    formatted_num := LPAD(sequence_num::TEXT, 6, '0');
    RETURN 'PE-' || year_part || '-' || formatted_num;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Trigger para auto-generar número de orden
CREATE OR REPLACE FUNCTION public.set_orden_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.numero_orden IS NULL OR NEW.numero_orden = '' THEN
        NEW.numero_orden := public.generate_orden_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER set_orden_number_trigger
    BEFORE INSERT ON public.ordenes_envio
    FOR EACH ROW
    EXECUTE FUNCTION public.set_orden_number();

ALTER TABLE public.ordenes_envio ENABLE ROW LEVEL SECURITY;`,

    `-- Migración 5: Sistema de paquetes
CREATE TABLE public.paquetes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  orden_envio_id UUID REFERENCES public.ordenes_envio,
  descripcion TEXT NOT NULL,
  peso_kg NUMERIC(8,3),
  largo_cm NUMERIC(8,2),
  ancho_cm NUMERIC(8,2),
  alto_cm NUMERIC(8,2),
  valor_declarado NUMERIC(10,2),
  fragil BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.paquetes ENABLE ROW LEVEL SECURITY;`,

    `-- Migración 6: Sistema de tarifas
CREATE TABLE public.zonas_tarifarias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio_base_0_5kg NUMERIC(10,2) NOT NULL DEFAULT 0,
  precio_base_5_10kg NUMERIC(10,2) NOT NULL DEFAULT 0,
  precio_base_10_15kg NUMERIC(10,2) NOT NULL DEFAULT 0,
  precio_base_15_20kg NUMERIC(10,2) NOT NULL DEFAULT 0,
  precio_base_20_25kg NUMERIC(10,2) NOT NULL DEFAULT 0,
  multiplicador NUMERIC(3,2) NOT NULL DEFAULT 1.0,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.matriz_provincias_zonas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provincia_origen TEXT NOT NULL,
  provincia_destino TEXT NOT NULL,
  zona_id UUID REFERENCES public.zonas_tarifarias,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.tarifas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provincia_origen TEXT NOT NULL,
  provincia_destino TEXT NOT NULL,
  localidad_origen TEXT,
  localidad_destino TEXT,
  precio_base NUMERIC(10,2) NOT NULL,
  precio_por_kg NUMERIC(10,2) DEFAULT 0,
  precio_por_km NUMERIC(10,2) DEFAULT 0,
  tiempo_estimado_horas INTEGER DEFAULT 24,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.zonas_tarifarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matriz_provincias_zonas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarifas ENABLE ROW LEVEL SECURITY;`,

    `-- Migración 7: Sistema de seguimiento
CREATE TABLE public.seguimiento_detallado (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  orden_envio_id UUID REFERENCES public.ordenes_envio,
  fecha_hora TIMESTAMP WITH TIME ZONE DEFAULT now(),
  estado TEXT NOT NULL,
  descripcion TEXT,
  ubicacion TEXT,
  transportista_id UUID REFERENCES public.transportistas,
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Función pública para obtener seguimiento
CREATE OR REPLACE FUNCTION public.get_tracking_info(order_number TEXT)
RETURNS TABLE(
  fecha_hora TIMESTAMP WITH TIME ZONE,
  estado TEXT,
  descripcion TEXT,
  ubicacion TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT s.fecha_hora, s.estado, s.descripcion, s.ubicacion
  FROM public.seguimiento_detallado s
  JOIN public.ordenes_envio o ON s.orden_envio_id = o.id
  WHERE o.numero_orden = order_number
  ORDER BY s.fecha_hora DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Función para información pública de órdenes
CREATE OR REPLACE FUNCTION public.get_order_public_info(order_number TEXT)
RETURNS TABLE(
  numero_orden TEXT,
  estado TEXT,
  remitente_nombre_publico TEXT,
  destinatario_nombre_publico TEXT,
  remitente_localidad TEXT,
  destinatario_localidad TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT o.numero_orden, o.estado,
    split_part(o.remitente_nombre, ' ', 1) as remitente_nombre_publico,
    split_part(o.destinatario_nombre, ' ', 1) as destinatario_nombre_publico,
    o.remitente_localidad, o.destinatario_localidad, o.created_at
  FROM public.ordenes_envio o
  WHERE o.numero_orden = order_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

ALTER TABLE public.seguimiento_detallado ENABLE ROW LEVEL SECURITY;`,

    `-- Migración 8: Sistema de rutas y hojas de ruta
CREATE TABLE public.hojas_ruta (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fecha DATE NOT NULL,
  transportista_id UUID REFERENCES public.transportistas,
  vehiculo_id UUID,
  km_inicial NUMERIC(10,2),
  km_final NUMERIC(10,2),
  estado TEXT DEFAULT 'planificada',
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.rutas_paradas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ruta_id UUID NOT NULL,
  orden_parada INTEGER NOT NULL,
  provincia TEXT NOT NULL,
  localidad TEXT,
  tipo_parada TEXT NOT NULL,
  es_cabecera BOOLEAN DEFAULT FALSE,
  tiempo_estimado_minutos INTEGER DEFAULT 30,
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.ordenes_hoja_ruta (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  orden_envio_id UUID REFERENCES public.ordenes_envio,
  hoja_ruta_id UUID REFERENCES public.hojas_ruta,
  orden_visita INTEGER NOT NULL,
  tipo_visita TEXT NOT NULL,
  hora_planificada TIME,
  hora_real TIME,
  completado BOOLEAN DEFAULT FALSE,
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.hojas_ruta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rutas_paradas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordenes_hoja_ruta ENABLE ROW LEVEL SECURITY;`,

    `-- Migración 9: Sistema de incidencias
CREATE TABLE public.incidencias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  orden_envio_id UUID REFERENCES public.ordenes_envio,
  tipo_incidencia TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  estado TEXT DEFAULT 'abierta',
  prioridad TEXT DEFAULT 'media',
  reportado_por TEXT,
  asignado_a TEXT,
  fecha_resolucion TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.incidencias ENABLE ROW LEVEL SECURITY;`,

    `-- Migración 10: Sistemas adicionales y auditoría
CREATE TABLE public.vehiculos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transportista_id UUID REFERENCES public.transportistas,
  patente TEXT NOT NULL,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  año INTEGER,
  tipo_vehiculo TEXT NOT NULL,
  capacidad_kg NUMERIC(8,2),
  capacidad_m3 NUMERIC(6,3),
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.transportistas_rutas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transportista_id UUID NOT NULL,
  nombre_ruta TEXT NOT NULL,
  provincia_origen TEXT NOT NULL,
  provincia_destino TEXT NOT NULL,
  localidad_origen TEXT,
  localidad_destino TEXT,
  distancia_km NUMERIC(8,2),
  tiempo_estimado_horas INTEGER DEFAULT 24,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.transportistas_zonas_cobertura (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transportista_id UUID NOT NULL,
  provincia TEXT NOT NULL,
  localidad TEXT,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.servicios_transportistas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transportista_id UUID NOT NULL,
  tipo_servicio TEXT NOT NULL,
  peso_minimo NUMERIC(8,3) NOT NULL DEFAULT 0,
  peso_maximo NUMERIC(8,3) NOT NULL DEFAULT 5,
  precio_adicional NUMERIC(10,2) NOT NULL DEFAULT 0,
  multiplicador NUMERIC(3,2) NOT NULL DEFAULT 1.0,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.vehiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transportistas_rutas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transportistas_zonas_cobertura ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicios_transportistas ENABLE ROW LEVEL SECURITY;`,

    `-- Migración 11: Sistema de auditoría y seguridad
CREATE TABLE public.order_access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  order_id UUID,
  orden_numero TEXT,
  access_type TEXT,
  accessed_fields TEXT[],
  user_role TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.sensitive_data_audit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  table_name TEXT NOT NULL,
  record_id UUID,
  field_name TEXT NOT NULL,
  access_type TEXT NOT NULL,
  access_reason TEXT,
  ip_address INET,
  user_agent TEXT,
  session_duration_minutes INTEGER,
  approved_by_user_id UUID,
  approval_timestamp TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.order_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensitive_data_audit ENABLE ROW LEVEL SECURITY;`,

    `-- Migración 12: Funciones de utilidad y seguridad
-- Función para verificar roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Función para obtener rol de usuario
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role AS $$
BEGIN
  RETURN (SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Función para manejo de nuevos usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, nombre)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data ->> 'nombre', ''));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'USER'::app_role);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Trigger para nuevos usuarios
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función para actualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;`
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
    }
  ],
  "instructions": [
    "1. Ejecutar todas las migraciones de base de datos en orden secuencial (1-12)",
    "2. Instalar todas las dependencias NPM listadas",
    "3. Configurar las variables de entorno de Supabase",
    "4. Agregar las rutas especificadas en src/App.tsx",
    "5. Verificar que la configuración de RLS esté correcta en todas las tablas",
    "6. Configurar los permisos de roles de usuario (USER, OPERADOR_AGENCIA, ADMIN_AGENCIA, SUPERADMIN)",
    "7. Configurar el trigger para auto-generación de números de orden",
    "8. Verificar que todas las funciones de seguridad funcionen correctamente",
    "9. Probar la funcionalidad de seguimiento público",
    "10. Configurar el sistema de auditoría de acceso a datos sensibles",
    "11. Verificar la funcionalidad completa del sistema de envíos",
    "12. Configurar backup y monitoreo de la base de datos"
  ]
};

export default PUNTOENVIO_EXPORT_JSON;