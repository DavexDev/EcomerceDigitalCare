'use client';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';

export default function AddToCartBtn({ item }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handle = () => {
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button className={`add-to-cart-btn${added ? ' added' : ''}`} onClick={handle}>
      {added ? <><Check size={16} /> Agregado</> : <><ShoppingCart size={16} /> Agregar</>}
    </button>
  );
}
