import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { nombre, email, telefono, items, total, referencia } = body;

    if (!nombre || !email || !items || !total) {
      return NextResponse.json({ error: 'Datos incompletos.' }, { status: 400 });
    }

    const [pedido] = await query(
      `INSERT INTO pedidos (nombre, email, telefono, items, total, referencia, estado)
       VALUES ($1, $2, $3, $4, $5, $6, 'pendiente')
       RETURNING id`,
      [nombre, email, telefono || null, JSON.stringify(items), total, referencia || null]
    );

    return NextResponse.json({ id: pedido.id });
  } catch (err) {
    console.error('[api/pedidos]', err);
    return NextResponse.json({ error: 'Error al guardar el pedido.' }, { status: 500 });
  }
}
