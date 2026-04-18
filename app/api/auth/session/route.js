import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('dc_client')?.value;
  if (!token) return NextResponse.json({ user: null });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.json({ user: { id: user.id, email: user.email, nombre: user.nombre } });
  } catch {
    return NextResponse.json({ user: null });
  }
}
