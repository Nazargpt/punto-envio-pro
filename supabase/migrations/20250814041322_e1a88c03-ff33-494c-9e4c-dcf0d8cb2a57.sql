-- Fix security issues for tarifas table policies
-- Remove anonymous access from tarifas policies

-- Drop the current policy that allows anonymous access
DROP POLICY IF EXISTS "Authenticated users can view tarifas" ON public.tarifas;

-- Create a more restrictive policy that requires authentication
CREATE POLICY "Only authenticated users can view tarifas" 
ON public.tarifas 
FOR SELECT 
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Also fix the function search path issues for the existing functions
-- Update the generate_orden_number function
CREATE OR REPLACE FUNCTION public.generate_orden_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    year_part TEXT;
    sequence_num INT;
    formatted_num TEXT;
BEGIN
    -- Obtener el año actual
    year_part := EXTRACT(year FROM CURRENT_DATE)::TEXT;
    
    -- Contar órdenes del año actual + 1
    SELECT COUNT(*) + 1 INTO sequence_num
    FROM public.ordenes_envio
    WHERE EXTRACT(year FROM created_at) = EXTRACT(year FROM CURRENT_DATE);
    
    -- Formatear el número con padding de ceros
    formatted_num := LPAD(sequence_num::TEXT, 6, '0');
    
    -- Retornar en formato PE-YYYY-NNNNNN
    RETURN 'PE-' || year_part || '-' || formatted_num;
END;
$$;

-- Update the set_orden_number function
CREATE OR REPLACE FUNCTION public.set_orden_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF NEW.numero_orden IS NULL OR NEW.numero_orden = '' THEN
        NEW.numero_orden := public.generate_orden_number();
    END IF;
    RETURN NEW;
END;
$$;