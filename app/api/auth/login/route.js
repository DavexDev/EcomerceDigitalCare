import { query, queryOne } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña requeridos.' }, { status: 400 });
    }

    const user = await queryOne('SELECT * FROM clientes WHERE email = $1', [email.toLowerCase()]);
    if (!user) {
      return NextResponse.json({ error: 'Credenciales incorrectas.' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Credenciales incorrectas.' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, nombre: user.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const res = NextResponse.json({
      user: { id: user.id, email: user.email, nombre: user.nombre },
    });
    res.cookies.set('dc_client', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return res;
  } catch (err) {
    console.error('[auth/login]', err);
    return NextResponse.json({ error: 'Error del servidor.' }, { status: 500 });
  }
}
