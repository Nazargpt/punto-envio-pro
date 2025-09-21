/**
 * DOCUMENTACIÓN TÉCNICA COMPLETA - API PUNTOENVIO
 * Para integración con SuperPasajes y sistemas externos
 * Versión: 1.0.0
 * Fecha: 2025-09-21
 */

export const API_DOCUMENTATION = {
  
  // ==========================================
  // 1. INFORMACIÓN DE CONEXIÓN
  // ==========================================
  connection: {
    base_url: "https://zyowxsfzfuunjlufxqik.supabase.co/functions/v1",
    authentication: {
      type: "Bearer Token",
      header: "Authorization",
      format: "Bearer {API_KEY}",
      description: "Todas las requests requieren API Key excepto tracking público"
    },
    required_headers: {
      "Authorization": "Bearer {API_KEY}",
      "Content-Type": "application/json"
    },
    environments: {
      production: {
        base_url: "https://zyowxsfzfuunjlufxqik.supabase.co/functions/v1",
        description: "Ambiente de producción"
      },
      testing: {
        base_url: "https://zyowxsfzfuunjlufxqik.supabase.co/functions/v1",
        description: "Mismo ambiente - usar suffix '-test' en external_reference"
      }
    }
  },

  // ==========================================
  // 2. ENDPOINTS PRINCIPALES  
  // ==========================================
  endpoints: {
    
    // CREAR ENVÍO
    create_shipment: {
      method: "POST",
      url: "/create-shipment",
      description: "Crear un nuevo envío en el sistema",
      authentication: "Required",
      request_body: {
        remitente: {
          nombre: "string (required) - Nombre completo del remitente",
          documento: "string (required) - DNI/CUIT del remitente", 
          domicilio: "string (required) - Dirección completa",
          localidad: "string (required) - Ciudad/Localidad",
          provincia: "string (required) - Provincia argentina",
          telefono: "string (optional) - Teléfono de contacto",
          email: "string (optional) - Email de contacto"
        },
        destinatario: {
          nombre: "string (required) - Nombre completo del destinatario",
          documento: "string (required) - DNI/CUIT del destinatario",
          domicilio: "string (required) - Dirección completa", 
          localidad: "string (required) - Ciudad/Localidad",
          provincia: "string (required) - Provincia argentina",
          telefono: "string (optional) - Teléfono de contacto",
          email: "string (optional) - Email de contacto"
        },
        paquete: {
          peso: "number (required) - Peso en kilogramos",
          valor_declarado: "number (required) - Valor en pesos argentinos",
          descripcion: "string (required) - Descripción del contenido",
          largo_cm: "number (optional) - Largo en centímetros",
          ancho_cm: "number (optional) - Ancho en centímetros", 
          alto_cm: "number (optional) - Alto en centímetros",
          fragil: "boolean (optional) - Indica si es frágil"
        },
        servicio: {
          tipo_recoleccion: "string (required) - 'domicilio' | 'agencia'",
          tipo_entrega: "string (required) - 'domicilio' | 'agencia'",
          agencia_origen_id: "string (optional) - UUID agencia origen si tipo_recoleccion='agencia'",
          agencia_destino_id: "string (optional) - UUID agencia destino si tipo_entrega='agencia'",
          fecha_recoleccion: "string (optional) - Fecha YYYY-MM-DD",
          hora_recoleccion: "string (optional) - Hora HH:MM",
          fecha_entrega: "string (optional) - Fecha YYYY-MM-DD",
          hora_entrega: "string (optional) - Hora HH:MM",
          termosellado: "boolean (optional) - Servicio de termosellado"
        },
        external_reference: "string (optional) - Referencia externa del cliente"
      },
      response_success: {
        success: true,
        data: {
          numero_orden: "PE-2025-000001",
          id: "uuid",
          estado: "pendiente",
          created_at: "2025-09-21T10:30:00.000Z",
          tracking_url: "https://zyowxsfzfuunjlufxqik.supabase.co/functions/v1/tracking/PE-2025-000001",
          external_reference: "SUP-12345"  
        }
      },
      status_codes: {
        201: "Envío creado exitosamente",
        400: "Datos inválidos o campos faltantes",
        401: "Authorization header faltante",
        403: "API Key inválida o sin permisos",
        500: "Error interno del servidor"
      }
    },

    // CONSULTAR ESTADO
    tracking: {
      method: "GET", 
      url: "/tracking/{numero_orden}",
      description: "Consultar estado y seguimiento de un envío",
      authentication: "Optional (más detalles con API Key)",
      path_parameters: {
        numero_orden: "string (required) - Número de orden (ej: PE-2025-000001)"
      },
      response_public: {
        numero_orden: "PE-2025-000001",
        estado: "en_transito",
        created_at: "2025-09-21T10:30:00.000Z",
        remitente: {
          nombre_publico: "Juan",
          localidad: "CABA"
        },
        destinatario: {
          nombre_publico: "María", 
          localidad: "Córdoba"
        },
        historial: [
          {
            fecha_hora: "2025-09-21T11:00:00.000Z",
            estado: "recolectado",
            descripcion: "Paquete recolectado desde origen",
            ubicacion: "CABA, Buenos Aires"
          }
        ],
        fecha_estimada_entrega: "2025-09-23",
        ubicacion_actual: "En tránsito hacia Córdoba"
      },
      response_authenticated: {
        "...public_data": "Incluye todos los datos públicos +",
        detalles_completos: {
          tipo_recoleccion: "domicilio",
          tipo_entrega: "domicilio", 
          fecha_recoleccion: "2025-09-21",
          fecha_entrega: "2025-09-23",
          estado_detallado: "en_transito_larga_distancia"
        },
        paquete: {
          descripcion: "Documentos",
          peso_kg: 0.5,
          valor_declarado: 50000,
          fragil: false
        }
      },
      status_codes: {
        200: "Información de seguimiento obtenida",
        404: "Orden no encontrada", 
        500: "Error interno del servidor"
      }
    },

    // OBTENER COTIZACIÓN
    quotes: {
      method: "POST",
      url: "/quotes", 
      description: "Obtener cotización de envío",
      authentication: "Required",
      request_body: {
        origen: {
          provincia: "string (required) - Provincia de origen",
          localidad: "string (required) - Localidad de origen"
        },
        destino: {
          provincia: "string (required) - Provincia de destino",
          localidad: "string (required) - Localidad de destino"
        },
        paquete: {
          peso: "number (required) - Peso en kilogramos",
          valor_declarado: "number (required) - Valor declarado en ARS",
          termosellado: "boolean (optional) - Servicio de termosellado"
        },
        servicio: {
          tipo_recoleccion: "string (required) - 'domicilio' | 'agencia'",
          tipo_entrega: "string (required) - 'domicilio' | 'agencia'"
        }
      },
      response_success: {
        success: true,
        data: {
          cotizacion: {
            flete: 8000,
            seguro: 50,
            cargos_administrativos: 1200,
            servicios_transportista: 1100,
            termosellado: 0,
            subtotal: 10350,
            iva: 2174,
            total: 12524
          },
          detalles: {
            ruta: "Buenos Aires → Córdoba",
            peso_categoria: "0-5",
            tiempo_estimado_horas: 48,
            fecha_entrega_estimada: "2025-09-23",
            tipo_servicio: {
              recoleccion: "domicilio",
              entrega: "domicilio"
            }
          },
          validez: {
            valida_hasta: "2025-09-28",
            moneda: "ARS", 
            impuestos_incluidos: false
          }
        }
      },
      status_codes: {
        200: "Cotización generada exitosamente",
        400: "Datos inválidos o campos faltantes",
        401: "Authorization header faltante",
        403: "API Key inválida o sin permisos",
        500: "Error interno del servidor"
      }
    },

    // GESTIÓN DE WEBHOOKS
    webhooks: {
      methods: ["GET", "POST", "PUT", "DELETE"],
      base_url: "/webhooks",
      description: "Gestionar configuraciones de webhooks para notificaciones",
      authentication: "Required",
      
      get_webhooks: {
        method: "GET",
        url: "/webhooks",
        description: "Obtener configuraciones de webhooks existentes",
        response: {
          success: true,
          data: [
            {
              id: "uuid",
              webhook_url: "https://superpasajes.com/webhooks/puntoenvio",
              events: ["shipment_created", "status_updated", "delivered"],
              is_active: true,
              max_retries: 3,
              retry_delay_seconds: 60,
              created_at: "2025-09-21T10:00:00.000Z",
              updated_at: "2025-09-21T10:00:00.000Z"
            }
          ]
        }
      },

      create_webhook: {
        method: "POST", 
        url: "/webhooks",
        description: "Crear nueva configuración de webhook",
        request_body: {
          webhook_url: "string (required) - URL completa del webhook",
          secret_token: "string (required) - Token secreto para validación",
          events: "array (required) - Lista de eventos a notificar",
          max_retries: "number (optional) - Máximo reintentos (default: 3)",
          retry_delay_seconds: "number (optional) - Delay entre reintentos (default: 60)"
        },
        valid_events: [
          "shipment_created", 
          "status_updated",
          "delivered", 
          "cancelled",
          "exception"
        ]
      }
    }
  },

  // ==========================================
  // 3. MODELOS DE DATOS
  // ==========================================
  data_models: {
    
    estados_envio: {
      pendiente: "Orden creada, pendiente de recolección",
      recolectado: "Paquete recogido desde origen", 
      en_transito: "En camino hacia destino",
      en_destino: "Llegó a ciudad de destino",
      entregado: "Entregado al destinatario",
      cancelado: "Orden cancelada"
    },

    provincias_argentina: [
      "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", 
      "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", 
      "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", 
      "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe", 
      "Santiago del Estero", "Tierra del Fuego", "Tucumán"
    ],

    estructura_orden: {
      numero_orden: "Formato: PE-YYYY-NNNNNN",
      estados_posibles: ["pendiente", "recolectado", "en_transito", "en_destino", "entregado", "cancelado"],
      peso_categorias: ["0-5", "5-10", "10-15", "15-20", "20-25", "25+"],
      tipos_servicio: ["domicilio", "agencia"]
    }
  },

  // ==========================================
  // 4. CONFIGURACIÓN TÉCNICA
  // ==========================================
  technical_config: {
    timeouts: {
      connection: "30 segundos",
      request: "60 segundos", 
      recommendation: "Usar timeout de 30s para conexión y 60s para request completo"
    },
    rate_limiting: {
      default: "100 requests por minuto por API Key",
      burst: "Hasta 10 requests simultáneas",
      headers: {
        "X-RateLimit-Limit": "Límite por minuto",
        "X-RateLimit-Remaining": "Requests restantes",
        "X-RateLimit-Reset": "Timestamp de reset"
      }
    },
    retry_policy: {
      max_retries: 3,
      backoff: "Exponencial: 1s, 2s, 4s",
      retry_codes: [429, 500, 502, 503, 504],
      no_retry_codes: [400, 401, 403, 404]
    },
    webhook_security: {
      signature_header: "X-PuntoEnvio-Signature",
      signature_format: "sha256={hash}",
      algorithm: "HMAC-SHA256",
      payload: "JSON string del cuerpo del webhook",
      verification: "Comparar hash(secret_token + payload) con signature"
    }
  },

  // ==========================================
  // 5. EJEMPLOS PRÁCTICOS
  // ==========================================
  examples: {
    
    // CREAR ENVÍO COMPLETO
    create_shipment_curl: `
curl -X POST https://zyowxsfzfuunjlufxqik.supabase.co/functions/v1/create-shipment \\
  -H "Authorization: Bearer tu_api_key_aqui" \\
  -H "Content-Type: application/json" \\
  -d '{
    "remitente": {
      "nombre": "Juan Pérez",
      "documento": "12345678",
      "domicilio": "Av. Corrientes 1234",
      "localidad": "CABA", 
      "provincia": "Buenos Aires",
      "telefono": "+541123456789",
      "email": "juan@email.com"
    },
    "destinatario": {
      "nombre": "María García",
      "documento": "87654321", 
      "domicilio": "San Martín 567",
      "localidad": "Córdoba",
      "provincia": "Córdoba",
      "telefono": "+543514567890",
      "email": "maria@email.com"
    },
    "paquete": {
      "peso": 2.5,
      "valor_declarado": 75000,
      "descripcion": "Documentos y muestras",
      "largo_cm": 30,
      "ancho_cm": 20,
      "alto_cm": 10,
      "fragil": false
    },
    "servicio": {
      "tipo_recoleccion": "domicilio",
      "tipo_entrega": "domicilio",
      "fecha_recoleccion": "2025-09-22",
      "hora_recoleccion": "14:30",
      "termosellado": false
    },
    "external_reference": "SUP-ORD-12345"
  }'`,

    // CONSULTAR ESTADO  
    tracking_curl: `
curl -X GET https://zyowxsfzfuunjlufxqik.supabase.co/functions/v1/tracking/PE-2025-000001 \\
  -H "Authorization: Bearer tu_api_key_aqui"`,

    // OBTENER COTIZACIÓN
    quote_curl: `
curl -X POST https://zyowxsfzfuunjlufxqik.supabase.co/functions/v1/quotes \\
  -H "Authorization: Bearer tu_api_key_aqui" \\
  -H "Content-Type: application/json" \\
  -d '{
    "origen": {
      "provincia": "Buenos Aires",
      "localidad": "CABA"
    },
    "destino": {
      "provincia": "Córdoba", 
      "localidad": "Córdoba"
    },
    "paquete": {
      "peso": 2.5,
      "valor_declarado": 75000,
      "termosellado": false
    },
    "servicio": {
      "tipo_recoleccion": "domicilio",
      "tipo_entrega": "domicilio"
    }
  }'`,

    // CONFIGURAR WEBHOOK
    webhook_curl: `
curl -X POST https://zyowxsfzfuunjlufxqik.supabase.co/functions/v1/webhooks \\
  -H "Authorization: Bearer tu_api_key_aqui" \\
  -H "Content-Type: application/json" \\
  -d '{
    "webhook_url": "https://superpasajes.com/api/webhooks/puntoenvio",
    "secret_token": "tu_token_secreto_aqui", 
    "events": ["shipment_created", "status_updated", "delivered"],
    "max_retries": 3,
    "retry_delay_seconds": 60
  }'`
  },

  // ==========================================
  // 6. CÓDIGOS DE ERROR DETALLADOS
  // ==========================================
  error_codes: {
    400: {
      code: "BAD_REQUEST",
      description: "Solicitud inválida",
      common_causes: [
        "Campos requeridos faltantes",
        "Formato de datos incorrecto", 
        "Valores fuera de rango",
        "Provincia inexistente"
      ]
    },
    401: {
      code: "UNAUTHORIZED", 
      description: "No autorizado",
      common_causes: [
        "Header Authorization faltante",
        "Formato de API Key incorrecto"
      ]
    },
    403: {
      code: "FORBIDDEN",
      description: "Acceso denegado", 
      common_causes: [
        "API Key inválida o expirada",
        "Permisos insuficientes",
        "API Key desactivada"
      ]
    },
    404: {
      code: "NOT_FOUND",
      description: "Recurso no encontrado",
      common_causes: [
        "Número de orden inexistente",
        "Endpoint incorrecto"
      ]
    },
    429: {
      code: "RATE_LIMITED",
      description: "Límite de tasa excedido",
      common_causes: [
        "Demasiadas requests por minuto",
        "Límite de API Key superado"
      ]
    },
    500: {
      code: "INTERNAL_ERROR",
      description: "Error interno del servidor", 
      common_causes: [
        "Error en base de datos",
        "Servicio temporalmente no disponible"
      ]
    }
  },

  // ==========================================
  // 7. CONSIDERACIONES DE SEGURIDAD
  // ==========================================
  security: {
    api_key_management: {
      rotation: "Rotar API Keys cada 90 días",
      storage: "Almacenar de forma segura, nunca en código fuente",
      environment: "Usar variables de entorno", 
      monitoring: "Monitorear uso para detectar actividad sospechosa"
    },
    webhook_validation: {
      signature_verification: "OBLIGATORIO - Siempre validar signature",
      https_only: "URLs de webhook deben usar HTTPS",
      timeout: "Configurar timeout de 10 segundos para webhooks",
      idempotency: "Manejar webhooks duplicados de forma idempotente"
    },
    data_privacy: {
      pii_handling: "Datos personales están enmascarados en responses públicos",
      audit_logging: "Todos los accesos se registran para auditoría",
      data_retention: "Logs se mantienen por 90 días"
    }
  }
};

