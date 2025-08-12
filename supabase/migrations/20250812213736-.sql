-- Create table for transportista services pricing
CREATE TABLE public.servicios_transportistas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transportista_id UUID NOT NULL,
  tipo_servicio TEXT NOT NULL CHECK (tipo_servicio IN ('retiro_domicilio', 'entrega_domicilio', 'entrega_agencia_origen', 'retiro_agencia_destino')),
  peso_minimo NUMERIC NOT NULL DEFAULT 0,
  peso_maximo NUMERIC NOT NULL DEFAULT 5,
  precio_adicional NUMERIC NOT NULL DEFAULT 0,
  multiplicador NUMERIC NOT NULL DEFAULT 1.0,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraint
ALTER TABLE public.servicios_transportistas 
ADD CONSTRAINT servicios_transportistas_transportista_id_fkey 
FOREIGN KEY (transportista_id) REFERENCES public.transportistas(id) ON DELETE CASCADE;

-- Create unique constraint to prevent duplicate service/weight combinations per transportista
ALTER TABLE public.servicios_transportistas 
ADD CONSTRAINT servicios_transportistas_unique_service_weight 
UNIQUE (transportista_id, tipo_servicio, peso_minimo, peso_maximo);

-- Enable RLS
ALTER TABLE public.servicios_transportistas ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public can view servicios_transportistas" 
ON public.servicios_transportistas 
FOR SELECT 
USING (true);

CREATE POLICY "Public can create servicios_transportistas" 
ON public.servicios_transportistas 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can update servicios_transportistas" 
ON public.servicios_transportistas 
FOR UPDATE 
USING (true);

CREATE POLICY "Public can delete servicios_transportistas" 
ON public.servicios_transportistas 
FOR DELETE 
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_servicios_transportistas_updated_at
BEFORE UPDATE ON public.servicios_transportistas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO public.servicios_transportistas (transportista_id, tipo_servicio, peso_minimo, peso_maximo, precio_adicional, multiplicador) VALUES
-- Assuming we have a transportista with a known ID, we'll use a placeholder for now
((SELECT id FROM public.transportistas LIMIT 1), 'retiro_domicilio', 0, 5, 500, 1.0),
((SELECT id FROM public.transportistas LIMIT 1), 'retiro_domicilio', 5, 10, 750, 1.0),
((SELECT id FROM public.transportistas LIMIT 1), 'retiro_domicilio', 10, 15, 1000, 1.0),
((SELECT id FROM public.transportistas LIMIT 1), 'retiro_domicilio', 15, 20, 1250, 1.0),
((SELECT id FROM public.transportistas LIMIT 1), 'retiro_domicilio', 20, 25, 1500, 1.0),
((SELECT id FROM public.transportistas LIMIT 1), 'entrega_domicilio', 0, 5, 600, 1.0),
((SELECT id FROM public.transportistas LIMIT 1), 'entrega_domicilio', 5, 10, 850, 1.0),
((SELECT id FROM public.transportistas LIMIT 1), 'entrega_domicilio', 10, 15, 1100, 1.0),
((SELECT id FROM public.transportistas LIMIT 1), 'entrega_domicilio', 15, 20, 1350, 1.0),
((SELECT id FROM public.transportistas LIMIT 1), 'entrega_domicilio', 20, 25, 1600, 1.0),
((SELECT id FROM public.transportistas LIMIT 1), 'entrega_agencia_origen', 0, 5, 200, 1.0),
((SELECT id FROM public.transportistas LIMIT 1), 'entrega_agencia_origen', 5, 10, 300, 1.0),
((SELECT id FROM public.transportistas LIMIT 1), 'entrega_agencia_origen', 10, 15, 400, 1.0),
((SELECT id FROM public.transportistas LIMIT 1), 'entrega_agencia_origen', 15, 20, 500, 1.0),
((SELECT id FROM public.transportistas LIMIT 1), 'entrega_agencia_origen', 20, 25, 600, 1.0),
((SELECT id FROM public.transportistas LIMIT 1), 'retiro_agencia_destino', 0, 5, 250, 1.0),
((SELECT id FROM public.transportistas LIMIT 1), 'retiro_agencia_destino', 5, 10, 350, 1.0),
((SELECT id FROM public.transportistas LIMIT 1), 'retiro_agencia_destino', 10, 15, 450, 1.0),
((SELECT id FROM public.transportistas LIMIT 1), 'retiro_agencia_destino', 15, 20, 550, 1.0),
((SELECT id FROM public.transportistas LIMIT 1), 'retiro_agencia_destino', 20, 25, 650, 1.0);