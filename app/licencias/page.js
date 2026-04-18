import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';

export const metadata = { title: 'Licencias — DigitalCare GT' };

export default async function LicenciasPage() {
  const { data: licencias, error } = await supabase
    .from('licencias')
    .select('*')
    .eq('activo', true)
    .order('plataforma', { ascending: true });

  return (
    <>
      <Header />
      <main className="section">
        <div className="container">
          <h2>Venta de Licencias</h2>
          <p>Licencias originales para uso personal, profesional o empresarial. Garantizamos productos genuinos.</p>

          {error && (
            <p style={{ color: 'red' }}>Error al cargar licencias: {error.message}</p>
          )}

          <div className="licencias-grid">
            {licencias && licencias.length > 0 ? (
              licencias.map((lic) => (
                <ProductCard
                  key={lic.id}
                  nombre={lic.nombre}
                  descripcion={lic.descripcion}
                  precio={lic.precio}
                  tipo={lic.tipo}
                />
              ))
            ) : (
              !error && <p>No hay licencias disponibles por el momento.</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
