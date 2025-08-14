-- Fix security vulnerability: Protect customer personal information in ordenes_envio
-- Implement stricter access controls and data minimization

-- First, let's create a secure view for limited order information
-- This view excludes sensitive personal data like documents and full addresses
CREATE OR REPLACE VIEW public.ordenes_envio_public AS
SELECT 
  id,
  numero_orden,
  estado,
  -- Only show first name for privacy
  split_part(remitente_nombre, ' ', 1) as remitente_nombre_publico,
  remitente_localidad,
  remitente_provincia,
  split_part(destinatario_nombre, ' ', 1) as destinatario_nombre_publico,
  destinatario_localidad,
  destinatario_provincia,
  tipo_recoleccion,
  tipo_entrega,
  fecha_recoleccion,
  hora_recoleccion,
  fecha_entrega,
  hora_entrega,
  created_at,
  updated_at
FROM public.ordenes_envio;

-- Enable RLS on the public view
ALTER VIEW public.ordenes_envio_public SET (security_barrier = true);

-- Create secure policies for the main ordenes_envio table
-- Drop existing policies to recreate them with stricter controls
DROP POLICY IF EXISTS "Authenticated users can create orders" ON public.ordenes_envio;
DROP POLICY IF EXISTS "Users can view their own orders or admins can view all" ON public.ordenes_envio;
DROP POLICY IF EXISTS "Users can update their own orders or admins can update all" ON public.ordenes_envio;

-- 1. Users can only create orders for themselves (must match authenticated user)
CREATE POLICY "Users can create their own orders only" 
ON public.ordenes_envio 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = usuario_creacion_id);

-- 2. Users can view their own orders with full details OR admins can view all
CREATE POLICY "Users view own orders or admins view all" 
ON public.ordenes_envio 
FOR SELECT 
TO authenticated
USING (
  auth.uid() = usuario_creacion_id OR 
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role)
);

-- 3. Only users can update their own orders, admins have full update access
CREATE POLICY "Users update own orders or admins update all" 
ON public.ordenes_envio 
FOR UPDATE 
TO authenticated
USING (
  auth.uid() = usuario_creacion_id OR 
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role)
);

-- 4. Only superadmins can delete orders (for data integrity)
CREATE POLICY "Only superadmins can delete orders" 
ON public.ordenes_envio 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- Create a secure function for customer service representatives 
-- to search orders with limited information (no full documents)
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
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
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
    -- Only allow if user has appropriate role
    AND (
      has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role) OR
      has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
      has_role(auth.uid(), 'SUPERADMIN'::app_role)
    )
  ORDER BY o.created_at DESC
  LIMIT 50;
$$;

-- Create audit logging for sensitive data access
CREATE TABLE IF NOT EXISTS public.order_access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  order_id uuid,
  orden_numero text,
  access_type text, -- 'view', 'update', 'create'
  accessed_fields text[], -- which sensitive fields were accessed
  user_role text,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.order_access_logs ENABLE ROW LEVEL SECURITY;

-- Only superadmins can view audit logs
CREATE POLICY "Only superadmins can view audit logs" 
ON public.order_access_logs 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

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