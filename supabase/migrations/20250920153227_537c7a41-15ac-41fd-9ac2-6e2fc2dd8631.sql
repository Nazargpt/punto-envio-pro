-- Phase 1: Critical Security Fix - Restrict geographic data access to authenticated users only
-- Fix security vulnerability: Restrict provincias table access
DROP POLICY IF EXISTS "Public can view provincias" ON public.provincias;
DROP POLICY IF EXISTS "Public can create provincias" ON public.provincias;
DROP POLICY IF EXISTS "Public can update provincias" ON public.provincias;

-- Restrict provincias access to authenticated admin users only
CREATE POLICY "Only authenticated admins can view provincias" 
ON public.provincias 
FOR SELECT 
USING (
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR
  has_role(auth.uid(), 'SUPERVISOR'::app_role) OR
  has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role)
);

CREATE POLICY "Only superadmins can create provincias" 
ON public.provincias 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE POLICY "Only superadmins can update provincias" 
ON public.provincias 
FOR UPDATE 
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- Fix security vulnerability: Restrict localidades table access
DROP POLICY IF EXISTS "Public can view localidades" ON public.localidades;
DROP POLICY IF EXISTS "Public can create localidades" ON public.localidades;
DROP POLICY IF EXISTS "Public can update localidades" ON public.localidades;

-- Restrict localidades access to authenticated admin users only
CREATE POLICY "Only authenticated admins can view localidades" 
ON public.localidades 
FOR SELECT 
USING (
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR
  has_role(auth.uid(), 'SUPERVISOR'::app_role) OR
  has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role)
);

CREATE POLICY "Only superadmins can create localidades" 
ON public.localidades 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'SUPERADMIN'::app_role));

CREATE POLICY "Only superadmins can update localidades" 
ON public.localidades 
FOR UPDATE 
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));