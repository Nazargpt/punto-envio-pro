-- Secure the transportistas table to protect driver personal information
-- Implement strict role-based access controls

-- Drop existing policies on transportistas table
DROP POLICY IF EXISTS "Authenticated users can view transportistas" ON public.transportistas;
DROP POLICY IF EXISTS "Only admins can manage transportistas" ON public.transportistas;

-- 1. Only admins and superadmins can view full transportistas data
CREATE POLICY "Only admins can view transportistas" 
ON public.transportistas 
FOR SELECT 
TO authenticated
USING (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
  has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role)
);

-- 2. Only admins and superadmins can create transportistas
CREATE POLICY "Only admins can create transportistas" 
ON public.transportistas 
FOR INSERT 
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role)
);

-- 3. Only admins and superadmins can update transportistas
CREATE POLICY "Only admins can update transportistas" 
ON public.transportistas 
FOR UPDATE 
TO authenticated
USING (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role)
);

-- 4. Only superadmins can delete transportistas
CREATE POLICY "Only superadmins can delete transportistas" 
ON public.transportistas 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- Create a secure view for limited transportista information (for general app use)
DROP VIEW IF EXISTS public.transportistas_public;

CREATE VIEW public.transportistas_public AS
SELECT 
  id,
  nombre,
  apellido,
  tipo_transportista,
  activo,
  created_at,
  updated_at
FROM public.transportistas
WHERE activo = true;

-- Enable RLS on the view
ALTER VIEW public.transportistas_public SET (security_barrier = true);

-- Create a secure function to get transportista basic info for services
CREATE OR REPLACE FUNCTION public.get_transportistas_for_services()
RETURNS TABLE (
  id uuid,
  nombre_completo text,
  tipo_transportista text,
  activo boolean
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    t.id,
    t.nombre || ' ' || t.apellido as nombre_completo,
    t.tipo_transportista,
    t.activo
  FROM public.transportistas t
  WHERE t.activo = true
  ORDER BY t.nombre, t.apellido;
$$;

-- Grant access to the view for authenticated users (for basic transportista selection)
GRANT SELECT ON public.transportistas_public TO authenticated;

-- Create audit logging for transportista data access
CREATE OR REPLACE FUNCTION public.log_transportista_access(
  p_transportista_id uuid,
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

  -- Insert audit log (reusing order_access_logs structure for transportista access)
  INSERT INTO public.order_access_logs (
    user_id,
    order_id, -- We'll use this field for transportista_id
    orden_numero, -- We'll use this for transportista name
    access_type,
    accessed_fields,
    user_role,
    created_at
  ) VALUES (
    auth.uid(),
    p_transportista_id,
    'TRANSPORTISTA_ACCESS',
    p_access_type,
    p_accessed_fields,
    COALESCE(user_role_val, 'USER'),
    now()
  );
END;
$$;