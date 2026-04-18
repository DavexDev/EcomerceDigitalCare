'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Mail, Lock, LogIn } from 'lucide-react';

export default function AdminLoginPage() {
  const { user, loading, authError, setAuthError, loginWithPassword } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (!loading && user) router.push('/admin');
  }, [user, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setSubmitting(true);
    try {
      await loginWithPassword(email, password);
      router.push('/admin');
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const error = authError || localError;

  if (loading) {
    return (
      <div className="admin-login-wrap">
        <div className="admin-login-box">
          <p style={{ color: '#a0aec0', textAlign: 'center' }}>Cargando…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-box">
        <div className="admin-login-brand">
          <Shield size={32} strokeWidth={1.5} />
          <h1>DigitalCare GT</h1>
          <p>Panel de administración</p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          {error && <p className="admin-login-error">{error}</p>}

          <div className="admin-login-field">
            <label><Mail size={14} /> Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@digitalcare.gt"
              required
              autoComplete="username"
            />
          </div>

          <div className="admin-login-field">
            <label><Lock size={14} /> Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="admin-login-btn" disabled={submitting}>
            {submitting ? 'Verificando…' : <><LogIn size={16} /> Ingresar al panel</>}
          </button>
        </form>
      </div>
    </div>
  );
}
