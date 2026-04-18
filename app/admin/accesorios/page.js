'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminAccesoriosPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', stock: '0' });
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('accesorios').select('*').order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const resetForm = () => { setForm({ nombre: '', descripcion: '', precio: '', stock: '0' }); setEditId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { nombre: form.nombre, descripcion: form.descripcion,
      precio: parseFloat(form.precio), stock: parseInt(form.stock, 10) };
    if (editId) {
      await supabase.from('accesorios').update(payload).eq('id', editId);
      setMsg('Accesorio actualizado.');
    } else {
      await supabase.from('accesorios').insert(payload);
      setMsg('Accesorio creado.');
    }
    resetForm();
    fetchItems();
    setTimeout(() => setMsg(''), 3000);
  };

  const handleEdit = (item) => {
    setForm({ nombre: item.nombre, descripcion: item.descripcion ?? '', precio: item.precio, stock: item.stock ?? 0 });
    setEditId(item.id);
  };

  const handleToggle = async (item) => {
    await supabase.from('accesorios').update({ activo: !item.activo }).eq('id', item.id);
    fetchItems();
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este accesorio?')) return;
    await supabase.from('accesorios').delete().eq('id', id);
    fetchItems();
  };

  return (
    <div>
      <h1 style={{ color: '#176887', fontSize: '1.8rem', marginBottom: '24px' }}>Accesorios</h1>

      {msg && <div style={{ padding:'12px', background:'#e6fffa', borderRadius:'8px', marginBottom:'16px', color:'#276749' }}>{msg}</div>}

      {/* FORMULARIO */}
      <div className="admin-card">
        <h2 style={{ marginBottom: '16px', color: '#176887' }}>{editId ? 'Editar Accesorio' : 'Nuevo Accesorio'}</h2>
        <form onSubmit={handleSubmit} style={{ display:'grid', gap:'12px', maxWidth:'500px' }}>
          <input required placeholder="Nombre" value={form.nombre}
            onChange={e => setForm(p => ({...p, nombre: e.target.value}))}
            style={{ padding:'10px', border:'1px solid #ccc', borderRadius:'8px', fontFamily:'inherit' }} />
          <textarea placeholder="Descripción" value={form.descripcion}
            onChange={e => setForm(p => ({...p, descripcion: e.target.value}))}
            style={{ padding:'10px', border:'1px solid #ccc', borderRadius:'8px', fontFamily:'inherit', minHeight:'80px' }} />
          <input required type="number" min="0" step="0.01" placeholder="Precio (Q)"
            value={form.precio} onChange={e => setForm(p => ({...p, precio: e.target.value}))}
            style={{ padding:'10px', border:'1px solid #ccc', borderRadius:'8px', fontFamily:'inherit' }} />
          <input type="number" min="0" placeholder="Stock"
            value={form.stock} onChange={e => setForm(p => ({...p, stock: e.target.value}))}
            style={{ padding:'10px', border:'1px solid #ccc', borderRadius:'8px', fontFamily:'inherit' }} />
          <div style={{ display:'flex', gap:'10px' }}>
            <button type="submit" className="btn-success">{editId ? 'Actualizar' : 'Crear'}</button>
            {editId && <button type="button" onClick={resetForm}
              style={{ padding:'10px 20px', border:'1px solid #ccc', borderRadius:'8px', cursor:'pointer', fontFamily:'inherit' }}>
              Cancelar</button>}
          </div>
        </form>
      </div>

      {/* TABLA */}
      <div className="admin-card">
        <h2 style={{ marginBottom: '16px', color: '#176887' }}>Lista de Accesorios</h2>
        {loading ? <p>Cargando...</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th><th>Descripción</th><th>Precio</th><th>Stock</th><th>Activo</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td>{item.nombre}</td>
                    <td style={{ maxWidth:'200px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.descripcion}</td>
                    <td>Q{item.precio}</td>
                    <td>{item.stock}</td>
                    <td>
                      <button onClick={() => handleToggle(item)}
                        style={{ background: item.activo ? '#38a169' : '#e53e3e', color:'#fff', border:'none',
                          padding:'4px 10px', borderRadius:'6px', cursor:'pointer', fontFamily:'inherit', fontSize:'0.8rem' }}>
                        {item.activo ? 'Sí' : 'No'}
                      </button>
                    </td>
                    <td style={{ display:'flex', gap:'8px' }}>
                      <button onClick={() => handleEdit(item)}
                        style={{ background:'#176887', color:'#fff', border:'none', padding:'6px 12px',
                          borderRadius:'6px', cursor:'pointer', fontFamily:'inherit' }}>Editar</button>
                      <button onClick={() => handleDelete(item.id)} className="btn-danger">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {items.length === 0 && <p style={{ textAlign:'center', padding:'20px', color:'#888' }}>Sin accesorios.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
