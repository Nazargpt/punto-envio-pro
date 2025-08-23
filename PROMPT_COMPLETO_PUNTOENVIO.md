# PROMPT COMPLETO PARA RECREAR SISTEMA PUNTOENVÍO

## INSTRUCCIONES PARA EL AI RECEPTOR

**IMPORTANTE**: Este prompt contiene TODA la información para recrear completamente el sistema PuntoEnvío. Debes seguir estos pasos EN ORDEN y NO omitir ningún archivo ni configuración.

### PASO 1: CONFIGURACIÓN INICIAL
1. Crear proyecto React + TypeScript + Vite + Tailwind CSS
2. Conectar a Supabase (usa las credenciales que te proporcionen)
3. Instalar todas las dependencias listadas abajo
4. Crear TODOS los archivos en el orden especificado

### PASO 2: DEPENDENCIAS NPM EXACTAS
```json
{
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
```

### PASO 3: CONFIGURACIÓN DE SUPABASE
#### Base de Datos - Ejecutar estas migraciones EN ORDEN:

```sql
-- 1. Crear enum para roles
CREATE TYPE public.app_role AS ENUM ('SUPERADMIN', 'ADMIN_AGENCIA', 'OPERADOR_AGENCIA', 'TRANSPORTISTA_LOCAL', 'TRANSPORTISTA_LD');

-- 2. Función de seguridad para roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 3. Tabla user_roles
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    agencia_id uuid,
    created_at timestamp with time zone DEFAULT now()
);

-- 4. RLS para user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Superadmin can manage all roles" ON public.user_roles
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- 5. Tabla profiles
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL UNIQUE,
    nombre text,
    email text,
    agencia_id uuid,
    activo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 6. RLS para profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "SUPERADMIN can manage all profiles" ON public.profiles
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role))
WITH CHECK (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- 7. Tabla provincias
CREATE TABLE public.provincias (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre text NOT NULL,
    codigo text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.provincias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view provincias" ON public.provincias
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Public can create provincias" ON public.provincias
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Public can update provincias" ON public.provincias
FOR UPDATE TO authenticated
USING (true);

-- 8. Tabla localidades
CREATE TABLE public.localidades (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre text NOT NULL,
    provincia_id uuid NOT NULL,
    codigo_postal text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.localidades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view localidades" ON public.localidades
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Public can create localidades" ON public.localidades
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Public can update localidades" ON public.localidades
FOR UPDATE TO authenticated
USING (true);

-- 9. Tabla agencias
CREATE TABLE public.agencias (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre text NOT NULL,
    direccion text,
    localidad text,
    provincia text,
    contacto jsonb,
    tipo_parada boolean DEFAULT false,
    activo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.agencias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view agencias" ON public.agencias
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Only admins can manage agencias" ON public.agencias
FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE POLICY "Only admins can update agencias" ON public.agencias
FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE POLICY "Only superadmin can delete agencias" ON public.agencias
FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- 10. Tabla transportistas
CREATE TABLE public.transportistas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre text NOT NULL,
    apellido text NOT NULL,
    documento text NOT NULL,
    telefono text,
    email text,
    licencia_conducir text,
    fecha_vencimiento_licencia date,
    tipo_transportista text DEFAULT 'local'::text NOT NULL,
    nombre_empresa text,
    calificacion numeric DEFAULT 5.0,
    activo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.transportistas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view transportistas" ON public.transportistas
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role) OR has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role));

CREATE POLICY "Only admins can create transportistas" ON public.transportistas
FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE POLICY "Only admins can update transportistas" ON public.transportistas
FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE POLICY "Only superadmins can delete transportistas" ON public.transportistas
FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- 11. Tabla vehiculos
CREATE TABLE public.vehiculos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    transportista_id uuid,
    patente text NOT NULL,
    marca text NOT NULL,
    modelo text NOT NULL,
    año integer,
    tipo_vehiculo text NOT NULL,
    capacidad_kg numeric,
    capacidad_m3 numeric,
    activo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.vehiculos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view vehiculos" ON public.vehiculos
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role) OR has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role));

CREATE POLICY "Only admins can create vehiculos" ON public.vehiculos
FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE POLICY "Only admins can update vehiculos" ON public.vehiculos
FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE POLICY "Only superadmins can delete vehiculos" ON public.vehiculos
FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- 12. Tabla ordenes_envio
CREATE TABLE public.ordenes_envio (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_orden text NOT NULL,
    usuario_creacion_id uuid NOT NULL,
    remitente_nombre text NOT NULL,
    remitente_documento text NOT NULL,
    remitente_domicilio text NOT NULL,
    remitente_localidad text NOT NULL,
    remitente_provincia text NOT NULL,
    destinatario_nombre text NOT NULL,
    destinatario_documento text NOT NULL,
    destinatario_domicilio text NOT NULL,
    destinatario_localidad text NOT NULL,
    destinatario_provincia text NOT NULL,
    tipo_recoleccion text NOT NULL,
    fecha_recoleccion date,
    hora_recoleccion time,
    agencia_origen_id uuid,
    tipo_entrega text NOT NULL,
    fecha_entrega date,
    hora_entrega time,
    agencia_destino_id uuid,
    transportista_id uuid,
    estado text DEFAULT 'pendiente'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.ordenes_envio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Secure order view policy" ON public.ordenes_envio
FOR SELECT TO authenticated
USING ((auth.uid() = usuario_creacion_id) OR has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE POLICY "Secure order creation policy" ON public.ordenes_envio
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = usuario_creacion_id);

CREATE POLICY "Secure order update policy" ON public.ordenes_envio
FOR UPDATE TO authenticated
USING ((auth.uid() = usuario_creacion_id) OR has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE POLICY "Secure order delete policy" ON public.ordenes_envio
FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- 13. Tabla paquetes
CREATE TABLE public.paquetes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    orden_envio_id uuid,
    descripcion text NOT NULL,
    peso_kg numeric,
    largo_cm numeric,
    ancho_cm numeric,
    alto_cm numeric,
    valor_declarado numeric,
    fragil boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.paquetes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view related paquetes" ON public.paquetes
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role) OR has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role) OR has_role(auth.uid(), 'TRANSPORTISTA_LOCAL'::app_role) OR has_role(auth.uid(), 'TRANSPORTISTA_LD'::app_role) OR (EXISTS ( SELECT 1 FROM ordenes_envio o WHERE ((o.id = paquetes.orden_envio_id) AND (o.usuario_creacion_id = auth.uid())))));

CREATE POLICY "Users can create paquetes for their orders" ON public.paquetes
FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role) OR has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role) OR (EXISTS ( SELECT 1 FROM ordenes_envio o WHERE ((o.id = paquetes.orden_envio_id) AND (o.usuario_creacion_id = auth.uid())))));

CREATE POLICY "Users can update paquetes for their orders" ON public.paquetes
FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role) OR has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role) OR (EXISTS ( SELECT 1 FROM ordenes_envio o WHERE ((o.id = paquetes.orden_envio_id) AND (o.usuario_creacion_id = auth.uid())))));

CREATE POLICY "Only superadmins can delete paquetes" ON public.paquetes
FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- 14. Tabla seguimiento_detallado
CREATE TABLE public.seguimiento_detallado (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    orden_envio_id uuid,
    fecha_hora timestamp with time zone DEFAULT now(),
    estado text NOT NULL,
    ubicacion text,
    descripcion text,
    transportista_id uuid,
    observaciones text,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.seguimiento_detallado ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Secure tracking view policy" ON public.seguimiento_detallado
FOR SELECT TO authenticated
USING (EXISTS ( SELECT 1 FROM ordenes_envio o WHERE ((o.id = seguimiento_detallado.orden_envio_id) AND ((o.usuario_creacion_id = auth.uid()) OR has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role)))));

CREATE POLICY "Secure tracking insert policy" ON public.seguimiento_detallado
FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role) OR has_role(auth.uid(), 'TRANSPORTISTA_LOCAL'::app_role) OR has_role(auth.uid(), 'TRANSPORTISTA_LD'::app_role));

CREATE POLICY "Secure tracking update policy" ON public.seguimiento_detallado
FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE POLICY "Secure tracking delete policy" ON public.seguimiento_detallado
FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- 15. Tabla tarifas
CREATE TABLE public.tarifas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    provincia_origen text NOT NULL,
    localidad_origen text,
    provincia_destino text NOT NULL,
    localidad_destino text,
    precio_base numeric NOT NULL,
    precio_por_kg numeric DEFAULT 0,
    precio_por_km numeric DEFAULT 0,
    tiempo_estimado_horas integer DEFAULT 24,
    activo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.tarifas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only authenticated users can view tarifas" ON public.tarifas
FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can create tarifas" ON public.tarifas
FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE POLICY "Only admins can update tarifas" ON public.tarifas
FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE POLICY "Only superadmins can delete tarifas" ON public.tarifas
FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- 16. Tabla incidencias
CREATE TABLE public.incidencias (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    orden_envio_id uuid,
    tipo_incidencia text NOT NULL,
    descripcion text NOT NULL,
    estado text DEFAULT 'abierta'::text,
    prioridad text DEFAULT 'media'::text,
    reportado_por text,
    asignado_a text,
    fecha_resolucion timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.incidencias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view incidencias" ON public.incidencias
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create incidencias" ON public.incidencias
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Only admins can update incidencias" ON public.incidencias
FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE POLICY "Only superadmins can delete incidencias" ON public.incidencias
FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- 17. Tabla hojas_ruta
CREATE TABLE public.hojas_ruta (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    fecha date NOT NULL,
    transportista_id uuid,
    vehiculo_id uuid,
    km_inicial numeric,
    km_final numeric,
    estado text DEFAULT 'planificada'::text,
    observaciones text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.hojas_ruta ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view hojas_ruta" ON public.hojas_ruta
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Only admins can manage hojas_ruta" ON public.hojas_ruta
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- 18. Tabla ordenes_hoja_ruta
CREATE TABLE public.ordenes_hoja_ruta (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    hoja_ruta_id uuid,
    orden_envio_id uuid,
    tipo_visita text NOT NULL,
    orden_visita integer NOT NULL,
    hora_planificada time,
    hora_real time,
    completado boolean DEFAULT false,
    observaciones text,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.ordenes_hoja_ruta ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only authenticated users can view ordenes_hoja_ruta" ON public.ordenes_hoja_ruta
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role) OR has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role) OR has_role(auth.uid(), 'TRANSPORTISTA_LOCAL'::app_role) OR has_role(auth.uid(), 'TRANSPORTISTA_LD'::app_role));

CREATE POLICY "Only admins can create ordenes_hoja_ruta" ON public.ordenes_hoja_ruta
FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role) OR has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role));

CREATE POLICY "Only admins can update ordenes_hoja_ruta" ON public.ordenes_hoja_ruta
FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role) OR has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role));

CREATE POLICY "Only superadmins can delete ordenes_hoja_ruta" ON public.ordenes_hoja_ruta
FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- 19. Tablas adicionales de tarifas y zonas
CREATE TABLE public.zonas_tarifarias (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre text NOT NULL,
    descripcion text,
    precio_base_0_5kg numeric DEFAULT 0 NOT NULL,
    precio_base_5_10kg numeric DEFAULT 0 NOT NULL,
    precio_base_10_15kg numeric DEFAULT 0 NOT NULL,
    precio_base_15_20kg numeric DEFAULT 0 NOT NULL,
    precio_base_20_25kg numeric DEFAULT 0 NOT NULL,
    multiplicador numeric DEFAULT 1.0 NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.zonas_tarifarias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Solo administradores pueden ver zonas_tarifarias" ON public.zonas_tarifarias
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role) OR has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role));

CREATE POLICY "Solo administradores pueden crear zonas_tarifarias" ON public.zonas_tarifarias
FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE POLICY "Solo administradores pueden actualizar zonas_tarifarias" ON public.zonas_tarifarias
FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE POLICY "Solo superadministradores pueden eliminar zonas_tarifarias" ON public.zonas_tarifarias
FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- 20. Matriz provincias zonas
CREATE TABLE public.matriz_provincias_zonas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    provincia_origen text NOT NULL,
    provincia_destino text NOT NULL,
    zona_id uuid,
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.matriz_provincias_zonas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Solo administradores pueden ver matriz_provincias_zonas" ON public.matriz_provincias_zonas
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role) OR has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role));

CREATE POLICY "Solo administradores pueden crear matriz_provincias_zonas" ON public.matriz_provincias_zonas
FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE POLICY "Solo administradores pueden actualizar matriz_provincias_zonas" ON public.matriz_provincias_zonas
FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE POLICY "Solo superadministradores pueden eliminar matriz_provincias_zon" ON public.matriz_provincias_zonas
FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- 21. Transportistas rutas y servicios
CREATE TABLE public.transportistas_rutas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    transportista_id uuid NOT NULL,
    nombre_ruta text NOT NULL,
    provincia_origen text NOT NULL,
    localidad_origen text,
    provincia_destino text NOT NULL,
    localidad_destino text,
    distancia_km numeric,
    tiempo_estimado_horas integer DEFAULT 24,
    activo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.transportistas_rutas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view transportistas_rutas" ON public.transportistas_rutas
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role) OR has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role));

CREATE POLICY "Only admins can create transportistas_rutas" ON public.transportistas_rutas
FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE POLICY "Only admins can update transportistas_rutas" ON public.transportistas_rutas
FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE POLICY "Only superadmins can delete transportistas_rutas" ON public.transportistas_rutas
FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE TABLE public.transportistas_zonas_cobertura (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    transportista_id uuid NOT NULL,
    provincia text NOT NULL,
    localidad text,
    activo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.transportistas_zonas_cobertura ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view transportistas_zonas_cobertura" ON public.transportistas_zonas_cobertura
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role) OR has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role));

CREATE POLICY "Only admins can create transportistas_zonas_cobertura" ON public.transportistas_zonas_cobertura
FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE POLICY "Only admins can update transportistas_zonas_cobertura" ON public.transportistas_zonas_cobertura
FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE POLICY "Only superadmins can delete transportistas_zonas_cobertura" ON public.transportistas_zonas_cobertura
FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE TABLE public.servicios_transportistas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    transportista_id uuid NOT NULL,
    tipo_servicio text NOT NULL,
    peso_minimo numeric DEFAULT 0 NOT NULL,
    peso_maximo numeric DEFAULT 5 NOT NULL,
    precio_adicional numeric DEFAULT 0 NOT NULL,
    multiplicador numeric DEFAULT 1.0 NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.servicios_transportistas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view servicios_transportistas" ON public.servicios_transportistas
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role) OR has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role));

CREATE POLICY "Only admins can create servicios_transportistas" ON public.servicios_transportistas
FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE POLICY "Only admins can update servicios_transportistas" ON public.servicios_transportistas
FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE POLICY "Only superadmins can delete servicios_transportistas" ON public.servicios_transportistas
FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE TABLE public.rutas_paradas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ruta_id uuid NOT NULL,
    orden_parada integer NOT NULL,
    tipo_parada text NOT NULL,
    provincia text NOT NULL,
    localidad text,
    es_cabecera boolean DEFAULT false,
    tiempo_estimado_minutos integer DEFAULT 30,
    observaciones text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.rutas_paradas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only authenticated users can view rutas_paradas" ON public.rutas_paradas
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role) OR has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role) OR has_role(auth.uid(), 'TRANSPORTISTA_LOCAL'::app_role) OR has_role(auth.uid(), 'TRANSPORTISTA_LD'::app_role));

CREATE POLICY "Only admins can create rutas_paradas" ON public.rutas_paradas
FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role) OR has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role));

CREATE POLICY "Only admins can update rutas_paradas" ON public.rutas_paradas
FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role) OR has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role));

CREATE POLICY "Only superadmins can delete rutas_paradas" ON public.rutas_paradas
FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- 22. Tablas de auditoría
CREATE TABLE public.order_access_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    order_id uuid,
    orden_numero text,
    access_type text,
    accessed_fields text[],
    user_role text,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.order_access_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Secure audit log access policy" ON public.order_access_logs
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE TABLE public.sensitive_data_audit (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    record_id uuid,
    table_name text NOT NULL,
    field_name text NOT NULL,
    access_type text NOT NULL,
    access_reason text,
    approved_by_user_id uuid,
    approval_timestamp timestamp with time zone,
    session_duration_minutes integer,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.sensitive_data_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only superadmins can view sensitive audit logs" ON public.sensitive_data_audit
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- 23. Triggers para timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas que tienen updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_agencias_updated_at BEFORE UPDATE ON public.agencias FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_transportistas_updated_at BEFORE UPDATE ON public.transportistas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vehiculos_updated_at BEFORE UPDATE ON public.vehiculos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ordenes_envio_updated_at BEFORE UPDATE ON public.ordenes_envio FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tarifas_updated_at BEFORE UPDATE ON public.tarifas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_incidencias_updated_at BEFORE UPDATE ON public.incidencias FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hojas_ruta_updated_at BEFORE UPDATE ON public.hojas_ruta FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_transportistas_rutas_updated_at BEFORE UPDATE ON public.transportistas_rutas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_transportistas_zonas_cobertura_updated_at BEFORE UPDATE ON public.transportistas_zonas_cobertura FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_servicios_transportistas_updated_at BEFORE UPDATE ON public.servicios_transportistas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_zonas_tarifarias_updated_at BEFORE UPDATE ON public.zonas_tarifarias FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_matriz_provincias_zonas_updated_at BEFORE UPDATE ON public.matriz_provincias_zonas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_rutas_paradas_updated_at BEFORE UPDATE ON public.rutas_paradas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_provincias_updated_at BEFORE UPDATE ON public.provincias FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_localidades_updated_at BEFORE UPDATE ON public.localidades FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 24. Tabla temporal para testing (se puede eliminar en producción)
CREATE TABLE public."puntoenvio tabla" (
    id bigint PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
```

