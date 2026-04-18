import { Orbitron } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import WhatsAppModal from '@/components/WhatsAppModal';
import { ThemeProvider } from '@/components/ThemeProvider';
import SpotlightCursor from '@/components/SpotlightCursor';

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
        <ThemeProvider>
          <SpotlightCursor />
          <AuthProvider>
            {children}
            <WhatsAppModal />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
