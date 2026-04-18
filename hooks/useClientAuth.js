'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ClientAuthContext = createContext(null);

export function ClientAuthProvider({ children }) {
  const [client, setClient]         = useState(null);
  const [loadingClient, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then(({ user }) => { setClient(user); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const signUp = useCallback(async (email, password, nombre) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, nombre }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error };
    setClient(data.user);
    return { data };
  }, []);

  const signIn = useCallback(async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error };
    setClient(data.user);
    return { data };
  }, []);

  const signOut = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setClient(null);
  }, []);

  return (
    <ClientAuthContext.Provider value={{ client, loadingClient, signUp, signIn, signOut }}>
      {children}
    </ClientAuthContext.Provider>
  );
}

export function useClientAuth() {
  const ctx = useContext(ClientAuthContext);
  if (!ctx) throw new Error('useClientAuth debe usarse dentro de <ClientAuthProvider>');
  return ctx;
}
