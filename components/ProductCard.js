'use client';
import AddToCartBtn from '@/components/AddToCartBtn';

export default function ProductCard({ id, nombre, descripcion, precio, onConsultar }) {
  const handleConsultar = () => {
    window.dispatchEvent(new CustomEvent('open-whatsapp', { detail: { producto: nombre } }));
    onConsultar?.();
  };

  return (
    <div className="product-card">
      <h3>{nombre}</h3>
      <p>{descripcion}</p>
      <span className="precio">Desde Q{precio}</span>
      <div className="product-card-actions">
        <AddToCartBtn item={{ id: id || nombre, name: nombre, price: precio }} />
        <button className="btn-consultar" onClick={handleConsultar}>
          Consultar
        </button>
      </div>
    </div>
  );
}
