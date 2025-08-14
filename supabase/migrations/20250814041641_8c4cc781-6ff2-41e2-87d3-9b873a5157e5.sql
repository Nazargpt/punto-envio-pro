-- Fix the security definer view issue
-- Remove the problematic view and replace with a secure function

-- Drop the problematic view
DROP VIEW IF EXISTS public.transportistas_public;

-- Create a secure function instead of a view for getting basic transportista info
CREATE OR REPLACE FUNCTION public.get_transportistas_basic()
RETURNS TABLE (
  id uuid,
  nombre text,
  apellido text,
  tipo_transportista text,
  activo boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    t.id,
    t.nombre,
    t.apellido,
    t.tipo_transportista,
    t.activo,
    t.created_at,
    t.updated_at
  FROM public.transportistas t
  WHERE t.activo = true
  ORDER BY t.nombre, t.apellido;
$$;