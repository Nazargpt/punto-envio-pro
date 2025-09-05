export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      agencias: {
        Row: {
          activo: boolean | null
          contacto: Json | null
          created_at: string | null
          direccion: string | null
          id: string
          localidad: string | null
          nombre: string
          provincia: string | null
          ruta_parada_id: string | null
          tipo_parada: boolean | null
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          contacto?: Json | null
          created_at?: string | null
          direccion?: string | null
          id?: string
          localidad?: string | null
          nombre: string
          provincia?: string | null
          ruta_parada_id?: string | null
          tipo_parada?: boolean | null
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          contacto?: Json | null
          created_at?: string | null
          direccion?: string | null
          id?: string
          localidad?: string | null
          nombre?: string
          provincia?: string | null
          ruta_parada_id?: string | null
          tipo_parada?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agencias_ruta_parada_id_fkey"
            columns: ["ruta_parada_id"]
            isOneToOne: false
            referencedRelation: "rutas_paradas"
            referencedColumns: ["id"]
          },
        ]
      }
      hoja_ruta_fotos: {
        Row: {
          created_at: string
          foto_url: string
          hoja_ruta_id: string | null
          id: string
          observaciones: string | null
          orden_envio_id: string | null
          tipo_foto: string
          tomada_por_user_id: string
          ubicacion_gps: unknown | null
        }
        Insert: {
          created_at?: string
          foto_url: string
          hoja_ruta_id?: string | null
          id?: string
          observaciones?: string | null
          orden_envio_id?: string | null
          tipo_foto: string
          tomada_por_user_id: string
          ubicacion_gps?: unknown | null
        }
        Update: {
          created_at?: string
          foto_url?: string
          hoja_ruta_id?: string | null
          id?: string
          observaciones?: string | null
          orden_envio_id?: string | null
          tipo_foto?: string
          tomada_por_user_id?: string
          ubicacion_gps?: unknown | null
        }
        Relationships: [
          {
            foreignKeyName: "hoja_ruta_fotos_hoja_ruta_id_fkey"
            columns: ["hoja_ruta_id"]
            isOneToOne: false
            referencedRelation: "hojas_ruta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hoja_ruta_fotos_orden_envio_id_fkey"
            columns: ["orden_envio_id"]
            isOneToOne: false
            referencedRelation: "ordenes_envio"
            referencedColumns: ["id"]
          },
        ]
      }
      hojas_ruta: {
        Row: {
          codigo_seguimiento: string | null
          created_at: string | null
          deposito_destino: string | null
          deposito_origen: string | null
          estado: string | null
          fecha: string
          id: string
          km_final: number | null
          km_inicial: number | null
          observaciones: string | null
          tipo_ruta: string
          transportista_id: string | null
          updated_at: string | null
          vehiculo_id: string | null
        }
        Insert: {
          codigo_seguimiento?: string | null
          created_at?: string | null
          deposito_destino?: string | null
          deposito_origen?: string | null
          estado?: string | null
          fecha: string
          id?: string
          km_final?: number | null
          km_inicial?: number | null
          observaciones?: string | null
          tipo_ruta?: string
          transportista_id?: string | null
          updated_at?: string | null
          vehiculo_id?: string | null
        }
        Update: {
          codigo_seguimiento?: string | null
          created_at?: string | null
          deposito_destino?: string | null
          deposito_origen?: string | null
          estado?: string | null
          fecha?: string
          id?: string
          km_final?: number | null
          km_inicial?: number | null
          observaciones?: string | null
          tipo_ruta?: string
          transportista_id?: string | null
          updated_at?: string | null
          vehiculo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hojas_ruta_transportista_id_fkey"
            columns: ["transportista_id"]
            isOneToOne: false
            referencedRelation: "transportistas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hojas_ruta_vehiculo_id_fkey"
            columns: ["vehiculo_id"]
            isOneToOne: false
            referencedRelation: "vehiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      hojas_ruta_asociaciones: {
        Row: {
          created_at: string
          estado_asociacion: string
          fecha_entrega_deposito: string | null
          fecha_recogida_deposito: string | null
          hoja_ruta_larga_distancia_id: string | null
          hoja_ruta_local_destino_id: string | null
          hoja_ruta_local_origen_id: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          estado_asociacion?: string
          fecha_entrega_deposito?: string | null
          fecha_recogida_deposito?: string | null
          hoja_ruta_larga_distancia_id?: string | null
          hoja_ruta_local_destino_id?: string | null
          hoja_ruta_local_origen_id?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          estado_asociacion?: string
          fecha_entrega_deposito?: string | null
          fecha_recogida_deposito?: string | null
          hoja_ruta_larga_distancia_id?: string | null
          hoja_ruta_local_destino_id?: string | null
          hoja_ruta_local_origen_id?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hojas_ruta_asociaciones_hoja_ruta_larga_distancia_id_fkey"
            columns: ["hoja_ruta_larga_distancia_id"]
            isOneToOne: false
            referencedRelation: "hojas_ruta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hojas_ruta_asociaciones_hoja_ruta_local_destino_id_fkey"
            columns: ["hoja_ruta_local_destino_id"]
            isOneToOne: false
            referencedRelation: "hojas_ruta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hojas_ruta_asociaciones_hoja_ruta_local_origen_id_fkey"
            columns: ["hoja_ruta_local_origen_id"]
            isOneToOne: false
            referencedRelation: "hojas_ruta"
            referencedColumns: ["id"]
          },
        ]
      }
      incidencias: {
        Row: {
          asignado_a: string | null
          created_at: string | null
          descripcion: string
          estado: string | null
          fecha_resolucion: string | null
          id: string
          orden_envio_id: string | null
          prioridad: string | null
          reportado_por: string | null
          tipo_incidencia: string
          updated_at: string | null
        }
        Insert: {
          asignado_a?: string | null
          created_at?: string | null
          descripcion: string
          estado?: string | null
          fecha_resolucion?: string | null
          id?: string
          orden_envio_id?: string | null
          prioridad?: string | null
          reportado_por?: string | null
          tipo_incidencia: string
          updated_at?: string | null
        }
        Update: {
          asignado_a?: string | null
          created_at?: string | null
          descripcion?: string
          estado?: string | null
          fecha_resolucion?: string | null
          id?: string
          orden_envio_id?: string | null
          prioridad?: string | null
          reportado_por?: string | null
          tipo_incidencia?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incidencias_orden_envio_id_fkey"
            columns: ["orden_envio_id"]
            isOneToOne: false
            referencedRelation: "ordenes_envio"
            referencedColumns: ["id"]
          },
        ]
      }
      localidades: {
        Row: {
          codigo_postal: string | null
          created_at: string
          id: string
          nombre: string
          provincia_id: string
          updated_at: string
        }
        Insert: {
          codigo_postal?: string | null
          created_at?: string
          id?: string
          nombre: string
          provincia_id: string
          updated_at?: string
        }
        Update: {
          codigo_postal?: string | null
          created_at?: string
          id?: string
          nombre?: string
          provincia_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      matriz_provincias_zonas: {
        Row: {
          activo: boolean
          created_at: string
          id: string
          provincia_destino: string
          provincia_origen: string
          updated_at: string
          zona_id: string | null
        }
        Insert: {
          activo?: boolean
          created_at?: string
          id?: string
          provincia_destino: string
          provincia_origen: string
          updated_at?: string
          zona_id?: string | null
        }
        Update: {
          activo?: boolean
          created_at?: string
          id?: string
          provincia_destino?: string
          provincia_origen?: string
          updated_at?: string
          zona_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matriz_provincias_zonas_zona_id_fkey"
            columns: ["zona_id"]
            isOneToOne: false
            referencedRelation: "zonas_tarifarias"
            referencedColumns: ["id"]
          },
        ]
      }
      ordenes_envio: {
        Row: {
          agencia_destino_id: string | null
          agencia_origen_id: string | null
          created_at: string
          destinatario_documento: string
          destinatario_domicilio: string
          destinatario_localidad: string
          destinatario_nombre: string
          destinatario_provincia: string
          estado: string
          estado_detallado: string | null
          fecha_entrega: string | null
          fecha_recoleccion: string | null
          hora_entrega: string | null
          hora_recoleccion: string | null
          id: string
          numero_orden: string
          remitente_documento: string
          remitente_domicilio: string
          remitente_localidad: string
          remitente_nombre: string
          remitente_provincia: string
          tipo_entrega: string
          tipo_recoleccion: string
          transportista_id: string | null
          updated_at: string
          usuario_creacion_id: string
        }
        Insert: {
          agencia_destino_id?: string | null
          agencia_origen_id?: string | null
          created_at?: string
          destinatario_documento: string
          destinatario_domicilio: string
          destinatario_localidad: string
          destinatario_nombre: string
          destinatario_provincia: string
          estado?: string
          estado_detallado?: string | null
          fecha_entrega?: string | null
          fecha_recoleccion?: string | null
          hora_entrega?: string | null
          hora_recoleccion?: string | null
          id?: string
          numero_orden: string
          remitente_documento: string
          remitente_domicilio: string
          remitente_localidad: string
          remitente_nombre: string
          remitente_provincia: string
          tipo_entrega: string
          tipo_recoleccion: string
          transportista_id?: string | null
          updated_at?: string
          usuario_creacion_id: string
        }
        Update: {
          agencia_destino_id?: string | null
          agencia_origen_id?: string | null
          created_at?: string
          destinatario_documento?: string
          destinatario_domicilio?: string
          destinatario_localidad?: string
          destinatario_nombre?: string
          destinatario_provincia?: string
          estado?: string
          estado_detallado?: string | null
          fecha_entrega?: string | null
          fecha_recoleccion?: string | null
          hora_entrega?: string | null
          hora_recoleccion?: string | null
          id?: string
          numero_orden?: string
          remitente_documento?: string
          remitente_domicilio?: string
          remitente_localidad?: string
          remitente_nombre?: string
          remitente_provincia?: string
          tipo_entrega?: string
          tipo_recoleccion?: string
          transportista_id?: string | null
          updated_at?: string
          usuario_creacion_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ordenes_envio_agencia_destino_id_fkey"
            columns: ["agencia_destino_id"]
            isOneToOne: false
            referencedRelation: "agencias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordenes_envio_agencia_origen_id_fkey"
            columns: ["agencia_origen_id"]
            isOneToOne: false
            referencedRelation: "agencias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordenes_envio_transportista_id_fkey"
            columns: ["transportista_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ordenes_hoja_ruta: {
        Row: {
          completado: boolean | null
          created_at: string | null
          hoja_ruta_id: string | null
          hora_planificada: string | null
          hora_real: string | null
          id: string
          observaciones: string | null
          orden_envio_id: string | null
          orden_visita: number
          tipo_visita: string
        }
        Insert: {
          completado?: boolean | null
          created_at?: string | null
          hoja_ruta_id?: string | null
          hora_planificada?: string | null
          hora_real?: string | null
          id?: string
          observaciones?: string | null
          orden_envio_id?: string | null
          orden_visita: number
          tipo_visita: string
        }
        Update: {
          completado?: boolean | null
          created_at?: string | null
          hoja_ruta_id?: string | null
          hora_planificada?: string | null
          hora_real?: string | null
          id?: string
          observaciones?: string | null
          orden_envio_id?: string | null
          orden_visita?: number
          tipo_visita?: string
        }
        Relationships: [
          {
            foreignKeyName: "ordenes_hoja_ruta_hoja_ruta_id_fkey"
            columns: ["hoja_ruta_id"]
            isOneToOne: false
            referencedRelation: "hojas_ruta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordenes_hoja_ruta_orden_envio_id_fkey"
            columns: ["orden_envio_id"]
            isOneToOne: false
            referencedRelation: "ordenes_envio"
            referencedColumns: ["id"]
          },
        ]
      }
      order_access_logs: {
        Row: {
          access_type: string | null
          accessed_fields: string[] | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          orden_numero: string | null
          order_id: string | null
          user_agent: string | null
          user_id: string | null
          user_role: string | null
        }
        Insert: {
          access_type?: string | null
          accessed_fields?: string[] | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          orden_numero?: string | null
          order_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Update: {
          access_type?: string | null
          accessed_fields?: string[] | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          orden_numero?: string | null
          order_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Relationships: []
      }
      paquetes: {
        Row: {
          alto_cm: number | null
          ancho_cm: number | null
          created_at: string | null
          descripcion: string
          fragil: boolean | null
          id: string
          largo_cm: number | null
          orden_envio_id: string | null
          peso_kg: number | null
          valor_declarado: number | null
        }
        Insert: {
          alto_cm?: number | null
          ancho_cm?: number | null
          created_at?: string | null
          descripcion: string
          fragil?: boolean | null
          id?: string
          largo_cm?: number | null
          orden_envio_id?: string | null
          peso_kg?: number | null
          valor_declarado?: number | null
        }
        Update: {
          alto_cm?: number | null
          ancho_cm?: number | null
          created_at?: string | null
          descripcion?: string
          fragil?: boolean | null
          id?: string
          largo_cm?: number | null
          orden_envio_id?: string | null
          peso_kg?: number | null
          valor_declarado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "paquetes_orden_envio_id_fkey"
            columns: ["orden_envio_id"]
            isOneToOne: false
            referencedRelation: "ordenes_envio"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          activo: boolean | null
          agencia_id: string | null
          created_at: string | null
          email: string | null
          id: string
          nombre: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activo?: boolean | null
          agencia_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          nombre?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activo?: boolean | null
          agencia_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          nombre?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_agencia_id_fkey"
            columns: ["agencia_id"]
            isOneToOne: false
            referencedRelation: "agencias"
            referencedColumns: ["id"]
          },
        ]
      }
      provincias: {
        Row: {
          codigo: string | null
          created_at: string
          id: string
          nombre: string
          updated_at: string
        }
        Insert: {
          codigo?: string | null
          created_at?: string
          id?: string
          nombre: string
          updated_at?: string
        }
        Update: {
          codigo?: string | null
          created_at?: string
          id?: string
          nombre?: string
          updated_at?: string
        }
        Relationships: []
      }
      "puntoenvio tabla": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      rutas_paradas: {
        Row: {
          created_at: string | null
          es_cabecera: boolean | null
          id: string
          localidad: string | null
          observaciones: string | null
          orden_parada: number
          provincia: string
          ruta_id: string
          tiempo_estimado_minutos: number | null
          tipo_parada: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          es_cabecera?: boolean | null
          id?: string
          localidad?: string | null
          observaciones?: string | null
          orden_parada: number
          provincia: string
          ruta_id: string
          tiempo_estimado_minutos?: number | null
          tipo_parada: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          es_cabecera?: boolean | null
          id?: string
          localidad?: string | null
          observaciones?: string | null
          orden_parada?: number
          provincia?: string
          ruta_id?: string
          tiempo_estimado_minutos?: number | null
          tipo_parada?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rutas_paradas_ruta_id_fkey"
            columns: ["ruta_id"]
            isOneToOne: false
            referencedRelation: "transportistas_rutas"
            referencedColumns: ["id"]
          },
        ]
      }
      seguimiento_detallado: {
        Row: {
          created_at: string | null
          descripcion: string | null
          estado: string
          fecha_hora: string | null
          id: string
          observaciones: string | null
          orden_envio_id: string | null
          transportista_id: string | null
          ubicacion: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          estado: string
          fecha_hora?: string | null
          id?: string
          observaciones?: string | null
          orden_envio_id?: string | null
          transportista_id?: string | null
          ubicacion?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          estado?: string
          fecha_hora?: string | null
          id?: string
          observaciones?: string | null
          orden_envio_id?: string | null
          transportista_id?: string | null
          ubicacion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seguimiento_detallado_orden_envio_id_fkey"
            columns: ["orden_envio_id"]
            isOneToOne: false
            referencedRelation: "ordenes_envio"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seguimiento_detallado_transportista_id_fkey"
            columns: ["transportista_id"]
            isOneToOne: false
            referencedRelation: "transportistas"
            referencedColumns: ["id"]
          },
        ]
      }
      sensitive_data_audit: {
        Row: {
          access_reason: string | null
          access_type: string
          approval_timestamp: string | null
          approved_by_user_id: string | null
          created_at: string | null
          field_name: string
          id: string
          ip_address: unknown | null
          record_id: string | null
          session_duration_minutes: number | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          access_reason?: string | null
          access_type: string
          approval_timestamp?: string | null
          approved_by_user_id?: string | null
          created_at?: string | null
          field_name: string
          id?: string
          ip_address?: unknown | null
          record_id?: string | null
          session_duration_minutes?: number | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          access_reason?: string | null
          access_type?: string
          approval_timestamp?: string | null
          approved_by_user_id?: string | null
          created_at?: string | null
          field_name?: string
          id?: string
          ip_address?: unknown | null
          record_id?: string | null
          session_duration_minutes?: number | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      servicios_transportistas: {
        Row: {
          activo: boolean
          created_at: string
          id: string
          multiplicador: number
          peso_maximo: number
          peso_minimo: number
          precio_adicional: number
          tipo_servicio: string
          transportista_id: string
          updated_at: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          id?: string
          multiplicador?: number
          peso_maximo?: number
          peso_minimo?: number
          precio_adicional?: number
          tipo_servicio: string
          transportista_id: string
          updated_at?: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          id?: string
          multiplicador?: number
          peso_maximo?: number
          peso_minimo?: number
          precio_adicional?: number
          tipo_servicio?: string
          transportista_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "servicios_transportistas_transportista_id_fkey"
            columns: ["transportista_id"]
            isOneToOne: false
            referencedRelation: "transportistas"
            referencedColumns: ["id"]
          },
        ]
      }
      tarifas: {
        Row: {
          activo: boolean | null
          created_at: string | null
          id: string
          localidad_destino: string | null
          localidad_origen: string | null
          precio_base: number
          precio_por_kg: number | null
          precio_por_km: number | null
          provincia_destino: string
          provincia_origen: string
          tiempo_estimado_horas: number | null
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          id?: string
          localidad_destino?: string | null
          localidad_origen?: string | null
          precio_base: number
          precio_por_kg?: number | null
          precio_por_km?: number | null
          provincia_destino: string
          provincia_origen: string
          tiempo_estimado_horas?: number | null
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          id?: string
          localidad_destino?: string | null
          localidad_origen?: string | null
          precio_base?: number
          precio_por_kg?: number | null
          precio_por_km?: number | null
          provincia_destino?: string
          provincia_origen?: string
          tiempo_estimado_horas?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      transportistas: {
        Row: {
          activo: boolean | null
          apellido: string
          calificacion: number | null
          created_at: string | null
          documento: string
          email: string | null
          fecha_vencimiento_licencia: string | null
          id: string
          licencia_conducir: string | null
          nombre: string
          nombre_empresa: string | null
          telefono: string | null
          tipo_transportista: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          apellido: string
          calificacion?: number | null
          created_at?: string | null
          documento: string
          email?: string | null
          fecha_vencimiento_licencia?: string | null
          id?: string
          licencia_conducir?: string | null
          nombre: string
          nombre_empresa?: string | null
          telefono?: string | null
          tipo_transportista?: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          apellido?: string
          calificacion?: number | null
          created_at?: string | null
          documento?: string
          email?: string | null
          fecha_vencimiento_licencia?: string | null
          id?: string
          licencia_conducir?: string | null
          nombre?: string
          nombre_empresa?: string | null
          telefono?: string | null
          tipo_transportista?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      transportistas_rutas: {
        Row: {
          activo: boolean | null
          created_at: string | null
          distancia_km: number | null
          id: string
          localidad_destino: string | null
          localidad_origen: string | null
          nombre_ruta: string
          provincia_destino: string
          provincia_origen: string
          tiempo_estimado_horas: number | null
          transportista_id: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          distancia_km?: number | null
          id?: string
          localidad_destino?: string | null
          localidad_origen?: string | null
          nombre_ruta: string
          provincia_destino: string
          provincia_origen: string
          tiempo_estimado_horas?: number | null
          transportista_id: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          distancia_km?: number | null
          id?: string
          localidad_destino?: string | null
          localidad_origen?: string | null
          nombre_ruta?: string
          provincia_destino?: string
          provincia_origen?: string
          tiempo_estimado_horas?: number | null
          transportista_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transportistas_rutas_transportista_id_fkey"
            columns: ["transportista_id"]
            isOneToOne: false
            referencedRelation: "transportistas"
            referencedColumns: ["id"]
          },
        ]
      }
      transportistas_zonas_cobertura: {
        Row: {
          activo: boolean | null
          created_at: string | null
          id: string
          localidad: string | null
          provincia: string
          transportista_id: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          id?: string
          localidad?: string | null
          provincia: string
          transportista_id: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          id?: string
          localidad?: string | null
          provincia?: string
          transportista_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transportistas_zonas_cobertura_transportista_id_fkey"
            columns: ["transportista_id"]
            isOneToOne: false
            referencedRelation: "transportistas"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          agencia_id: string | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          agencia_id?: string | null
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          agencia_id?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_agencia_id_fkey"
            columns: ["agencia_id"]
            isOneToOne: false
            referencedRelation: "agencias"
            referencedColumns: ["id"]
          },
        ]
      }
      vehiculos: {
        Row: {
          activo: boolean | null
          año: number | null
          capacidad_kg: number | null
          capacidad_m3: number | null
          created_at: string | null
          id: string
          marca: string
          modelo: string
          patente: string
          tipo_vehiculo: string
          transportista_id: string | null
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          año?: number | null
          capacidad_kg?: number | null
          capacidad_m3?: number | null
          created_at?: string | null
          id?: string
          marca: string
          modelo: string
          patente: string
          tipo_vehiculo: string
          transportista_id?: string | null
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          año?: number | null
          capacidad_kg?: number | null
          capacidad_m3?: number | null
          created_at?: string | null
          id?: string
          marca?: string
          modelo?: string
          patente?: string
          tipo_vehiculo?: string
          transportista_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehiculos_transportista_id_fkey"
            columns: ["transportista_id"]
            isOneToOne: false
            referencedRelation: "transportistas"
            referencedColumns: ["id"]
          },
        ]
      }
      zonas_tarifarias: {
        Row: {
          activo: boolean
          created_at: string
          descripcion: string | null
          id: string
          multiplicador: number
          nombre: string
          precio_base_0_5kg: number
          precio_base_10_15kg: number
          precio_base_15_20kg: number
          precio_base_20_25kg: number
          precio_base_5_10kg: number
          updated_at: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          id?: string
          multiplicador?: number
          nombre: string
          precio_base_0_5kg?: number
          precio_base_10_15kg?: number
          precio_base_15_20kg?: number
          precio_base_20_25kg?: number
          precio_base_5_10kg?: number
          updated_at?: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          id?: string
          multiplicador?: number
          nombre?: string
          precio_base_0_5kg?: number
          precio_base_10_15kg?: number
          precio_base_15_20kg?: number
          precio_base_20_25kg?: number
          precio_base_5_10kg?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generar_hojas_ruta_agencia: {
        Args: { p_agencia_id: string }
        Returns: Json
      }
      generate_hoja_ruta_codigo: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_orden_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_business_analytics_summary: {
        Args: { date_range_days?: number }
        Returns: {
          access_level: string
          active_routes: number
          average_delivery_time: number
          total_orders: number
          total_packages: number
        }[]
      }
      get_orden_with_masking: {
        Args: { orden_id: string }
        Returns: {
          access_level: string
          created_at: string
          destinatario_documento_masked: string
          destinatario_domicilio_masked: string
          destinatario_localidad: string
          destinatario_nombre: string
          destinatario_provincia: string
          estado: string
          id: string
          numero_orden: string
          remitente_documento_masked: string
          remitente_domicilio_masked: string
          remitente_localidad: string
          remitente_nombre: string
          remitente_provincia: string
        }[]
      }
      get_order_public_info: {
        Args: { order_number: string }
        Returns: {
          created_at: string
          destinatario_localidad: string
          destinatario_nombre_publico: string
          estado: string
          numero_orden: string
          remitente_localidad: string
          remitente_nombre_publico: string
        }[]
      }
      get_route_stops_for_agency: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          localidad: string
          nombre_ruta: string
          provincia: string
          ruta_id: string
          tipo_parada: string
          transportista_empresa: string
        }[]
      }
      get_tracking_info: {
        Args: { order_number: string }
        Returns: {
          descripcion: string
          estado: string
          fecha_hora: string
          ubicacion: string
        }[]
      }
      get_transportista_with_masking: {
        Args: { transportista_id: string }
        Returns: {
          access_level: string
          activo: boolean
          apellido: string
          calificacion: number
          created_at: string
          documento_masked: string
          email_masked: string
          fecha_vencimiento_licencia: string
          id: string
          licencia_conducir_masked: string
          nombre: string
          nombre_empresa: string
          telefono_masked: string
          tipo_transportista: string
          updated_at: string
        }[]
      }
      get_transportistas_basic: {
        Args: Record<PropertyKey, never>
        Returns: {
          activo: boolean
          apellido: string
          created_at: string
          id: string
          nombre: string
          tipo_transportista: string
          updated_at: string
        }[]
      }
      get_transportistas_for_services: {
        Args: Record<PropertyKey, never>
        Returns: {
          activo: boolean
          id: string
          nombre_completo: string
          tipo_transportista: string
        }[]
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_order_access: {
        Args: {
          p_access_type: string
          p_accessed_fields?: string[]
          p_orden_numero: string
          p_order_id: string
        }
        Returns: undefined
      }
      log_transportista_access: {
        Args: {
          p_access_type: string
          p_accessed_fields?: string[]
          p_transportista_id: string
        }
        Returns: undefined
      }
      mask_documento: {
        Args: { documento: string; requester_role?: string }
        Returns: string
      }
      mask_domicilio: {
        Args: { domicilio: string }
        Returns: string
      }
      mask_email: {
        Args: { email: string }
        Returns: string
      }
      mask_telefono: {
        Args: { telefono: string }
        Returns: string
      }
      request_sensitive_data_access: {
        Args: {
          business_reason: string
          target_fields: string[]
          target_record_id: string
          target_table: string
        }
        Returns: string
      }
      search_orders_limited: {
        Args: { search_term: string; search_type?: string }
        Returns: {
          created_at: string
          destinatario_localidad: string
          destinatario_nombre_parcial: string
          estado: string
          numero_orden: string
          remitente_localidad: string
          remitente_nombre_parcial: string
        }[]
      }
    }
    Enums: {
      app_role:
        | "SUPERADMIN"
        | "ADMIN_AGENCIA"
        | "OPERADOR_AGENCIA"
        | "TRANSPORTISTA_LOCAL"
        | "TRANSPORTISTA_LD"
        | "AUDITOR"
        | "USER"
        | "ADMIN"
        | "SUPERVISOR"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "SUPERADMIN",
        "ADMIN_AGENCIA",
        "OPERADOR_AGENCIA",
        "TRANSPORTISTA_LOCAL",
        "TRANSPORTISTA_LD",
        "AUDITOR",
        "USER",
        "ADMIN",
        "SUPERVISOR",
      ],
    },
  },
} as const
