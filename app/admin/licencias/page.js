'use client';
import { useState, useEffect } from 'react';

export default function AdminLicenciasPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ 
    nombre: '', 
    descripcion: '', 
    precio: '', 
    duracion: '12', 
    tipo: 'antivirus' 
  });

  const fetchItems = async () => {
    const res = await fetch('/api/admin/licencias');
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: parseFloat(form.precio),
      duracion: parseInt(form.duracion),
      tipo: form.tipo,
      activo: true,
    };

    if (editId) {
      await fetch('/api/admin/licencias', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editId, ...payload }),
      });
    } else {
      await fetch('/api/admin/licencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    setForm({ nombre: '', descripcion: '', precio: '', duracion: '12', tipo: 'antivirus' });
    setEditId(null);
    fetchItems();
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      nombre: item.nombre,
      descripcion: item.descripcion,
      precio: item.precio.toString(),
      duracion: item.duracion?.toString() || '12',
      tipo: item.tipo || 'antivirus',
    });
  };

  const handleToggle = async (item) => {
    await fetch('/api/admin/licencias', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, activo: !item.activo }),
    });
    fetchItems();
  };

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar esta licencia?')) {
      await fetch(`/api/admin/licencias?id=${id}`, { method: 'DELETE' });
      fetchItems();
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div>
      <h2>Gestión de Licencias</h2>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editId ? 'Editar Licencia' : 'Nueva Licencia'}</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Tipo</label>
            <select
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            >
              <option value="antivirus">Antivirus</option>
              <option value="office">Office</option>
              <option value="windows">Windows</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div className="form-group">
            <label>Precio (Q)</label>
            <input
              type="number"
              value={form.precio}
              onChange={(e) => setForm({ ...form, precio: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Duración (meses)</label>
            <input
              type="number"
              value={form.duracion}
              onChange={(e) => setForm({ ...form, duracion: e.target.value })}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Descripción</label>
          <textarea
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            rows="2"
          />
        </div>
        <button type="submit" className="btn-primary">
          {editId ? 'Actualizar' : 'Crear'}
        </button>
        {editId && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setEditId(null);
              setForm({ nombre: '', descripcion: '', precio: '', duracion: '12', tipo: 'antivirus' });
            }}
            style={{ marginLeft: '10px' }}
          >
            Cancelar
          </button>
        )}
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Duración</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.nombre}</td>
              <td>{item.tipo}</td>
              <td>{item.descripcion}</td>
              <td>Q{item.precio}</td>
              <td>{item.duracion} meses</td>
              <td>{item.activo ? '✅' : '❌'}</td>
              <td>
                <div className="admin-actions">
                  <button className="btn-edit" onClick={() => handleEdit(item)}>Editar</button>
                  <button className="btn-toggle" onClick={() => handleToggle(item)}>
                    {item.activo ? 'Desactivar' : 'Activar'}
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(item.id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
