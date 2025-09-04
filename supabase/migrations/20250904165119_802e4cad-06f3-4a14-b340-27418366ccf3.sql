-- Add photo tracking system for packages
CREATE TABLE public.hoja_ruta_fotos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    hoja_ruta_id UUID REFERENCES public.hojas_ruta(id) ON DELETE CASCADE,
    orden_envio_id UUID REFERENCES public.ordenes_envio(id) ON DELETE CASCADE,
    foto_url TEXT NOT NULL,
    tipo_foto TEXT NOT NULL CHECK (tipo_foto IN ('recogida_origen', 'entrega_deposito_ld', 'recogida_deposito_ld', 'entrega_destino')),
    tomada_por_user_id UUID NOT NULL,
    ubicacion_gps POINT,
    observaciones TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add roadmap associations for tracking between local and long-distance carriers
CREATE TABLE public.hojas_ruta_asociaciones (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    hoja_ruta_local_origen_id UUID REFERENCES public.hojas_ruta(id) ON DELETE CASCADE,
    hoja_ruta_larga_distancia_id UUID REFERENCES public.hojas_ruta(id) ON DELETE CASCADE,
    hoja_ruta_local_destino_id UUID REFERENCES public.hojas_ruta(id) ON DELETE CASCADE,
    estado_asociacion TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado_asociacion IN ('pendiente', 'confirmada', 'en_transito', 'completada')),
    fecha_entrega_deposito TIMESTAMP WITH TIME ZONE,
    fecha_recogida_deposito TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add more granular states to orders tracking
ALTER TABLE public.ordenes_envio 
ADD COLUMN estado_detallado TEXT DEFAULT 'pendiente' CHECK (estado_detallado IN (
    'pendiente', 
    'asignada_transportista_local_origen',
    'recogida_por_transportista_local_origen',
    'en_deposito_larga_distancia',
    'recogida_por_transportista_larga_distancia',
    'en_transito_larga_distancia',
    'entregada_deposito_destino',
    'recogida_por_transportista_local_destino',
    'en_ruta_entrega_final',
    'entregada_agencia_destino',
    'completada'
));

-- Add route type to differentiate local origin, long distance, and local destination routes
ALTER TABLE public.hojas_ruta 
ADD COLUMN tipo_ruta TEXT NOT NULL DEFAULT 'local_origen' CHECK (tipo_ruta IN ('local_origen', 'larga_distancia', 'local_destino'));

-- Add deposit/warehouse information for long-distance carriers
ALTER TABLE public.hojas_ruta 
ADD COLUMN deposito_origen TEXT,
ADD COLUMN deposito_destino TEXT,
ADD COLUMN codigo_seguimiento TEXT UNIQUE;

-- Function to generate unique tracking codes
CREATE OR REPLACE FUNCTION public.generate_hoja_ruta_codigo()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    year_part TEXT;
    sequence_num INT;
    formatted_num TEXT;
BEGIN
    year_part := EXTRACT(year FROM CURRENT_DATE)::TEXT;
    
    SELECT COUNT(*) + 1 INTO sequence_num
    FROM public.hojas_ruta
    WHERE EXTRACT(year FROM created_at) = EXTRACT(year FROM CURRENT_DATE);
    
    formatted_num := LPAD(sequence_num::TEXT, 6, '0');
    
    RETURN 'HR-' || year_part || '-' || formatted_num;
END;
$$;

-- Trigger to auto-generate tracking codes
CREATE OR REPLACE FUNCTION public.set_hoja_ruta_codigo()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF NEW.codigo_seguimiento IS NULL OR NEW.codigo_seguimiento = '' THEN
        NEW.codigo_seguimiento := public.generate_hoja_ruta_codigo();
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_hoja_ruta_codigo_trigger
    BEFORE INSERT ON public.hojas_ruta
    FOR EACH ROW
    EXECUTE FUNCTION public.set_hoja_ruta_codigo();

