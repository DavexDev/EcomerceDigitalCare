import { query, queryOne } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get('filter') || 'todos';

  let sql = 'SELECT * FROM leads ORDER BY created_at DESC';
  const params = [];

  if (filter === 'pendientes') {
    sql = 'SELECT * FROM leads WHERE contactado = false ORDER BY created_at DESC';
  } else if (filter === 'contactados') {
    sql = 'SELECT * FROM leads WHERE contactado = true ORDER BY created_at DESC';
  }

  const rows = await query(sql, params);
  return NextResponse.json(rows);
}

export async function POST(req) {
  const body = await req.json();
  const { producto, sucursal, mensaje } = body;
  const row = await queryOne(
    'INSERT INTO leads (nombre, telefono, servicio, mensaje) VALUES ($1,$2,$3,$4) RETURNING *',
    [producto || 'Sin nombre', sucursal || 'Chiquimula', producto, mensaje || null]
  );
  return NextResponse.json(row);
}

export async function PUT(req) {
  const body = await req.json();
  const { id, contactado } = body;
  const row = await queryOne(
    'UPDATE leads SET contactado=$1 WHERE id=$2 RETURNING *',
    [contactado, id]
  );
  return NextResponse.json(row);
}

export async function DELETE(req) {
  const { id } = await req.json();
  await query('DELETE FROM leads WHERE id=$1', [id]);
  return NextResponse.json({ ok: true });
}
