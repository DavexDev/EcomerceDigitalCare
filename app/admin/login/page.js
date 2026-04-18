'use client';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLoginPage() {
  const { user, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) router.replace('/admin');
  }, [user, router]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      setError('Error al iniciar sesión: ' + err.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f0f4f8'
    }}>
      <div className="admin-card" style={{ maxWidth: '360px', width: '90%', textAlign: 'center' }}>
        <h1 style={{ color: '#176887', fontSize: '1.5rem', marginBottom: '8px' }}>
          DigitalCare GT
        </h1>
        <p style={{ color: '#666', marginBottom: '24px' }}>Panel de Administración</p>

        {error && (
          <p style={{ color: 'red', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</p>
        )}

        <button
          onClick={handleLogin}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center',
            width: '100%', padding: '12px 20px', background: '#fff',
            border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: '1rem', fontWeight: '600',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)', transition: 'box-shadow 0.2s'
          }}
        >
          {/* Google icon */}
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.7 2.4 30.2 0 24 0 14.8 0 6.9 5.4 3.2 13.3l7.9 6.1C12.9 13.3 18 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.6 24.5c0-1.6-.1-3.1-.4-4.5H24v8.6h12.7c-.6 3-2.3 5.5-4.9 7.2l7.7 6c4.5-4.2 7.1-10.4 7.1-17.3z"/>
            <path fill="#FBBC05" d="M11.1 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.1.8-4.6l-7.9-6.1A23.8 23.8 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l8.5-6.1z"/>
            <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.7-6c-2.1 1.4-4.7 2.2-7.5 2.2-6 0-11.1-4-12.9-9.4l-8.5 6.1C6.9 42.6 14.8 48 24 48z"/>
          </svg>
          Iniciar sesión con Google
        </button>
      </div>
    </div>
  );
}