-- Function to automatically generate roadmaps for an agency
CREATE OR REPLACE FUNCTION public.generar_hojas_ruta_agencia(p_agencia_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    orden_record RECORD;
    transportista_local_origen RECORD;
    transportista_larga_distancia RECORD;
    transportista_local_destino RECORD;
    hoja_ruta_local_origen_id UUID;
    hoja_ruta_larga_distancia_id UUID;
    hoja_ruta_local_destino_id UUID;
    asociacion_id UUID;
    result JSON;
    hojas_creadas INT := 0;
BEGIN
    -- Check if user has permission
    IF NOT (
        has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR
        has_role(auth.uid(), 'SUPERADMIN'::app_role)
    ) THEN
        RAISE EXCEPTION 'Access denied: insufficient privileges';
    END IF;

    -- Process pending orders from the agency
    FOR orden_record IN 
        SELECT o.* 
        FROM public.ordenes_envio o 
        WHERE o.agencia_origen_id = p_agencia_id 
        AND o.estado = 'pendiente'
        AND o.estado_detallado = 'pendiente'
    LOOP
        -- Find local origin transporter
        SELECT t.* INTO transportista_local_origen
        FROM public.transportistas t
        JOIN public.transportistas_zonas_cobertura tzc ON t.id = tzc.transportista_id
        WHERE t.tipo_transportista = 'local'
        AND t.activo = true
        AND tzc.provincia = orden_record.remitente_provincia
        AND (tzc.localidad IS NULL OR tzc.localidad = orden_record.remitente_localidad)
        LIMIT 1;

        -- Find long-distance transporter
        SELECT t.* INTO transportista_larga_distancia
        FROM public.transportistas t
        JOIN public.transportistas_rutas tr ON t.id = tr.transportista_id
        WHERE t.tipo_transportista = 'larga_distancia'
        AND t.activo = true
        AND tr.provincia_origen = orden_record.remitente_provincia
        AND tr.provincia_destino = orden_record.destinatario_provincia
        AND tr.activo = true
        LIMIT 1;

        -- Find local destination transporter
        SELECT t.* INTO transportista_local_destino
        FROM public.transportistas t
        JOIN public.transportistas_zonas_cobertura tzc ON t.id = tzc.transportista_id
        WHERE t.tipo_transportista = 'local'
        AND t.activo = true
        AND tzc.provincia = orden_record.destinatario_provincia
        AND (tzc.localidad IS NULL OR tzc.localidad = orden_record.destinatario_localidad)
        LIMIT 1;

        -- Create roadmaps if transporters are found
        IF transportista_local_origen.id IS NOT NULL AND 
           transportista_larga_distancia.id IS NOT NULL AND 
           transportista_local_destino.id IS NOT NULL THEN

            -- Create local origin roadmap
            INSERT INTO public.hojas_ruta (
                transportista_id, fecha, tipo_ruta, estado, observaciones
            ) VALUES (
                transportista_local_origen.id, 
                CURRENT_DATE, 
                'local_origen', 
                'planificada',
                'Recogida en origen para orden ' || orden_record.numero_orden
            ) RETURNING id INTO hoja_ruta_local_origen_id;

            -- Create long-distance roadmap
            INSERT INTO public.hojas_ruta (
                transportista_id, fecha, tipo_ruta, estado, observaciones,
                deposito_origen, deposito_destino
            ) VALUES (
                transportista_larga_distancia.id, 
                CURRENT_DATE, 
                'larga_distancia', 
                'planificada',
                'Transporte larga distancia para orden ' || orden_record.numero_orden,
                orden_record.remitente_localidad || ', ' || orden_record.remitente_provincia,
                orden_record.destinatario_localidad || ', ' || orden_record.destinatario_provincia
            ) RETURNING id INTO hoja_ruta_larga_distancia_id;

            -- Create local destination roadmap
            INSERT INTO public.hojas_ruta (
                transportista_id, fecha, tipo_ruta, estado, observaciones
            ) VALUES (
                transportista_local_destino.id, 
                CURRENT_DATE, 
                'local_destino', 
                'planificada',
                'Entrega final para orden ' || orden_record.numero_orden
            ) RETURNING id INTO hoja_ruta_local_destino_id;

            -- Create association between roadmaps
            INSERT INTO public.hojas_ruta_asociaciones (
                hoja_ruta_local_origen_id,
                hoja_ruta_larga_distancia_id,
                hoja_ruta_local_destino_id,
                estado_asociacion
            ) VALUES (
                hoja_ruta_local_origen_id,
                hoja_ruta_larga_distancia_id,
                hoja_ruta_local_destino_id,
                'pendiente'
            ) RETURNING id INTO asociacion_id;

            -- Add orders to roadmaps
            INSERT INTO public.ordenes_hoja_ruta (
                hoja_ruta_id, orden_envio_id, orden_visita, tipo_visita
            ) VALUES 
                (hoja_ruta_local_origen_id, orden_record.id, 1, 'recogida'),
                (hoja_ruta_larga_distancia_id, orden_record.id, 1, 'transporte'),
                (hoja_ruta_local_destino_id, orden_record.id, 1, 'entrega');

            -- Update order status
            UPDATE public.ordenes_envio 
            SET estado = 'asignada', estado_detallado = 'asignada_transportista_local_origen'
            WHERE id = orden_record.id;

            hojas_creadas := hojas_creadas + 1;
        END IF;
    END LOOP;

    result := json_build_object(
        'success', true,
        'hojas_creadas', hojas_creadas,
        'message', 'Se generaron ' || hojas_creadas || ' hojas de ruta exitosamente'
    );

    RETURN result;
END;
$$;

-- Enable RLS on new tables
ALTER TABLE public.hoja_ruta_fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hojas_ruta_asociaciones ENABLE ROW LEVEL SECURITY;

-- RLS policies for photos
CREATE POLICY "Users can view roadmap photos they have access to" 
ON public.hoja_ruta_fotos 
FOR SELECT 
USING (
    has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR
    has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
    has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role) OR
    tomada_por_user_id = auth.uid()
);

CREATE POLICY "Transporters can upload photos for their roadmaps" 
ON public.hoja_ruta_fotos 
FOR INSERT 
WITH CHECK (
    has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR
    has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
    EXISTS (
        SELECT 1 FROM public.hojas_ruta hr 
        JOIN public.transportistas t ON hr.transportista_id = t.id
        WHERE hr.id = hoja_ruta_id
    )
);

-- RLS policies for associations
CREATE POLICY "Users can view roadmap associations" 
ON public.hojas_ruta_asociaciones 
FOR SELECT 
USING (
    has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR
    has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
    has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role)
);

CREATE POLICY "Only admins can manage roadmap associations" 
ON public.hojas_ruta_asociaciones 
FOR ALL 
USING (
    has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR
    has_role(auth.uid(), 'SUPERADMIN'::app_role)
);

-- Add triggers for updated_at
CREATE TRIGGER update_hojas_ruta_asociaciones_updated_at
BEFORE UPDATE ON public.hojas_ruta_asociaciones
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();