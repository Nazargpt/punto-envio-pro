import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ShipmentRequest {
  remitente: {
    nombre: string;
    documento: string;
    domicilio: string;
    localidad: string;
    provincia: string;
    telefono?: string;
    email?: string;
  };
  destinatario: {
    nombre: string;
    documento: string;
    domicilio: string;
    localidad: string;
    provincia: string;
    telefono?: string;
    email?: string;
  };
  paquete: {
    peso: number;
    valor_declarado: number;
    descripcion: string;
    largo_cm?: number;
    ancho_cm?: number;
    alto_cm?: number;
    fragil?: boolean;
  };
  servicio: {
    tipo_recoleccion: 'domicilio' | 'agencia';
    tipo_entrega: 'domicilio' | 'agencia';
    agencia_origen_id?: string;
    agencia_destino_id?: string;
    fecha_recoleccion?: string;
    hora_recoleccion?: string;
    fecha_entrega?: string;
    hora_entrega?: string;
    termosellado?: boolean;
  };
  external_reference?: string;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

async function validateApiKey(apiKey: string) {
  const { data: keyData, error } = await supabase.rpc('validate_api_key', {
    provided_key: apiKey
  });

  if (error || !keyData || keyData.length === 0) {
    return { valid: false, data: null };
  }

  const key = keyData[0];
  return { 
    valid: key.is_valid && key.permissions.includes('write'),
    data: key
  };
}

async function logApiUsage(
  apiKeyId: string, 
  endpoint: string, 
  method: string, 
  statusCode: number, 
  requestIp: string | null,
  userAgent: string | null,
  responseTimeMs: number,
  errorMessage?: string
) {
  await supabase.from('api_usage_logs').insert({
    api_key_id: apiKeyId,
    endpoint,
    method,
    status_code: statusCode,
    request_ip: requestIp,
    user_agent: userAgent,
    response_time_ms: responseTimeMs,
    error_message: errorMessage
  });
}

async function triggerWebhook(apiKeyId: string, eventType: string, payload: any) {
  // Get webhook configurations for this API key
  const { data: webhooks } = await supabase
    .from('webhook_configurations')
    .select('*')
    .eq('api_key_id', apiKeyId)
    .eq('is_active', true)
    .contains('events', [eventType]);

  if (!webhooks || webhooks.length === 0) return;

  // Send webhooks asynchronously
  for (const webhook of webhooks) {
    try {
      const signature = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(webhook.secret_token + JSON.stringify(payload))
      );
      const signatureHex = Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      const response = await fetch(webhook.webhook_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-PuntoEnvio-Signature': `sha256=${signatureHex}`,
          'X-PuntoEnvio-Event': eventType,
        },
        body: JSON.stringify(payload),
      });

      // Log webhook delivery
      await supabase.from('webhook_delivery_logs').insert({
        webhook_config_id: webhook.id,
        event_type: eventType,
        payload,
        status_code: response.status,
        response_body: await response.text(),
        delivered_at: response.ok ? new Date().toISOString() : null,
        error_message: response.ok ? null : `HTTP ${response.status}`,
      });
    } catch (error: any) {
      // Log failed webhook
      await supabase.from('webhook_delivery_logs').insert({
        webhook_config_id: webhook.id,
        event_type: eventType,
        payload,
        status_code: 0,
        error_message: error.message,
      });
    }
  }
}

