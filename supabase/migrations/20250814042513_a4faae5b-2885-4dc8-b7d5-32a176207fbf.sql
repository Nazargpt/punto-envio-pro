-- EMERGENCY SECURITY FIX: Secure critical business operations data
-- Remove dangerous public policies that expose business operations to competitors

-- 1. Secure ordenes_hoja_ruta table (delivery route sheets)
DROP POLICY IF EXISTS "Public can create ordenes_hoja_ruta" ON public.ordenes_hoja_ruta;
DROP POLICY IF EXISTS "Public can delete ordenes_hoja_ruta" ON public.ordenes_hoja_ruta;
DROP POLICY IF EXISTS "Public can update ordenes_hoja_ruta" ON public.ordenes_hoja_ruta;
DROP POLICY IF EXISTS "Public can view ordenes_hoja_ruta" ON public.ordenes_hoja_ruta;

-- Create secure policies for ordenes_hoja_ruta
CREATE POLICY "Only authenticated users can view ordenes_hoja_ruta" 
ON public.ordenes_hoja_ruta 
FOR SELECT 
TO authenticated
USING (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
  has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role) OR
  has_role(auth.uid(), 'TRANSPORTISTA_LOCAL'::app_role) OR
  has_role(auth.uid(), 'TRANSPORTISTA_LD'::app_role)
);

CREATE POLICY "Only admins can create ordenes_hoja_ruta" 
ON public.ordenes_hoja_ruta 
FOR INSERT 
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
  has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role)
);

CREATE POLICY "Only admins can update ordenes_hoja_ruta" 
ON public.ordenes_hoja_ruta 
FOR UPDATE 
TO authenticated
USING (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
  has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role)
);

CREATE POLICY "Only superadmins can delete ordenes_hoja_ruta" 
ON public.ordenes_hoja_ruta 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- 2. Secure rutas_paradas table (route stops and timing)
DROP POLICY IF EXISTS "Public can create rutas_paradas" ON public.rutas_paradas;
DROP POLICY IF EXISTS "Public can delete rutas_paradas" ON public.rutas_paradas;
DROP POLICY IF EXISTS "Public can update rutas_paradas" ON public.rutas_paradas;
DROP POLICY IF EXISTS "Public can view rutas_paradas" ON public.rutas_paradas;

-- Create secure policies for rutas_paradas
CREATE POLICY "Only authenticated users can view rutas_paradas" 
ON public.rutas_paradas 
FOR SELECT 
TO authenticated
USING (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
  has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role) OR
  has_role(auth.uid(), 'TRANSPORTISTA_LOCAL'::app_role) OR
  has_role(auth.uid(), 'TRANSPORTISTA_LD'::app_role)
);

CREATE POLICY "Only admins can create rutas_paradas" 
ON public.rutas_paradas 
FOR INSERT 
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
  has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role)
);

CREATE POLICY "Only admins can update rutas_paradas" 
ON public.rutas_paradas 
FOR UPDATE 
TO authenticated
USING (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
  has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role)
);

CREATE POLICY "Only superadmins can delete rutas_paradas" 
ON public.rutas_paradas 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- 3. Secure paquetes table (package details and contents)
DROP POLICY IF EXISTS "Public can create paquetes" ON public.paquetes;
DROP POLICY IF EXISTS "Public can delete paquetes" ON public.paquetes;
DROP POLICY IF EXISTS "Public can update paquetes" ON public.paquetes;
DROP POLICY IF EXISTS "Public can view paquetes" ON public.paquetes;

-- Create secure policies for paquetes (with owner-based access for customers)
CREATE POLICY "Users can view related paquetes" 
ON public.paquetes 
FOR SELECT 
TO authenticated
USING (
  -- Admins and operators can see all packages
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
  has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role) OR
  has_role(auth.uid(), 'TRANSPORTISTA_LOCAL'::app_role) OR
  has_role(auth.uid(), 'TRANSPORTISTA_LD'::app_role) OR
  -- Users can only see packages from their own orders
  EXISTS (
    SELECT 1 FROM public.ordenes_envio o 
    WHERE o.id = paquetes.orden_envio_id 
    AND o.usuario_creacion_id = auth.uid()
  )
);

