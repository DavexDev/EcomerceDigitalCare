'use client';

export default function ProductCard({ nombre, descripcion, precio, onConsultar }) {
  const handleConsultar = () => {
    window.dispatchEvent(new CustomEvent('open-whatsapp', { detail: { producto: nombre } }));
    onConsultar?.();
  };

  return (
    <div className="product-card">
      <h3>{nombre}</h3>
      <p>{descripcion}</p>
      <span className="precio">Q{precio}</span>
      <button className="btn-consultar" onClick={handleConsultar}>
        Consultar
      </button>
    </div>
  );
}
