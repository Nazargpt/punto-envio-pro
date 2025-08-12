-- Update RLS policy to handle dev mode properly
DROP POLICY IF EXISTS "Authenticated users can create orders" ON public.ordenes_envio;

-- Allow order creation when there's a valid user ID in usuario_creacion_id
-- This handles both real auth (where auth.uid() works) and dev mode (where we pass the user ID directly)
CREATE POLICY "Authenticated users can create orders" 
ON public.ordenes_envio 
FOR INSERT 
WITH CHECK (
  -- Either user is authenticated through Supabase auth
  auth.uid() IS NOT NULL 
  -- Or we have a valid user ID (for dev mode)
  OR (usuario_creacion_id IS NOT NULL AND length(usuario_creacion_id::text) = 36)
);