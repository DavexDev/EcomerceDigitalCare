import { query, queryOne } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const rows = await query('SELECT * FROM licencias ORDER BY nombre');
  return NextResponse.json(rows);
}

export async function POST(req) {
  const body = await req.json();
  const { nombre, descripcion, precio, duracion, tipo, activo = true } = body;
  const row = await queryOne(
    'INSERT INTO licencias (nombre, descripcion, precio, duracion, tipo, activo) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [nombre, descripcion, parseFloat(precio), parseInt(duracion) || 12, tipo, activo]
  );
  return NextResponse.json(row);
}

export async function PUT(req) {
  const body = await req.json();
  const { id, nombre, descripcion, precio, duracion, tipo, activo } = body;
  const row = await queryOne(
    'UPDATE licencias SET nombre=$1, descripcion=$2, precio=$3, duracion=$4, tipo=$5, activo=$6 WHERE id=$7 RETURNING *',
    [nombre, descripcion, parseFloat(precio), parseInt(duracion), tipo, activo ?? true, id]
  );
  return NextResponse.json(row);
}

export async function DELETE(req) {
  const { id } = await req.json();
  await query('DELETE FROM licencias WHERE id=$1', [id]);
  return NextResponse.json({ ok: true });
}
