import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebhookConfig {
  webhook_url: string;
  secret_token: string;
  events: string[];
  max_retries?: number;
  retry_delay_seconds?: number;
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
      await logApiUsage('unknown', '/webhooks', req.method, 401, requestIp, userAgent, Date.now() - startTime, 'Missing or invalid authorization header');
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = authHeader.replace('Bearer ', '');
    const keyValidation = await validateApiKey(apiKey);
    
    if (!keyValidation.valid) {
      await logApiUsage('unknown', '/webhooks', req.method, 403, requestIp, userAgent, Date.now() - startTime, 'Invalid or expired API key');
      return new Response(
        JSON.stringify({ error: 'Invalid or expired API key' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    apiKeyData = keyValidation.data;

    // Handle different HTTP methods
    if (req.method === 'GET') {
      // Get existing webhook configs
      const { data: configs, error } = await supabase
        .from('webhook_configurations')
        .select('*')
        .eq('api_key_id', apiKeyData.api_key_id);

      if (error) {
        throw new Error('Failed to fetch webhook configurations: ' + error.message);
      }

      await logApiUsage(apiKeyData.api_key_id, '/webhooks', req.method, 200, requestIp, userAgent, Date.now() - startTime);

      return new Response(
        JSON.stringify({
          success: true,
          data: configs?.map(config => ({
            id: config.id,
            webhook_url: config.webhook_url,
            events: config.events,
            is_active: config.is_active,
            max_retries: config.max_retries,
            retry_delay_seconds: config.retry_delay_seconds,
            created_at: config.created_at,
            updated_at: config.updated_at
          })) || []
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (req.method === 'POST') {
      // Create new webhook config
      const webhookData: WebhookConfig = await req.json();

      // Validate required fields
      if (!webhookData.webhook_url || !webhookData.secret_token || !webhookData.events) {
        await logApiUsage(apiKeyData.api_key_id, '/webhooks', req.method, 400, requestIp, userAgent, Date.now() - startTime, 'Missing required fields');
        return new Response(
          JSON.stringify({ 
            error: 'Missing required fields', 
            required: ['webhook_url', 'secret_token', 'events'] 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Validate webhook URL format
      try {
        new URL(webhookData.webhook_url);
      } catch {
        await logApiUsage(apiKeyData.api_key_id, '/webhooks', req.method, 400, requestIp, userAgent, Date.now() - startTime, 'Invalid webhook URL format');
        return new Response(
          JSON.stringify({ error: 'Invalid webhook URL format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Validate events
      const validEvents = ['shipment_created', 'status_updated', 'delivered', 'cancelled', 'exception'];
      const invalidEvents = webhookData.events.filter(event => !validEvents.includes(event));
      
      if (invalidEvents.length > 0) {
        await logApiUsage(apiKeyData.api_key_id, '/webhooks', req.method, 400, requestIp, userAgent, Date.now() - startTime, 'Invalid event types');
        return new Response(
          JSON.stringify({ 
            error: 'Invalid event types', 
            invalid_events: invalidEvents,
            valid_events: validEvents
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create webhook configuration
      const { data: newConfig, error: insertError } = await supabase
        .from('webhook_configurations')
        .insert({
          api_key_id: apiKeyData.api_key_id,
          webhook_url: webhookData.webhook_url,
          secret_token: webhookData.secret_token,
          events: webhookData.events,
          max_retries: webhookData.max_retries || 3,
          retry_delay_seconds: webhookData.retry_delay_seconds || 60,
          is_active: true
        })
        .select('*')
        .single();

      if (insertError) {
        throw new Error('Failed to create webhook configuration: ' + insertError.message);
      }

      await logApiUsage(apiKeyData.api_key_id, '/webhooks', req.method, 201, requestIp, userAgent, Date.now() - startTime);

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            id: newConfig.id,
            webhook_url: newConfig.webhook_url,
            events: newConfig.events,
            is_active: newConfig.is_active,
            max_retries: newConfig.max_retries,
            retry_delay_seconds: newConfig.retry_delay_seconds,
            created_at: newConfig.created_at
          }
        }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (req.method === 'PUT') {
      // Update webhook config
      const url = new URL(req.url);
      const pathParts = url.pathname.split('/');
      const webhookId = pathParts[pathParts.length - 1];

      if (!webhookId || webhookId === 'webhooks') {
        return new Response(
          JSON.stringify({ error: 'Webhook ID is required in URL path. Use: /webhooks/{webhook_id}' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const updateData = await req.json();

      // Update webhook configuration
      const { data: updatedConfig, error: updateError } = await supabase
        .from('webhook_configurations')
        .update(updateData)
        .eq('id', webhookId)
        .eq('api_key_id', apiKeyData.api_key_id)
        .select('*')
        .single();

      if (updateError) {
        throw new Error('Failed to update webhook configuration: ' + updateError.message);
      }

      await logApiUsage(apiKeyData.api_key_id, '/webhooks', req.method, 200, requestIp, userAgent, Date.now() - startTime);

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            id: updatedConfig.id,
            webhook_url: updatedConfig.webhook_url,
            events: updatedConfig.events,
            is_active: updatedConfig.is_active,
            max_retries: updatedConfig.max_retries,
            retry_delay_seconds: updatedConfig.retry_delay_seconds,
            updated_at: updatedConfig.updated_at
          }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (req.method === 'DELETE') {
      // Delete webhook config
      const url = new URL(req.url);
      const pathParts = url.pathname.split('/');
      const webhookId = pathParts[pathParts.length - 1];

      if (!webhookId || webhookId === 'webhooks') {
        return new Response(
          JSON.stringify({ error: 'Webhook ID is required in URL path. Use: /webhooks/{webhook_id}' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Delete webhook configuration
      const { error: deleteError } = await supabase
        .from('webhook_configurations')
        .delete()
        .eq('id', webhookId)
        .eq('api_key_id', apiKeyData.api_key_id);

      if (deleteError) {
        throw new Error('Failed to delete webhook configuration: ' + deleteError.message);
      }

      await logApiUsage(apiKeyData.api_key_id, '/webhooks', req.method, 204, requestIp, userAgent, Date.now() - startTime);

      return new Response(
        JSON.stringify({ success: true, message: 'Webhook configuration deleted' }),
        { status: 204, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else {
      // Method not allowed
      await logApiUsage(apiKeyData.api_key_id, '/webhooks', req.method, 405, requestIp, userAgent, Date.now() - startTime, 'Method not allowed');
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error: any) {
    console.error('Error in webhooks:', error);
    
    // Log error
    if (apiKeyData) {
      await logApiUsage(apiKeyData.api_key_id, '/webhooks', req.method, 500, requestIp, userAgent, Date.now() - startTime, error.message);
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