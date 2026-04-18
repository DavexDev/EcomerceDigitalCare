'use client';
import { useState, useTransition } from 'react';
import { updatePedidoEstado } from './actions';
import { ChevronDown, Loader2, Package } from 'lucide-react';

const ESTADOS = ['pendiente', 'verificado', 'enviado', 'completado', 'cancelado'];
const STATUS_META = {
  pendiente:  { label: 'Pendiente',  cls: 'badge-warning' },
  verificado: { label: 'Verificado', cls: 'badge-info' },
  enviado:    { label: 'Enviado',    cls: 'badge-info' },
  completado: { label: 'Completado', cls: 'badge-success' },
  cancelado:  { label: 'Cancelado',  cls: 'badge-error' },
};

function fmtQ(n) {
  return `Q ${Number(n ?? 0).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`;
}

export default function PedidosTable({ pedidos }) {
  const [estados, setEstados] = useState(
    Object.fromEntries(pedidos.map((p) => [p.id, p.estado]))
  );
  const [isPending, startTransition] = useTransition();
  const [activeId, setActiveId] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const handleChange = (id, nuevoEstado) => {
    setActiveId(id);
    startTransition(async () => {
      const result = await updatePedidoEstado(id, nuevoEstado);
      if (!result.error) {
        setEstados((prev) => ({ ...prev, [id]: nuevoEstado }));
      }
      setActiveId(null);
    });
  };

  if (pedidos.length === 0) {
    return (
      <div className="dash-card">
        <p className="dash-empty">No hay pedidos aún.</p>
      </div>
    );
  }

  return (
    <div className="dash-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="dash-table-wrap">
        <table className="dash-table pedidos-full-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Email</th>
              <th>Ref. transferencia</th>
              <th>Total</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => {
              const estado = estados[p.id] ?? p.estado;
              const { cls } = STATUS_META[estado] ?? {};
              let items = [];
              try { items = JSON.parse(p.items || '[]'); } catch {}
              const isExpanded = expanded === p.id;

              return (
                <>
                  <tr key={p.id} className={isExpanded ? 'row-expanded' : ''}>
                    <td className="td-time">
                      {new Date(p.created_at).toLocaleDateString('es-GT')}
                    </td>
                    <td className="td-name">{p.nombre}</td>
                    <td className="td-email">{p.email}</td>
                    <td className="td-ref">
                      {p.referencia_transferencia
                        ? <code className="ref-code">{p.referencia_transferencia}</code>
                        : <span style={{ color: '#a0aec0' }}>—</span>
                      }
                    </td>
                    <td className="td-amount">{fmtQ(p.total)}</td>
                    <td>
                      <div className="status-select-wrap">
                        {isPending && activeId === p.id
                          ? <Loader2 size={14} className="spin" />
                          : <span className={`badge ${cls}`}>{STATUS_META[estado]?.label ?? estado}</span>
                        }
                        <div className="select-shell">
                          <select
                            className="status-select"
                            value={estado}
                            onChange={(e) => handleChange(p.id, e.target.value)}
                            disabled={isPending && activeId === p.id}
                          >
                            {ESTADOS.map((e) => (
                              <option key={e} value={e}>{STATUS_META[e]?.label ?? e}</option>
                            ))}
                          </select>
                          <ChevronDown size={11} className="select-arrow" />
                        </div>
                      </div>
                    </td>
                    <td>
                      <button
                        className="expand-btn"
                        onClick={() => setExpanded(isExpanded ? null : p.id)}
                        title="Ver productos"
                      >
                        <Package size={14} />
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${p.id}-items`} className="items-row">
                      <td colSpan={7}>
                        <div className="items-expand-panel">
                          <strong>Productos:</strong>
                          <div className="items-expand-list">
                            {items.length === 0
                              ? <span style={{ color: '#a0aec0' }}>Sin items</span>
                              : items.map((it, idx) => (
                                <div key={idx} className="items-expand-item">
                                  <span className="item-chip">
                                    {it.name ?? it.nombre ?? 'Producto'}
                                    {' '}×{it.qty ?? it.cantidad ?? 1}
                                  </span>
                                  {it.price != null && (
                                    <span className="item-price">{fmtQ(it.price)}</span>
                                  )}
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
