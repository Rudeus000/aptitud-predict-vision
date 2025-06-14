export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      datos_documentos_procesados: {
        Row: {
          data_extraida: Json
          documento_id: number
          fecha_procesamiento: string | null
          habilidades_indexadas: string[] | null
          procesado_id: number
          tipo_entidad_procesada: string
        }
        Insert: {
          data_extraida: Json
          documento_id: number
          fecha_procesamiento?: string | null
          habilidades_indexadas?: string[] | null
          procesado_id?: number
          tipo_entidad_procesada: string
        }
        Update: {
          data_extraida?: Json
          documento_id?: number
          fecha_procesamiento?: string | null
          habilidades_indexadas?: string[] | null
          procesado_id?: number
          tipo_entidad_procesada?: string
        }
        Relationships: [
          {
            foreignKeyName: "datos_documentos_procesados_documento_id_fkey"
            columns: ["documento_id"]
            isOneToOne: true
            referencedRelation: "documentos_cargados"
            referencedColumns: ["documento_id"]
          },
        ]
      }
      documentos_cargados: {
        Row: {
          contenido_raw_texto: string | null
          documento_id: number
          fecha_carga: string | null
          metadata_documento: Json | null
          mime_type: string | null
          nombre_archivo: string
          ruta_almacenamiento_original: string | null
          tamano_bytes: number | null
          uploader_id: string
        }
        Insert: {
          contenido_raw_texto?: string | null
          documento_id?: number
          fecha_carga?: string | null
          metadata_documento?: Json | null
          mime_type?: string | null
          nombre_archivo: string
          ruta_almacenamiento_original?: string | null
          tamano_bytes?: number | null
          uploader_id: string
        }
        Update: {
          contenido_raw_texto?: string | null
          documento_id?: number
          fecha_carga?: string | null
          metadata_documento?: Json | null
          mime_type?: string | null
          nombre_archivo?: string
          ruta_almacenamiento_original?: string | null
          tamano_bytes?: number | null
          uploader_id?: string
        }
        Relationships: []
      }
      encuestas: {
        Row: {
          activa: boolean | null
          descripcion: string | null
          encuesta_id: number
          fecha_creacion: string | null
          preguntas: Json
          tipo_encuesta: string
          titulo: string
        }
        Insert: {
          activa?: boolean | null
          descripcion?: string | null
          encuesta_id?: number
          fecha_creacion?: string | null
          preguntas: Json
          tipo_encuesta: string
          titulo: string
        }
        Update: {
          activa?: boolean | null
          descripcion?: string | null
          encuesta_id?: number
          fecha_creacion?: string | null
          preguntas?: Json
          tipo_encuesta?: string
          titulo?: string
        }
        Relationships: []
      }
      modelos_predictivos: {
        Row: {
          activo: boolean | null
          fecha_entrenamiento: string | null
          metrica_precision: number | null
          modelo_id: number
          nombre_modelo: string
          parametros_utilizados: Json | null
          ruta_modelo_almacenado: string | null
          version_numero: string
        }
        Insert: {
          activo?: boolean | null
          fecha_entrenamiento?: string | null
          metrica_precision?: number | null
          modelo_id?: number
          nombre_modelo: string
          parametros_utilizados?: Json | null
          ruta_modelo_almacenado?: string | null
          version_numero: string
        }
        Update: {
          activo?: boolean | null
          fecha_entrenamiento?: string | null
          metrica_precision?: number | null
          modelo_id?: number
          nombre_modelo?: string
          parametros_utilizados?: Json | null
          ruta_modelo_almacenado?: string | null
          version_numero?: string
        }
        Relationships: []
      }
      postulaciones: {
        Row: {
          estado: string
          fecha_postulacion: string | null
          feedback_reclutador: string | null
          nombre_vacante: string
          postulacion_id: number
          procesado_data_id: number
          reclutador_id: string | null
        }
        Insert: {
          estado?: string
          fecha_postulacion?: string | null
          feedback_reclutador?: string | null
          nombre_vacante: string
          postulacion_id?: number
          procesado_data_id: number
          reclutador_id?: string | null
        }
        Update: {
          estado?: string
          fecha_postulacion?: string | null
          feedback_reclutador?: string | null
          nombre_vacante?: string
          postulacion_id?: number
          procesado_data_id?: number
          reclutador_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "postulaciones_procesado_data_id_fkey"
            columns: ["procesado_data_id"]
            isOneToOne: false
            referencedRelation: "datos_documentos_procesados"
            referencedColumns: ["procesado_id"]
          },
        ]
      }
      predicciones: {
        Row: {
          factores_clave: string[] | null
          fecha_prediccion: string | null
          prediccion_id: number
          probabilidad_exito: number | null
          procesado_data_id: number
          version_modelo_ml_id: number
        }
        Insert: {
          factores_clave?: string[] | null
          fecha_prediccion?: string | null
          prediccion_id?: number
          probabilidad_exito?: number | null
          procesado_data_id: number
          version_modelo_ml_id: number
        }
        Update: {
          factores_clave?: string[] | null
          fecha_prediccion?: string | null
          prediccion_id?: number
          probabilidad_exito?: number | null
          procesado_data_id?: number
          version_modelo_ml_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "predicciones_procesado_data_id_fkey"
            columns: ["procesado_data_id"]
            isOneToOne: true
            referencedRelation: "datos_documentos_procesados"
            referencedColumns: ["procesado_id"]
          },
          {
            foreignKeyName: "predicciones_version_modelo_ml_id_fkey"
            columns: ["version_modelo_ml_id"]
            isOneToOne: false
            referencedRelation: "modelos_predictivos"
            referencedColumns: ["modelo_id"]
          },
        ]
      }
      recomendaciones: {
        Row: {
          descripcion: string | null
          fecha_generacion: string | null
          prioridad: string | null
          recomendacion_id: number
          tipo: string
          titulo: string
        }
        Insert: {
          descripcion?: string | null
          fecha_generacion?: string | null
          prioridad?: string | null
          recomendacion_id?: number
          tipo: string
          titulo: string
        }
        Update: {
          descripcion?: string | null
          fecha_generacion?: string | null
          prioridad?: string | null
          recomendacion_id?: number
          tipo?: string
          titulo?: string
        }
        Relationships: []
      }
      respuestas_encuesta: {
        Row: {
          calificacion_desempeno_real: number | null
          encuesta_id: number
          fecha_respuesta: string | null
          procesado_data_asociado_id: number | null
          respuesta_id: number
          respuestas: Json
          usuario_respuesta_id: string
        }
        Insert: {
          calificacion_desempeno_real?: number | null
          encuesta_id: number
          fecha_respuesta?: string | null
          procesado_data_asociado_id?: number | null
          respuesta_id?: number
          respuestas: Json
          usuario_respuesta_id: string
        }
        Update: {
          calificacion_desempeno_real?: number | null
          encuesta_id?: number
          fecha_respuesta?: string | null
          procesado_data_asociado_id?: number | null
          respuesta_id?: number
          respuestas?: Json
          usuario_respuesta_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "respuestas_encuesta_encuesta_id_fkey"
            columns: ["encuesta_id"]
            isOneToOne: false
            referencedRelation: "encuestas"
            referencedColumns: ["encuesta_id"]
          },
          {
            foreignKeyName: "respuestas_encuesta_procesado_data_asociado_id_fkey"
            columns: ["procesado_data_asociado_id"]
            isOneToOne: false
            referencedRelation: "datos_documentos_procesados"
            referencedColumns: ["procesado_id"]
          },
        ]
      }
      usuarios: {
        Row: {
          fecha_creacion: string | null
          metadata_usuario: Json | null
          nombre_completo_perfil: string | null
          nombre_usuario: string
          rol: string
          ultimo_login: string | null
          usuario_id: string
        }
        Insert: {
          fecha_creacion?: string | null
          metadata_usuario?: Json | null
          nombre_completo_perfil?: string | null
          nombre_usuario: string
          rol?: string
          ultimo_login?: string | null
          usuario_id: string
        }
        Update: {
          fecha_creacion?: string | null
          metadata_usuario?: Json | null
          nombre_completo_perfil?: string | null
          nombre_usuario?: string
          rol?: string
          ultimo_login?: string | null
          usuario_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
