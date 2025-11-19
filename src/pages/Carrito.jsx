import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { parseCLP } from '../utils/money.logic';
import { useUser } from '../context/UserContext';

export default function Carrito() {
  const { groupedItems, updateQuantity, removeQuantity, total, clear } = useCart();
  const {currentUser} = useUser();
  const navigate = useNavigate();

  const fmt = useMemo(() => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }), []);

  if (groupedItems.length === 0) {
    return (
      <main className="page-container">
        <div className="empty-cart">
          <div className="empty-emoji" aria-hidden>🧁</div>
          <h3 className="empty-title">Tu caja de dulces está vacía</h3>
          <p className="empty-text">Agrega tortas, postres y panes para endulzar tu día.</p>
          <Link to="/catalogo" className="btn btn-primary empty-cta">Ir al catálogo</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <h2 className="page-title">Carrito</h2>
      <div className="cart-list">
        {groupedItems.map((it) => (
          <div className="cart-item" key={it.groupKey || it.codigo}>
            <div className="cart-col-name">
              <div className="cart-item-name">{it.nombre}</div>
              <div className="cart-item-price">{it.precio}</div>
            </div>
            <div className="cart-col-actions">
              <div className="cart-item-meta">
                <span className="meta-chip cart-item-qty">Cantidad 🍰: {it.cantidad}</span>
                {it.personalizacion?.mensaje && (
                  <span className="meta-chip">Mensaje: {it.personalizacion.mensaje}</span>
                )}
                <span className="meta-chip cart-item-sub">Subtotal 🧁: {fmt.format(parseCLP(it.precio) * it.cantidad)}</span>
              </div>
              <div className="cart-item-actions">
                {it.personalizacion?.mensaje ? (
                  <button className="btn btn-outline-danger" onClick={() => { if (window.confirm('¿Eliminar este producto del carrito?')) updateQuantity(it.groupKey || it.codigo, 0); }}>Eliminar</button>
                ) : (
                  <>
                    <button className="btn btn-outline-secondary" onClick={() => updateQuantity(it.groupKey || it.codigo, it.cantidad + 1)}>+1</button>
                    <button className="btn btn-outline-secondary" disabled={it.cantidad <= 1} onClick={() => removeQuantity(it.groupKey || it.codigo, 1)}>-1</button>
                    <button className="btn btn-outline-danger" onClick={() => { if (window.confirm('¿Eliminar este producto del carrito?')) updateQuantity(it.groupKey || it.codigo, 0); }}>Eliminar</button>
                  </>
                )}
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
              Vaciar carrito</button>
            <button className="btn btn-primary" onClick={() => {
              if (!currentUser) {
                navigate('/login?redirect=/carrito');
                return;
              }
              navigate('/confirmacion');
            }}>Confirmar compra</button>
            <Link to="/catalogo" className="btn btn-secondary">Seguir comprando</Link>
          </div>
        </div>
      </div>
    </main>
  );
}



