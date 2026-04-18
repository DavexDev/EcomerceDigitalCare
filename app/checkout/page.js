'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { useClientAuth } from '@/hooks/useClientAuth';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Link from 'next/link';
import { Building2, Copy, CheckCircle2, ShoppingBag, ArrowLeft, MessageCircle } from 'lucide-react';

const BANCO = {
  banco: 'Banrural',
  nombre: 'DigitalCare GT',
  cuenta: '3-123-00456789-0',
  tipo: 'Monetaria',
};

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { client } = useClientAuth();
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [email, setEmail]   = useState('');
  const [referencia, setReferencia] = useState('');
  const [enviando, setEnviando]     = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [copiado, setCopiado]       = useState(false);
  const [error, setError]           = useState('');

  // Pre-llenar con datos del cliente si está logueado
  useEffect(() => {
    if (client) {
      setNombre(client.user_metadata?.nombre || '');
      setEmail(client.email || '');
    }
  }, [client]);

  // Redirigir si el carrito está vacío (y no venimos de una confirmación)
  useEffect(() => {
    if (!confirmado && items.length === 0) {
      router.replace('/accesorios');
    }
  }, [items, confirmado, router]);

  const copiarCuenta = () => {
    navigator.clipboard.writeText(BANCO.cuenta);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !email || !referencia) {
      setError('Por favor completa todos los campos.');
      return;
    }
    if (items.length === 0) {
      setError('Tu carrito está vacío.');
      return;
    }
    setError('');
    setEnviando(true);

    try {
      await supabase.from('pedidos').insert({
        nombre,
        email,
        items: JSON.stringify(items),
        total,
        metodo_pago: 'Transferencia bancaria',
        referencia_transferencia: referencia,
        estado: 'pendiente',
        user_id: client?.id || null,
      });

      clearCart();
      setConfirmado(true);
    } catch (err) {
      setError('Hubo un error al registrar tu pedido. Intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  if (confirmado) {
    return (
      <>
        <Header />
        <main className="checkout-page">
          <div className="checkout-success">
            <CheckCircle2 size={64} color="#64ccc5" />
            <h2>¡Pedido registrado!</h2>
            <p>Verificaremos tu transferencia en un máximo de <strong>24 horas</strong>. Recibirás confirmación al correo <strong>{email}</strong>.</p>
            <Link href="/" className="btn-primary">Volver al inicio</Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-left">
            <h1>Finalizar pedido</h1>
            <p className="checkout-subtitle">Solo aceptamos pago por <strong>transferencia bancaria</strong>. Si prefieres pagar en efectivo por un servicio, contáctanos por WhatsApp.</p>

            {/* Datos bancarios */}
            <div className="bank-card">
              <div className="bank-card-header">
                <Building2 size={20} />
                <span>Datos para transferencia</span>
              </div>
              <div className="bank-details">
                <div className="bank-row"><span>Banco</span><strong>{BANCO.banco}</strong></div>
                <div className="bank-row"><span>Nombre</span><strong>{BANCO.nombre}</strong></div>
                <div className="bank-row"><span>Tipo</span><strong>{BANCO.tipo}</strong></div>
                <div className="bank-row cuenta-row">
                  <span>No. Cuenta</span>
                  <strong>{BANCO.cuenta}</strong>
                  <button className="copy-btn" onClick={copiarCuenta} title="Copiar número">
                    {copiado ? <CheckCircle2 size={16} color="#64ccc5" /> : <Copy size={16} />}
                  </button>
                </div>
                <div className="bank-row monto-row">
                  <span>Monto a transferir</span>
                  <strong className="monto-total">Q{total.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <form className="checkout-form" onSubmit={handleSubmit}>
              <h3>Confirmar pedido</h3>
              <div className="form-group">
                <label>Nombre completo</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" required />
              </div>
              <div className="form-group">
                <label>Correo electrónico</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" required />
              </div>
              <div className="form-group">
                <label>Número de referencia / autorización de transferencia</label>
                <input type="text" value={referencia} onChange={(e) => setReferencia(e.target.value)} placeholder="Ej: 1234567890" required />
              </div>
              {error && <p className="form-error">{error}</p>}
              <button type="submit" className="btn-primary full-width" disabled={enviando}>
                {enviando ? 'Registrando...' : 'Confirmar pedido'}
              </button>
            </form>
          </div>

          {/* Resumen */}
          <div className="checkout-right">
            <div className="order-summary">
              <h3>Resumen del pedido</h3>
              <ul className="order-items">
                {items.map((item) => (
                  <li key={item.id} className="order-item">
                    <span className="order-item-name">{item.name} <em>×{item.qty}</em></span>
                    <span>Q{(item.price * item.qty).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="order-total">
                <span>Total</span>
                <strong>Q{total.toFixed(2)}</strong>
              </div>
              <p className="order-note">⚡ Para servicios de mantenimiento o soporte técnico con pago en efectivo, <button className="link-btn" onClick={() => window.dispatchEvent(new CustomEvent('open-whatsapp', { detail: { producto: 'Servicio técnico' } }))}>contáctanos por WhatsApp</button>.</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
