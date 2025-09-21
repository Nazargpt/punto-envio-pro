-- Crear tabla para gestión de API Keys para integraciones externas
CREATE TABLE public.api_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key_name TEXT NOT NULL,
  api_key TEXT NOT NULL UNIQUE,
  secret_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  permissions JSONB NOT NULL DEFAULT '["read", "write"]'::jsonb,
  rate_limit_per_minute INTEGER NOT NULL DEFAULT 100,
  company_name TEXT,
  contact_email TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS en api_keys
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Solo superadmins pueden gestionar API keys
CREATE POLICY "Only superadmins can manage API keys"
ON public.api_keys
FOR ALL
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role))
WITH CHECK (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- Crear tabla para logs de API usage
CREATE TABLE public.api_usage_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  api_key_id UUID REFERENCES public.api_keys(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  request_ip INET,
  user_agent TEXT,
  request_body_size INTEGER,
  response_time_ms INTEGER,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS en api_usage_logs
ALTER TABLE public.api_usage_logs ENABLE ROW LEVEL SECURITY;

-- Solo superadmins pueden ver logs de API
CREATE POLICY "Only superadmins can view API usage logs"
ON public.api_usage_logs
FOR SELECT
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- Crear tabla para configuración de webhooks
CREATE TABLE public.webhook_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  api_key_id UUID REFERENCES public.api_keys(id) ON DELETE CASCADE,
  webhook_url TEXT NOT NULL,
  secret_token TEXT NOT NULL,
  events TEXT[] NOT NULL DEFAULT '{"shipment_created", "status_updated", "delivered"}'::text[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  max_retries INTEGER NOT NULL DEFAULT 3,
  retry_delay_seconds INTEGER NOT NULL DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS en webhook_configurations
ALTER TABLE public.webhook_configurations ENABLE ROW LEVEL SECURITY;

-- Solo superadmins pueden gestionar webhooks
CREATE POLICY "Only superadmins can manage webhooks"
ON public.webhook_configurations
FOR ALL
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role))
WITH CHECK (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- Crear tabla para logs de webhooks
CREATE TABLE public.webhook_delivery_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  webhook_config_id UUID REFERENCES public.webhook_configurations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status_code INTEGER,
  response_body TEXT,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  delivered_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS en webhook_delivery_logs
ALTER TABLE public.webhook_delivery_logs ENABLE ROW LEVEL SECURITY;

-- Solo superadmins pueden ver logs de webhooks
CREATE POLICY "Only superadmins can view webhook logs"
ON public.webhook_delivery_logs
FOR SELECT
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- Crear función para validar API Key
CREATE OR REPLACE FUNCTION public.validate_api_key(provided_key TEXT)
RETURNS TABLE(
  api_key_id UUID,
  key_name TEXT,
  permissions JSONB,
  rate_limit_per_minute INTEGER,
  is_valid BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ak.id,
    ak.key_name,
    ak.permissions,
    ak.rate_limit_per_minute,
    (ak.is_active AND (ak.expires_at IS NULL OR ak.expires_at > now())) as is_valid
  FROM public.api_keys ak
  WHERE ak.api_key = provided_key;
  
  -- Update last_used_at
  UPDATE public.api_keys 
  SET last_used_at = now() 
  WHERE api_key = provided_key;
END;
$$;

-- Crear función para generar números de orden únicos para API
CREATE OR REPLACE FUNCTION public.generate_api_orden_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    year_part TEXT;
    sequence_num INT;
    formatted_num TEXT;
BEGIN
    year_part := EXTRACT(year FROM CURRENT_DATE)::TEXT;
    
    SELECT COUNT(*) + 1 INTO sequence_num
    FROM public.ordenes_envio
    WHERE EXTRACT(year FROM created_at) = EXTRACT(year FROM CURRENT_DATE);
    
    formatted_num := LPAD(sequence_num::TEXT, 6, '0');
    
    RETURN 'PE-' || year_part || '-' || formatted_num;
END;
$$;

-- Crear trigger para actualizar updated_at en las tablas nuevas
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_api_keys_updated_at
BEFORE UPDATE ON public.api_keys
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_webhook_configurations_updated_at
BEFORE UPDATE ON public.webhook_configurations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();