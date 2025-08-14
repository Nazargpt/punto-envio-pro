-- Fix the security definer view issue and create audit logging functions
-- Remove the problematic view and create secure functions instead

-- Drop the view that was flagged as security definer
DROP VIEW IF EXISTS public.ordenes_envio_public;

-- Create a secure function for limited order search for customer service
CREATE OR REPLACE FUNCTION public.search_orders_limited(
  search_term text,
  search_type text DEFAULT 'numero_orden'
)
RETURNS TABLE (
  numero_orden text,
  estado text,
  remitente_nombre_parcial text,
  destinatario_nombre_parcial text,
  remitente_localidad text,
  destinatario_localidad text,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only allow access to users with appropriate roles
  IF NOT (
    has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role) OR
    has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
    has_role(auth.uid(), 'SUPERADMIN'::app_role)
  ) THEN
    RAISE EXCEPTION 'Access denied: insufficient privileges';
  END IF;

  RETURN QUERY
  SELECT 
    o.numero_orden,
    o.estado,
    split_part(o.remitente_nombre, ' ', 1) || ' ' || 
    CASE WHEN length(split_part(o.remitente_nombre, ' ', 2)) > 0 
         THEN left(split_part(o.remitente_nombre, ' ', 2), 1) || '.' 
         ELSE '' END as remitente_nombre_parcial,
    split_part(o.destinatario_nombre, ' ', 1) || ' ' || 
    CASE WHEN length(split_part(o.destinatario_nombre, ' ', 2)) > 0 
         THEN left(split_part(o.destinatario_nombre, ' ', 2), 1) || '.' 
         ELSE '' END as destinatario_nombre_parcial,
    o.remitente_localidad,
    o.destinatario_localidad,
    o.created_at
  FROM public.ordenes_envio o
  WHERE 
    CASE 
      WHEN search_type = 'numero_orden' THEN o.numero_orden ILIKE '%' || search_term || '%'
      WHEN search_type = 'remitente_localidad' THEN o.remitente_localidad ILIKE '%' || search_term || '%'
      WHEN search_type = 'destinatario_localidad' THEN o.destinatario_localidad ILIKE '%' || search_term || '%'
      ELSE false
    END
  ORDER BY o.created_at DESC
  LIMIT 50;
END;
$$;

-- Create function to log sensitive data access
CREATE OR REPLACE FUNCTION public.log_order_access(
  p_order_id uuid,
  p_orden_numero text,
  p_access_type text,
  p_accessed_fields text[] DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_role_val text;
BEGIN
  -- Get user role
  SELECT role INTO user_role_val 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1;

  -- Insert audit log
  INSERT INTO public.order_access_logs (
    user_id,
    order_id,
    orden_numero,
    access_type,
    accessed_fields,
    user_role,
    created_at
  ) VALUES (
    auth.uid(),
    p_order_id,
    p_orden_numero,
    p_access_type,
    p_accessed_fields,
    COALESCE(user_role_val, 'USER'),
    now()
  );
END;
$$;

-- Create a function to get sanitized order info for public tracking
CREATE OR REPLACE FUNCTION public.get_order_public_info(order_number text)
RETURNS TABLE (
  numero_orden text,
  estado text,
  remitente_nombre_publico text,
  destinatario_nombre_publico text,
  remitente_localidad text,
  destinatario_localidad text,
  created_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    o.numero_orden,
    o.estado,
    split_part(o.remitente_nombre, ' ', 1) as remitente_nombre_publico,
    split_part(o.destinatario_nombre, ' ', 1) as destinatario_nombre_publico,
    o.remitente_localidad,
    o.destinatario_localidad,
    o.created_at
  FROM public.ordenes_envio o
  WHERE o.numero_orden = order_number;
$$;