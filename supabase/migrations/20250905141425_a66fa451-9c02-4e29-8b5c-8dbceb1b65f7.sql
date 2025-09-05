-- Paso 2: Crear el perfil para Nadia Bobadilla y actualizar políticas
-- Crear el perfil para Nadia Bobadilla
INSERT INTO public.profiles (user_id, email, nombre, activo)
VALUES (
  gen_random_uuid(),
  'nadiabobadilla@puntoenvio.com',
  'Nadia Bobadilla',
  true
);

-- Asignar el rol SUPERVISOR a Nadia Bobadilla
INSERT INTO public.user_roles (user_id, role)
SELECT p.user_id, 'SUPERVISOR'::app_role
FROM public.profiles p
WHERE p.email = 'nadiabobadilla@puntoenvio.com';

-- Actualizar políticas RLS para incluir SUPERVISOR con acceso completo

-- Actualizar políticas de ordenes_envio
DROP POLICY IF EXISTS "Secure order view policy" ON public.ordenes_envio;
CREATE POLICY "Secure order view policy" 
ON public.ordenes_envio 
FOR SELECT 
USING (
  (auth.uid() = usuario_creacion_id) OR 
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
  has_role(auth.uid(), 'SUPERVISOR'::app_role)
);

DROP POLICY IF EXISTS "Secure order update policy" ON public.ordenes_envio;
CREATE POLICY "Secure order update policy" 
ON public.ordenes_envio 
FOR UPDATE 
USING (
  (auth.uid() = usuario_creacion_id) OR 
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
  has_role(auth.uid(), 'SUPERVISOR'::app_role)
);

-- Actualizar políticas de transportistas
DROP POLICY IF EXISTS "Only admins can view transportistas" ON public.transportistas;
CREATE POLICY "Only admins can view transportistas" 
ON public.transportistas 
FOR SELECT 
USING (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR 
  has_role(auth.uid(), 'SUPERVISOR'::app_role) OR
  has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role)
);

DROP POLICY IF EXISTS "Only admins can create transportistas" ON public.transportistas;
CREATE POLICY "Only admins can create transportistas" 
ON public.transportistas 
FOR INSERT 
WITH CHECK (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
  has_role(auth.uid(), 'SUPERVISOR'::app_role)
);

DROP POLICY IF EXISTS "Only admins can update transportistas" ON public.transportistas;
CREATE POLICY "Only admins can update transportistas" 
ON public.transportistas 
FOR UPDATE 
USING (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
  has_role(auth.uid(), 'SUPERVISOR'::app_role)
);

-- Actualizar políticas de hojas_ruta
DROP POLICY IF EXISTS "Only admins can manage hojas_ruta" ON public.hojas_ruta;
CREATE POLICY "Only admins can manage hojas_ruta" 
ON public.hojas_ruta 
FOR ALL 
USING (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
  has_role(auth.uid(), 'SUPERVISOR'::app_role)
);

-- Actualizar políticas de agencias
DROP POLICY IF EXISTS "Only admins can manage agencias" ON public.agencias;
CREATE POLICY "Only admins can manage agencias" 
ON public.agencias 
FOR INSERT 
WITH CHECK (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
  has_role(auth.uid(), 'SUPERVISOR'::app_role)
);

DROP POLICY IF EXISTS "Only admins can update agencias" ON public.agencias;
CREATE POLICY "Only admins can update agencias" 
ON public.agencias 
FOR UPDATE 
USING (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
  has_role(auth.uid(), 'SUPERVISOR'::app_role)
);