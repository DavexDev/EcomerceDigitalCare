-- DigitalCare Supabase Schema
-- Execute this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Accesorios table
CREATE TABLE IF NOT EXISTS accesorios (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Licencias table
CREATE TABLE IF NOT EXISTS licencias (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  duracion INTEGER DEFAULT 12, -- months
  tipo VARCHAR(50) DEFAULT 'antivirus', -- antivirus, office, windows, otro
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table (contactos from WhatsApp modal)
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  servicio VARCHAR(255),
  mensaje TEXT,
  contactado BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to accesorios
CREATE TRIGGER update_accesorios_updated_at
  BEFORE UPDATE ON accesorios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to licencias
CREATE TRIGGER update_licencias_updated_at
  BEFORE UPDATE ON licencias
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)

-- Enable RLS on all tables
ALTER TABLE accesorios ENABLE ROW LEVEL SECURITY;
ALTER TABLE licencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Public read access for active products
CREATE POLICY "Public read access for active accesorios"
  ON accesorios FOR SELECT
  USING (activo = true);

CREATE POLICY "Public read access for active licencias"
  ON licencias FOR SELECT
  USING (activo = true);

-- Authenticated users (admin) can do everything
CREATE POLICY "Admin full access to accesorios"
  ON accesorios FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to licencias"
  ON licencias FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to leads"
  ON leads FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Public can insert leads (from WhatsApp modal)
CREATE POLICY "Public can insert leads"
  ON leads FOR INSERT
  WITH CHECK (true);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_accesorios_activo ON accesorios(activo);
CREATE INDEX IF NOT EXISTS idx_licencias_activo ON licencias(activo);
CREATE INDEX IF NOT EXISTS idx_licencias_tipo ON licencias(tipo);
CREATE INDEX IF NOT EXISTS idx_leads_contactado ON leads(contactado);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- Sample data for development
INSERT INTO accesorios (nombre, descripcion, precio, stock) VALUES
  ('Mouse Inalámbrico', 'Mouse ergonómico con DPI ajustable', 125.00, 15),
  ('Teclado Mecánico', 'Teclado gaming con retroiluminación RGB', 350.00, 8),
  ('Auriculares Gaming', 'Auriculares con micrófono y cancelación de ruido', 275.00, 12),
  ('Webcam HD', 'Cámara web 1080p con micrófono integrado', 225.00, 10),
  ('Hub USB-C', 'Hub multipuerto con HDMI, USB y lector SD', 175.00, 20);

INSERT INTO licencias (nombre, descripcion, precio, duracion, tipo) VALUES
  ('ESET NOD32', 'Antivirus completo con protección en tiempo real', 350.00, 12, 'antivirus'),
  ('Kaspersky Total Security', 'Suite de seguridad premium', 450.00, 12, 'antivirus'),
  ('Microsoft 365 Personal', 'Office completo con 1TB OneDrive', 650.00, 12, 'office'),
  ('Windows 11 Pro', 'Licencia perpetua Windows 11 Professional', 1200.00, 0, 'windows'),
  ('Norton 360', 'Protección completa con VPN incluida', 400.00, 12, 'antivirus');
