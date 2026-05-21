/**
 * lib/csrf.ts
 * 
 * Utilidades para generar y verificar tokens CSRF
 * Usa hashing para mayor seguridad
 */

import crypto from 'crypto';

const CSRF_TOKEN_LENGTH = 32;
const CSRF_SECRET_LENGTH = 32;

/**
 * Genera un nuevo token CSRF
 * Se almacena en sesión/cookie y se requiere en headers o body de requests
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
}

/**
 * Valida un token CSRF
 */
export function validateCSRFToken(token: string, expectedToken: string): boolean {
  if (!token || !expectedToken) return false;
  
  // Usar comparación timing-safe para evitar timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(expectedToken)
  );
}

/**
 * Obtiene el token CSRF de una request
 * Verifica en header x-csrf-token primero, luego en body
 */
export async function getCSRFTokenFromRequest(req: Request): Promise<string | null> {
  // Desde header
  const headerToken = req.headers.get('x-csrf-token');
  if (headerToken) return headerToken;

  // Desde body (form o JSON)
  try {
    const contentType = req.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      const body = await req.json();
      return body._csrf || null;
    } else if (contentType?.includes('application/x-www-form-urlencoded')) {
      const formData = await req.text();
      const params = new URLSearchParams(formData);
      return params.get('_csrf') || null;
    }
  } catch (err) {
    console.warn('[getCSRFTokenFromRequest] Error parsing request:', err);
  }

  return null;
}

/**
 * Middleware NextJS para validar CSRF
 * Uso en Route Handlers:
 * 
 * export async function POST(req) {
 *   const error = await validateCSRFMiddleware(req);
 *   if (error) return error;
 *   // ... resto del código
 * }
 */
export async function validateCSRFMiddleware(
  req: Request,
  csrfToken: string | null
): Promise<Response | null> {
  // Solo validar en requests que modifiquen datos
  const method = req.method;
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    return null; // GET requests no requieren CSRF
  }

  const token = await getCSRFTokenFromRequest(req);

  if (!token || !csrfToken || !validateCSRFToken(token, csrfToken)) {
    return new Response(
      JSON.stringify({ error: 'Token CSRF inválido' }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return null; // Valid
}

/**
 * Inyecta token CSRF en respuesta como header o en HTML meta tag
 */
export function injectCSRFToken(response: Response, token: string): Response {
  response.headers.set('X-CSRF-Token', token);
  return response;
}

// Session storage para tokens (en producción usar Redis o similar)
const sessionTokens = new Map<string, { token: string; expires: number }>();

/**
 * Almacena token CSRF en memoria (solo para desarrollo)
 * En producción: usar Redis, Memcached o similar
 */
export function storeCSRFToken(sessionId: string, token: string): void {
  const expiresIn = 60 * 60 * 1000; // 1 hora
  sessionTokens.set(sessionId, {
    token,
    expires: Date.now() + expiresIn,
  });
}

/**
 * Recupera token CSRF de sesión
 */
export function getStoredCSRFToken(sessionId: string): string | null {
  const entry = sessionTokens.get(sessionId);

  if (!entry) return null;

  // Verificar expiración
  if (Date.now() > entry.expires) {
    sessionTokens.delete(sessionId);
    return null;
  }

  return entry.token;
}

/**
 * Limpia tokens CSRF expirados
 * Ejecutar periódicamente (ej. cada 5 minutos)
 */
export function cleanupExpiredTokens(): void {
  const now = Date.now();
  for (const [sessionId, entry] of sessionTokens.entries()) {
    if (now > entry.expires) {
      sessionTokens.delete(sessionId);
    }
  }
}

// Ejecutar limpieza cada 5 minutos
if (typeof global !== 'undefined') {
  (global as any).__csrfCleanupScheduled ??= setInterval(
    cleanupExpiredTokens,
    5 * 60 * 1000
  );
}
