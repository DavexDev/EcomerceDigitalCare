'use client';
import { useEffect, useState } from 'react';
import { useClientAuth } from '@/hooks/useClientAuth';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Link from 'next/link';
import { Package, LogOut, User } from 'lucide-react';

const ESTADO_LABEL = {
  pendiente: { label: 'Pendiente verificación', color: '#f59e0b' },
  verificado: { label: 'Pago verificado', color: '#10b981' },
  enviado: { label: 'Enviado', color: '#3b82f6' },
  completado: { label: 'Completado', color: '#64ccc5' },
  cancelado: { label: 'Cancelado', color: '#ef4444' },
};

export default function CuentaPage() {
  const { client, loadingClient, signOut } = useClientAuth();
  const router = useRouter();
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);

  useEffect(() => {
    if (!loadingClient && !client) router.push('/cuenta/login');
  }, [client, loadingClient]);

  useEffect(() => {
    if (!client) return;
    supabase
      .from('pedidos')
      .select('*')
      .eq('email', client.email)
      .then(({ data }) => {
        setPedidos(data || []);
        setLoadingPedidos(false);
      });
  }, [client]);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  if (loadingClient) {
    return (
      <>
        <Header />
        <main className="auth-page"><p>Cargando...</p></main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="cuenta-page">
        <div className="cuenta-container">
          {/* Sidebar */}
          <aside className="cuenta-sidebar">
            <div className="cuenta-user">
              <div className="cuenta-avatar"><User size={32} /></div>
              <div>
                <strong>{client?.user_metadata?.nombre || 'Cliente'}</strong>
                <span>{client?.email}</span>
              </div>
            </div>
            <nav className="cuenta-nav">
              <button className="cuenta-nav-item active"><Package size={16} /> Mis pedidos</button>
            </nav>
            <button className="cuenta-logout" onClick={handleLogout}>
              <LogOut size={16} /> Cerrar sesión
            </button>
          </aside>

          {/* Content */}
          <div className="cuenta-content">
            <h2>Mis pedidos</h2>
            {loadingPedidos ? (
              <p>Cargando pedidos...</p>
            ) : pedidos.length === 0 ? (
              <div className="cuenta-empty">
                <Package size={48} />
                <p>No tienes pedidos aún.</p>
                <Link href="/accesorios" className="btn-primary">Ver productos</Link>
              </div>
            ) : (
              <ul className="pedidos-list">
                {pedidos.map((p) => {
                  const estado = ESTADO_LABEL[p.estado] || ESTADO_LABEL.pendiente;
                  const items = JSON.parse(p.items || '[]');
                  return (
                    <li key={p.id} className="pedido-card">
                      <div className="pedido-header">
                        <span className="pedido-id">Pedido #{p.id?.toString().slice(-6)}</span>
                        <span className="pedido-estado" style={{ color: estado.color }}>{estado.label}</span>
                      </div>
                      <ul className="pedido-items">
                        {items.map((item, idx) => (
                          <li key={idx}>{item.name} × {item.qty} — <strong>Q{(item.price * item.qty).toFixed(2)}</strong></li>
                        ))}
                      </ul>
                      <div className="pedido-footer">
                        <span>Total: <strong>Q{Number(p.total).toFixed(2)}</strong></span>
                        <span className="pedido-fecha">{new Date(p.created_at).toLocaleDateString('es-GT')}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
