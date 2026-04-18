-- DigitalCare GT — Seed Data para desarrollo
-- Ejecuta esto en el SQL Editor de Supabase después de schema.sql
-- ⚠️  Solo para entorno de prueba/desarrollo

-- -------------------------------------------------------
-- 1. TABLA PEDIDOS (si no existe aún)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS pedidos (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nombre      VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  telefono    VARCHAR(30),
  items       JSONB NOT NULL DEFAULT '[]',
  total       DECIMAL(10,2) NOT NULL DEFAULT 0,
  estado      VARCHAR(30) NOT NULL DEFAULT 'pendiente',
  notas       TEXT,
  referencia  VARCHAR(100),
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clientes ven sus pedidos" ON pedidos
  FOR SELECT USING (email = auth.jwt()->>'email');
CREATE POLICY "Clientes crean pedidos" ON pedidos
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full access pedidos" ON pedidos
  FOR ALL USING (auth.role() = 'authenticated');

-- Índices
CREATE INDEX IF NOT EXISTS idx_pedidos_email ON pedidos(email);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_created_at ON pedidos(created_at DESC);

-- Trigger updated_at
CREATE TRIGGER update_pedidos_updated_at
  BEFORE UPDATE ON pedidos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -------------------------------------------------------
-- 2. PEDIDOS DE PRUEBA
-- -------------------------------------------------------
INSERT INTO pedidos (nombre, email, telefono, items, total, estado, referencia, created_at) VALUES

-- Pedidos completados
(
  'Carlos Morales',
  'carlos.morales@gmail.com',
  '57812345',
  '[{"id":"eset-1","name":"ESET NOD32 Antivirus","price":350,"qty":1},{"id":"acc-mouse","name":"Mouse Inalámbrico","price":125,"qty":1}]',
  475.00,
  'completado',
  'REF-2026-001',
  NOW() - INTERVAL '15 days'
),
(
  'María García',
  'maria.garcia@hotmail.com',
  '57654321',
  '[{"id":"m365-1","name":"Microsoft 365 Personal","price":650,"qty":1}]',
  650.00,
  'completado',
  'REF-2026-002',
  NOW() - INTERVAL '12 days'
),
(
  'José Hernández',
  'jose.hernandez@yahoo.com',
  '45123456',
  '[{"id":"win11-1","name":"Windows 11 Pro","price":1200,"qty":1},{"id":"kas-1","name":"Kaspersky Total Security","price":450,"qty":1}]',
  1650.00,
  'completado',
  'REF-2026-003',
  NOW() - INTERVAL '10 days'
),
(
  'Ana López',
  'ana.lopez@gmail.com',
  '58765432',
  '[{"id":"acc-kb","name":"Teclado Mecánico RGB","price":350,"qty":1},{"id":"acc-hs","name":"Auriculares Gaming","price":275,"qty":1}]',
  625.00,
  'completado',
  'REF-2026-004',
  NOW() - INTERVAL '8 days'
),

-- Pedidos verificados
(
  'Luis Pérez',
  'luis.perez@gmail.com',
  '59234567',
  '[{"id":"norton-1","name":"Norton 360","price":400,"qty":1}]',
  400.00,
  'verificado',
  'REF-2026-005',
  NOW() - INTERVAL '5 days'
),
(
  'Sandra Ruíz',
  'sandra.ruiz@outlook.com',
  '57345678',
  '[{"id":"m365-1","name":"Microsoft 365 Personal","price":650,"qty":1},{"id":"acc-hub","name":"Hub USB-C","price":175,"qty":1}]',
  825.00,
  'verificado',
  'REF-2026-006',
  NOW() - INTERVAL '3 days'
),

-- Pedidos enviados
(
  'Roberto Castillo',
  'roberto.castillo@gmail.com',
  '58456789',
  '[{"id":"acc-cam","name":"Webcam HD 1080p","price":225,"qty":1},{"id":"acc-mouse","name":"Mouse Inalámbrico","price":125,"qty":2}]',
  475.00,
  'enviado',
  'REF-2026-007',
  NOW() - INTERVAL '2 days'
),

-- Pedidos pendientes (recientes — los que el admin verá en rojo)
(
  'Patricia Méndez',
  'patricia.mendez@gmail.com',
  '57567890',
  '[{"id":"eset-1","name":"ESET NOD32 Antivirus","price":350,"qty":1}]',
  350.00,
  'pendiente',
  NULL,
  NOW() - INTERVAL '18 hours'
),
(
  'Diego Flores',
  'diego.flores@hotmail.com',
  '45678901',
  '[{"id":"win11-1","name":"Windows 11 Pro","price":1200,"qty":1}]',
  1200.00,
  'pendiente',
  NULL,
  NOW() - INTERVAL '6 hours'
),
(
  'Gabriela Torres',
  'gabriela.torres@gmail.com',
  '59789012',
  '[{"id":"m365-1","name":"Microsoft 365 Personal","price":650,"qty":1},{"id":"kas-1","name":"Kaspersky Total Security","price":450,"qty":1}]',
  1100.00,
  'pendiente',
  NULL,
  NOW() - INTERVAL '45 minutes'
),

-- Un cancelado
(
  'Ernesto Vásquez',
  'ernesto.vasquez@gmail.com',
  '57890123',
  '[{"id":"acc-kb","name":"Teclado Mecánico RGB","price":350,"qty":1}]',
  350.00,
  'cancelado',
  NULL,
  NOW() - INTERVAL '20 days'
);

-- -------------------------------------------------------
-- 3. PRODUCTOS ADICIONALES (accesorios y licencias extras)
-- -------------------------------------------------------
INSERT INTO accesorios (nombre, descripcion, precio, stock) VALUES
  ('Mousepad XL', 'Mousepad gaming extendido 90x40cm', 95.00, 25),
  ('Soporte Laptop', 'Soporte ajustable de aluminio', 145.00, 18),
  ('Cable USB-C 2m', 'Cable de carga y datos USB-C trenzado', 65.00, 40),
  ('Limpiador Pantallas', 'Kit limpieza pantallas y teclados', 45.00, 50),
  ('Regleta 6 tomas', 'Regleta con protección de sobretensión', 185.00, 12)
ON CONFLICT DO NOTHING;

INSERT INTO licencias (nombre, descripcion, precio, duracion, tipo) VALUES
  ('ESET Internet Security', 'Protección avanzada para internet y banca en línea', 425.00, 12, 'antivirus'),
  ('Microsoft 365 Familiar', 'Office para 6 usuarios + 6TB OneDrive', 950.00, 12, 'office'),
  ('Bitdefender Total Security', 'Suite completa con VPN y control parental', 380.00, 12, 'antivirus'),
  ('Windows 11 Home', 'Licencia perpetua Windows 11 Home', 850.00, 0, 'windows'),
  ('Malwarebytes Premium', 'Protección contra malware y ransomware', 295.00, 12, 'antivirus')
ON CONFLICT DO NOTHING;

-- -------------------------------------------------------
-- 4. RESUMEN
-- -------------------------------------------------------
-- Pedidos insertados: 11 (4 completados, 2 verificados, 1 enviado, 3 pendientes, 1 cancelado)
-- Ingresos confirmados (no cancelados): ~Q7,550
-- Top productos: Windows 11 Pro (2), Microsoft 365 (2), ESET (2), Kaspersky (2)
