-- DigitalCare Supabase Security Migrations
-- Ejecuta esto después del schema.sql para agregar tablas de seguridad
-- Fecha: 2026-05-20

-- ============================================================
-- 1. TABLA CLIENTES (Usuarios del ecommerce)
-- ============================================================
CREATE TABLE IF NOT EXISTS clientes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  apellido VARCHAR(255),
  telefono VARCHAR(20),
  
  -- Verificación de email
  email_verified BOOLEAN DEFAULT false,
  email_verified_at TIMESTAMP WITH TIME ZONE,
  verification_token VARCHAR(255),
  verification_token_expires TIMESTAMP WITH TIME ZONE,
  
  -- Seguridad
  last_login TIMESTAMP WITH TIME ZONE,
  last_login_ip VARCHAR(45),
  failed_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Índices para clientes
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_verification_token ON clientes(verification_token);
CREATE INDEX IF NOT EXISTS idx_clientes_created_at ON clientes(created_at DESC);

-- ============================================================
-- 2. TABLA ADMINS (Administradores)
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  
  -- 2FA (Two-Factor Authentication)
  two_fa_enabled BOOLEAN DEFAULT false,
  two_fa_secret VARCHAR(255),
  two_fa_verified BOOLEAN DEFAULT false,
  
  -- Seguridad
  active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  last_login_ip VARCHAR(45),
  failed_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  
  -- Permisos
  role VARCHAR(50) DEFAULT 'moderator', -- admin, moderator
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para admins
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_active ON admins(active);
CREATE INDEX IF NOT EXISTS idx_admins_created_at ON admins(created_at DESC);

-- ============================================================
-- 3. TABLA AUDIT_LOGS (Registro de acciones sensibles)
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Actor
  actor_type VARCHAR(50) NOT NULL, -- admin, client, system
  actor_id UUID,
  actor_email VARCHAR(255),
  
  -- Acción
  action VARCHAR(100) NOT NULL, -- login, logout, create_product, update_product, delete_product, etc.
  resource_type VARCHAR(50), -- producto, pedido, cliente, admin, etc.
  resource_id UUID,
  
  -- Datos
  description TEXT,
  old_values JSONB,
  new_values JSONB,
  
  -- Contexto
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  -- Status
  status VARCHAR(50) DEFAULT 'success', -- success, error
  error_message TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Política de retención: mantener logs por 90 días
-- (Ejecutar manualmente cada semana o como cron job)
-- DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '90 days';

-- ============================================================
-- 4. TABLA PEDIDOS (Órdenes de compra)
-- ============================================================
CREATE TABLE IF NOT EXISTS pedidos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Cliente
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  
  -- Items
  items JSONB NOT NULL DEFAULT '[]', -- [{ id, name, price, qty }, ...]
  total DECIMAL(10,2) NOT NULL,
  
  -- Pago
  metodo_pago VARCHAR(50) DEFAULT 'whatsapp', -- whatsapp, transferencia
  referencia_pago VARCHAR(100) UNIQUE,
  
  -- Estado
  estado VARCHAR(50) DEFAULT 'pendiente', -- pendiente, verificado, enviado, completado, cancelado
  notas TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para pedidos
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente_id ON pedidos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_email ON pedidos(email);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_created_at ON pedidos(created_at DESC);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_pedidos_updated_at
  BEFORE UPDATE ON pedidos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 5. TABLA PASSWORD_RESET_TOKENS (Reset de contraseña)
