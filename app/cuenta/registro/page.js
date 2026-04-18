'use client';
import { useState } from 'react';
import { useClientAuth } from '@/hooks/useClientAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { UserPlus } from 'lucide-react';

export default function RegistroPage() {
  const { signUp } = useClientAuth();
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== password2) { setError('Las contraseñas no coinciden.'); return; }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return; }
    setLoading(true);
    const { error: err } = await signUp(email, password, nombre);
    setLoading(false);
    if (err) {
      setError(err.message.includes('already') ? 'Este correo ya está registrado.' : 'Error al registrar. Intenta de nuevo.');
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <>
        <Header />
        <main className="auth-page">
          <div className="auth-card">
            <h2>¡Registro exitoso!</h2>
            <p>Revisa tu correo para confirmar tu cuenta, luego puedes <Link href="/cuenta/login">iniciar sesión</Link>.</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="auth-page">
        <div className="auth-card">
          <div className="auth-icon"><UserPlus size={32} /></div>
          <h1>Crear cuenta</h1>
          <p className="auth-subtitle">Crea tu cuenta para seguir tus pedidos</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Nombre completo</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" required />
            </div>
            <div className="form-group">
              <label>Correo electrónico</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" required />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required />
            </div>
            <div className="form-group">
              <label>Confirmar contraseña</label>
              <input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} placeholder="Repite tu contraseña" required />
            </div>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn-primary full-width" disabled={loading}>
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>
          <p className="auth-link">¿Ya tienes cuenta? <Link href="/cuenta/login">Inicia sesión</Link></p>
        </div>
      </main>
    </>
  );
}
