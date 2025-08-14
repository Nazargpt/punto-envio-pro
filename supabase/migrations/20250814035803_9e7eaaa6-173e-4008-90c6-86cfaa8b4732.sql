-- Phase 1: Immediate Data Protection - Update RLS policies to require authentication

-- First, let's secure customer data in ordenes_envio
DROP POLICY IF EXISTS "Public can create orders" ON public.ordenes_envio;
DROP POLICY IF EXISTS "Public can view all orders" ON public.ordenes_envio;
DROP POLICY IF EXISTS "Public can update orders" ON public.ordenes_envio;

-- Create secure policies for ordenes_envio
CREATE POLICY "Authenticated users can create orders" 
ON public.ordenes_envio 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = usuario_creacion_id);

CREATE POLICY "Users can view their own orders or admins can view all" 
ON public.ordenes_envio 
FOR SELECT 
TO authenticated
USING (
  auth.uid() = usuario_creacion_id OR 
  has_role(auth.uid(), 'ADMIN'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role)
);

CREATE POLICY "Users can update their own orders or admins can update all" 
ON public.ordenes_envio 
FOR UPDATE 
TO authenticated
USING (
  auth.uid() = usuario_creacion_id OR 
  has_role(auth.uid(), 'ADMIN'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role)
);

-- Secure transportistas data
DROP POLICY IF EXISTS "Public can view transportistas" ON public.transportistas;
DROP POLICY IF EXISTS "Public can create transportistas" ON public.transportistas;
DROP POLICY IF EXISTS "Public can update transportistas" ON public.transportistas;
DROP POLICY IF EXISTS "Public can delete transportistas" ON public.transportistas;

CREATE POLICY "Authenticated users can view transportistas" 
ON public.transportistas 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Only admins can manage transportistas" 
ON public.transportistas 
FOR ALL 
TO authenticated
USING (
  has_role(auth.uid(), 'ADMIN'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role)
);

-- Secure agencias data
DROP POLICY IF EXISTS "Anyone can view agencias" ON public.agencias;
DROP POLICY IF EXISTS "Anyone can insert agencias" ON public.agencias;
DROP POLICY IF EXISTS "Anyone can update agencias" ON public.agencias;

CREATE POLICY "Authenticated users can view agencias" 
ON public.agencias 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Only admins can manage agencias" 
ON public.agencias 
FOR INSERT 
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'ADMIN'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role)
);

CREATE POLICY "Only admins can update agencias" 
ON public.agencias 
FOR UPDATE 
TO authenticated
USING (
  has_role(auth.uid(), 'ADMIN'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role)
);

-- Secure other sensitive tables
DROP POLICY IF EXISTS "Public can view hojas_ruta" ON public.hojas_ruta;
DROP POLICY IF EXISTS "Public can create hojas_ruta" ON public.hojas_ruta;
DROP POLICY IF EXISTS "Public can update hojas_ruta" ON public.hojas_ruta;
DROP POLICY IF EXISTS "Public can delete hojas_ruta" ON public.hojas_ruta;

CREATE POLICY "Authenticated users can view hojas_ruta" 
ON public.hojas_ruta 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Only admins can manage hojas_ruta" 
ON public.hojas_ruta 
FOR ALL 
TO authenticated
USING (
  has_role(auth.uid(), 'ADMIN'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role)
);

-- Secure incidencias
DROP POLICY IF EXISTS "Public can view incidencias" ON public.incidencias;
DROP POLICY IF EXISTS "Public can create incidencias" ON public.incidencias;
DROP POLICY IF EXISTS "Public can update incidencias" ON public.incidencias;
DROP POLICY IF EXISTS "Public can delete incidencias" ON public.incidencias;

CREATE POLICY "Authenticated users can view incidencias" 
ON public.incidencias 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create incidencias" 
ON public.incidencias 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Only admins can update incidencias" 
ON public.incidencias 
FOR UPDATE 
TO authenticated
USING (
  has_role(auth.uid(), 'ADMIN'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role)
);

CREATE POLICY "Only superadmins can delete incidencias" 
ON public.incidencias 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- Create a function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, nombre)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data ->> 'nombre', ''));
  
  -- Assign default USER role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'USER'::app_role);
  
  RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add USER role to the app_role enum if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'USER' AND enumtypid = 'app_role'::regtype) THEN
    ALTER TYPE app_role ADD VALUE 'USER';
  END IF;
END$$;