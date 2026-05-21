/**
 * lib/schemas.ts
 * 
 * Esquemas de validación Zod centralizados
 * Usados tanto en cliente como en servidor
 * 
 * Uso:
 * import { clientRegisterSchema, adminLoginSchema } from '@/lib/schemas';
 * 
 * const { data, error } = clientRegisterSchema.safeParse(formData);
 */

import { z } from 'zod';

// ============================================================
// UTILIDADES DE VALIDACIÓN
// ============================================================

export const passwordSchema = z
  .string()
  .min(12, 'La contraseña debe tener al menos 12 caracteres')
  .max(128, 'La contraseña no puede exceder 128 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
  .regex(/[a-z]/, 'Debe contener al menos una minúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Debe contener al menos un carácter especial');

export const emailSchema = z
  .string()
  .email('Email no válido')
  .max(255, 'Email muy largo')
  .transform(val => val.toLowerCase().trim());

export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-()]{8,20}$/, 'Teléfono no válido')
  .optional()
  .or(z.literal(''));

// ============================================================
// CLIENTE - AUTENTICACIÓN
// ============================================================

export const clientRegisterSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+$/, 'El nombre contiene caracteres no válidos'),
  
  email: emailSchema,
  
  password: passwordSchema,
  
  passwordConfirm: z.string(),
  
  apellido: z
    .string()
    .max(100, 'El apellido es demasiado largo')
    .optional()
    .or(z.literal('')),
  
  telefono: phoneSchema,
  
  terminos_aceptados: z
    .boolean()
    .refine(val => val === true, 'Debes aceptar los términos de servicio'),
}).refine(data => data.password === data.passwordConfirm, {
  message: "Las contraseñas no coinciden",
  path: ["passwordConfirm"],
});

export const clientLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'La contraseña es requerida'),
});

export const clientPasswordResetSchema = z.object({
  email: emailSchema,
});

export const clientPasswordResetConfirmSchema = z.object({
  token: z.string().min(10, 'Token no válido'),
  password: passwordSchema,
  passwordConfirm: z.string(),
}).refine(data => data.password === data.passwordConfirm, {
  message: "Las contraseñas no coinciden",
  path: ["passwordConfirm"],
});

export const clientUpdateProfileSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo')
    .optional(),
  
  apellido: z
    .string()
    .max(100, 'El apellido es demasiado largo')
    .optional(),
  
  telefono: phoneSchema,
});

// ============================================================
// ADMIN - AUTENTICACIÓN
// ============================================================

export const adminSetupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo'),
});

export const adminLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'La contraseña es requerida'),
});

export const admin2FAEnableSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'La contraseña es requerida'),
});

export const admin2FAVerifySchema = z.object({
  code: z
    .string()
    .length(6, 'El código debe tener 6 dígitos')
    .regex(/^[0-9]+$/, 'El código debe contener solo dígitos'),
});

// ============================================================
// PRODUCTOS
// ============================================================

export const productoBaseSchema = {
  nombre: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(255, 'El nombre es demasiado largo'),
  
  descripcion: z
    .string()
    .max(2000, 'La descripción es demasiado larga')
    .optional()
    .or(z.literal('')),
  
  precio: z
    .number()
    .positive('El precio debe ser positivo')
    .max(999999, 'El precio es demasiado alto'),
  
  stock: z
    .number()
    .int('El stock debe ser un número entero')
    .nonnegative('El stock no puede ser negativo')
    .default(0),
  
  stock_minimo: z
    .number()
    .int('Stock mínimo debe ser un número entero')
    .nonnegative('Stock mínimo no puede ser negativo')
    .default(5),
  
  activo: z.boolean().default(true),
  
  categoria: z
    .string()
    .max(100, 'Categoría muy larga')
    .optional()
    .or(z.literal('')),
  
  sku: z
    .string()
    .max(100, 'SKU muy largo')
    .optional()
    .or(z.literal('')),
  
  imagen_url: z
    .string()
    .url('URL de imagen no válida')
    .optional()
    .or(z.literal('')),
};

