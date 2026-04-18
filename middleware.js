import { NextResponse } from 'next/server';

/**
 * Middleware de seguridad para rutas /admin/*
 *
 * Capas:
 * 1. Verifica cookie de sesión admin (establecida tras login exitoso con Google)
 * 2. Inyecta security headers en todas las respuestas
 *
 * Nota: La cookie "dc_admin" es una primera línea de defensa.
 * La verificación real de identidad ocurre en el cliente con Firebase Auth.
 * Para producción de alto tráfico, agrega Firebase Admin SDK para verificar
 * el ID token en el servidor (nextjs/app/api/admin/verify/route.js).
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;

  // ── Proteger rutas admin (excepto la propia pantalla de login) ──
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const adminCookie = request.cookies.get('dc_admin');

    if (!adminCookie || adminCookie.value !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Security headers en todas las respuestas ──
  const response = NextResponse.next();

  // Prevenir clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  // Prevenir MIME sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  // Control de referrer
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  // XSS básico (complementario a CSP)
  response.headers.set('X-XSS-Protection', '1; mode=block');
  // No indexar panel admin
  if (pathname.startsWith('/admin')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
}

export const config = {
  // Aplica solo a rutas admin (excluye assets estáticos)
  matcher: ['/admin/:path*'],
};