// Función helper para generar la documentación como markdown
export function generateMarkdownDocs(): string {
  return `
# API PuntoEnvio - Documentación Técnica

## Información de Conexión
- **URL Base**: ${API_DOCUMENTATION.connection.base_url}
- **Autenticación**: ${API_DOCUMENTATION.connection.authentication.type}
- **Header**: \`${API_DOCUMENTATION.connection.authentication.header}: ${API_DOCUMENTATION.connection.authentication.format}\`

## Endpoints Disponibles

### 1. Crear Envío
\`${API_DOCUMENTATION.endpoints.create_shipment.method} ${API_DOCUMENTATION.endpoints.create_shipment.url}\`

${API_DOCUMENTATION.endpoints.create_shipment.description}

### 2. Consultar Estado  
\`${API_DOCUMENTATION.endpoints.tracking.method} ${API_DOCUMENTATION.endpoints.tracking.url}\`

${API_DOCUMENTATION.endpoints.tracking.description}

### 3. Obtener Cotización
\`${API_DOCUMENTATION.endpoints.quotes.method} ${API_DOCUMENTATION.endpoints.quotes.url}\`

${API_DOCUMENTATION.endpoints.quotes.description}

### 4. Gestión de Webhooks
\`${API_DOCUMENTATION.endpoints.webhooks.methods.join(', ')} ${API_DOCUMENTATION.endpoints.webhooks.base_url}\`

${API_DOCUMENTATION.endpoints.webhooks.description}

## Estados de Envío
${Object.entries(API_DOCUMENTATION.data_models.estados_envio)
  .map(([key, value]) => `- **${key}**: ${value}`)
  .join('\n')}

## Configuración Técnica
- **Timeout**: ${API_DOCUMENTATION.technical_config.timeouts.recommendation}
- **Rate Limit**: ${API_DOCUMENTATION.technical_config.rate_limiting.default}
- **Reintentos**: ${API_DOCUMENTATION.technical_config.retry_policy.max_retries} con backoff ${API_DOCUMENTATION.technical_config.retry_policy.backoff}

Para obtener tu API Key, contacta al administrador del sistema PuntoEnvio.
`;
}

export default API_DOCUMENTATION;