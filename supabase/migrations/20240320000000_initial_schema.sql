-- Create enum for conservador status
CREATE TYPE conservador_status AS ENUM ('activo', 'mantenimiento', 'inactivo');

-- Create enum for maintenance status
CREATE TYPE maintenance_status AS ENUM ('pendiente', 'en_proceso', 'completado', 'cancelado');

-- Create tables
CREATE TABLE IF NOT EXISTS clientes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    rfc TEXT,
    direccion TEXT,
    telefono TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS conservadores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    numero_serie TEXT UNIQUE NOT NULL,
    modelo TEXT,
    capacidad NUMERIC,
    status conservador_status DEFAULT 'activo',
    cliente_id UUID REFERENCES clientes(id),
    qr_code TEXT,
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS ubicaciones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conservador_id UUID REFERENCES conservadores(id),
    latitud NUMERIC,
    longitud NUMERIC,
    direccion TEXT,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS mantenimientos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conservador_id UUID REFERENCES conservadores(id),
    tipo_servicio TEXT NOT NULL,
    descripcion TEXT,
    fecha_programada DATE,
    fecha_realizado DATE,
    costo NUMERIC,
    status maintenance_status DEFAULT 'pendiente',
    tecnico TEXT,
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX idx_conservadores_cliente_id ON conservadores(cliente_id);
CREATE INDEX idx_ubicaciones_conservador_id ON ubicaciones(conservador_id);
CREATE INDEX idx_mantenimientos_conservador_id ON mantenimientos(conservador_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_clientes_updated_at
    BEFORE UPDATE ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conservadores_updated_at
    BEFORE UPDATE ON conservadores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mantenimientos_updated_at
    BEFORE UPDATE ON mantenimientos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 