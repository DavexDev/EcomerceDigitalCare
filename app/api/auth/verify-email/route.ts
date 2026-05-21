/**
 * app/api/auth/verify-email/route.ts
 * 
 * Verifica el token de email del cliente
 * 
 * GET /api/auth/verify-email?token=XXX
 * POST /api/auth/verify-email/resend (reenviar email)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getClientIP } from '@/lib/validation-middleware';
import { generateVerificationToken, getTokenExpirationTime } from '@/lib/2fa';

/**
 * GET: Verificar token y activar email
 */
export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token');
    const ipAddress = getClientIP(req);

    if (!token) {
      return NextResponse.json(
        { error: 'Token de verificación requerido' },
        { status: 400 }
      );
    }

    // Buscar cliente con este token
    const { data: client, error: fetchError } = await supabaseAdmin
      .from('clientes')
      .select('id, email, verification_token_expires, email_verified')
      .eq('verification_token', token)
      .single();

    if (fetchError || !client) {
      await logAudit(
        'email_verification_failed',
        null,
        'Unknown',
        'Token inválido',
        ipAddress,
        'error'
      );

      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 400 }
      );
    }

    // Verificar que el token no haya expirado
    if (new Date(client.verification_token_expires) < new Date()) {
      await logAudit(
        'email_verification_failed',
        client.id,
        client.email,
        'Token expirado',
        ipAddress,
        'error'
      );

      return NextResponse.json(
        { error: 'Token expirado. Solicita uno nuevo.' },
        { status: 400 }
      );
    }

    // Si ya está verificado
    if (client.email_verified) {
      return NextResponse.json(
        { message: 'Este email ya está verificado' },
        { status: 200 }
      );
    }

    // Activar email
    const { error: updateError } = await supabaseAdmin
      .from('clientes')
      .update({
        email_verified: true,
        email_verified_at: new Date().toISOString(),
        verification_token: null,
        verification_token_expires: null,
      })
      .eq('id', client.id);

    if (updateError) {
      console.error('[auth/verify-email]', updateError);
      return NextResponse.json(
        { error: 'Error al verificar email' },
        { status: 500 }
      );
    }

    await logAudit(
      'email_verified',
      client.id,
      client.email,
      'Email verificado exitosamente',
      ipAddress,
      'success'
    );

    // Redirigir a login
    return NextResponse.json(
      {
        ok: true,
        message: 'Email verificado. Ahora puedes iniciar sesión.',
        redirect: '/auth/login',
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[auth/verify-email]', err);
    return NextResponse.json(
      { error: 'Error del servidor' },
      { status: 500 }
    );
  }
}

/**
 * POST: Reenviar email de verificación
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const ipAddress = getClientIP(req);

    if (!email) {
      return NextResponse.json(
        { error: 'Email requerido' },
        { status: 400 }
      );
    }

    // Buscar cliente
    const { data: client, error: fetchError } = await supabaseAdmin
      .from('clientes')
      .select('id, email_verified')
      .eq('email', email.toLowerCase())
      .single();

    if (fetchError || !client) {
      // No revelar si el email existe (seguridad)
      return NextResponse.json(
        { message: 'Si el email existe, se enviará un link de verificación' },
        { status: 200 }
      );
    }

    // Si ya está verificado
    if (client.email_verified) {
      return NextResponse.json(
        { message: 'Este email ya está verificado' },
        { status: 200 }
      );
    }

    // Generar nuevo token
    const verificationToken = generateVerificationToken();
    const verificationTokenExpires = getTokenExpirationTime(24);

    // Actualizar
    const { error: updateError } = await supabaseAdmin
      .from('clientes')
      .update({
        verification_token: verificationToken,
        verification_token_expires: verificationTokenExpires.toISOString(),
      })
      .eq('id', client.id);

    if (updateError) {
      console.error('[auth/verify-email/resend]', updateError);
      return NextResponse.json(
        { error: 'Error al reenviar email' },
        { status: 500 }
      );
    }

    // TODO: Enviar nuevo email de verificación
    // await sendVerificationEmail(email, verificationToken);

    await logAudit(
      'verification_email_resent',
      client.id,
      email,
      'Email de verificación reenviado',
      ipAddress,
      'success'
    );

    return NextResponse.json(
      { message: 'Se reenviará un email de verificación' },
      { status: 200 }
    );
  } catch (err) {
    console.error('[auth/verify-email/resend]', err);
    return NextResponse.json(
      { error: 'Error del servidor' },
      { status: 500 }
    );
  }
}

/**
 * Helper para registrar en audit log
 */
async function logAudit(
  action: string,
  actorId: string | null,
  email: string,
  description: string,
  ipAddress: string,
  status: string = 'success'
) {
  try {
    await supabaseAdmin.from('audit_logs').insert({
      actor_type: 'client',
      actor_id: actorId,
      actor_email: email,
      action,
      description,
      ip_address: ipAddress,
      status,
    });
  } catch (err) {
    console.error('[logAudit]', err);
  }
}
