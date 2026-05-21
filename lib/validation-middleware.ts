/**
 * lib/validation-middleware.ts
 * 
 * Utilidades para validar, sanitizar y proteger APIs
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema, ZodError } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Valida el body de una request contra un schema Zod
 */
export async function validateRequestBody<T>(
  req: NextRequest,
  schema: ZodSchema
): Promise<{
  data: T | null;
  error: NextResponse | null;
}> {
  try {
    const body = await req.json();

    const result = schema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const messages: Record<string, string> = {};

      for (const [field, fieldErrors] of Object.entries(errors)) {
        if (fieldErrors && fieldErrors.length > 0) {
          messages[field] = fieldErrors[0];
        }
      }

      return {
        data: null,
        error: NextResponse.json(
          { error: 'Validación fallida', details: messages },
          { status: 400 }
        ),
      };
    }

    return { data: result.data as T, error: null };
  } catch (err) {
    console.error('[validateRequestBody] Error:', err);
    return {
      data: null,
      error: NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      ),
    };
  }
}

/**
 * Sanitiza strings para prevenir XSS
 */
export function sanitizeString(input: string): string {
  if (!input) return '';
  
  // Remover HTML tags
  const cleaned = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });

  return cleaned.trim();
}

/**
 * Sanitiza un objeto recursivamente
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj };

  for (const key in sanitized) {
    const value = sanitized[key];

    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value) as any;
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value) as any;
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item =>
        typeof item === 'string' ? sanitizeString(item) : item
      ) as any;
    }
  }

  return sanitized;
}

/**
 * Valida email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

/**
 * Valida URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extrae IP de request (soporta proxies y load balancers)
 */
export function getClientIP(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = req.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  return '127.0.0.1';
}

/**
 * Valida contraseña (debe cumplir requisitos de seguridad)
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push('Mínimo 12 caracteres');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Debe contener mayúsculas');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Debe contener minúsculas');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Debe contener números');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Debe contener caracteres especiales');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Rate limiting helper
 * Uso: en middleware.ts para limitar requests por IP
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60 * 1000 // 1 minuto
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetAt) {
    // Crear nueva entrada
    const resetAt = now + windowMs;
    rateLimitMap.set(identifier, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  // Incrementar contador
  entry.count++;

  const allowed = entry.count <= limit;
  const remaining = Math.max(0, limit - entry.count);

  return { allowed, remaining, resetAt: entry.resetAt };
}

/**
 * Limpia el mapa de rate limiting cada 5 minutos
 */
export function cleanupRateLimit() {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}

// Ejecutar limpieza cada 5 minutos
if (typeof global !== 'undefined' && !(global as any).__rateLimitCleanupScheduled) {
  (global as any).__rateLimitCleanupScheduled = true;
  setInterval(cleanupRateLimit, 5 * 60 * 1000);
}