### PASO 4: CONFIGURACIÓN DE ARCHIVOS PRINCIPALES

#### tailwind.config.ts
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
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
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "fade-out": {
          "0%": {
            opacity: "1",
            transform: "translateY(0)"
          },
          "100%": {
            opacity: "0",
            transform: "translateY(10px)"
          }
        },
        "scale-in": {
          "0%": {
            transform: "scale(0.95)",
            opacity: "0"
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1"
          }
        },
        "scale-out": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.95)", opacity: "0" }
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" }
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "scale-out": "scale-out 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-out-right": "slide-out-right 0.3s ease-out",
        "enter": "fade-in 0.3s ease-out, scale-in 0.2s ease-out",
        "exit": "fade-out 0.3s ease-out, scale-out 0.2s ease-out"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
```

#### src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
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
    --radius: 0.5rem;
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
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@layer utilities {
  .story-link {
    @apply relative inline-block after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left;
  }
  
  .hover-scale {
    @apply transition-transform duration-200 hover:scale-105;
  }
}
```

#### src/lib/utils.ts
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

#### src/integrations/supabase/client.ts
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://zyowxsfzfuunjlufxqik.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5b3d4c2Z6ZnV1bmpsdWZ4cWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5OTY2MTYsImV4cCI6MjA3MDU3MjYxNn0.uRaFrjITY4tZLVkU9Et3WrpxXMkR03Pqjq_Mg9zOW3s"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### PASO 5: CREAR TODOS LOS COMPONENTES UI (SHADCN)

