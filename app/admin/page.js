import { supabase } from '@/lib/supabase';

export default async function AdminDashboard() {
  const [{ count: totalAccesorios }, { count: totalLicencias }, { count: totalContactos }] =
    await Promise.all([
      supabase.from('accesorios').select('*', { count: 'exact', head: true }),
      supabase.from('licencias').select('*', { count: 'exact', head: true }),
      supabase.from('contactos').select('*', { count: 'exact', head: true }),
    ]);

  const stats = [
    { label: 'Accesorios', value: totalAccesorios ?? 0, color: '#176887' },
    { label: 'Licencias',  value: totalLicencias  ?? 0, color: '#64ccc5' },
    { label: 'Leads',      value: totalContactos  ?? 0, color: '#38a169' },
  ];

  return (
    <div>
      <h1 style={{ color: '#176887', fontSize: '1.8rem', marginBottom: '8px' }}>Dashboard</h1>
      <p style={{ color: '#666', marginBottom: '32px' }}>Resumen general de DigitalCare GT</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
        {stats.map((s) => (
          <div key={s.label} className="admin-card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '3rem', fontWeight: 700, color: s.color }}>{s.value}</p>
            <p style={{ color: '#666', marginTop: '4px' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="admin-card" style={{ marginTop: '32px' }}>
        <h2 style={{ color: '#176887', marginBottom: '12px' }}>Accesos rápidos</h2>
        <ul style={{ listStyle: 'none', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <li><a href="/admin/accesorios" className="btn-ver-mas">Gestionar Accesorios</a></li>
          <li><a href="/admin/licencias"  className="btn-ver-mas">Gestionar Licencias</a></li>
          <li><a href="/admin/contactos"  className="btn-ver-mas">Ver Leads</a></li>
        </ul>
      </div>
    </div>
  );
}
