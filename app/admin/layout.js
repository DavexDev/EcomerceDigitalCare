'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="admin-layout">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirigiendo...
  }

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <h1>Panel Admin - DigitalCare GT</h1>
        <nav className="admin-nav">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/accesorios">Accesorios</Link>
          <Link href="/admin/licencias">Licencias</Link>
          <Link href="/admin/contactos">Contactos</Link>
          <button onClick={logout} className="btn-secondary">
            Cerrar sesión
          </button>
        </nav>
      </header>
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}
