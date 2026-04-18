import { supabaseAdmin } from '@/lib/supabaseAdmin';
import PedidosTable from './PedidosTable';

export const revalidate = 0;
export const metadata = { title: 'Pedidos — Admin DigitalCare GT' };

export default async function AdminPedidosPage() {
  const { data: pedidos } = await supabaseAdmin
    .from('pedidos')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="dash-page">
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Pedidos</h1>
          <p className="dash-subtitle">{pedidos?.length ?? 0} pedidos en total</p>
        </div>
      </div>
      <PedidosTable pedidos={pedidos ?? []} />
    </div>
  );
}
