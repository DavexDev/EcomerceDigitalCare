import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';

export const revalidate = 60; // Revalidar cada 60 segundos

async function getLicencias() {
  const { data, error } = await supabase
    .from('licencias')
    .select('*')
    .eq('activo', true)
    .order('plataforma');

  if (error) {
    console.error('Error fetching licencias:', error);
    return [];
  }
  return data || [];
}

export default async function LicenciasPage() {
  const licencias = await getLicencias();

  // Datos de ejemplo si no hay datos de Supabase
  const datosEjemplo = licencias.length > 0 ? licencias : [
    { id: 1, nombre: 'Canva Pro', descripcion: '1 año de acceso', precio: 90, plataforma: 'Diseño' },
    { id: 2, nombre: 'Office 365', descripcion: 'Cuenta activa 1 año', precio: 100, plataforma: 'Microsoft' },
    { id: 3, nombre: 'Office 2019', descripcion: 'Licencia permanente', precio: 140, plataforma: 'Microsoft' },
    { id: 4, nombre: 'Office 2021', descripcion: 'Licencia permanente', precio: 150, plataforma: 'Microsoft' },
    { id: 5, nombre: 'AutoCAD', descripcion: 'Versión profesional', precio: 200, plataforma: 'Autodesk' },
    { id: 6, nombre: 'Windows 10 Pro', descripcion: 'Activación 100%', precio: 120, plataforma: 'Microsoft' },
    { id: 7, nombre: 'Windows 11 Pro', descripcion: 'Última versión', precio: 130, plataforma: 'Microsoft' },
  ];

  return (
    <>
      <Header />
      <main className="catalog-page">
        <section className="section">
          <div className="container">
            <h2>Licencias de Software</h2>
            <p>Licencias originales para tu productividad y seguridad. Consultar por disponibilidad y activación.</p>
            
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
