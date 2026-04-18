/**
 * lib/db.js — PostgreSQL connection pool (local)
 * Usar en Server Components, Server Actions y Route Handlers.
 * NUNCA importar en componentes con 'use client'.
 */
import { Pool } from 'pg';

if (typeof window !== 'undefined') {
  throw new Error('[db] Solo puede usarse en el servidor.');
}

const globalForPg = globalThis;

/** @type {import('pg').Pool} */
export const db = globalForPg.__pgPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
});

if (process.env.NODE_ENV !== 'production') {
  globalForPg.__pgPool = db;
}

/** Helper: ejecutar una query con parámetros */
export async function query(sql, params = []) {
  const { rows } = await db.query(sql, params);
  return rows;
}

/** Helper: obtener una sola fila */
export async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return rows[0] ?? null;
}
