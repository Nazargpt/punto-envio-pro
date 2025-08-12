-- Make date and time fields nullable in ordenes_envio table
ALTER TABLE public.ordenes_envio 
ALTER COLUMN fecha_recoleccion DROP NOT NULL,
ALTER COLUMN hora_recoleccion DROP NOT NULL,
ALTER COLUMN fecha_entrega DROP NOT NULL,
ALTER COLUMN hora_entrega DROP NOT NULL;