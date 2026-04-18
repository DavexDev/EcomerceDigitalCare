'use client';
import { useState, useEffect } from 'react';

export default function AdminContactosPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos');

  const fetchLeads = async () => {
    const params = filter !== 'todos' ? `?filter=${filter === 'pendientes' ? 'pendiente' : 'contactado'}` : '';
    const res = await fetch(`/api/admin/contactos${params}`);
    const data = await res.json();
    setLeads(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, [filter]);

  const handleToggleContactado = async (lead) => {
    await fetch('/api/admin/contactos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: lead.id, contactado: !lead.contactado }),
    });
    fetchLeads();
  };

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar este contacto?')) {
      await fetch(`/api/admin/contactos?id=${id}`, { method: 'DELETE' });
      fetchLeads();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('es-GT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div>
      <h2>Gestión de Contactos</h2>

      <div className="filter-bar">
        <label>Filtrar:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="todos">Todos</option>
          <option value="pendientes">Pendientes</option>
          <option value="contactados">Contactados</option>
        </select>
        <span className="lead-count">{leads.length} contacto(s)</span>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Servicio</th>
            <th>Mensaje</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className={lead.contactado ? 'contactado' : 'pendiente'}>
              <td>{formatDate(lead.created_at)}</td>
              <td>{lead.nombre}</td>
              <td>
                <a
                  href={`https://wa.me/502${lead.telefono}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-link"
                >
                  {lead.telefono}
                </a>
              </td>
              <td>{lead.servicio}</td>
              <td className="mensaje-cell">{lead.mensaje}</td>
              <td>{lead.contactado ? '✅ Contactado' : '⏳ Pendiente'}</td>
              <td>
                <div className="admin-actions">
                  <button
                    className={lead.contactado ? 'btn-pending' : 'btn-done'}
                    onClick={() => handleToggleContactado(lead)}
                  >
                    {lead.contactado ? 'Marcar Pendiente' : 'Marcar Contactado'}
                  </button>
                  <a
                    href={`https://wa.me/502${lead.telefono}?text=Hola ${lead.nombre}, soy de DigitalCare. Recibimos tu solicitud sobre ${lead.servicio}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp"
                  >
                    💬 WhatsApp
                  </a>
                  <button className="btn-delete" onClick={() => handleDelete(lead.id)}>
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {leads.length === 0 && (
        <div className="empty-state">
          <p>No hay contactos {filter !== 'todos' ? filter : ''}</p>
        </div>
      )}

      <style jsx>{`
        .filter-bar {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
          padding: 15px;
          background: #1a1a3a;
          border-radius: 8px;
        }
        .filter-bar label {
          color: #aaa;
        }
        .filter-bar select {
          padding: 8px 12px;
          background: #0f0f2a;
          border: 1px solid #0ff;
          color: white;
          border-radius: 4px;
        }
        .lead-count {
          margin-left: auto;
          color: #0ff;
        }
        .whatsapp-link {
          color: #25D366;
          text-decoration: none;
        }
        .whatsapp-link:hover {
          text-decoration: underline;
        }
        .mensaje-cell {
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .pendiente {
          background: rgba(255, 193, 7, 0.1);
        }
        .contactado {
          background: rgba(76, 175, 80, 0.1);
        }
        .btn-done {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
        }
        .btn-pending {
          background: #FF9800;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
        }
        .btn-whatsapp {
          background: #25D366;
          color: white;
          text-decoration: none;
          padding: 5px 10px;
          border-radius: 4px;
        }
        .empty-state {
          text-align: center;
          padding: 40px;
          color: #888;
        }
      `}</style>
    </div>
  );
}
