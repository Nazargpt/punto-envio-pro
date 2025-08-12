-- Crear tabla de provincias
CREATE TABLE IF NOT EXISTS public.provincias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE,
  codigo TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de localidades
CREATE TABLE IF NOT EXISTS public.localidades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  provincia_id UUID NOT NULL,
  codigo_postal TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(nombre, provincia_id)
);

-- Habilitar RLS en ambas tablas
ALTER TABLE public.provincias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.localidades ENABLE ROW LEVEL SECURITY;

-- Políticas para provincias
CREATE POLICY "Public can view provincias" 
ON public.provincias 
FOR SELECT 
USING (true);

CREATE POLICY "Public can create provincias" 
ON public.provincias 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can update provincias" 
ON public.provincias 
FOR UPDATE 
USING (true);

-- Políticas para localidades
CREATE POLICY "Public can view localidades" 
ON public.localidades 
FOR SELECT 
USING (true);

CREATE POLICY "Public can create localidades" 
ON public.localidades 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can update localidades" 
ON public.localidades 
FOR UPDATE 
USING (true);

-- Insertar provincias argentinas
INSERT INTO public.provincias (nombre, codigo) VALUES
('Buenos Aires', 'BA'),
('Catamarca', 'CT'),
('Chaco', 'CC'),
('Chubut', 'CH'),
('Córdoba', 'CB'),
('Corrientes', 'CR'),
('Entre Ríos', 'ER'),
('Formosa', 'FM'),
('Jujuy', 'JY'),
('La Pampa', 'LP'),
('La Rioja', 'LR'),
('Mendoza', 'MZ'),
('Misiones', 'MN'),
('Neuquén', 'NQ'),
('Río Negro', 'RN'),
('Salta', 'SA'),
('San Juan', 'SJ'),
('San Luis', 'SL'),
('Santa Cruz', 'SC'),
('Santa Fe', 'SF'),
('Santiago del Estero', 'SE'),
('Tierra del Fuego', 'TF'),
('Tucumán', 'TM'),
('Ciudad Autónoma de Buenos Aires', 'CABA')
ON CONFLICT (nombre) DO NOTHING;

-- Crear trigger para actualizar updated_at
CREATE TRIGGER update_provincias_updated_at
BEFORE UPDATE ON public.provincias
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_localidades_updated_at
BEFORE UPDATE ON public.localidades
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();