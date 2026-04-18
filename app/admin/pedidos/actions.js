'use server';
import { query } from '@/lib/db';
import { revalidatePath } from 'next/cache';

const ESTADOS_VALIDOS = ['pendiente', 'verificado', 'enviado', 'completado', 'cancelado'];

export async function updatePedidoEstado(pedidoId, nuevoEstado) {
  if (!pedidoId) return { error: 'ID de pedido inválido.' };
  if (!ESTADOS_VALIDOS.includes(nuevoEstado)) return { error: 'Estado inválido.' };

  try {
    await query('UPDATE pedidos SET estado = $1 WHERE id = $2', [nuevoEstado, pedidoId]);
    revalidatePath('/admin/pedidos');
    revalidatePath('/admin');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}
