'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import {
  LayoutDashboard, ShoppingBag, Users, Package,
  FileKey, MessageSquare, LogOut, Shield,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin',            label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/admin/pedidos',    label: 'Pedidos',       icon: ShoppingBag },
  { href: '/admin/clientes',   label: 'Clientes',      icon: Users },
  { href: '/admin/accesorios', label: 'Accesorios',    icon: Package },
  { href: '/admin/licencias',  label: 'Licencias',     icon: FileKey },
  { href: '/admin/contactos',  label: 'Contactos',     icon: MessageSquare },
];

export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.push('/admin/login');
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="admin-shell">
        <div className="admin-loading">
          <Shield size={32} />
          <span>Verificando sesión…</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <Shield size={18} />
          <span>DigitalCare GT</span>
        </div>

        <nav className="admin-sidebar-nav">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(href);
            return (
              <Link key={href} href={href}
                className={`admin-nav-link${isActive ? ' active' : ''}`}>
                <Icon size={15} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {user.email?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div className="admin-user-details">
              <span className="admin-user-name">Admin</span>
              <span className="admin-user-email">{user.email}</span>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={logout} title="Cerrar sesión">
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}

