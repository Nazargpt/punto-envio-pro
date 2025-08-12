-- Arreglar funciones con search_path mutable (solo las nuevas que creé)
CREATE OR REPLACE FUNCTION public.generate_orden_number()
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

CREATE OR REPLACE FUNCTION public.set_orden_number()
RETURNS TRIGGER 
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