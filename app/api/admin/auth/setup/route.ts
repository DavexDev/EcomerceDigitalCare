/**
 * app/api/admin/auth/setup/route.ts
 * 
 * One-time setup para crear el primer admin
 * Se debe ejecutar una sola vez después de desplegar
 * 
 * POST /api/admin/auth/setup
 * Body: { email, password, nombre }
 * 
 * IMPORTANTE: Desactiva esta ruta después del primer uso
 * O agregar validación de token secreto
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { adminSetupSchema } from '@/lib/schemas';
import { validateRequestBody } from '@/lib/validation-middleware';

export async function POST(req: NextRequest) {
  try {
    // VERIFICACIÓN: Solo permitir si hay variable de setup token
    const setupToken = req.headers.get('x-setup-token');
    const expectedToken = process.env.ADMIN_SETUP_TOKEN;

    if (!expectedToken || setupToken !== expectedToken) {
      return NextResponse.json(
        { error: 'Setup token requerido o inválido' },
        { status: 403 }
      );
    }

    // Validar body
    const { data, error } = await validateRequestBody(req, adminSetupSchema);
    if (error) return error;

    const { email, password, nombre } = data!;

    // Verificar si ya existe un admin
    const { data: existingAdmins, error: checkError } = await supabaseAdmin
      .from('admins')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('[admin/auth/setup]', checkError);
      return NextResponse.json(
        { error: 'Error al verificar admins' },
        { status: 500 }
      );
    }

    if (existingAdmins && existingAdmins.length > 0) {
      return NextResponse.json(
        { error: 'Ya existe un admin en el sistema' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear admin
    const { data: newAdmin, error: insertError } = await supabaseAdmin
      .from('admins')
      .insert({
        email: email.toLowerCase(),
        password_hash: hashedPassword,
        nombre,
        active: true,
        role: 'admin',
      })
      .select('id, email, nombre')
      .single();

    if (insertError) {
      console.error('[admin/auth/setup]', insertError);
      return NextResponse.json(
        { error: 'Error al crear admin' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Admin creado exitosamente',
      admin: newAdmin,
      note: 'IMPORTANTE: Desactiva esta ruta después del primer uso',
    });
  } catch (err) {
    console.error('[admin/auth/setup]', err);
    return NextResponse.json(
      { error: 'Error del servidor' },
      { status: 500 }
    );
  }
}
