-- CRITICAL SECURITY FIX: Remove dangerous public policies from transportista-related tables
-- These policies allow anonymous users to manipulate carrier personal information

-- 1. Secure transportistas_rutas table
DROP POLICY IF EXISTS "Public can create transportistas_rutas" ON public.transportistas_rutas;
DROP POLICY IF EXISTS "Public can delete transportistas_rutas" ON public.transportistas_rutas;
DROP POLICY IF EXISTS "Public can update transportistas_rutas" ON public.transportistas_rutas;
DROP POLICY IF EXISTS "Public can view transportistas_rutas" ON public.transportistas_rutas;

-- Create secure policies for transportistas_rutas
CREATE POLICY "Only admins can view transportistas_rutas" 
ON public.transportistas_rutas 
FOR SELECT 
TO authenticated
USING (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
  has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role)
);

CREATE POLICY "Only admins can create transportistas_rutas" 
ON public.transportistas_rutas 
FOR INSERT 
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role)
);

CREATE POLICY "Only admins can update transportistas_rutas" 
ON public.transportistas_rutas 
FOR UPDATE 
TO authenticated
USING (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role)
);

CREATE POLICY "Only superadmins can delete transportistas_rutas" 
ON public.transportistas_rutas 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- 2. Secure transportistas_zonas_cobertura table
DROP POLICY IF EXISTS "Public can create transportistas_zonas_cobertura" ON public.transportistas_zonas_cobertura;
DROP POLICY IF EXISTS "Public can delete transportistas_zonas_cobertura" ON public.transportistas_zonas_cobertura;
DROP POLICY IF EXISTS "Public can update transportistas_zonas_cobertura" ON public.transportistas_zonas_cobertura;
DROP POLICY IF EXISTS "Public can view transportistas_zonas_cobertura" ON public.transportistas_zonas_cobertura;

-- Create secure policies for transportistas_zonas_cobertura
CREATE POLICY "Only admins can view transportistas_zonas_cobertura" 
ON public.transportistas_zonas_cobertura 
FOR SELECT 
TO authenticated
USING (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
  has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role)
);

CREATE POLICY "Only admins can create transportistas_zonas_cobertura" 
ON public.transportistas_zonas_cobertura 
FOR INSERT 
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role)
);

CREATE POLICY "Only admins can update transportistas_zonas_cobertura" 
ON public.transportistas_zonas_cobertura 
FOR UPDATE 
TO authenticated
USING (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role)
);

CREATE POLICY "Only superadmins can delete transportistas_zonas_cobertura" 
ON public.transportistas_zonas_cobertura 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- 3. Secure vehiculos table (contains transportista personal vehicle info)
DROP POLICY IF EXISTS "Public can create vehiculos" ON public.vehiculos;
DROP POLICY IF EXISTS "Public can delete vehiculos" ON public.vehiculos;
DROP POLICY IF EXISTS "Public can update vehiculos" ON public.vehiculos;
DROP POLICY IF EXISTS "Public can view vehiculos" ON public.vehiculos;

-- Create secure policies for vehiculos
CREATE POLICY "Only admins can view vehiculos" 
ON public.vehiculos 
FOR SELECT 
TO authenticated
USING (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
  has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role)
);

CREATE POLICY "Only admins can create vehiculos" 
ON public.vehiculos 
FOR INSERT 
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role)
);

CREATE POLICY "Only admins can update vehiculos" 
ON public.vehiculos 
FOR UPDATE 
TO authenticated
USING (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role)
);

CREATE POLICY "Only superadmins can delete vehiculos" 
ON public.vehiculos 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- 4. Secure servicios_transportistas table
DROP POLICY IF EXISTS "Public can create servicios_transportistas" ON public.servicios_transportistas;
DROP POLICY IF EXISTS "Public can delete servicios_transportistas" ON public.servicios_transportistas;
DROP POLICY IF EXISTS "Public can update servicios_transportistas" ON public.servicios_transportistas;
DROP POLICY IF EXISTS "Public can view servicios_transportistas" ON public.servicios_transportistas;

-- Create secure policies for servicios_transportistas
CREATE POLICY "Only admins can view servicios_transportistas" 
ON public.servicios_transportistas 
FOR SELECT 
TO authenticated
USING (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
  has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role)
);

CREATE POLICY "Only admins can create servicios_transportistas" 
ON public.servicios_transportistas 
FOR INSERT 
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role)
);

CREATE POLICY "Only admins can update servicios_transportistas" 
ON public.servicios_transportistas 
FOR UPDATE 
TO authenticated
USING (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role)
);

CREATE POLICY "Only superadmins can delete servicios_transportistas" 
ON public.servicios_transportistas 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- 5. Add comprehensive audit logging for all transportista-related data modifications
CREATE OR REPLACE FUNCTION public.log_transportista_table_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_role_val text;
  operation_type text;
BEGIN
  -- Get user role
  SELECT role INTO user_role_val 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1;

  -- Determine operation type
  operation_type := TG_OP;

  -- Log the operation
  INSERT INTO public.sensitive_data_audit (
    user_id,
    table_name,
    record_id,
    field_name,
    access_type,
    access_reason,
    ip_address,
    created_at
  ) VALUES (
    auth.uid(),
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    'table_modification',
    operation_type,
    'Admin operation on transportista data',
    inet_client_addr(),
    now()
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Add triggers for audit logging on all transportista-related tables
CREATE TRIGGER audit_transportistas_rutas_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.transportistas_rutas
  FOR EACH ROW EXECUTE FUNCTION public.log_transportista_table_access();

CREATE TRIGGER audit_transportistas_zonas_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.transportistas_zonas_cobertura
  FOR EACH ROW EXECUTE FUNCTION public.log_transportista_table_access();

CREATE TRIGGER audit_vehiculos_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.vehiculos
  FOR EACH ROW EXECUTE FUNCTION public.log_transportista_table_access();

CREATE TRIGGER audit_servicios_transportistas_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.servicios_transportistas
  FOR EACH ROW EXECUTE FUNCTION public.log_transportista_table_access();