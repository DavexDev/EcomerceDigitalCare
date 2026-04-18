'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const ClientAuthContext = createContext(null);

export function ClientAuthProvider({ children }) {
  const [client, setClient] = useState(null);
  const [loadingClient, setLoadingClient] = useState(true);

  useEffect(() => {
    // Get current session
    supabase.auth?.getSession?.().then(({ data }) => {
      setClient(data?.session?.user ?? null);
      setLoadingClient(false);
    }).catch(() => setLoadingClient(false));

    // Listen for auth changes
    const { data: listener } = supabase.auth?.onAuthStateChange?.((_, session) => {
      setClient(session?.user ?? null);
    }) ?? { data: null };

    return () => listener?.subscription?.unsubscribe?.();
  }, []);

  const signUp = async (email, password, nombre) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre } },
    });
    return { data, error };
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setClient(null);
  };

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
