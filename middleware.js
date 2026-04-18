import { NextResponse } from 'next/server';

/**
 * Middleware de seguridad — DigitalCare GT
 *
 * Capas de protección:
 * 1. Rate limiting por IP  — bloquea fuerza bruta y DDoS simples
 * 2. Bloqueo de patrones   — SQLi, path traversal, scanners comunes
 * 3. Verificación de sesión— cookie dc_admin para rutas admin
 * 4. Security headers      — CSP, HSTS, X-Frame, nosniff, Referrer
 */

// ── Rate limiter (Edge-compatible in-memory sliding window) ──────────────
// Límites: /admin/login más estricto, resto de /admin moderado
const RATE_LIMITS = {
  '/admin/login': { max: 10,  windowMs: 60_000  }, // 10 req/min
  '/admin':       { max: 120, windowMs: 60_000  }, // 120 req/min
  'default':      { max: 300, windowMs: 60_000  }, // 300 req/min
};

// Map: ip_route -> { count, resetAt }
const ipCounters = new Map();

function getRateLimit(pathname) {
  if (pathname === '/admin/login' || pathname.startsWith('/admin/login/'))
    return RATE_LIMITS['/admin/login'];
  if (pathname.startsWith('/admin'))
    return RATE_LIMITS['/admin'];
  return RATE_LIMITS['default'];
}

function checkRateLimit(ip, pathname) {
  const { max, windowMs } = getRateLimit(pathname);
  const key = `${ip}::${pathname.split('/').slice(0, 3).join('/')}`;
  const now  = Date.now();
  const entry = ipCounters.get(key);

  if (!entry || now > entry.resetAt) {
    ipCounters.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, remaining: max - 1 };
  }

  entry.count += 1;
  const remaining = Math.max(0, max - entry.count);

  if (entry.count > max) {
    return { limited: true, remaining: 0, resetAt: entry.resetAt };
  }
  return { limited: false, remaining };
}

// Limpiar entradas viejas cada ~500 requests para no saturar memoria
let cleanupCounter = 0;
function maybeCleanup() {
  cleanupCounter++;
  if (cleanupCounter % 500 !== 0) return;
  const now = Date.now();
  for (const [key, val] of ipCounters) {
    if (now > val.resetAt) ipCounters.delete(key);
  }
}

// ── Bloqueo de patrones maliciosos ───────────────────────────────────────
const BLOCKED_PATTERNS = [
  /(\.\.\/){2,}/,              // path traversal
  /(<script|%3cscript)/i,      // XSS en URL
  /(union.*select|select.*from|drop.*table|insert.*into)/i, // SQLi
  /(\.php|\.asp|\.aspx|\.env|\.git\/|wp-admin|xmlrpc)/i,  // scanners
  /(%00|\x00)/,                // null bytes
];

function isBlockedPattern(url) {
  const raw = decodeURIComponent(url).toLowerCase();
  return BLOCKED_PATTERNS.some((re) => re.test(raw));
}

// ── Content Security Policy ───────────────────────────────────────────────
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://*.supabase.co https://lh3.googleusercontent.com",
  "connect-src 'self' https://*.supabase.co https://identitytoolkit.googleapis.com https://securetoken.googleapis.com wss://*.supabase.co",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join('; ');

// ── Middleware principal ──────────────────────────────────────────────────
export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Bloquear patrones maliciosos en cualquier ruta
  if (isBlockedPattern(request.nextUrl.href)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // 2. Rate limiting
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    '127.0.0.1';

  maybeCleanup();
  const { limited, remaining, resetAt } = checkRateLimit(ip, pathname);

  if (limited) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After':        String(Math.ceil((resetAt - Date.now()) / 1000)),
        'X-RateLimit-Limit':  String(getRateLimit(pathname).max),
        'X-RateLimit-Reset':  String(Math.ceil(resetAt / 1000)),
        'Content-Type':       'text/plain',
      },
    });
  }

  // 3. Verificar sesión admin (excepto login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const adminCookie = request.cookies.get('dc_admin');
    if (!adminCookie || adminCookie.value !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. Inyectar security headers
  const response = NextResponse.next();

  response.headers.set('Content-Security-Policy',     CSP);
  response.headers.set('X-Frame-Options',             'DENY');
  response.headers.set('X-Content-Type-Options',      'nosniff');
  response.headers.set('Referrer-Policy',             'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection',            '1; mode=block');
  response.headers.set('Permissions-Policy',          'camera=(), microphone=(), geolocation=(), payment=()');
  response.headers.set('Strict-Transport-Security',   'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-RateLimit-Remaining',       String(remaining));

  if (pathname.startsWith('/admin')) {
    response.headers.set('X-Robots-Tag',    'noindex, nofollow');
    response.headers.set('Cache-Control',   'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma',          'no-cache');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Aplica a todas las rutas excepto:
     * - _next/static (archivos estáticos)
     * - _next/image  (optimización de imágenes)
     * - favicon.ico
     * - archivos con extensión (png, jpg, svg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};

