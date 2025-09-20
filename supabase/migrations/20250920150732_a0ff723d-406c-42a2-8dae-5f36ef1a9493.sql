-- Fix security vulnerability: Restrict hojas_ruta access based on user roles
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view hojas_ruta" ON public.hojas_ruta;

-- Create a more restrictive policy for viewing delivery routes
CREATE POLICY "Restricted access to hojas_ruta based on roles" 
ON public.hojas_ruta 
FOR SELECT 
USING (
  -- Allow SUPERADMIN, ADMIN_AGENCIA, and SUPERVISOR to see all routes
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR
  has_role(auth.uid(), 'SUPERVISOR'::app_role) OR
  has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role) OR
  -- Allow transporters to see only their assigned routes
  (
    (has_role(auth.uid(), 'TRANSPORTISTA_LOCAL'::app_role) OR has_role(auth.uid(), 'TRANSPORTISTA_LD'::app_role)) AND
    EXISTS (
      SELECT 1 FROM public.transportistas t 
      WHERE t.id = hojas_ruta.transportista_id 
      AND t.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  )
);