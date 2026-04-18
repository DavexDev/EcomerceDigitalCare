'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

const TIPOS = ['permanente', 'anual', 'mensual'];
const PLATAFORMAS = ['Windows', 'Office', 'Antivirus', 'Adobe', 'macOS', 'Linux', 'Otro'];

export default function AdminLicenciasPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', tipo: 'permanente', plataforma: 'Windows' });
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('licencias').select('*').order('plataforma');
    setItems(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const resetForm = () => {
    setForm({ nombre: '', descripcion: '', precio: '', tipo: 'permanente', plataforma: 'Windows' });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { nombre: form.nombre, descripcion: form.descripcion,
      precio: parseFloat(form.precio), tipo: form.tipo, plataforma: form.plataforma };
    if (editId) {
      await supabase.from('licencias').update(payload).eq('id', editId);
      setMsg('Licencia actualizada.');
    } else {
      await supabase.from('licencias').insert(payload);
      setMsg('Licencia creada.');
    }
    resetForm();
    fetchItems();
    setTimeout(() => setMsg(''), 3000);
  };

  const handleEdit = (item) => {
    setForm({ nombre: item.nombre, descripcion: item.descripcion ?? '',
      precio: item.precio, tipo: item.tipo, plataforma: item.plataforma ?? 'Windows' });
    setEditId(item.id);
  };

  const handleToggle = async (item) => {
    await supabase.from('licencias').update({ activo: !item.activo }).eq('id', item.id);
    fetchItems();
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta licencia?')) return;
    await supabase.from('licencias').delete().eq('id', id);
    fetchItems();
  };

  const selectStyle = { padding:'10px', border:'1px solid #ccc', borderRadius:'8px', fontFamily:'inherit', background:'#fff', width:'100%' };

  return (
    <div>
      <h1 style={{ color: '#176887', fontSize: '1.8rem', marginBottom: '24px' }}>Licencias</h1>

      {msg && <div style={{ padding:'12px', background:'#e6fffa', borderRadius:'8px', marginBottom:'16px', color:'#276749' }}>{msg}</div>}

      {/* FORMULARIO */}
      <div className="admin-card">
        <h2 style={{ marginBottom: '16px', color: '#176887' }}>{editId ? 'Editar Licencia' : 'Nueva Licencia'}</h2>
        <form onSubmit={handleSubmit} style={{ display:'grid', gap:'12px', maxWidth:'500px' }}>
          <input required placeholder="Nombre" value={form.nombre}
            onChange={e => setForm(p => ({...p, nombre: e.target.value}))}
            style={{ padding:'10px', border:'1px solid #ccc', borderRadius:'8px', fontFamily:'inherit' }} />
          <textarea placeholder="Descripción" value={form.descripcion}
            onChange={e => setForm(p => ({...p, descripcion: e.target.value}))}
            style={{ padding:'10px', border:'1px solid #ccc', borderRadius:'8px', fontFamily:'inherit', minHeight:'70px' }} />
          <input required type="number" min="0" step="0.01" placeholder="Precio (Q)"
            value={form.precio} onChange={e => setForm(p => ({...p, precio: e.target.value}))}
            style={{ padding:'10px', border:'1px solid #ccc', borderRadius:'8px', fontFamily:'inherit' }} />
          <select value={form.tipo} onChange={e => setForm(p => ({...p, tipo: e.target.value}))} style={selectStyle}>
            {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={form.plataforma} onChange={e => setForm(p => ({...p, plataforma: e.target.value}))} style={selectStyle}>
            {PLATAFORMAS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <div style={{ display:'flex', gap: