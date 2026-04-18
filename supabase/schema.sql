-- =============================================
-- DigitalCare GT - Supabase Database Schema
-- Ejecuta este SQL en el SQL Editor de Supabase
-- =============================================

-- Tabla de productos (accesorios)
CREATE TABLE IF NOT EXISTS public.accesorios (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre        TEXT NOT NULL,
  descripcion   TEXT,
  precio        NUMERIC(10, 2) NOT NULL,
  imagen_url    TEXT,
  stock         INT DEFAULT 0,
  activo        BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Tabla de licencias
CREATE TABLE IF NOT EXISTS public.licencias (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre        TEXT NOT NULL,
  descripcion   TEXT,
  precio        NUMERIC(10, 2) NOT NULL,
  tipo          TEXT CHECK (tipo IN ('permanente', 'anual', 'mensual')) DEFAULT 'permanente',
  plataforma    TEXT,          -- Windows, macOS, Office, Antivirus, etc.
  imagen_url    TEXT,
  activo        BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Tabla de contactos / leads (formulario de WhatsApp)
CREATE TABLE IF NOT EXISTS public.contactos (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  producto      TEXT NOT NULL,
  sucursal      TEXT,          -- Chiquimula | Esquipulas
  mensaje       TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- -----------------------------------------------
-- Row Level Security (RLS)
-- -----------------------------------------------

ALTER TABLE public.accesorios  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licencias   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contactos   ENABLE ROW LEVEL SECURITY;

-- Lectura pública (anon) de productos activos
CREATE POLICY "Lectura pública accesorios"
  ON public.accesorios FOR SELECT
  USING (activo = true);

CREATE POLICY "Lectura pública licencias"
  ON public.licencias FOR SELECT
  USING (activo = true);

-- Solo el servicio (service_role) puede insertar/actualizar/eliminar
CREATE POLICY "Admin total accesorios"
  ON public.accesorios FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Admin total licencias"
  ON public.licencias FOR ALL
  USING (auth.role() = 'service_role');

-- Cualquiera puede insertar contactos (leads)
CREATE POLICY "Insertar contactos"
  ON public.contactos FOR INSERT
  WITH CHECK (true);

-- Solo service_role puede leer/borrar contactos
CREATE POLICY "Admin leer contactos"
  ON public.contactos FOR SELECT
  USING (auth.role() = 'service_role');

-- -----------------------------------------------
-- Datos de ejemplo (seed)
-- -----------------------------------------------

INSERT INTO public.accesorios (nombre, descripcion, precio) VALUES
  ('Teclado Mecánico RGB',     'Iluminación LED, switches blue, ideal para gaming y escritura.',  250),
  ('Mouse Gamer 7200 DPI',     'Diseño ergonómico, 6 botones programables.',                      180),
  ('Auriculares con Micrófono','Sonido envolvente, cómodos para largas sesiones.',                 220),
  ('Mousepad XL Gaming',       'Superficie extendida de tela, base antideslizante.',               89),
  ('Webcam HD 1080p',          'Imagen nítida para videollamadas y streaming.',                    350),
  ('Hub USB-C 7 en 1',         'HDMI, USB 3.0 x3, SD, lector de tarjetas.',                       275);

INSERT INTO public.licencias (nombre, descripcion, precio, tipo, plataforma) VALUES
  ('Windows 10/11 Pro',    'Licencia permanente, activación digital.',  150, 'permanente', 'Windows'),
  ('Microsoft Office 2021','Word, Excel, PowerPoint y más.',             200, 'permanente', 'Office'),
  ('Antivirus ESET',       'Protección total por 1 año.',                120, 'anual',      'Antivirus'),
  ('Adobe Photoshop',      'Plan mensual Creative Cloud.',               180, 'mensual',    'Adobe'),
  ('Windows Server 2022',  'Licencia permanente para servidores.',       850, 'permanente', 'Windows'),
  ('Kaspersky Total Security','1 dispositivo, 1 año.',                   100, 'anual',      'Antivirus');
