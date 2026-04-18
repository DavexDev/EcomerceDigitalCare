'use client';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart, X, Trash2, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CartDrawer() {
  const { items, removeItem, updateQty, count, total } = useCart();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const goCheckout = () => {
    setOpen(false);
    router.push('/checkout');
  };

  return (
    <>
      {/* Cart button */}
      <button
        className="cart-btn"
        onClick={() => setOpen(true)}
        aria-label="Ver carrito"
      >
        <ShoppingCart size={20} />
        {count > 0 && <span className="cart-badge">{count}</span>}
      </button>

      {/* Overlay */}
      {open && (
        <div className="cart-overlay" onClick={() => setOpen(false)} />
      )}

      {/* Drawer */}
      <div className={`cart-drawer${open ? ' open' : ''}`}>
        <div className="cart-drawer-header">
          <h3>Carrito</h3>
          <button className="cart-drawer-close" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <p className="cart-empty">Tu carrito está vacío.</p>
          ) : (
            <ul className="cart-items-list">
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.name}</span>
                    <span className="cart-item-price">Q{item.price}</span>
                  </div>
                  <div className="cart-item-controls">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} disabled={item.qty <= 1}>
                      <Minus size={14} />
                    </button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}>
                      <Plus size={14} />
                    </button>
                    <button className="cart-remove" onClick={() => removeItem(item.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-total">
              <span>Total</span>
              <strong>Q{total.toFixed(2)}</strong>
            </div>
            <button className="btn-primary full-width" onClick={goCheckout}>
              Proceder al pago
            </button>
          </div>
        )}
      </div>
    </>
  );
}
