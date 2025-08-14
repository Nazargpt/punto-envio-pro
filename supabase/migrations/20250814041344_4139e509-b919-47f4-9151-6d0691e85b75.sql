-- Secure the tarifas table to prevent pricing strategy theft
-- First check what policies exist and drop them properly

DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Drop all existing policies on tarifas table
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'tarifas' 
        AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.tarifas', policy_record.policyname);
    END LOOP;
END
$$;

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