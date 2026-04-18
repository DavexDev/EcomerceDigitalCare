import { queryOne } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { nombre, email, password } = await req.json();
    if (!nombre || !email || !password) {
      return NextResponse.json({ error: 'Todos los campos son requeridos.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres.' }, { status: 400 });
    }

    const existing = await queryOne('SELECT id FROM clientes WHERE email = $1', [email.toLowerCase()]);
    if (existing) {
      return NextResponse.json({ error: 'Ya existe una cuenta con ese correo.' }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 12);
    const user = await queryOne(
      'INSERT INTO clientes (nombre, email, password_hash) VALUES ($1, $2, $3) RETURNING id, email, nombre',
      [nombre.trim(), email.toLowerCase(), hash]
    );

    const token = jwt.sign(
      { id: user.id, email: user.email, nombre: user.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const res = NextResponse.json({ user: { id: user.id, email: user.email, nombre: user.nombre } });
    res.cookies.set('dc_client', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return res;
  } catch (err) {
    console.error('[auth/register]', err);
    return NextResponse.json({ error: 'Error del servidor.' }, { status: 500 });
  }
}
