import { Orbitron } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import { ClientAuthProvider } from '@/hooks/useClientAuth';
import { CartProvider } from '@/hooks/useCart';
import WhatsAppModal from '@/components/WhatsAppModal';
import { ThemeProvider } from '@/components/ThemeProvider';
import SpotlightCursor from '@/components/SpotlightCursor';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-orbitron',
});

const BASE_URL = 'https://digitalcare.gt';

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'DigitalCare GT — Soporte Técnico y Tecnología en Chiquimula',
    template: '%s | DigitalCare GT',
  },
  description:
    'Servicio técnico profesional para PC, laptops y consolas en Chiquimula, Guatemala. Mantenimiento, reparación, licencias originales, accesorios y seguridad digital.',
  keywords: [
    'soporte técnico Chiquimula',
    'mantenimiento de computadoras Guatemala',
    'reparación PC Chiquimula',
    'licencias Windows Guatemala',
    'antivirus ESET Guatemala',
    'accesorios gaming Guatemala',
    'DigitalCare GT',
    'técnico en computadoras',
  ],
  authors: [{ name: 'DigitalCare GT', url: BASE_URL }],
  creator: 'DigitalCare GT',
  publisher: 'DigitalCare GT',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'es_GT',
    url: BASE_URL,
    siteName: 'DigitalCare GT',
    title: 'DigitalCare GT — Soporte Técnico y Tecnología en Chiquimula',
    description:
      'Servicio técnico profesional, licencias originales y accesorios en Chiquimula, Guatemala.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'DigitalCare GT' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DigitalCare GT — Soporte Técnico en Chiquimula',
    description: 'Mantenimiento, reparación, licencias y accesorios en Chiquimula, Guatemala.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: BASE_URL,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'DigitalCare GT',
  description:
    'Soporte técnico profesional para PC, laptops y consolas. Mantenimiento, reparación, licencias y accesorios en Chiquimula, Guatemala.',
  url: BASE_URL,
  telephone: '+50257655899',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Chiquimula',
    addressRegion: 'Chiquimula',
    addressCountry: 'GT',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 14.7995, longitude: -89.5452 },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '08:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '08:00', closes: '13:00' },
  ],
  priceRange: '$$',
  image: `${BASE_URL}/logo.png`,
  sameAs: [],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={orbitron.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <SpotlightCursor />
          <ClientAuthProvider>
            <CartProvider>
              <AuthProvider>
                {children}
                <WhatsAppModal />
              </AuthProvider>
            </CartProvider>
          </ClientAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

