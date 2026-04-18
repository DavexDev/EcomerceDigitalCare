'use client';
import { useState, useEffect } from 'react';

export default function AdminAccesoriosPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', stock: '' });

  const fetchItems = async () => {
    const res = await fetch('/api/admin/accesorios');
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
      stock: parseInt(form.stock) || 0,
      activo: true,
    };

    if (editId) {
      await fetch('/api/admin/accesorios', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editId, ...payload }),
      });
    } else {
      await fetch('/api/admin/accesorios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    setForm({ nombre: '', descripcion: '', precio: '', stock: '' });
    setEditId(null);
    fetchItems();
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      nombre: item.nombre,
      descripcion: item.descripcion,
      precio: item.precio.toString(),
      stock: item.stock?.toString() || '0',
    });
  };

  const handleToggle = async (item) => {
    await fetch('/api/admin/accesorios', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, activo: !item.activo }),
    });
    fetchItems();
  };

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar este accesorio?')) {
      await fetch(`/api/admin/accesorios?id=${id}`, { method: 'DELETE' });
      fetchItems();
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div>
      <h2>Gestión de Accesorios</h2>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editId ? 'Editar Accesorio' : 'Nuevo Accesorio'}</h3>
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
            <label>Precio (Q)</label>
            <input
              type="number"
              value={form.precio}
              onChange={(e) => setForm({ ...form, precio: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
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
              setForm({ nombre: '', descripcion: '', precio: '', stock: '' });
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
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.nombre}</td>
              <td>{item.descripcion}</td>
              <td>Q{item.precio}</td>
              <td>{item.stock || 0}</td>
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
