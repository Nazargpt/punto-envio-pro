-- Fix security vulnerability: Secure the seguimiento_detallado table
-- Remove all existing policies and create secure ones

-- First, get current policies and drop them
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Drop all existing policies on seguimiento_detallado table
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'seguimiento_detallado' 
        AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.seguimiento_detallado', policy_record.policyname);
    END LOOP;
END
$$;

-- Create secure policies for seguimiento_detallado table
-- 1. Users can only view tracking details for orders they created or if they are admins
CREATE POLICY "Secure tracking view policy" 
ON public.seguimiento_detallado 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.ordenes_envio o 
    WHERE o.id = seguimiento_detallado.orden_envio_id 
    AND (
      o.usuario_creacion_id = auth.uid() OR 
      has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
      has_role(auth.uid(), 'SUPERADMIN'::app_role)
    )
  )
);

-- 2. Only admins and transportistas can create tracking records
CREATE POLICY "Secure tracking insert policy" 
ON public.seguimiento_detallado 
FOR INSERT 
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR 
  has_role(auth.uid(), 'TRANSPORTISTA_LOCAL'::app_role) OR 
  has_role(auth.uid(), 'TRANSPORTISTA_LD'::app_role)
);

-- 3. Only admins can update tracking records (simplified for security)
CREATE POLICY "Secure tracking update policy" 
ON public.seguimiento_detallado 
FOR UPDATE 
TO authenticated
USING (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role)
);

-- 4. Only superadmin can delete tracking records
CREATE POLICY "Secure tracking delete policy" 
ON public.seguimiento_detallado 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- Create a secure function for public tracking lookup
CREATE OR REPLACE FUNCTION public.get_tracking_info(order_number text)
RETURNS TABLE (
  fecha_hora timestamp with time zone,
  estado text,
  descripcion text,
  ubicacion text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    s.fecha_hora,
    s.estado,
    s.descripcion,
    s.ubicacion
  FROM public.seguimiento_detallado s
  JOIN public.ordenes_envio o ON s.orden_envio_id = o.id
  WHERE o.numero_orden = order_number
  ORDER BY s.fecha_hora DESC;
$$;