/**
 * lib/2fa.ts
 * 
 * Utilidades para autenticación de dos factores con Google Authenticator
 * Basado en speakeasy + qrcode
 */

import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

/**
 * Genera un nuevo secreto para 2FA
 */
export function generate2FASecret(email: string, appName: string = 'DigitalCare GT') {
  const secret = speakeasy.generateSecret({
    name: `${appName} (${email})`,
    issuer: appName,
    length: 32,
  });

  return {
    secret: secret.base32,
    backupCodes: generateBackupCodes(10),
    otpauth_url: secret.otpauth_url,
  };
}

/**
 * Genera código QR como Data URL
 */
export async function generate2FAQRCode(otpauth_url: string): Promise<string> {
  try {
    const qrCode = await QRCode.toDataURL(otpauth_url);
    return qrCode;
  } catch (error) {
    console.error('[2FA] Error generando QR code:', error);
    throw new Error('No se pudo generar el código QR');
  }
}

/**
 * Verifica un token de 2FA
 */
export function verify2FAToken(
  secret: string,
  token: string,
  window: number = 1
): boolean {
  try {
    const isValid = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: window,
    });

    return isValid || false;
  } catch (error) {
    console.error('[2FA] Error verificando token:', error);
    return false;
  }
}

/**
 * Genera códigos de respaldo (backup codes)
 * Se pueden usar si pierden acceso al dispositivo authenticator
 */
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const code = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();
    codes.push(code);
  }
  return codes;
}

/**
 * Verifica un código de respaldo
 */
export function verifyBackupCode(
  backupCodes: string[],
  code: string
): boolean {
  return backupCodes.includes(code.toUpperCase());
}

/**
 * Genera un token temporal para verificación de email o password reset
 */
export function generateVerificationToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * Calcula el tiempo de expiración para un token
 * Por defecto: 24 horas
 */
export function getTokenExpirationTime(hours: number = 24): Date {
  const now = new Date();
  now.setHours(now.getHours() + hours);
  return now;
}
