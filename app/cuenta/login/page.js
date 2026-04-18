'use client';
import { useState } from 'react';
import { useClientAuth } from '@/hooks/useClientAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const { signIn } = useClientAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) {
      setError('Correo o contraseña incorrectos.');
    } else {
      router.push('/cuenta');
    }
  };

  return (
    <>
      <Header />
      <main className="auth-page">
        <div className="auth-card">
          <div className="auth-icon"><LogIn size={32} /></div>
          <h1>Iniciar sesión</h1>
          <p className="auth-subtitle">Accede a tu historial de pedidos</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Correo electrónico</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" required />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn-primary full-width" disabled={loading}>
              {loading ? 'Entrando...' : 'Iniciar sesión'}
            </button>
          </form>
          <p className="auth-link">¿No tienes cuenta? <Link href="/cuenta/registro">Regístrate</Link></p>
        </div>
      </main>
    </>
  );
}
