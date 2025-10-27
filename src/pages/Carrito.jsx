import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { parseCLP } from '../utils/money.logic';

export default function Carrito() {
  const { groupedItems, updateQuantity, removeQuantity, total, clear } = useCart();

  const fmt = useMemo(() => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }), []);

  return (
    <main className="page-container">
      <h2 className="page-title">Carrito</h2>
      {groupedItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-emoji" aria-hidden>🧁🍰🥐</div>
          <h3 className="empty-title">Tu caja de dulces está vacía</h3>
          <p className="empty-text">Agrega tortas, postres y panes para endulzar tu día.</p>
          <Link to="/catalogo" className="btn btn-primary empty-cta">Ir al catálogo</Link>
        </div>
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
              <button
                className="btn btn-outline-danger"
                onClick={() => { if (window.confirm('¿Vaciar todo el carrito?')) clear(); }}
              >
                Vaciar carrito
              </button>
              <Link to="/catalogo" className="btn btn-primary">Seguir comprando</Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
