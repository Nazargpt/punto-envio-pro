-- Crear tabla de órdenes de envío  
CREATE TABLE IF NOT EXISTS public.ordenes_envio (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    numero_orden TEXT UNIQUE NOT NULL DEFAULT 'ORD-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(nextval('public.ordenes_seq')::text, 4, '0'),
    
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

-- Habilitar RLS
ALTER TABLE public.ordenes_envio ENABLE ROW LEVEL SECURITY;

-- Insertar usuario administrador
INSERT INTO public.user_roles (user_id, role)
VALUES ('00000000-0000-0000-0000-000000000001'::uuid, 'SUPERADMIN'::app_role);

-- Políticas de acceso completo para SUPERADMIN
CREATE POLICY "SUPERADMIN can manage all orders" 
ON public.ordenes_envio 
FOR ALL 
TO authenticated 
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role))
WITH CHECK (has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE POLICY "SUPERADMIN can manage all profiles" 
ON public.profiles 
FOR ALL 
TO authenticated 
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role))
WITH CHECK (has_role(auth.uid(), 'SUPERADMIN'::app_role));