/**
 * supabaseAdmin.js — Cliente con SERVICE ROLE KEY
 *
 * REGLAS DE SEGURIDAD:
 * 1. NUNCA importar este módulo en componentes cliente ('use client').
 * 2. NUNCA exponer SUPABASE_SERVICE_ROLE_KEY en variables NEXT_PUBLIC_*.
 * 3. Usar exclusivamente en: Server Components, Server Actions, Route Handlers.
 * 4. Este cliente bypasea RLS — úsalo solo para operaciones admin verificadas.
 */

import { createClient } from '@supabase/supabase-js';

// Guard: evitar importación accidental en el cliente
if (typeof window !== 'undefined') {
  throw new Error(
    '[supabaseAdmin] Este módulo solo puede ejecutarse en el servidor. ' +
    'No importes supabaseAdmin en componentes con "use client".'
  );
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.warn(
    '[supabaseAdmin] Variables de entorno faltantes: ' +
    'NEXT_PUBLIC_SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY. ' +
    'Las operaciones admin retornarán datos vacíos.'
  );
}

const isConfigured = supabaseUrl && serviceRoleKey &&
  !supabaseUrl.includes('placeholder');

// Mock para desarrollo sin credenciales configuradas
const mockAdmin = {
  from: () => ({
    select: () => ({ data: [], error: null, count: 0 }),
    update: () => ({ eq: () => ({ data: null, error: null }) }),
    delete: () => ({ eq: () => ({ data: null, error: null }) }),
  }),
  auth: {
    admin: {
      listUsers: async () => ({ data: { users: [] }, error: null }),
    },
  },
};

export const supabaseAdmin = isConfigured
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : mockAdmin;
