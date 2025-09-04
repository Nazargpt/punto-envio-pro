-- Create function to get route stops for agency assignment
CREATE OR REPLACE FUNCTION public.get_route_stops_for_agency()
RETURNS TABLE(
  id uuid,
  provincia text,
  localidad text,
  tipo_parada text,
  nombre_ruta text,
  transportista_empresa text,
  ruta_id uuid
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT 
    rp.id,
    rp.provincia,
    rp.localidad,
    rp.tipo_parada,
    tr.nombre_ruta,
    t.nombre_empresa,
    tr.id as ruta_id
  FROM public.rutas_paradas rp
  JOIN public.transportistas_rutas tr ON rp.ruta_id = tr.id
  JOIN public.transportistas t ON tr.transportista_id = t.id
  WHERE t.tipo_transportista = 'larga_distancia'
  AND t.activo = true
  AND tr.activo = true
  ORDER BY rp.provincia, rp.localidad, tr.nombre_ruta;
$function$