-- Fix security issue: Restrict direct access to transportistas table for OPERADOR_AGENCIA
-- Only allow SUPERADMIN, ADMIN_AGENCIA, and SUPERVISOR to see full transportista data directly
-- OPERADOR_AGENCIA should use secure functions with data masking

-- Update the transportistas SELECT policy to be more restrictive
DROP POLICY IF EXISTS "Only admins can view transportistas" ON public.transportistas;

CREATE POLICY "Restrict transportistas direct access to senior roles only" 
ON public.transportistas 
FOR SELECT 
USING (
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR 
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERVISOR'::app_role)
);

-- Add audit logging trigger for transportista access
CREATE TRIGGER log_transportista_access_trigger
  AFTER SELECT ON public.transportistas
  FOR EACH ROW EXECUTE FUNCTION public.log_transportista_table_access();