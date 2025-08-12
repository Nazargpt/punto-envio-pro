-- Crear función para generar número de orden automático
CREATE OR REPLACE FUNCTION public.generate_orden_number()
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql;

-- Crear trigger para auto-generar número de orden
CREATE OR REPLACE FUNCTION public.set_orden_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.numero_orden IS NULL OR NEW.numero_orden = '' THEN
        NEW.numero_orden := public.generate_orden_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger en la tabla ordenes_envio
DROP TRIGGER IF EXISTS trigger_set_orden_number ON public.ordenes_envio;
CREATE TRIGGER trigger_set_orden_number
    BEFORE INSERT ON public.ordenes_envio
    FOR EACH ROW
    EXECUTE FUNCTION public.set_orden_number();