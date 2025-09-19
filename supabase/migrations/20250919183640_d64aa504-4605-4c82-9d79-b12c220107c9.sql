-- Fix RLS policies for profiles table to allow admins to view all users
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "SUPERADMIN can manage all profiles" ON public.profiles;

-- Create new comprehensive policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR 
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR
  has_role(auth.uid(), 'SUPERVISOR'::app_role)
);

CREATE POLICY "SUPERADMIN can manage all profiles" 
ON public.profiles 
FOR ALL 
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role))
WITH CHECK (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- Also fix user_roles policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Superadmin can manage all roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR 
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR
  has_role(auth.uid(), 'SUPERVISOR'::app_role)
);

CREATE POLICY "SUPERADMIN can manage all roles" 
ON public.user_roles 
FOR ALL 
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role))
WITH CHECK (has_role(auth.uid(), 'SUPERADMIN'::app_role);