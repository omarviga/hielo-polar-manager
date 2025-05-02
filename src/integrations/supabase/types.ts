export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ConservadorStatus = 'activo' | 'mantenimiento' | 'inactivo';
export type MaintenanceStatus = 'pendiente' | 'en_proceso' | 'completado' | 'cancelado';
export type TipoServicio = 'mantenimiento_preventivo' | 'mantenimiento_correctivo' | 'reparacion' | 'instalacion' | 'desinstalacion' | 'otro';
export type EstadoOrden = 'borrador' | 'pendiente' | 'en_proceso' | 'completada' | 'cancelada' | 'facturada';

export interface Database {
  public: {
    Tables: {
      clientes: {
        Row: {
          id: string;
          nombre: string;
          rfc: string | null;
          direccion: string | null;
          telefono: string | null;
          email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['clientes']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['clientes']['Insert']>;
      };
      conservadores: {
        Row: {
          id: string;
          numero_serie: string;
          modelo: string | null;
          capacidad: number | null;
          status: ConservadorStatus;
          cliente_id: string | null;
          qr_code: string | null;
          notas: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['conservadores']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['conservadores']['Insert']>;
      };
      ubicaciones: {
        Row: {
          id: string;
          conservador_id: string;
          latitud: number | null;
          longitud: number | null;
          direccion: string | null;
          fecha_registro: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ubicaciones']['Row'], 'id' | 'created_at' | 'fecha_registro'>;
        Update: Partial<Database['public']['Tables']['ubicaciones']['Insert']>;
      };
      mantenimientos: {
        Row: {
          id: string;
          conservador_id: string;
          tipo_servicio: TipoServicio;
          descripcion: string | null;
          fecha_programada: string | null;
          fecha_realizado: string | null;
          costo: number | null;
          status: MaintenanceStatus;
          tecnico: string | null;
          notas: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['mantenimientos']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['mantenimientos']['Insert']>;
      };
      proveedores_servicio: {
        Row: {
          id: string;
          razon_social: string;
          rfc: string;
          regimen_fiscal: string;
          direccion_fiscal: string;
          telefono: string | null;
          email: string | null;
          contacto_nombre: string | null;
          notas: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['proveedores_servicio']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['proveedores_servicio']['Insert']>;
      };
      ordenes_servicio: {
        Row: {
          id: string;
          numero_orden: string;
          conservador_id: string;
          proveedor_id: string;
          tipo: TipoServicio;
          estado: EstadoOrden;
          fecha_solicitud: string;
          fecha_programada: string | null;
          fecha_inicio: string | null;
          fecha_fin: string | null;
          descripcion_problema: string | null;
          diagnostico: string | null;
          trabajo_realizado: string | null;
          materiales_utilizados: string | null;
          costo_materiales: number | null;
          costo_mano_obra: number | null;
          costo_total: number | null;
          numero_factura: string | null;
          fecha_factura: string | null;
          uuid_factura: string | null;
          pdf_factura_url: string | null;
          xml_factura_url: string | null;
          notas_internas: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ordenes_servicio']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['ordenes_servicio']['Insert']>;
      };
      evidencias_servicio: {
        Row: {
          id: string;
          orden_servicio_id: string;
          tipo: string;
          url: string;
          descripcion: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['evidencias_servicio']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['evidencias_servicio']['Insert']>;
      };
      firmas_conformidad: {
        Row: {
          id: string;
          orden_servicio_id: string;
          nombre_firmante: string;
          cargo_firmante: string | null;
          firma_url: string;
          fecha_firma: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['firmas_conformidad']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['firmas_conformidad']['Insert']>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      conservador_status: ConservadorStatus;
      maintenance_status: MaintenanceStatus;
      tipo_servicio: TipoServicio;
      estado_orden: EstadoOrden;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Enums = Database['public']['Enums'];

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

export type PublicEnums = Database['public']['Enums'];
export type PublicTables = Database['public']['Tables'];
export type PublicViews = Database['public']['Views'];
export type PublicFunctions = Database['public']['Functions'];
export type PublicCompositeTypes = Database['public']['CompositeTypes'];

export const Constants = {
  public: {
    Enums: {},
  },
} as const;