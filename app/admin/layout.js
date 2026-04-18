'use client';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!user && pathname !== '/admin/login') return null;

  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>DigitalCare GT</h2>
          <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>Panel Admin</p>
        </div>

        <nav style={{ display:'flex', flexDirection:'column', gap:'8px', flex:1 }}>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/accesorios">Accesorios</Link>
          <Link href="/admin/licencias">Licencias</Link>
          <Link href="/admin/contactos">Leads / Contactos</Link>
        </nav>

        <div style={{ marginTop:'auto', paddingTop:'16px', borderTop:'1px solid rgba(255,255,255,0.2)' }}>
          <p style={{ fontSize:'0.8rem', opacity:0.75, marginBottom:'8px' }}>{user.email}</p>
          <button
            onClick={logout}
            style={{ background:'rgba(255,255,255,0.15)', border:'none', color:'#fff',
              padding:'8px 14px', borderRadius:'8px', cursor:'pointer', fontFamily:'inherit', width:'100%' }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}
