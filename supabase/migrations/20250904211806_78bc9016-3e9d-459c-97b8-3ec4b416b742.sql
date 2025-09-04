-- Add field to store route stop assignment for agencies
ALTER TABLE public.agencias 
ADD COLUMN ruta_parada_id uuid REFERENCES public.rutas_paradas(id);