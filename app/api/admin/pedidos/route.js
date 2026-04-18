import { query, queryOne } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (email) {
    const rows = await query(
      'SELECT * FROM pedidos WHERE email=$1 ORDER BY created_at DESC',
      [email]
    );
    return NextResponse.json(rows);
  }

  const rows = await query('SELECT * FROM pedidos ORDER BY created_at DESC');
  return NextResponse.json(rows);
}

export async function PUT(req) {
  const body = await req.json();
  const { id, estado } = body;
  const VALID = ['pendiente','verificado','enviado','completado','cancelado'];
  if (!VALID.includes(estado)) {
    return NextResponse.json({ error: 'Estado inválido.' }, { status: 400 });
  }
  const row = await queryOne(
    'UPDATE pedidos SET estado=$1, updated_at=NOW() WHERE id=$2 RETURNING *',
    [estado, id]
  );
  return NextResponse.json(row);
}