CREATE POLICY "Users can create paquetes for their orders" 
ON public.paquetes 
FOR INSERT 
TO authenticated
WITH CHECK (
  -- Admins and operators can create packages for any order
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
  has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role) OR
  -- Users can only create packages for their own orders
  EXISTS (
    SELECT 1 FROM public.ordenes_envio o 
    WHERE o.id = paquetes.orden_envio_id 
    AND o.usuario_creacion_id = auth.uid()
  )
);

CREATE POLICY "Users can update paquetes for their orders" 
ON public.paquetes 
FOR UPDATE 
TO authenticated
USING (
  -- Admins and operators can update any package
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR 
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
  has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role) OR
  -- Users can only update packages from their own orders
  EXISTS (
    SELECT 1 FROM public.ordenes_envio o 
    WHERE o.id = paquetes.orden_envio_id 
    AND o.usuario_creacion_id = auth.uid()
  )
);

CREATE POLICY "Only superadmins can delete paquetes" 
ON public.paquetes 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- 4. Create business operations audit logging
CREATE OR REPLACE FUNCTION public.log_business_operations_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_role_val text;
  operation_type text;
  sensitive_fields text[];
BEGIN
  -- Get user role
  SELECT role INTO user_role_val 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1;

  -- Determine operation type
  operation_type := TG_OP;

  -- Define sensitive fields based on table
  CASE TG_TABLE_NAME
    WHEN 'ordenes_hoja_ruta' THEN
      sensitive_fields := ARRAY['observaciones', 'hora_planificada', 'hora_real'];
    WHEN 'rutas_paradas' THEN
      sensitive_fields := ARRAY['tiempo_estimado_minutos', 'observaciones'];
    WHEN 'paquetes' THEN
      sensitive_fields := ARRAY['descripcion', 'valor_declarado', 'peso_kg'];
    ELSE
      sensitive_fields := ARRAY['general_business_data'];
  END CASE;

  -- Log the business operations access
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
    array_to_string(sensitive_fields, ','),
    operation_type || '_business_ops',
    'Business operations data access',
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

-- Add audit triggers for business operations tables
CREATE TRIGGER audit_ordenes_hoja_ruta_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.ordenes_hoja_ruta
  FOR EACH ROW EXECUTE FUNCTION public.log_business_operations_access();

CREATE TRIGGER audit_rutas_paradas_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.rutas_paradas
  FOR EACH ROW EXECUTE FUNCTION public.log_business_operations_access();

CREATE TRIGGER audit_paquetes_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.paquetes
  FOR EACH ROW EXECUTE FUNCTION public.log_business_operations_access();

-- 5. Create business intelligence protection function
CREATE OR REPLACE FUNCTION public.get_business_analytics_summary(date_range_days integer DEFAULT 30)
RETURNS TABLE (
  total_orders bigint,
  active_routes bigint,
  total_packages bigint,
  average_delivery_time numeric,
  access_level text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_user_role text;
BEGIN
  -- Only allow access to authorized personnel
  IF NOT (
    has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR
    has_role(auth.uid(), 'SUPERADMIN'::app_role)
  ) THEN
    RAISE EXCEPTION 'Access denied: Business analytics require admin privileges';
  END IF;

  -- Get user role for logging
  SELECT role INTO current_user_role 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1;

  -- Log analytics access
  INSERT INTO public.sensitive_data_audit (
    user_id, table_name, field_name, access_type, access_reason, ip_address
  ) VALUES (
    auth.uid(), 'business_analytics', 'summary_data', 'analytics_access', 
    'Business intelligence summary requested', inet_client_addr()
  );

  -- Return aggregated business data (no sensitive details)
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.ordenes_envio 
     WHERE created_at >= now() - interval '1 day' * date_range_days)::bigint as total_orders,
    (SELECT COUNT(DISTINCT ruta_id) FROM public.rutas_paradas 
     WHERE created_at >= now() - interval '1 day' * date_range_days)::bigint as active_routes,
    (SELECT COUNT(*) FROM public.paquetes p
     JOIN public.ordenes_envio o ON p.orden_envio_id = o.id
     WHERE o.created_at >= now() - interval '1 day' * date_range_days)::bigint as total_packages,
    24.5::numeric as average_delivery_time, -- Placeholder calculation
    current_user_role as access_level;
END;
$$;