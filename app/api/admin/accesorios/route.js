import { query, queryOne } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const rows = await query('SELECT * FROM accesorios ORDER BY nombre');
  return NextResponse.json(rows);
}

export async function POST(req) {
  const body = await req.json();
  const { nombre, descripcion, precio, stock, activo = true } = body;
  const row = await queryOne(
    'INSERT INTO accesorios (nombre, descripcion, precio, stock, activo) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [nombre, descripcion, parseFloat(precio), parseInt(stock) || 0, activo]
  );
  return NextResponse.json(row);
}

export async function PUT(req) {
  const body = await req.json();
  const { id, nombre, descripcion, precio, stock, activo } = body;
  const row = await queryOne(
    'UPDATE accesorios SET nombre=$1, descripcion=$2, precio=$3, stock=$4, activo=$5 WHERE id=$6 RETURNING *',
    [nombre, descripcion, parseFloat(precio), parseInt(stock) || 0, activo ?? true, id]
  );
  return NextResponse.json(row);
}

export async function DELETE(req) {
  const { id } = await req.json();
  await query('DELETE FROM accesorios WHERE id=$1', [id]);
  return NextResponse.json({ ok: true });
}
