import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Verificar si tenemos credenciales válidas
const hasValidConfig = firebaseConfig.apiKey && 
  !firebaseConfig.apiKey.includes('tu-') && 
  firebaseConfig.apiKey !== 'AIzaSy...';

let app = null;
let auth = null;
let googleProvider = null;

if (hasValidConfig) {
  // Evita re-inicializar en hot reload de Next.js
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
} else if (typeof window !== 'undefined') {
  console.warn('[Firebase] Modo demo - configura las credenciales en .env.local para autenticación');
}

export { auth, googleProvider };
export default app;
