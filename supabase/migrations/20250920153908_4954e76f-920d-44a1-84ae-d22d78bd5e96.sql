-- CRITICAL SECURITY FIX: Secure order access function
CREATE OR REPLACE FUNCTION public.get_orders_secure(
  user_orders_only boolean DEFAULT false,
  limit_count integer DEFAULT 50
)
RETURNS TABLE(
  id uuid,
  numero_orden text,
  estado text,
  estado_detallado text,
  remitente_nombre_masked text,
  remitente_documento_masked text,
  remitente_domicilio_masked text,
  remitente_localidad text,
  remitente_provincia text,
  destinatario_nombre_masked text,
  destinatario_documento_masked text,
  destinatario_domicilio_masked text,
  destinatario_localidad text,
  destinatario_provincia text,
  fecha_recoleccion date,
  fecha_entrega date,
  tipo_recoleccion text,
  tipo_entrega text,
  agencia_origen_id uuid,
  agencia_destino_id uuid,
  usuario_creacion_id uuid,
  access_level text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  current_user_role text;
BEGIN
  -- Check if user has permission to access order data
  IF NOT (
    has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR
    has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
    has_role(auth.uid(), 'SUPERVISOR'::app_role) OR
    has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role) OR
    auth.uid() IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'Access denied: insufficient privileges';
  END IF;

  -- Get user role for access level tracking
  SELECT role INTO current_user_role 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1;

  -- Log the access for audit purposes
  INSERT INTO public.sensitive_data_audit (
    user_id, table_name, field_name, access_type, access_reason, ip_address
  ) VALUES (
    auth.uid(), 'ordenes_envio', 'bulk_orders_masked', 'secure_list_access', 
    'Accessing orders list with data masking', inet_client_addr()
  );

  -- Return masked order data
  RETURN QUERY
  SELECT 
    o.id,
    o.numero_orden,
    o.estado,
    o.estado_detallado,
    public.mask_nombre(o.remitente_nombre) as remitente_nombre_masked,
    public.mask_documento(o.remitente_documento) as remitente_documento_masked,
    public.mask_domicilio(o.remitente_domicilio) as remitente_domicilio_masked,
    o.remitente_localidad,
    o.remitente_provincia,
    public.mask_nombre(o.destinatario_nombre) as destinatario_nombre_masked,
    public.mask_documento(o.destinatario_documento) as destinatario_documento_masked,
    public.mask_domicilio(o.destinatario_domicilio) as destinatario_domicilio_masked,
    o.destinatario_localidad,
    o.destinatario_provincia,
    o.fecha_recoleccion,
    o.fecha_entrega,
    o.tipo_recoleccion,
    o.tipo_entrega,
    o.agencia_origen_id,
    o.agencia_destino_id,
    o.usuario_creacion_id,
    COALESCE(current_user_role, 'USER') as access_level,
    o.created_at,
    o.updated_at
  FROM public.ordenes_envio o
  WHERE 
    CASE 
      WHEN user_orders_only THEN o.usuario_creacion_id = auth.uid()
      ELSE (
        o.usuario_creacion_id = auth.uid() OR
        has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR
        has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
        has_role(auth.uid(), 'SUPERVISOR'::app_role) OR
        has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role)
      )
    END
  ORDER BY o.created_at DESC
  LIMIT limit_count;
END;
$function$