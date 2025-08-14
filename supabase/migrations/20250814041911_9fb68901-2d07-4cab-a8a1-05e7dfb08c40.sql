-- Implement multi-layered security for personal information protection
-- This addresses the vulnerability where admin credential compromise exposes all sensitive data

-- 1. Create enhanced audit logging table for sensitive field access
CREATE TABLE IF NOT EXISTS public.sensitive_data_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  table_name text NOT NULL,
  record_id uuid,
  field_name text NOT NULL,
  access_type text NOT NULL, -- 'view', 'export', 'print', 'edit'
  access_reason text, -- Business justification
  ip_address inet,
  user_agent text,
  session_duration_minutes integer,
  approved_by_user_id uuid REFERENCES auth.users(id),
  approval_timestamp timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on sensitive data audit
ALTER TABLE public.sensitive_data_audit ENABLE ROW LEVEL SECURITY;

-- Only superadmins can view audit logs
CREATE POLICY "Only superadmins can view sensitive audit logs" 
ON public.sensitive_data_audit 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- 2. Create data masking functions for different sensitivity levels
CREATE OR REPLACE FUNCTION public.mask_documento(documento text, requester_role text DEFAULT NULL)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only show full document to superadmins
  IF has_role(auth.uid(), 'SUPERADMIN'::app_role) THEN
    RETURN documento;
  END IF;
  
  -- Show partial document to admins
  IF has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) THEN
    RETURN left(documento, 2) || '****' || right(documento, 2);
  END IF;
  
  -- Show minimal info to operators
  RETURN '****' || right(documento, 2);
END;
$$;

