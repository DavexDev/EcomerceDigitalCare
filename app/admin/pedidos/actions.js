'use server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';

const ESTADOS_VALIDOS = ['pendiente', 'verificado', 'enviado', 'completado', 'cancelado'];

export async function updatePedidoEstado(pedidoId, nuevoEstado) {
  // Validar inputs — nunca confiar en el cliente
  if (!pedidoId || typeof pedidoId !== 'string') {
    return { error: 'ID de pedido inválido.' };
  }
  if (!ESTADOS_VALIDOS.includes(nuevoEstado)) {
    return { error: 'Estado inválido.' };
  }

  const { error } = await supabaseAdmin
    .from('pedidos')
    .update({ estado: nuevoEstado })
    .eq('id', pedidoId);

  if (error) return { error: error.message };

  revalidatePath('/admin/pedidos');
  revalidatePath('/admin');
  return { success: true };
}
