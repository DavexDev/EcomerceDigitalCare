'use client';
import { useState, useEffect, createContext, useContext } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

// Correos autorizados como admin (separados por coma en .env)
const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function isAdminEmail(email) {
  if (!email) return false;
  if (ADMIN_EMAILS.length === 0) return true; // Dev: sin allowlist configurada
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

function setAdminSessionCookie() {
  // Cookie de sesión — complementa la protección del middleware
  // SameSite=Strict evita CSRF; Secure en producción
  const isSecure = window.location.protocol === 'https:';
  document.cookie = `dc_admin=authenticated; path=/; SameSite=Strict${isSecure ? '; Secure' : ''}`;
}

function clearAdminSessionCookie() {
  document.cookie = 'dc_admin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && !isAdminEmail(currentUser.email)) {
        // Email no autorizado — cerrar sesión silenciosamente
        signOut(auth);
        clearAdminSessionCookie();
        setUser(null);
        setAuthError('Cuenta no autorizada para acceder al panel de administración.');
      } else {
        if (currentUser) setAdminSessionCookie();
        else clearAdminSessionCookie();
        setUser(currentUser);
        setAuthError(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    if (!auth || !googleProvider) {
      console.warn('Firebase no está configurado. Configura las credenciales en .env.local');
      return null;
    }
    setAuthError(null);
    const result = await signInWithPopup(auth, googleProvider);
    if (result?.user && !isAdminEmail(result.user.email)) {
      await signOut(auth);
      clearAdminSessionCookie();
      throw new Error('Cuenta no autorizada para acceder al panel de administración.');
    }
    if (result?.user) setAdminSessionCookie();
    return result;
  };

  const logout = async () => {
    if (!auth) return;
    clearAdminSessionCookie();
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, authError, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return context;
}
