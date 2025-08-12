-- Primero, verificamos que existe el tipo app_role y lo creamos si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('SUPERADMIN', 'ADMIN', 'TRANSPORTISTA', 'AGENCIA');
    END IF;
END $$;

-- Creamos una tabla para órdenes de envío
CREATE TABLE IF NOT EXISTS public.ordenes_envio (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    numero_orden TEXT UNIQUE NOT NULL DEFAULT 'ORD-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(nextval('ordenes_seq')::text, 4, '0'),
    
    -- Datos del remitente
    remitente_nombre TEXT NOT NULL,
    remitente_documento TEXT NOT NULL,
    remitente_domicilio TEXT NOT NULL,
    remitente_provincia TEXT NOT NULL,
    remitente_localidad TEXT NOT NULL,
    fecha_recoleccion DATE NOT NULL,
    hora_recoleccion TIME NOT NULL,
    tipo_recoleccion TEXT NOT NULL CHECK (tipo_recoleccion IN ('domicilio', 'agencia')),
    agencia_origen_id UUID REFERENCES public.agencias(id),
    
    -- Datos del destinatario
    destinatario_nombre TEXT NOT NULL,
    destinatario_documento TEXT NOT NULL,
    destinatario_domicilio TEXT NOT NULL,
    destinatario_provincia TEXT NOT NULL,
    destinatario_localidad TEXT NOT NULL,
    fecha_entrega DATE NOT NULL,
    hora_entrega TIME NOT NULL,
    tipo_entrega TEXT NOT NULL CHECK (tipo_entrega IN ('domicilio', 'agencia')),
    agencia_destino_id UUID REFERENCES public.agencias(id),
    
    -- Metadatos
    estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'recolectado', 'en_transito', 'entregado', 'cancelado')),
    usuario_creacion_id UUID NOT NULL,
    transportista_id UUID REFERENCES public.profiles(id),
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear secuencia para números de orden si no existe
CREATE SEQUENCE IF NOT EXISTS ordenes_seq START 1;

-- Habilitar RLS en la tabla de órdenes
ALTER TABLE public.ordenes_envio ENABLE ROW LEVEL SECURITY;

-- Insertar el usuario administrador de desarrollo en user_roles si no existe
INSERT INTO public.user_roles (user_id, role)
VALUES ('dev-admin-123', 'SUPERADMIN'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;

-- Políticas para órdenes de envío - SUPERADMIN tiene acceso completo
CREATE POLICY "SUPERADMIN can manage all orders" 
ON public.ordenes_envio 
FOR ALL 
TO authenticated 
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role))
WITH CHECK (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- Políticas para permitir a otros roles ver sus propias órdenes
CREATE POLICY "Users can view orders they created" 
ON public.ordenes_envio 
FOR SELECT 
TO authenticated 
USING (usuario_creacion_id = auth.uid());

-- Los transportistas pueden ver órdenes asignadas a ellos
CREATE POLICY "Transportistas can view assigned orders" 
ON public.ordenes_envio 
FOR SELECT 
TO authenticated 
USING (transportista_id = auth.uid() AND has_role(auth.uid(), 'TRANSPORTISTA'::app_role));

-- Crear función para actualizar timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_ordenes()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar timestamp automáticamente
CREATE TRIGGER update_ordenes_envio_updated_at
    BEFORE UPDATE ON public.ordenes_envio
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_ordenes();

-- Asegurar que SUPERADMIN tenga acceso completo a profiles
CREATE POLICY "SUPERADMIN can manage all profiles" 
ON public.profiles 
FOR ALL 
TO authenticated 
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role))
WITH CHECK (has_role(auth.uid(), 'SUPERADMIN'::app_role));