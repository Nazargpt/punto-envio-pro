-- Add tipo_transportista to transportistas table
ALTER TABLE public.transportistas 
ADD COLUMN tipo_transportista text NOT NULL DEFAULT 'local' CHECK (tipo_transportista IN ('local', 'larga_distancia'));

-- Create table for local transporter coverage zones
CREATE TABLE public.transportistas_zonas_cobertura (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transportista_id uuid NOT NULL REFERENCES public.transportistas(id) ON DELETE CASCADE,
  provincia text NOT NULL,
  localidad text,
  activo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create table for long-distance transporter routes
CREATE TABLE public.transportistas_rutas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transportista_id uuid NOT NULL REFERENCES public.transportistas(id) ON DELETE CASCADE,
  nombre_ruta text NOT NULL,
  provincia_origen text NOT NULL,
  localidad_origen text,
  provincia_destino text NOT NULL,
  localidad_destino text,
  tiempo_estimado_horas integer DEFAULT 24,
  distancia_km numeric,
  activo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.transportistas_zonas_cobertura ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transportistas_rutas ENABLE ROW LEVEL SECURITY;

-- Create public policies for new tables
CREATE POLICY "Public can view transportistas_zonas_cobertura" 
ON public.transportistas_zonas_cobertura 
FOR SELECT 
USING (true);

CREATE POLICY "Public can create transportistas_zonas_cobertura" 
ON public.transportistas_zonas_cobertura 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can update transportistas_zonas_cobertura" 
ON public.transportistas_zonas_cobertura 
FOR UPDATE 
USING (true);

CREATE POLICY "Public can delete transportistas_zonas_cobertura" 
ON public.transportistas_zonas_cobertura 
FOR DELETE 
USING (true);

CREATE POLICY "Public can view transportistas_rutas" 
ON public.transportistas_rutas 
FOR SELECT 
USING (true);

CREATE POLICY "Public can create transportistas_rutas" 
ON public.transportistas_rutas 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can update transportistas_rutas" 
ON public.transportistas_rutas 
FOR UPDATE 
USING (true);

CREATE POLICY "Public can delete transportistas_rutas" 
ON public.transportistas_rutas 
FOR DELETE 
USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_transportistas_zonas_cobertura_updated_at
BEFORE UPDATE ON public.transportistas_zonas_cobertura
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transportistas_rutas_updated_at
BEFORE UPDATE ON public.transportistas_rutas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();