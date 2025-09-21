import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    valid: key.is_valid && key.permissions.includes('read'),
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
    // Extract order number from URL path
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const numeroOrden = pathParts[pathParts.length - 1];

    if (!numeroOrden || numeroOrden === 'tracking') {
      return new Response(
        JSON.stringify({ error: 'Order number is required in URL path. Use: /tracking/{order_number}' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For public tracking (no API key required for basic info)
    const authHeader = req.headers.get('authorization');
    let isAuthenticated = false;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const apiKey = authHeader.replace('Bearer ', '');
      const keyValidation = await validateApiKey(apiKey);
      
      if (keyValidation.valid) {
        isAuthenticated = true;
        apiKeyData = keyValidation.data;
      }
    }

    // Get basic order information (always available)
    const { data: orderData, error: orderError } = await supabase.rpc('get_order_public_info', {
      order_number: numeroOrden
    });

    if (orderError || !orderData || orderData.length === 0) {
      const apiKeyId = apiKeyData?.api_key_id || 'public';
      await logApiUsage(apiKeyId, '/tracking', req.method, 404, requestIp, userAgent, Date.now() - startTime, 'Order not found');
      
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const order = orderData[0];

    // Get tracking history
    const { data: trackingData, error: trackingError } = await supabase.rpc('get_tracking_info', {
      order_number: numeroOrden
    });

    const response: any = {
      numero_orden: order.numero_orden,
      estado: order.estado,
      created_at: order.created_at,
      remitente: {
        nombre_publico: order.remitente_nombre_publico,
        localidad: order.remitente_localidad
      },
      destinatario: {
        nombre_publico: order.destinatario_nombre_publico,
        localidad: order.destinatario_localidad
      }
    };

    // Add tracking history if available
    if (trackingData && trackingData.length > 0) {
      response.historial = trackingData.map((entry: any) => ({
        fecha_hora: entry.fecha_hora,
        estado: entry.estado,
        descripcion: entry.descripcion,
        ubicacion: entry.ubicacion
      }));

      // Calculate estimated delivery date (simple logic: +2 days from creation)
      const createdDate = new Date(order.created_at);
      createdDate.setDate(createdDate.getDate() + 2);
      response.fecha_estimada_entrega = createdDate.toISOString().split('T')[0];
      
      // Current location from latest tracking entry
      if (trackingData.length > 0) {
        response.ubicacion_actual = trackingData[0].ubicacion;
      }
    }

    // Add additional details if authenticated
    if (isAuthenticated && apiKeyData) {
      // Get more detailed information for authenticated requests
      const { data: detailedOrder } = await supabase
        .from('ordenes_envio')
        .select(`
          *,
          paquetes (*)
        `)
        .eq('numero_orden', numeroOrden)
        .single();

      if (detailedOrder) {
        response.detalles_completos = {
          tipo_recoleccion: detailedOrder.tipo_recoleccion,
          tipo_entrega: detailedOrder.tipo_entrega,
          fecha_recoleccion: detailedOrder.fecha_recoleccion,
          fecha_entrega: detailedOrder.fecha_entrega,
          estado_detallado: detailedOrder.estado_detallado
        };

        if (detailedOrder.paquetes && detailedOrder.paquetes.length > 0) {
          response.paquete = {
            descripcion: detailedOrder.paquetes[0].descripcion,
            peso_kg: detailedOrder.paquetes[0].peso_kg,
            valor_declarado: detailedOrder.paquetes[0].valor_declarado,
            fragil: detailedOrder.paquetes[0].fragil
          };
        }
      }

      await logApiUsage(apiKeyData.api_key_id, '/tracking', req.method, 200, requestIp, userAgent, Date.now() - startTime);
    } else {
      // Log public access
      await logApiUsage('public', '/tracking', req.method, 200, requestIp, userAgent, Date.now() - startTime);
    }

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('Error in tracking:', error);
    
    // Log error
    const apiKeyId = apiKeyData?.api_key_id || 'public';
    await logApiUsage(apiKeyId, '/tracking', req.method, 500, requestIp, userAgent, Date.now() - startTime, error.message);

    return new Response(
      JSON.stringify({ 
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