-- ============================================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para password_reset_tokens
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email ON password_reset_tokens(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires ON password_reset_tokens(expires);

-- Política de limpieza: eliminar tokens expirados
-- DELETE FROM password_reset_tokens WHERE expires < NOW() AND used = false;

-- ============================================================
-- 6. MEJORA: Agregar campos a accesorios y licencias
-- ============================================================
ALTER TABLE accesorios ADD COLUMN IF NOT EXISTS categoria VARCHAR(100);
ALTER TABLE accesorios ADD COLUMN IF NOT EXISTS sku VARCHAR(100) UNIQUE;
ALTER TABLE accesorios ADD COLUMN IF NOT EXISTS stock_minimo INTEGER DEFAULT 5;
ALTER TABLE accesorios ADD COLUMN IF NOT EXISTS imagen_url TEXT;

ALTER TABLE licencias ADD COLUMN IF NOT EXISTS categoria VARCHAR(100);
ALTER TABLE licencias ADD COLUMN IF NOT EXISTS plataforma VARCHAR(100);
ALTER TABLE licencias ADD COLUMN IF NOT EXISTS stock_minimo INTEGER DEFAULT 3;
ALTER TABLE licencias ADD COLUMN IF NOT EXISTS imagen_url TEXT;

-- Índices adicionales
CREATE INDEX IF NOT EXISTS idx_accesorios_categoria ON accesorios(categoria);
CREATE INDEX IF NOT EXISTS idx_accesorios_sku ON accesorios(sku);
CREATE INDEX IF NOT EXISTS idx_licencias_plataforma ON licencias(plataforma);

-- ============================================================
-- 7. ROW LEVEL SECURITY (RLS) MEJORADO
-- ============================================================

-- Habilitar RLS en nuevas tablas
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Políticas para CLIENTES
CREATE POLICY "Clientes ven su propio perfil"
  ON clientes FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Clientes ven sus pedidos"
  ON pedidos FOR SELECT
  USING (cliente_id = auth.uid() OR email = auth.jwt()->>'email');

CREATE POLICY "Clientes pueden crear pedidos"
  ON pedidos FOR INSERT
  WITH CHECK (true);

-- Políticas para ADMINS (solo autenticados)
CREATE POLICY "Solo admins ven audit logs"
  ON audit_logs FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Solo admins pueden leer clientes"
  ON clientes FOR SELECT
  USING (auth.role() = 'authenticated');

-- Políticas para PASSWORD RESET (tokens públicos por email)
CREATE POLICY "Público puede crear password reset tokens"
  ON password_reset_tokens FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- 8. FUNCIÓN PARA CREAR ADMIN (One-time setup)
-- ============================================================
CREATE OR REPLACE FUNCTION create_initial_admin(
  p_email VARCHAR,
  p_password_hash VARCHAR,
  p_nombre VARCHAR
)
RETURNS TABLE (id UUID, email VARCHAR, nombre VARCHAR) AS $$
DECLARE
  v_id UUID;
BEGIN
  -- Verificar que no existan admins aún
  IF EXISTS(SELECT 1 FROM admins LIMIT 1) THEN
    RAISE EXCEPTION 'Ya existe un admin en el sistema';
  END IF;
  
  INSERT INTO admins (email, password_hash, nombre)
  VALUES (p_email, p_password_hash, p_nombre)
  RETURNING admins.id, admins.email, admins.nombre
  INTO v_id, p_email, p_nombre;
  
  RETURN QUERY SELECT v_id, p_email::VARCHAR, p_nombre::VARCHAR;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 9. FUNCIÓN PARA REGISTRAR AUDIT LOG
-- ============================================================
CREATE OR REPLACE FUNCTION log_audit(
  p_actor_type VARCHAR,
  p_actor_id UUID,
  p_actor_email VARCHAR,
  p_action VARCHAR,
  p_resource_type VARCHAR,
  p_resource_id UUID,
  p_description TEXT,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_ip_address VARCHAR DEFAULT NULL,
  p_status VARCHAR DEFAULT 'success',
  p_error_message TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO audit_logs (
    actor_type, actor_id, actor_email,
    action, resource_type, resource_id,
    description, old_values, new_values,
    ip_address, status, error_message
  )
  VALUES (
    p_actor_type, p_actor_id, p_actor_email,
    p_action, p_resource_type, p_resource_id,
    p_description, p_old_values, p_new_values,
    p_ip_address, p_status, p_error_message
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- NOTA: Este archivo debe ejecutarse manualmente en Supabase
-- Ir a: Supabase → SQL Editor → Nuevo query → Copiar y ejecutar
-- ============================================================
