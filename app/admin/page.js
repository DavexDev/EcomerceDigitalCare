import { supabaseAdmin } from '@/lib/supabaseAdmin';
import Link from 'next/link';
import { Users, ShoppingBag, DollarSign, Clock, TrendingUp, ArrowRight } from 'lucide-react';

export const revalidate = 0;

function fmtQ(n) {
  return `Q ${Number(n ?? 0).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function statusMeta(estado) {
  const map = {
    pendiente:  { label: 'Pendiente',  cls: 'badge-warning' },
    verificado: { label: 'Verificado', cls: 'badge-info' },
    enviado:    { label: 'Enviado',    cls: 'badge-info' },
    completado: { label: 'Completado', cls: 'badge-success' },
    cancelado:  { label: 'Cancelado',  cls: 'badge-error' },
  };
  return map[estado] ?? { label: estado, cls: 'badge-warning' };
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'ahora mismo';
  if (m < 60) return `hace ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h}h`;
  return `hace ${Math.floor(h / 24)}d`;
}

async function getDashboardData() {
  const [
    { data: pedidos },
    { data: { users } = {} },
  ] = await Promise.all([
    supabaseAdmin
      .from('pedidos')
      .select('id, nombre, email, items, total, estado, created_at')
      .order('created_at', { ascending: false }),
    supabaseAdmin.auth.admin.listUsers(),
  ]);

  const allPedidos = pedidos ?? [];
  const allClients = users ?? [];

  const totalIngresos = allPedidos
    .filter((p) => p.estado !== 'cancelado')
    .reduce((acc, p) => acc + Number(p.total ?? 0), 0);

  const pedidosPendientes = allPedidos.filter((p) => p.estado === 'pendiente').length;

  const productCount = {};
  for (const p of allPedidos) {
    if (p.estado === 'cancelado') continue;
    try {
      const items = JSON.parse(p.items || '[]');
      for (const item of items) {
        const key = item.name ?? item.nombre ?? 'Sin nombre';
        productCount[key] = (productCount[key] ?? 0) + (item.qty ?? item.cantidad ?? 1);
      }
    } catch { /* ignorar */ }
  }

  const topProductos = Object.entries(productCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, qty]) => ({ name, qty }));

  return {
    totalClientes:   allClients.length,
    totalPedidos:    allPedidos.length,
    totalIngresos,
    pedidosPendientes,
    ultimosPedidos:  allPedidos.slice(0, 6),
    ultimosClientes: allClients
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5),
    topProductos,
  };
}

export default async function AdminDashboard() {
  const {
    totalClientes, totalPedidos, totalIngresos,
    pedidosPendientes, ultimosPedidos, ultimosClientes, topProductos,
  } = await getDashboardData();

  const KPI_CARDS = [
    { label: 'Clientes registrados', value: totalClientes,       icon: Users,       color: 'kpi-blue',   href: '/admin/clientes' },
    { label: 'Total pedidos',        value: totalPedidos,        icon: ShoppingBag, color: 'kpi-teal',   href: '/admin/pedidos' },
    { label: 'Ingresos confirmados', value: fmtQ(totalIngresos), icon: DollarSign,  color: 'kpi-green',  href: '/admin/pedidos' },
    { label: 'Pedidos pendientes',   value: pedidosPendientes,   icon: Clock,
      color: pedidosPendientes > 0 ? 'kpi-orange' : 'kpi-teal', href: '/admin/pedidos' },
  ];

  return (
    <div className="dash-page">
      {/* Header */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Dashboard</h1>
          <p className="dash-subtitle">Vista general del negocio</p>
        </div>
        <Link href="/admin/pedidos" className="dash-action-btn">
          Ver todos los pedidos <ArrowRight size={14} />
        </Link>
      </div>

      {/* KPI grid */}
      <div className="kpi-grid">
        {KPI_CARDS.map(({ label, value, icon: Icon, color, href }) => (
          <Link href={href} key={label} className={`kpi-card ${color}`}>
            <div className="kpi-icon-wrap"><Icon size={20} /></div>
            <div className="kpi-body">
              <span className="kpi-value">{value}</span>
              <span className="kpi-label">{label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Middle row */}
      <div className="dash-grid-2">
        {/* Últimos pedidos */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h2><ShoppingBag size={15} /> Últimos pedidos</h2>
            <Link href="/admin/pedidos" className="dash-card-link">Ver todos <ArrowRight size={12} /></Link>
          </div>
          {ultimosPedidos.length === 0 ? (
            <p className="dash-empty">No hay pedidos aún.</p>
          ) : (
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr><th>Cliente</th><th>Total</th><th>Estado</th><th>Hace</th></tr>
                </thead>
                <tbody>
                  {ultimosPedidos.map((p) => {
                    const { label, cls } = statusMeta(p.estado);
                    return (
                      <tr key={p.id}>
                        <td className="td-name">{p.nombre}</td>
                        <td className="td-amount">{fmtQ(p.total)}</td>
                        <td><span className={`badge ${cls}`}>{label}</span></td>
                        <td className="td-time">{timeAgo(p.created_at)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top productos */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h2><TrendingUp size={15} /> Más vendidos</h2>
          </div>
          {topProductos.length === 0 ? (
            <p className="dash-empty">Sin datos de ventas aún.</p>
          ) : (
            <div className="top-products-list">
              {topProductos.map(({ name, qty }, i) => {
                const pct = Math.round((qty / topProductos[0].qty) * 100);
                return (
                  <div key={name} className="top-product-item">
                    <span className="top-product-rank">#{i + 1}</span>
                    <div className="top-product-body">
                      <div className="top-product-header">
                        <span className="top-product-name">{name}</span>
                        <span className="top-product-qty">{qty} uds.</span>
                      </div>
                      <div className="top-product-bar-bg">
                        <div className="top-product-bar" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Clientes recientes */}
      <div className="dash-card">
        <div className="dash-card-header">
          <h2><Users size={15} /> Clientes recientes</h2>
          <Link href="/admin/clientes" className="dash-card-link">Ver todos <ArrowRight size={12} /></Link>
        </div>
        {ultimosClientes.length === 0 ? (
          <p className="dash-empty">No hay clientes registrados aún.</p>
        ) : (
          <div className="clients-grid">
            {ultimosClientes.map((c) => (
              <div key={c.id} className="client-chip">
                <div className="client-chip-avatar">{c.email?.[0]?.toUpperCase()}</div>
                <div className="client-chip-info">
                  <span className="client-chip-email">{c.email}</span>
                  <span className="client-chip-date">{new Date(c.created_at).toLocaleDateString('es-GT')}</span>
                </div>
                <span className={`badge ${c.email_confirmed_at ? 'badge-success' : 'badge-warning'}`}>
                  {c.email_confirmed_at ? 'Verificado' : 'Pendiente'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
