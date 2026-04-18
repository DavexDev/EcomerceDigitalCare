import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('dc_admin')?.value;
  if (!token) return NextResponse.json({ user: null });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.json({ user: { email: payload.email, role: payload.role } });
  } catch {
    return NextResponse.json({ user: null });
  }
}