**IMPORTANTE**: Debes crear TODOS estos componentes UI con su contenido exacto. No los voy a incluir completos aquí por espacio, pero están en el proyecto original. Créalos usando shadcn o copia el contenido exacto de:

- src/components/ui/button.tsx
- src/components/ui/card.tsx
- src/components/ui/input.tsx
- src/components/ui/label.tsx
- src/components/ui/form.tsx
- src/components/ui/dialog.tsx
- src/components/ui/table.tsx
- src/components/ui/tabs.tsx
- src/components/ui/toast.tsx
- src/components/ui/toaster.tsx
- src/components/ui/use-toast.ts
- src/components/ui/select.tsx
- src/components/ui/textarea.tsx
- src/components/ui/badge.tsx
- src/components/ui/alert.tsx
- src/components/ui/alert-dialog.tsx
- src/components/ui/dropdown-menu.tsx
- src/components/ui/popover.tsx
- src/components/ui/calendar.tsx
- src/components/ui/progress.tsx
- src/components/ui/separator.tsx
- src/components/ui/scroll-area.tsx
- src/components/ui/accordion.tsx
- src/components/ui/avatar.tsx
- src/components/ui/checkbox.tsx
- src/components/ui/radio-group.tsx
- src/components/ui/switch.tsx
- src/components/ui/slider.tsx
- src/components/ui/tooltip.tsx
- src/components/ui/hover-card.tsx
- src/components/ui/menubar.tsx
- src/components/ui/navigation-menu.tsx
- src/components/ui/sheet.tsx
- src/components/ui/sidebar.tsx
- src/components/ui/skeleton.tsx
- src/components/ui/toggle.tsx
- src/components/ui/toggle-group.tsx
- src/components/ui/carousel.tsx
- src/components/ui/collapsible.tsx
- src/components/ui/command.tsx
- src/components/ui/context-menu.tsx
- src/components/ui/drawer.tsx
- src/components/ui/input-otp.tsx
- src/components/ui/pagination.tsx
- src/components/ui/resizable.tsx
- src/components/ui/sonner.tsx
- src/components/ui/chart.tsx
- src/components/ui/aspect-ratio.tsx
- src/components/ui/breadcrumb.tsx

