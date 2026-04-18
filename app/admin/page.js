import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const revalidate = 0; // Siempre datos frescos

async function getStats() {
  const [accesoriosRes, licenciasRes, contactosRes] = await Promise.all([
    supabase.from('accesorios').select('*', { count: 'exact', head: true }),
    supabase.from('licencias').select('*', { count: 'exact', head: true }),
    supabase.from('contactos').select('*', { count: 'exact', head: true }),
  ]);

  return {
    accesorios: accesoriosRes.count || 0,
    licencias: licenciasRes.count || 0,
    contactos: contactosRes.count || 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <h2>Dashboard</h2>
      
      <div className="admin-cards">
        <Link href="/admin/accesorios" className="admin-card">
          <h3>Accesorios</h3>
          <div className="count">{stats.accesorios}</div>
        </Link>
        
        <Link href="/admin/licencias" className="admin-card">
          <h3>Licencias</h3>
          <div className="count">{stats.licencias}</div>
        </Link>
        
        <Link href="/admin/contactos" className="admin-card">
          <h3>Contactos</h3>
          <div className="count">{stats.contactos}</div>
        </Link>
      </div>

      <div className="admin-form">
        <h2>Acciones Rápidas</h2>
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <Link href="/admin/accesorios" className="btn-primary">
            Gestionar Accesorios
          </Link>
          <Link href="/admin/licencias" className="btn-primary">
            Gestionar Licencias
          </Link>
          <Link href="/" className="btn-secondary" target="_blank">
            Ver Sitio
          </Link>
        </div>
      </div>
    </div>
  );
}