serve(async (req) => {
  const startTime = Date.now();
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const requestIp = req.headers.get('x-forwarded-for') || 
                   req.headers.get('x-real-ip') || 
                   'unknown';
  const userAgent = req.headers.get('user-agent');
  let apiKeyData: any = null;

  try {
    // Validate API Key
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      await logApiUsage('unknown', '/create-shipment', req.method, 401, requestIp, userAgent, Date.now() - startTime, 'Missing or invalid authorization header');
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = authHeader.replace('Bearer ', '');
    const keyValidation = await validateApiKey(apiKey);
    
    if (!keyValidation.valid) {
      await logApiUsage('unknown', '/create-shipment', req.method, 403, requestIp, userAgent, Date.now() - startTime, 'Invalid or expired API key');
      return new Response(
        JSON.stringify({ error: 'Invalid or expired API key' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    apiKeyData = keyValidation.data;

    // Parse request body
    const shipmentData: ShipmentRequest = await req.json();

    // Validate required fields
    if (!shipmentData.remitente?.nombre || !shipmentData.destinatario?.nombre || 
        !shipmentData.paquete?.descripcion || !shipmentData.servicio?.tipo_recoleccion) {
      await logApiUsage(apiKeyData.api_key_id, '/create-shipment', req.method, 400, requestIp, userAgent, Date.now() - startTime, 'Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields', required: ['remitente.nombre', 'destinatario.nombre', 'paquete.descripcion', 'servicio.tipo_recoleccion'] }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate order number
    const { data: numeroOrden, error: ordenError } = await supabase.rpc('generate_api_orden_number');
    if (ordenError) {
      throw new Error('Failed to generate order number: ' + ordenError.message);
    }

    // Create order in database
    const orderData = {
      numero_orden: numeroOrden,
      remitente_nombre: shipmentData.remitente.nombre,
      remitente_documento: shipmentData.remitente.documento,
      remitente_domicilio: shipmentData.remitente.domicilio,
      remitente_provincia: shipmentData.remitente.provincia,
      remitente_localidad: shipmentData.remitente.localidad,
      destinatario_nombre: shipmentData.destinatario.nombre,
      destinatario_documento: shipmentData.destinatario.documento,
      destinatario_domicilio: shipmentData.destinatario.domicilio,
      destinatario_provincia: shipmentData.destinatario.provincia,
      destinatario_localidad: shipmentData.destinatario.localidad,
      tipo_recoleccion: shipmentData.servicio.tipo_recoleccion,
      tipo_entrega: shipmentData.servicio.tipo_entrega,
      agencia_origen_id: shipmentData.servicio.agencia_origen_id || null,
      agencia_destino_id: shipmentData.servicio.agencia_destino_id || null,
      fecha_recoleccion: shipmentData.servicio.fecha_recoleccion || null,
      hora_recoleccion: shipmentData.servicio.hora_recoleccion || null,
      fecha_entrega: shipmentData.servicio.fecha_entrega || null,
      hora_entrega: shipmentData.servicio.hora_entrega || null,
      estado: 'pendiente',
      estado_detallado: 'pendiente',
      // Create a system user ID for API orders
      usuario_creacion_id: '00000000-0000-0000-0000-000000000000'
    };

    const { data: newOrder, error: insertError } = await supabase
      .from('ordenes_envio')
      .insert(orderData)
      .select('*')
      .single();

    if (insertError) {
      throw new Error('Failed to create order: ' + insertError.message);
    }

    // Create package record
    if (shipmentData.paquete) {
      const packageData = {
        orden_envio_id: newOrder.id,
        descripcion: shipmentData.paquete.descripcion,
        peso_kg: shipmentData.paquete.peso,
        valor_declarado: shipmentData.paquete.valor_declarado,
        largo_cm: shipmentData.paquete.largo_cm || null,
        ancho_cm: shipmentData.paquete.ancho_cm || null,
        alto_cm: shipmentData.paquete.alto_cm || null,
        fragil: shipmentData.paquete.fragil || false
      };

      await supabase.from('paquetes').insert(packageData);
    }

    // Create initial tracking entry
    await supabase.from('seguimiento_detallado').insert({
      orden_envio_id: newOrder.id,
      estado: 'pendiente',
      descripcion: 'Orden creada vía API externa',
      ubicacion: shipmentData.remitente.localidad + ', ' + shipmentData.remitente.provincia,
      observaciones: `Creado por ${apiKeyData.key_name} - Ref: ${shipmentData.external_reference || 'N/A'}`
    });

    const responseData = {
      success: true,
      data: {
        numero_orden: newOrder.numero_orden,
        id: newOrder.id,
        estado: newOrder.estado,
        created_at: newOrder.created_at,
        tracking_url: `https://zyowxsfzfuunjlufxqik.supabase.co/functions/v1/tracking/${newOrder.numero_orden}`,
        external_reference: shipmentData.external_reference
      }
    };

    // Log successful API usage
    await logApiUsage(apiKeyData.api_key_id, '/create-shipment', req.method, 201, requestIp, userAgent, Date.now() - startTime);

    // Trigger webhook asynchronously
    triggerWebhook(apiKeyData.api_key_id, 'shipment_created', {
      numero_orden: newOrder.numero_orden,
      estado: newOrder.estado,
      external_reference: shipmentData.external_reference,
      created_at: newOrder.created_at,
      remitente: {
        localidad: shipmentData.remitente.localidad,
        provincia: shipmentData.remitente.provincia
      },
      destinatario: {
        localidad: shipmentData.destinatario.localidad,
        provincia: shipmentData.destinatario.provincia
      }
    });

    return new Response(
      JSON.stringify(responseData),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('Error in create-shipment:', error);
    
    // Log error
    if (apiKeyData) {
      await logApiUsage(apiKeyData.api_key_id, '/create-shipment', req.method, 500, requestIp, userAgent, Date.now() - startTime, error.message);
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});