-- Update RLS policy to handle both real auth and dev mode
DROP POLICY IF EXISTS "Authenticated users can create orders" ON public.ordenes_envio;

-- Allow authenticated users to insert orders (includes both real auth and direct user_id)
CREATE POLICY "Authenticated users can create orders" 
ON public.ordenes_envio 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  OR usuario_creacion_id IS NOT NULL
);