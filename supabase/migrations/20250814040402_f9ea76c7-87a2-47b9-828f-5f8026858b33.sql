-- Fix security vulnerability: Remove public access to seguimiento_detallado table
-- This table contains sensitive tracking information that should only be accessible to authorized users

-- Drop all existing public policies that allow unrestricted access
DROP POLICY IF EXISTS "Public can view seguimiento_detallado" ON public.seguimiento_detallado;
DROP POLICY IF EXISTS "Public can create seguimiento_detallado" ON public.seguimiento_detallado;
DROP POLICY IF EXISTS "Public can update seguimiento_detallado" ON public.seguimiento_detallado;
DROP POLICY IF EXISTS "Public can delete seguimiento_detallado" ON public.seguimiento_detallado;

-- Create secure policies for seguimiento_detallado table
-- Users can only view tracking details for orders they created or if they are admins
CREATE POLICY "Users can view tracking for their orders or admins can view all" 
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

-- Only admins and transportistas can create tracking records
CREATE POLICY "Only admins and transportistas can create tracking records" 
ON public.seguimiento_detallado 
FOR INSERT 
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR 
  has_role(auth.uid(), 'TRANSPORTISTA_LOCAL'::app_role) OR 
  has_role(auth.uid(), 'TRANSPORTISTA_LD'::app_role)
);

-- Only admins and the assigned transportista can update tracking records
CREATE POLICY "Only admins and assigned transportista can update tracking records" 
ON public.seguimiento_detallado 
FOR UPDATE 
TO authenticated
USING (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR 
  (transportista_id IS NOT NULL AND 
   EXISTS (
     SELECT 1 FROM public.transportistas t 
     WHERE t.id = seguimiento_detallado.transportista_id 
     AND t.documento = (
       SELECT documento FROM public.profiles 
       WHERE user_id = auth.uid()
     )
   )
  )
);

-- Only superadmin can delete tracking records (for data integrity)
CREATE POLICY "Only superadmin can delete tracking records" 
ON public.seguimiento_detallado 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- Also secure the public tracking endpoint by requiring a valid order number
-- Create a function to safely get tracking info with order number validation
CREATE OR REPLACE FUNCTION public.get_tracking_info(order_number text)
RETURNS TABLE (
  fecha_hora timestamp with time zone,
  estado text,
  descripcion text,
  ubicacion text,
  observaciones text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    s.fecha_hora,
    s.estado,
    s.descripcion,
    s.ubicacion,
    s.observaciones
  FROM public.seguimiento_detallado s
  JOIN public.ordenes_envio o ON s.orden_envio_id = o.id
  WHERE o.numero_orden = order_number
  ORDER BY s.fecha_hora DESC;
$$;