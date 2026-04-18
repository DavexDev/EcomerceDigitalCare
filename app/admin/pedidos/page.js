import { query } from '@/lib/db';
import PedidosTable from './PedidosTable';

export const revalidate = 0;
export const metadata = { title: 'Pedidos — Admin DigitalCare GT' };

export default async function AdminPedidosPage() {
  const pedidos = await query('SELECT * FROM pedidos ORDER BY created_at DESC');

  return (
    <div className="dash-page">
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Pedidos</h1>
          <p className="dash-subtitle">{pedidos.length} pedidos en total</p>
        </div>
      </div>
      <PedidosTable pedidos={pedidos} />
    </div>
  );
}
