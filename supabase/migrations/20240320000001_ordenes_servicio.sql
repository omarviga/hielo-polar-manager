-- Create enum for tipo de servicio
CREATE TYPE tipo_servicio AS ENUM (
    'mantenimiento_preventivo',
    'mantenimiento_correctivo',
    'reparacion',
    'instalacion',
    'desinstalacion',
    'otro'
);

-- Create enum for estado de orden
CREATE TYPE estado_orden AS ENUM (
    'borrador',
    'pendiente',
    'en_proceso',
    'completada',
    'cancelada',
    'facturada'
);

-- Create table for proveedores de servicio (técnicos o empresas que realizan el servicio)
CREATE TABLE IF NOT EXISTS proveedores_servicio (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    razon_social TEXT NOT NULL,
    rfc TEXT NOT NULL,
    regimen_fiscal TEXT NOT NULL,
    direccion_fiscal TEXT NOT NULL,
    telefono TEXT,
    email TEXT,
    contacto_nombre TEXT,
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create table for ordenes de servicio
CREATE TABLE IF NOT EXISTS ordenes_servicio (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    numero_orden TEXT NOT NULL UNIQUE,
    conservador_id UUID REFERENCES conservadores(id) NOT NULL,
    proveedor_id UUID REFERENCES proveedores_servicio(id) NOT NULL,
    tipo tipo_servicio NOT NULL,
    estado estado_orden DEFAULT 'borrador',
    fecha_solicitud DATE NOT NULL,
    fecha_programada DATE,
    fecha_inicio DATE,
    fecha_fin DATE,
    descripcion_problema TEXT,
    diagnostico TEXT,
    trabajo_realizado TEXT,
    materiales_utilizados TEXT,
    costo_materiales NUMERIC,
    costo_mano_obra NUMERIC,
    costo_total NUMERIC,
    numero_factura TEXT,
    fecha_factura DATE,
    uuid_factura TEXT,
    pdf_factura_url TEXT,
    xml_factura_url TEXT,
    notas_internas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create table for fotos y evidencias de servicio
CREATE TABLE IF NOT EXISTS evidencias_servicio (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    orden_servicio_id UUID REFERENCES ordenes_servicio(id) NOT NULL,
    tipo TEXT NOT NULL, -- 'antes', 'durante', 'despues', 'documento', etc.
    url TEXT NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create table for firmas de conformidad
CREATE TABLE IF NOT EXISTS firmas_conformidad (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    orden_servicio_id UUID REFERENCES ordenes_servicio(id) NOT NULL,
    nombre_firmante TEXT NOT NULL,
    cargo_firmante TEXT,
    firma_url TEXT NOT NULL,
    fecha_firma TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX idx_ordenes_conservador ON ordenes_servicio(conservador_id);
CREATE INDEX idx_ordenes_proveedor ON ordenes_servicio(proveedor_id);
CREATE INDEX idx_evidencias_orden ON evidencias_servicio(orden_servicio_id);
CREATE INDEX idx_firmas_orden ON firmas_conformidad(orden_servicio_id);

-- Create trigger for updated_at on proveedores_servicio
CREATE TRIGGER update_proveedores_servicio_updated_at
    BEFORE UPDATE ON proveedores_servicio
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for updated_at on ordenes_servicio
CREATE TRIGGER update_ordenes_servicio_updated_at
    BEFORE UPDATE ON ordenes_servicio
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 