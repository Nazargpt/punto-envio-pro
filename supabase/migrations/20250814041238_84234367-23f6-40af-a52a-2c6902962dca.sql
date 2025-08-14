-- Secure the tarifas table to prevent pricing strategy theft
-- Restrict access to authenticated users only

-- Drop existing public policies
DROP POLICY IF EXISTS "Public can create tarifas" ON public.tarifas;
DROP POLICY IF EXISTS "Public can delete tarifas" ON public.tarifas;
DROP POLICY IF EXISTS "Public can update tarifas" ON public.tarifas;
DROP POLICY IF EXISTS "Public can view tarifas" ON public.tarifas;

-- Create secure policies for tarifas table
-- Only authenticated users can view tarifas (needed for cotizador functionality)
CREATE POLICY "Authenticated users can view tarifas" 
ON public.tarifas 
FOR SELECT 
TO authenticated
USING (true);

-- Only admins can manage tarifas (create, update, delete)
CREATE POLICY "Only admins can create tarifas" 
ON public.tarifas 
FOR INSERT 
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role)
);

CREATE POLICY "Only admins can update tarifas" 
ON public.tarifas 
FOR UPDATE 
TO authenticated
USING (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role)
);

CREATE POLICY "Only superadmins can delete tarifas" 
ON public.tarifas 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));