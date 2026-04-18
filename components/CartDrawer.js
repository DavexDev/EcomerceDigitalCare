'use client';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart, X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
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
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-header-left">
            <ShoppingBag size={18} />
            <h3>Carrito{count > 0 && <span className="cart-header-count">{count}</span>}</h3>
          </div>
          <button className="cart-drawer-close" onClick={() => setOpen(false)} aria-label="Cerrar carrito">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <ShoppingCart size={40} strokeWidth={1.2} />
              <p>Tu carrito está vacío</p>
              <button className="cart-empty-link" onClick={() => setOpen(false)}>
                Ver productos →
              </button>
            </div>
          ) : (
            <ul className="cart-items-list">
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.name}</span>
                    <span className="cart-item-price">Q{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                  <div className="cart-item-controls">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      disabled={item.qty <= 1}
                      aria-label="Reducir cantidad"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="cart-qty">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      aria-label="Aumentar cantidad"
                    >
                      <Plus size={13} />
                    </button>
                    <span className="cart-unit-price">× Q{item.price}</span>
                    <button
                      className="cart-remove"
                      onClick={() => removeItem(item.id)}
                      aria-label="Eliminar producto"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-total-row">
              <span className="cart-total-label">Total a pagar</span>
              <strong className="cart-total-value">Q{total.toFixed(2)}</strong>
            </div>
            <button className="cart-checkout-btn" onClick={goCheckout}>
              Finalizar pedido <ArrowRight size={16} />
            </button>
            <p className="cart-footer-note">Pago por transferencia bancaria · Banrural</p>
          </div>
        )}
      </div>
    </>
  );
}


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
