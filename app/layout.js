import { Orbitron } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import WhatsAppModal from '@/components/WhatsAppModal';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-orbitron',
});

export const metadata = {
  title: 'DigitalCare GT',
  description: 'Soporte técnico, desarrollo web, seguridad digital y más.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={orbitron.variable}>
      <body>
        <AuthProvider>
          {children}
          <WhatsAppModal />
        </AuthProvider>
      </body>
    </html>
  );
}
