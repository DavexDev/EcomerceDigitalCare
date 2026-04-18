import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';

export const revalidate = 60; // Revalidar cada 60 segundos

async function getAccesorios() {
  const { data, error } = await supabase
    .from('accesorios')
    .select('*')
    .eq('activo', true)
    .order('nombre');

  if (error) {
    console.error('Error fetching accesorios:', error);
    return [];
  }
  return data || [];
}

export default async function AccesoriosPage() {
  const accesorios = await getAccesorios();

  // Datos de ejemplo si no hay datos de Supabase
  const datosEjemplo = accesorios.length > 0 ? accesorios : [
    { id: 1, nombre: 'Teclado Mecánico RGB', descripcion: 'Switches blue, retroiluminación multicolor.', precio: 250 },
    { id: 2, nombre: 'Mouse Gamer 7200 DPI', descripcion: 'Alta precisión, 6 botones programables.', precio: 180 },
    { id: 3, nombre: 'Auriculares con Micrófono', descripcion: 'Sonido envolvente, micrófono retráctil.', precio: 220 },
    { id: 4, nombre: 'Base Refrigerante para Laptop', descripcion: 'Ventiladores silenciosos, ajustable.', precio: 130 },
    { id: 5, nombre: 'Webcam Full HD', descripcion: '1080p, micrófono integrado, USB plug & play.', precio: 160 },
  ];

  return (
    <>
      <Header />
      <main className="catalog-page">
        <section className="section">
          <div className="container">
            <h2>Accesorios</h2>
            <p>Complementa tu equipo con los mejores accesorios para productividad, entretenimiento o gaming.</p>
            
            <div className="catalog-grid">
              {datosEjemplo.map((item) => (
                <ProductCard
                  key={item.id}
                  nombre={item.nombre}
                  descripcion={item.descripcion}
                  precio={item.precio}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
