-- Fix security vulnerability: Protect customer personal information in ordenes_envio
-- Implement stricter access controls and data minimization

-- First, let's create a secure view for limited order information
-- This view excludes sensitive personal data like documents and full addresses
DROP VIEW IF EXISTS public.ordenes_envio_public;

CREATE VIEW public.ordenes_envio_public AS
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

-- Create secure policies for the main ordenes_envio table
-- Drop existing policies to recreate them with stricter controls
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Drop all existing policies on ordenes_envio table
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'ordenes_envio' 
        AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.ordenes_envio', policy_record.policyname);
    END LOOP;
END
$$;

-- 1. Users can only create orders for themselves (must match authenticated user)
CREATE POLICY "Secure order creation policy" 
ON public.ordenes_envio 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = usuario_creacion_id);

-- 2. Users can view their own orders with full details OR admins can view all
CREATE POLICY "Secure order view policy" 
ON public.ordenes_envio 
FOR SELECT 
TO authenticated
USING (
  auth.uid() = usuario_creacion_id OR 
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role)
);

-- 3. Only users can update their own orders, admins have full update access
CREATE POLICY "Secure order update policy" 
ON public.ordenes_envio 
FOR UPDATE 
TO authenticated
USING (
  auth.uid() = usuario_creacion_id OR 
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role)
);

-- 4. Only superadmins can delete orders (for data integrity)
CREATE POLICY "Secure order delete policy" 
ON public.ordenes_envio 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- Drop existing audit table if it exists to recreate with proper structure
DROP TABLE IF EXISTS public.order_access_logs CASCADE;

-- Create audit logging for sensitive data access
CREATE TABLE public.order_access_logs (
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
CREATE POLICY "Secure audit log access policy" 
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