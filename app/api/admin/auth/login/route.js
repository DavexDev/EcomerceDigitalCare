import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '')
  .split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? '';

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password)
    return NextResponse.json({ error: 'Campos requeridos.' }, { status: 400 });

  const emailLower = email.toLowerCase();
  const emailOk = ADMIN_EMAILS.length === 0 || ADMIN_EMAILS.includes(emailLower);

  if (!emailOk || password !== ADMIN_PASSWORD)
    return NextResponse.json({ error: 'Credenciales incorrectas.' }, { status: 401 });

  const token = jwt.sign(
    { email: emailLower, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '12h' }
  );

  const res = NextResponse.json({ ok: true });
  res.cookies.set('dc_admin', token, {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 12,
    secure: process.env.NODE_ENV === 'production',
  });
  return res;
}
