import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface QuoteRequest {
  origen: {
    provincia: string;
    localidad: string;
  };
  destino: {
    provincia: string;
    localidad: string;
  };
  paquete: {
    peso: number;
    valor_declarado: number;
    termosellado?: boolean;
  };
  servicio: {
    tipo_recoleccion: 'domicilio' | 'agencia';
    tipo_entrega: 'domicilio' | 'agencia';
  };
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

function obtenerPesoMaximo(peso: number): string {
  if (peso <= 5) return '0-5';
  if (peso <= 10) return '5-10';
  if (peso <= 15) return '10-15';
  if (peso <= 20) return '15-20';
  if (peso <= 25) return '20-25';
  return '25+';
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
      await logApiUsage('unknown', '/quotes', req.method, 401, requestIp, userAgent, Date.now() - startTime, 'Missing or invalid authorization header');
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = authHeader.replace('Bearer ', '');
    const keyValidation = await validateApiKey(apiKey);
    
    if (!keyValidation.valid) {
      await logApiUsage('unknown', '/quotes', req.method, 403, requestIp, userAgent, Date.now() - startTime, 'Invalid or expired API key');
      return new Response(
        JSON.stringify({ error: 'Invalid or expired API key' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    apiKeyData = keyValidation.data;

    // Parse request body
    const quoteData: QuoteRequest = await req.json();

    // Validate required fields
    if (!quoteData.origen?.provincia || !quoteData.destino?.provincia || 
        !quoteData.paquete?.peso || !quoteData.paquete?.valor_declarado) {
      await logApiUsage(apiKeyData.api_key_id, '/quotes', req.method, 400, requestIp, userAgent, Date.now() - startTime, 'Missing required fields');
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields', 
          required: ['origen.provincia', 'destino.provincia', 'paquete.peso', 'paquete.valor_declarado'] 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const pesoKg = quoteData.paquete.peso;
    const valorDeclarado = quoteData.paquete.valor_declarado;
    const termosellado = quoteData.paquete.termosellado || false;

    // Buscar tarifa en la base de datos
    const { data: tarifas, error: tarifasError } = await supabase
      .from('tarifas')
      .select('precio_base, tiempo_estimado_horas')
      .eq('provincia_origen', quoteData.origen.provincia)
      .eq('provincia_destino', quoteData.destino.provincia)
      .eq('activo', true)
      .maybeSingle();

    let flete = 0;
    let tiempoEstimadoHoras = 48; // Default 2 days

    if (tarifas) {
      flete = tarifas.precio_base;
      tiempoEstimadoHoras = tarifas.tiempo_estimado_horas || 48;
    } else {
      // Precio base por defecto si no hay tarifa específica
      const isInterprovincial = quoteData.origen.provincia !== quoteData.destino.provincia;
      flete = isInterprovincial ? 8000 : 3000; // More for interprovincial
    }

    // Ajustes por peso según cota seleccionada
    const ajustePorPeso = pesoKg > 5 ? Math.ceil((pesoKg - 5) / 5) * 500 : 0;
    flete += ajustePorPeso;

    // Calcular servicios de transportista
    let serviciosTransportista = 0;
    const serviciosRequeridos = [];
    
    if (quoteData.servicio.tipo_recoleccion === 'domicilio') {
      serviciosRequeridos.push('retiro_domicilio');
    } else {
      serviciosRequeridos.push('entrega_agencia_origen');
    }
    
    if (quoteData.servicio.tipo_entrega === 'domicilio') {
      serviciosRequeridos.push('entrega_domicilio');
    } else {
      serviciosRequeridos.push('retiro_agencia_destino');
    }

    // Obtener precios de servicios para el peso específico
    for (const servicio of serviciosRequeridos) {
      const { data: servicioData, error: servicioError } = await supabase
        .from('servicios_transportistas')
        .select('precio_adicional, multiplicador')
        .eq('tipo_servicio', servicio)
        .lte('peso_minimo', pesoKg)
        .gte('peso_maximo', pesoKg)
        .eq('activo', true)
        .limit(1)
        .maybeSingle();

      if (servicioData && !servicioError) {
        serviciosTransportista += servicioData.precio_adicional * servicioData.multiplicador;
      } else {
        // Precios por defecto si no hay configuración específica
        const preciosDefecto: Record<string, number> = {
          'retiro_domicilio': pesoKg <= 5 ? 500 : Math.ceil(pesoKg / 5) * 250,
          'entrega_domicilio': pesoKg <= 5 ? 600 : Math.ceil(pesoKg / 5) * 300,
          'entrega_agencia_origen': pesoKg <= 5 ? 200 : Math.ceil(pesoKg / 5) * 100,
          'retiro_agencia_destino': pesoKg <= 5 ? 250 : Math.ceil(pesoKg / 5) * 125,
        };
        serviciosTransportista += preciosDefecto[servicio] || 0;
      }
    }

    // Cálculos de la cotización
    const seguro = valorDeclarado * 0.001; // 0.1% del valor declarado
    const cargosAdministrativos = flete * 0.15; // 15% del flete
    const costoTermosellado = termosellado ? Math.min(flete * 0.25, 2000) : 0; // máximo $2000
    
    const subtotal = flete + seguro + cargosAdministrativos + costoTermosellado + serviciosTransportista;
    const iva = subtotal * 0.21; // 21% del subtotal
    const total = subtotal + iva;

    // Calculate delivery estimate
    const fechaEstimada = new Date();
    fechaEstimada.setHours(fechaEstimada.getHours() + tiempoEstimadoHoras);

    const responseData = {
      success: true,
      data: {
        cotizacion: {
          flete: Math.round(flete),
          seguro: Math.round(seguro),
          cargos_administrativos: Math.round(cargosAdministrativos),
          servicios_transportista: Math.round(serviciosTransportista),
          termosellado: Math.round(costoTermosellado),
          subtotal: Math.round(subtotal),
          iva: Math.round(iva),
          total: Math.round(total)
        },
        detalles: {
          ruta: `${quoteData.origen.provincia} → ${quoteData.destino.provincia}`,
          peso_categoria: obtenerPesoMaximo(pesoKg),
          tiempo_estimado_horas: tiempoEstimadoHoras,
          fecha_entrega_estimada: fechaEstimada.toISOString().split('T')[0],
          tipo_servicio: {
            recoleccion: quoteData.servicio.tipo_recoleccion,
            entrega: quoteData.servicio.tipo_entrega
          }
        },
        validez: {
          valida_hasta: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days
          moneda: 'ARS',
          impuestos_incluidos: false
        }
      }
    };

    // Log successful API usage
    await logApiUsage(apiKeyData.api_key_id, '/quotes', req.method, 200, requestIp, userAgent, Date.now() - startTime);

    return new Response(
      JSON.stringify(responseData),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('Error in quotes:', error);
    
    // Log error
    if (apiKeyData) {
      await logApiUsage(apiKeyData.api_key_id, '/quotes', req.method, 500, requestIp, userAgent, Date.now() - startTime, error.message);
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