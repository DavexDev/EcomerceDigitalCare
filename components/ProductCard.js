'use client';
import AddToCartBtn from '@/components/AddToCartBtn';
import { MessageCircle } from 'lucide-react';

export default function ProductCard({ id, nombre, descripcion, precio, categoria }) {
  const handleConsultar = () => {
    window.dispatchEvent(new CustomEvent('open-whatsapp', { detail: { producto: nombre } }));
  };

  return (
    <div className="product-card">
      <div className="product-card-body">
        <h3>{nombre}</h3>
        <p>{descripcion}</p>
      </div>
      <div className="product-card-footer">
        <div className="product-price-badge">
          <span className="price-label">Desde</span>
          <span className="price-value">Q{precio}</span>
        </div>
        <div className="product-card-actions">
          <AddToCartBtn item={{ id: id || nombre, name: nombre, price: precio }} />
          <button className="btn-consultar" onClick={handleConsultar}>
            <MessageCircle size={15} />
            Consultar
          </button>
        </div>
      </div>
    </div>
  );
}

