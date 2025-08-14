-- Crear tabla para paradas en rutas de larga distancia
CREATE TABLE public.rutas_paradas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ruta_id UUID NOT NULL REFERENCES public.transportistas_rutas(id) ON DELETE CASCADE,
  orden_parada INTEGER NOT NULL,
  provincia TEXT NOT NULL,
  localidad TEXT,
  tipo_parada TEXT NOT NULL CHECK (tipo_parada IN ('pasada', 'trasbordo')),
  es_cabecera BOOLEAN DEFAULT false,
  observaciones TEXT,
  tiempo_estimado_minutos INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.rutas_paradas ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS
CREATE POLICY "Public can view rutas_paradas" 
ON public.rutas_paradas 
FOR SELECT 
USING (true);

CREATE POLICY "Public can create rutas_paradas" 
ON public.rutas_paradas 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can update rutas_paradas" 
ON public.rutas_paradas 
FOR UPDATE 
USING (true);

CREATE POLICY "Public can delete rutas_paradas" 
ON public.rutas_paradas 
FOR DELETE 
USING (true);

-- Crear trigger para actualizar updated_at
CREATE TRIGGER update_rutas_paradas_updated_at
BEFORE UPDATE ON public.rutas_paradas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Crear índices
CREATE INDEX idx_rutas_paradas_ruta_id ON public.rutas_paradas(ruta_id);
CREATE INDEX idx_rutas_paradas_orden ON public.rutas_paradas(ruta_id, orden_parada);