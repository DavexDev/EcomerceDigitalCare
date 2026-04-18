import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';

export const metadata = { title: 'Accesorios — DigitalCare GT' };

export default async function AccesoriosPage() {
  const { data: accesorios, error } = await supabase
    .from('accesorios')
    .select('*')
    .eq('activo', true)
    .order('created_at', { ascending: false });

  return (
    <>
      <Header />
      <main className="section">
        <div className="container">
          <h2>Accesorios</h2>
          <p>Encuentra los mejores complementos para tu PC o consola: calidad, estilo y funcionalidad en un solo lugar.</p>

          {error && (
            <p style={{ color: 'red' }}>Error al cargar productos: {error.message}</p>
          )}

          <div className="accesorios-grid">
            {accesorios && accesorios.length > 0 ? (
              accesorios.map((acc) => (
                <ProductCard
                  key={acc.id}
                  nombre={acc.nombre}
                  descripcion={acc.descripcion}
                  precio={acc.precio}
                />
              ))
            ) : (
              !error && <p>No hay accesorios disponibles por el momento.</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
