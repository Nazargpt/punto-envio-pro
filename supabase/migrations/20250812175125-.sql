-- Remove existing policies for ordenes_envio
DROP POLICY IF EXISTS "Authenticated users can create orders" ON public.ordenes_envio;
DROP POLICY IF EXISTS "SUPERADMIN can manage all orders" ON public.ordenes_envio;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.ordenes_envio;

-- Create permissive policies for public access (no authentication required)
CREATE POLICY "Public can create orders" 
ON public.ordenes_envio 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can view all orders" 
ON public.ordenes_envio 
FOR SELECT 
USING (true);

CREATE POLICY "Public can update orders" 
ON public.ordenes_envio 
FOR UPDATE 
USING (true);