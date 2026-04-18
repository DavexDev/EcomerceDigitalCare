import { supabase } from '@/lib/supabase';

export const revalidate = 0; // siempre fresco

export default async function AdminContactosPage() {
  const { data: contactos, error } = await supabase
    .from('contactos')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 style={{ color: '#176887', fontSize: '1.8rem', marginBottom: '8px' }}>Leads / Contactos</h1>
      <p style={{ color: '#666', marginBottom: '24px' }}>
        Clientes que consultaron por WhatsApp. Total: <strong>{contactos?.length ?? 0}</strong>
      </p>

      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

      <div className="admin-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Producto</th>
                <th>Sucursal</th>
                <th>Mensaje</th>
              </tr>
            </thead>
            <tbody>
              {contactos && contactos.map((c) => (
                <tr key={c.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {new Date(c.created_at).toLocaleString('es-GT')}
                  </td>
                  <td>{c.producto}</td>
                  <td>{c.sucursal}</td>
                  <td style={{ maxWidth: '300px' }}>{c.mensaje}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!contactos || contactos.length === 0) && (
            <p style={{ textAlign: 'center', padding: '24px', color: '#888' }}>
              Aún no hay leads registrados.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
