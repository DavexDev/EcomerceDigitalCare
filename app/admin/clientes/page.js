import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { CheckCircle, Clock } from 'lucide-react';

export const revalidate = 0;
export const metadata = { title: 'Clientes — Admin DigitalCare GT' };

export default async function AdminClientesPage() {
  const [
    { data: { users } = {} },
    { data: pedidos },
  ] = await Promise.all([
    supabaseAdmin.auth.admin.listUsers(),
    supabaseAdmin.from('pedidos').select('email, total, estado'),
  ]);

  const allUsers = (users ?? []).sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  // Calcular gasto total por cliente (excluir cancelados)
  const gastoMap = {};
  const pedidosMap = {};
  for (const p of pedidos ?? []) {
    if (p.estado === 'cancelado') continue;
    gastoMap[p.email]   = (gastoMap[p.email] ?? 0) + Number(p.total ?? 0);
    pedidosMap[p.email] = (pedidosMap[p.email] ?? 0) + 1;
  }

  return (
    <div className="dash-page">
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Clientes</h1>
          <p className="dash-subtitle">{allUsers.length} clientes registrados</p>
        </div>
      </div>

      <div className="dash-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Registrado</th>
                <th>Email verificado</th>
                <th>Último acceso</th>
                <th>Pedidos</th>
                <th>Gasto total</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#a0aec0' }}>
                    No hay clientes registrados.
                  </td>
                </tr>
              ) : allUsers.map((u) => (
                <tr key={u.id}>
                  <td className="td-name">
                    <div className="client-row">
                      <div className="client-row-avatar">{u.email?.[0]?.toUpperCase()}</div>
                      <div>
                        <div>{u.user_metadata?.nombre ?? u.email?.split('@')[0]}</div>
                        <div style={{ fontSize: '0.75rem', color: '#718096' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="td-time">
                    {new Date(u.created_at).toLocaleDateString('es-GT')}
                  </td>
                  <td>
                    {u.email_confirmed_at
                      ? <span className="badge badge-success"><CheckCircle size={11} /> Verificado</span>
                      : <span className="badge badge-warning"><Clock size={11} /> Pendiente</span>
                    }
                  </td>
                  <td className="td-time">
                    {u.last_sign_in_at
                      ? new Date(u.last_sign_in_at).toLocaleDateString('es-GT')
                      : <span style={{ color: '#a0aec0' }}>—</span>
                    }
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="clients-count-badge">
                      {pedidosMap[u.email] ?? 0}
                    </span>
                  </td>
                  <td className="td-amount">
                    {gastoMap[u.email]
                      ? `Q ${Number(gastoMap[u.email]).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`
                      : <span style={{ color: '#a0aec0' }}>—</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
