-- Update RLS policies for ordenes_envio to allow authenticated users to create orders
DROP POLICY IF EXISTS "SUPERADMIN can manage all orders" ON public.ordenes_envio;

-- Allow SUPERADMIN to manage all orders
CREATE POLICY "SUPERADMIN can manage all orders" 
ON public.ordenes_envio 
FOR ALL 
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role))
WITH CHECK (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- Allow authenticated users to insert orders
CREATE POLICY "Authenticated users can create orders" 
ON public.ordenes_envio 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow users to view their own orders
CREATE POLICY "Users can view their own orders" 
ON public.ordenes_envio 
FOR SELECT 
USING (auth.uid() = usuario_creacion_id OR has_role(auth.uid(), 'SUPERADMIN'::app_role));