CREATE OR REPLACE FUNCTION public.mask_email(email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  local_part text;
  domain_part text;
BEGIN
  -- Only show full email to superadmins
  IF has_role(auth.uid(), 'SUPERADMIN'::app_role) THEN
    RETURN email;
  END IF;
  
  -- Mask email for others
  local_part := split_part(email, '@', 1);
  domain_part := split_part(email, '@', 2);
  
  IF length(local_part) > 2 THEN
    RETURN left(local_part, 1) || '***' || right(local_part, 1) || '@' || domain_part;
  ELSE
    RETURN '***@' || domain_part;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.mask_telefono(telefono text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only show full phone to superadmins
  IF has_role(auth.uid(), 'SUPERADMIN'::app_role) THEN
    RETURN telefono;
  END IF;
  
  -- Show partial phone to admins
  IF has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) THEN
    RETURN left(telefono, 3) || '****' || right(telefono, 2);
  END IF;
  
  -- Show minimal info to operators  
  RETURN '****' || right(telefono, 2);
END;
$$;

CREATE OR REPLACE FUNCTION public.mask_domicilio(domicilio text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only show full address to superadmins with approval
  IF has_role(auth.uid(), 'SUPERADMIN'::app_role) THEN
    RETURN domicilio;
  END IF;
  
  -- Show street name only to admins
  IF has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) THEN
    RETURN split_part(domicilio, ' ', 1) || ' ****';
  END IF;
  
  -- Show only neighborhood/area to operators
  RETURN 'Dirección confidencial';
END;
$$;

-- 3. Create secure function for transportista data with field-level access control
CREATE OR REPLACE FUNCTION public.get_transportista_with_masking(transportista_id uuid)
RETURNS TABLE (
  id uuid,
  nombre text,
  apellido text,
  documento_masked text,
  email_masked text,
  telefono_masked text,
  licencia_conducir_masked text,
  fecha_vencimiento_licencia date,
  tipo_transportista text,
  nombre_empresa text,
  calificacion numeric,
  activo boolean,
  access_level text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  transportista_record record;
  current_user_role text;
BEGIN
  -- Check if user has permission to access transportista data
  IF NOT (
    has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR
    has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
    has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role)
  ) THEN
    RAISE EXCEPTION 'Access denied: insufficient privileges';
  END IF;

  -- Get user role for audit
  SELECT role INTO current_user_role 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1;

  -- Get transportista data
  SELECT * INTO transportista_record
  FROM public.transportistas t
  WHERE t.id = transportista_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transportista not found';
  END IF;

  -- Log the access
  INSERT INTO public.sensitive_data_audit (
    user_id, table_name, record_id, field_name, access_type, ip_address
  ) VALUES (
    auth.uid(), 'transportistas', transportista_id, 'full_record_masked', 'view', inet_client_addr()
  );

  -- Return masked data based on role
  RETURN QUERY SELECT
    transportista_record.id,
    transportista_record.nombre,
    transportista_record.apellido,
    public.mask_documento(transportista_record.documento) as documento_masked,
    public.mask_email(COALESCE(transportista_record.email, '')) as email_masked,
    public.mask_telefono(COALESCE(transportista_record.telefono, '')) as telefono_masked,
    CASE 
      WHEN has_role(auth.uid(), 'SUPERADMIN'::app_role) THEN transportista_record.licencia_conducir
      ELSE '****' || right(COALESCE(transportista_record.licencia_conducir, ''), 2)
    END as licencia_conducir_masked,
    transportista_record.fecha_vencimiento_licencia,
    transportista_record.tipo_transportista,
    transportista_record.nombre_empresa,
    transportista_record.calificacion,
    transportista_record.activo,
    current_user_role as access_level,
    transportista_record.created_at,
    transportista_record.updated_at;
END;
$$;

-- 4. Create secure function for orden data with field-level access control
CREATE OR REPLACE FUNCTION public.get_orden_with_masking(orden_id uuid)
RETURNS TABLE (
  id uuid,
  numero_orden text,
  estado text,
  remitente_nombre text,
  remitente_documento_masked text,
  remitente_domicilio_masked text,
  remitente_localidad text,
  remitente_provincia text,
  destinatario_nombre text,
  destinatario_documento_masked text,
  destinatario_domicilio_masked text,
  destinatario_localidad text,
  destinatario_provincia text,
  access_level text,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  orden_record record;
  current_user_role text;
BEGIN
  -- Get user role
  SELECT role INTO current_user_role 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1;

  -- Check access permissions
  SELECT * INTO orden_record
  FROM public.ordenes_envio o
  WHERE o.id = orden_id
  AND (
    o.usuario_creacion_id = auth.uid() OR
    has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR
    has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
    has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role)
  );

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found or access denied';
  END IF;

  -- Log the access
  INSERT INTO public.sensitive_data_audit (
    user_id, table_name, record_id, field_name, access_type, ip_address
  ) VALUES (
    auth.uid(), 'ordenes_envio', orden_id, 'full_record_masked', 'view', inet_client_addr()
  );

  -- Return masked data
  RETURN QUERY SELECT
    orden_record.id,
    orden_record.numero_orden,
    orden_record.estado,
    orden_record.remitente_nombre,
    public.mask_documento(orden_record.remitente_documento) as remitente_documento_masked,
    public.mask_domicilio(orden_record.remitente_domicilio) as remitente_domicilio_masked,
    orden_record.remitente_localidad,
    orden_record.remitente_provincia,
    orden_record.destinatario_nombre,
    public.mask_documento(orden_record.destinatario_documento) as destinatario_documento_masked,
    public.mask_domicilio(orden_record.destinatario_domicilio) as destinatario_domicilio_masked,
    orden_record.destinatario_localidad,
    orden_record.destinatario_provincia,
    current_user_role as access_level,
    orden_record.created_at;
END;
$$;

-- 5. Create function to request access to sensitive data with approval workflow
CREATE OR REPLACE FUNCTION public.request_sensitive_data_access(
  target_table text,
  target_record_id uuid,
  target_fields text[],
  business_reason text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  request_id uuid;
BEGIN
  -- Create access request
  INSERT INTO public.sensitive_data_audit (
    user_id, table_name, record_id, field_name, access_type, access_reason, ip_address
  ) VALUES (
    auth.uid(), target_table, target_record_id, array_to_string(target_fields, ','), 'access_request', business_reason, inet_client_addr()
  ) RETURNING id INTO request_id;

  RETURN request_id;
END;
$$;