export const accesorioCreateSchema = z.object(productoBaseSchema);

export const accesorioUpdateSchema = z.object(productoBaseSchema).partial();

export const licenciaCreateSchema = z.object({
  ...productoBaseSchema,
  
  duracion: z
    .number()
    .int('Duración debe ser número entero')
    .nonnegative('Duración no puede ser negativa')
    .default(12),
  
  tipo: z
    .enum(['antivirus', 'office', 'windows', 'otro'], {
      errorMap: () => ({ message: 'Tipo de licencia no válido' }),
    })
    .default('antivirus'),
  
  plataforma: z
    .string()
    .max(100, 'Plataforma muy larga')
    .optional()
    .or(z.literal('')),
});

export const licenciaUpdateSchema = licenciaCreateSchema.partial();

// ============================================================
// PEDIDOS
// ============================================================

export const pedidoItemSchema = z.object({
  id: z.string().or(z.number()),
  name: z.string(),
  price: z.number().positive(),
  qty: z.number().int().positive(),
});

export const pedidoCreateSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre es requerido')
    .max(255),
  
  email: emailSchema,
  
  telefono: phoneSchema,
  
  items: z
    .array(pedidoItemSchema)
    .min(1, 'El pedido debe tener al menos un item'),
  
  total: z
    .number()
    .positive('El total debe ser positivo'),
  
  metodo_pago: z
    .enum(['whatsapp', 'transferencia'], {
      errorMap: () => ({ message: 'Método de pago no válido' }),
    })
    .default('whatsapp'),
  
  notas: z
    .string()
    .max(1000, 'Las notas son demasiado largas')
    .optional()
    .or(z.literal('')),
});

export const pedidoUpdateEstadoSchema = z.object({
  estado: z.enum(['pendiente', 'verificado', 'enviado', 'completado', 'cancelado']),
});

// ============================================================
// CONTACTOS / LEADS
// ============================================================

export const contactoCreateSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre es requerido')
    .max(255),
  
  email: emailSchema,
  
  telefono: z.string().min(8, 'El teléfono es requerido'),
  
  servicio: z
    .string()
    .max(255, 'Servicio muy largo')
    .optional()
    .or(z.literal('')),
  
  mensaje: z
    .string()
    .max(2000, 'El mensaje es muy largo')
    .optional()
    .or(z.literal('')),
});

// ============================================================
// UTILIDADES
// ============================================================

/**
 * Valida un schema y retorna { data, errors }
 * Uso: const result = validateSchema(data, mySchema);
 */
export function validateSchema<T>(data: unknown, schema: z.ZodSchema<T>) {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const errors = result.error.flatten();
    return { data: null, errors };
  }
  
  return { data: result.data, errors: null };
}

/**
 * Extrae mensajes de error formateados
 */
export function getErrorMessages(errors: z.ZodFormattedError<any, string>): Record<string, string> {
  const messages: Record<string, string> = {};
  
  // Field errors
  for (const [field, fieldErrors] of Object.entries(errors)) {
    if (fieldErrors && '_errors' in fieldErrors) {
      const errorArray = (fieldErrors as any)._errors;
      if (errorArray && errorArray.length > 0) {
        messages[field] = errorArray[0];
      }
    }
  }
  
  return messages;
}

// Exports de tipos para TypeScript
export type ClientRegister = z.infer<typeof clientRegisterSchema>;
export type ClientLogin = z.infer<typeof clientLoginSchema>;
export type AdminLogin = z.infer<typeof adminLoginSchema>;
export type PedidoCreate = z.infer<typeof pedidoCreateSchema>;
export type AccesorioCreate = z.infer<typeof accesorioCreateSchema>;
export type LicenciaCreate = z.infer<typeof licenciaCreateSchema>;
