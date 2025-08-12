export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
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
          tipo_parada?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      hojas_ruta: {
        Row: {
          created_at: string | null
          estado: string | null
          fecha: string
          id: string
          km_final: number | null
          km_inicial: number | null
          observaciones: string | null
          transportista_id: string | null
          updated_at: string | null
          vehiculo_id: string | null
        }
        Insert: {
          created_at?: string | null
          estado?: string | null
          fecha: string
          id?: string
          km_final?: number | null
          km_inicial?: number | null
          observaciones?: string | null
          transportista_id?: string | null
          updated_at?: string | null
          vehiculo_id?: string | null
        }
        Update: {
          created_at?: string | null
          estado?: string | null
          fecha?: string
          id?: string
          km_final?: number | null
          km_inicial?: number | null
          observaciones?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_orden_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
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
      ],
    },
  },
} as const