### PASO 6: CONTEXTO DE AUTENTICACIÓN

#### src/contexts/AuthContext.tsx
```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, nombre?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const role = await fetchUserRole(session.user.id);
          setUserRole(role);
        } else {
          setUserRole(null);
        }
        
        setLoading(false);
      }
    );

    // Check if there's an existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserRole(session.user.id).then(setUserRole);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }

      return data?.role || null;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, nombre?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (!error && data.user && nombre) {
      // Create profile
      await supabase
        .from('profiles')
        .insert([
          {
            user_id: data.user.id,
            email,
            nombre,
          },
        ]);
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const isAdmin = () => {
    return userRole === 'ADMIN_AGENCIA' || userRole === 'SUPERADMIN';
  };

  const isSuperAdmin = () => {
    return userRole === 'SUPERADMIN';
  };

  const value = {
    user,
    session,
    userRole,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isSuperAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

### PASO 7: HOOK DE TOAST

#### src/hooks/use-toast.ts
```typescript
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
```

### PASO 8: COMPONENTE PRINCIPAL APP

#### src/App.tsx
```typescript
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import ProtectedRoute from '@/components/ProtectedRoute';

// Pages
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Cotizador from '@/pages/Cotizador';
import CrearOrden from '@/pages/CrearOrden';
import Ordenes from '@/pages/Ordenes';
import Seguimiento from '@/pages/Seguimiento';
import Transportistas from '@/pages/Transportistas';
import Agencias from '@/pages/Agencias';
import Tarifas from '@/pages/Tarifas';
import HojasRuta from '@/pages/HojasRuta';
import Incidencias from '@/pages/Incidencias';
import Admin from '@/pages/Admin';
import AdminUsuarios from '@/pages/AdminUsuarios';
import AdminReportes from '@/pages/AdminReportes';
import AdminTarifario from '@/pages/AdminTarifario';
import AdminConfiguracion from '@/pages/AdminConfiguracion';
import ProjectExporter from '@/pages/ProjectExporter';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cotizador"
                element={
                  <ProtectedRoute>
                    <Cotizador />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/crear-orden"
                element={
                  <ProtectedRoute>
                    <CrearOrden />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ordenes"
                element={
                  <ProtectedRoute>
                    <Ordenes />
                  </ProtectedRoute>
                }
              />
              <Route path="/seguimiento" element={<Seguimiento />} />
              <Route
                path="/transportistas"
                element={
                  <ProtectedRoute requireAdmin>
                    <Transportistas />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agencias"
                element={
                  <ProtectedRoute requireAdmin>
                    <Agencias />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tarifas"
                element={
                  <ProtectedRoute requireAdmin>
                    <Tarifas />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hojas-ruta"
                element={
                  <ProtectedRoute requireAdmin>
                    <HojasRuta />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/incidencias"
                element={
                  <ProtectedRoute>
                    <Incidencias />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/usuarios"
                element={
                  <ProtectedRoute requireSuperAdmin>
                    <AdminUsuarios />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reportes"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminReportes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/tarifario"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminTarifario />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/configuracion"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminConfiguracion />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/project-exporter"
                element={
                  <ProtectedRoute requireAdmin>
                    <ProjectExporter />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <SonnerToaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
```

### PASO 9: MAIN.TSX

#### src/main.tsx
```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### PASO 10: TODAS LAS PÁGINAS

**IMPORTANTE**: Ahora debes crear TODAS las páginas con su funcionalidad completa. Por límites de espacio, te doy las más importantes:

#### src/pages/Index.tsx
```typescript
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Package, Truck, MapPin, Users, BarChart3, Shield } from 'lucide-react';
import HomeLayout from '@/components/layout/HomeLayout';

const Index = () => {
  return (
    <HomeLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 px-6 bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                Sistema Integral de
                <span className="text-primary block">Gestión Logística</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Plataforma completa para gestionar envíos, transportistas, agencias y rutas. 
                Optimiza tu operación logística con tecnología avanzada.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="px-8">
                  <Link to="/auth">
                    Comenzar Ahora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/seguimiento">
                    Seguir Envío
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Funcionalidades Principales
              </h2>
              <p className="text-xl text-muted-foreground">
                Todo lo que necesitas para gestionar tu operación logística
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Package className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Gestión de Órdenes</CardTitle>
                  <CardDescription>
                    Crea, gestiona y rastrea órdenes de envío de forma eficiente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Creación rápida de órdenes</li>
                    <li>• Seguimiento en tiempo real</li>
                    <li>• Gestión de paquetes</li>
                    <li>• Estados automáticos</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Truck className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Transportistas</CardTitle>
                  <CardDescription>
                    Administra tu flota de transportistas y vehículos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Registro de transportistas</li>
                    <li>• Gestión de vehículos</li>
                    <li>• Zonas de cobertura</li>
                    <li>• Servicios y tarifas</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <MapPin className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Hojas de Ruta</CardTitle>
                  <CardDescription>
                    Planifica y optimiza las rutas de entrega
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Planificación de rutas</li>
                    <li>• Asignación automática</li>
                    <li>• Seguimiento de vehículos</li>
                    <li>• Optimización de tiempos</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Users className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Gestión de Agencias</CardTitle>
                  <CardDescription>
                    Administra sucursales y puntos de distribución
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Red de agencias</li>
                    <li>• Gestión de usuarios</li>
                    <li>• Roles y permisos</li>
                    <li>• Configuración local</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <BarChart3 className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Reportes y Analytics</CardTitle>
                  <CardDescription>
                    Análisis detallado del rendimiento operacional
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Dashboards interactivos</li>
                    <li>• Métricas en tiempo real</li>
                    <li>• Reportes personalizados</li>
                    <li>• Análisis de tendencias</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Shield className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Seguridad y Control</CardTitle>
                  <CardDescription>
                    Sistema robusto de seguridad y auditoría
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Autenticación segura</li>
                    <li>• Control de acceso</li>
                    <li>• Auditoría completa</li>
                    <li>• Respaldo de datos</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-primary/5">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Listo para optimizar tu logística?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Únete a empresas que ya confían en PuntoEnvío para gestionar sus operaciones
            </p>
            <Button asChild size="lg" className="px-8">
              <Link to="/auth">
                Empezar Gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </HomeLayout>
  );
};

export default Index;
```

### PASO 11: CONTINÚA CREANDO TODAS LAS PÁGINAS RESTANTES

Debes crear TODOS estos archivos con el contenido completo:

- src/pages/Auth.tsx (formulario de login/registro)
- src/pages/Dashboard.tsx (dashboard principal)
- src/pages/Cotizador.tsx (cotizador de envíos)
- src/pages/CrearOrden.tsx (formulario crear orden)
- src/pages/Ordenes.tsx (listado de órdenes)
- src/pages/Seguimiento.tsx (seguimiento público)
- src/pages/Transportistas.tsx (gestión transportistas)
- src/pages/Agencias.tsx (gestión agencias)
- src/pages/Tarifas.tsx (configuración tarifas)
- src/pages/HojasRuta.tsx (planificación rutas)
- src/pages/Incidencias.tsx (gestión incidencias)
- src/pages/Admin.tsx (panel admin)
- src/pages/AdminUsuarios.tsx (gestión usuarios)
- src/pages/AdminReportes.tsx (reportes)
- src/pages/AdminTarifario.tsx (tarifario)
- src/pages/AdminConfiguracion.tsx (configuración)
- src/pages/ProjectExporter.tsx (exportador)
- src/pages/NotFound.tsx (404)

### PASO 12: COMPONENTES LAYOUT

#### src/components/layout/HomeLayout.tsx
#### src/components/layout/Layout.tsx
#### src/components/layout/AppHeader.tsx
#### src/components/layout/Footer.tsx

### PASO 13: COMPONENTES DE FORMULARIOS

Crear TODOS los componentes en src/components/forms/:
- AgenciaDetalles.tsx
- CrearAgenciaForm.tsx
- CrearTransportistaForm.tsx
- EditarAgenciaForm.tsx
- EditarTransportistaForm.tsx
- TransportistaForm.tsx
- VerPerfilTransportista.tsx

### PASO 14: COMPONENTES ADICIONALES

Crear todos los componentes restantes en:
- src/components/admin/
- src/components/users/
- src/components/pdf/
- src/hooks/
- src/utils/

### PASO 15: CONFIGURACIONES FINALES

#### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

#### index.html
```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PuntoEnvío - Sistema de Gestión Logística</title>
    <meta name="description" content="Sistema integral de gestión logística para empresas de transporte y envíos. Administra órdenes, transportistas, rutas y más.">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## INSTRUCCIONES FINALES

1. **CREAR EXACTAMENTE COMO ESTÁ**: No cambies nombres, estructura ni funcionalidad
2. **ORDEN IMPORTANTE**: Sigue el orden de los pasos
3. **CONFIGURAR SUPABASE**: Conecta con tus credenciales y ejecuta TODAS las migraciones
4. **VERIFICAR PERMISOS**: Asegúrate de que RLS funcione correctamente
5. **CREAR USUARIO INICIAL**: Registra un usuario y asígnale rol SUPERADMIN en la tabla user_roles
6. **PROBAR FUNCIONALIDADES**: Verifica que todo funcione correctamente

### USUARIOS DE PRUEBA
Una vez completado, crear usuarios con estos roles:
- SUPERADMIN: Acceso total
- ADMIN_AGENCIA: Gestión de agencia
- OPERADOR_AGENCIA: Operaciones básicas
- TRANSPORTISTA_LOCAL: Acceso limitado transportista
- TRANSPORTISTA_LD: Acceso limitado transportista LD

**¡EL SISTEMA DEBE QUEDAR IDÉNTICO AL ORIGINAL!**
