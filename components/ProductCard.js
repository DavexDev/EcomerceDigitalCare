'use client';

export default function ProductCard({ nombre, descripcion, precio, tipo, onConsultar }) {
  return (
    <div className="accesorio-card licencia-card">
      <h3>{nombre}</h3>
      {descripcion && <p>{descripcion}</p>}
      {tipo && <p className="tipo-badge">{tipo}</p>}
      <span className="precio">Q{Number(precio).toFixed(0)}</span>
      <button
        className="btn-consultar nav-btn"
        onClick={() =>
          document.dispatchEvent(
            new CustomEvent('open-whatsapp', { detail: { producto: nombre } })
          )
        }
      >
        Consultar
      </button>
    </div>
  );
}
