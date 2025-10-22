import React, { useMemo } from 'react';
import { useCart } from '../context/CartContext';

export default function Carrito() {
  const { groupedItems, updateQuantity, removeQuantity, total, clear } = useCart();

  const fmt = useMemo(() => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }), []);
  const parseCLP = (str) => Number.parseInt(String(str).replace(/[^0-9]/g, '') || '0', 10);

  return (
    <main className="page-container">
      <h2 className="page-title">Carrito</h2>
      {groupedItems.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <div className="cart-list">
          {groupedItems.map((it) => (
            <div className="cart-item" key={it.codigo}>
              <div className="cart-col-name">
                <div className="cart-item-name">{it.nombre}</div>
                <div className="cart-item-price">{it.precio}</div>
              </div>
              <div className="cart-col-actions">
                <div className="cart-item-meta">
                  <span className="meta-chip cart-item-qty">Cantidad 🧁: {it.cantidad}</span>
                  <span className="meta-chip cart-item-sub">Subtotal 🍰: {fmt.format(parseCLP(it.precio) * it.cantidad)}</span>
                </div>
                <div className="cart-item-actions">
                  <button className="btn btn-outline-secondary" onClick={() => updateQuantity(it.codigo, it.cantidad + 1)}>+1</button>
                  <button className="btn btn-outline-secondary" disabled={it.cantidad <= 1} onClick={() => removeQuantity(it.codigo, 1)}>-1</button>
                  <button className="btn btn-outline-danger" onClick={() => { if (window.confirm('¿Eliminar este producto del carrito?')) updateQuantity(it.codigo, 0); }}>Eliminar</button>
                </div>
              </div>
              <div className="cart-col-image">
                <div className="cart-img-wrap">
                  <img src={it.img} alt={it.nombre} className="cart-item-img" />
                </div>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <div className="cart-total-line"><strong>Total:</strong> {fmt.format(total)}</div>
            <div className="cart-actions">
              <button className="btn btn-outline-danger" onClick={clear}>Vaciar carrito</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
