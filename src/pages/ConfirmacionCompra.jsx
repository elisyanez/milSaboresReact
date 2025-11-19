import React, { useMemo } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { OrdersService } from '../services/OrdersService';
import { parseCLP } from '../utils/money.logic';

export default function ConfirmacionCompra(){
  const { groupedItems, total, clear } = useCart();
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const fmt = useMemo(()=> new Intl.NumberFormat('es-CL', { style:'currency', currency:'CLP'}), []);

  if (!currentUser) return <Navigate to="/login" replace />;
  if (groupedItems.length === 0) return <Navigate to="/carrito" replace />;

  const direccionCompleta = `${currentUser.direccion || ''}, ${currentUser.comuna || ''}, ${currentUser.region || ''}`.replace(/^,\s*/,'').replace(/\s+,\s+$/,'');

  const confirmar = () => {
    if (!window.confirm('¿Confirmar y generar boleta?')) return;
    const productos = groupedItems.map(it => ({ codigo: it.codigo, nombre: it.nombre, cantidad: it.cantidad, precio: it.precio, subtotal: parseCLP(it.precio) * it.cantidad }));
    const order = OrdersService.create({
      usuarioRun: currentUser.run,
      usuarioNombre: currentUser.nombre,
      direccion: direccionCompleta,
      productos,
      total,
    });
    clear();
    navigate(`/comprobante/${order.id}`);
  };

  return (
    <main className="page-container">
      <h2 className="page-title">Confirmación de Compra</h2>
      <div className="form-card">
        <h3 style={{marginTop:0}}>Resumen</h3>
        <div style={{marginBottom:8}}>Cliente: <strong>{currentUser.nombre}</strong> (RUN: {currentUser.run})</div>
        <div style={{marginBottom:8}}>Dirección de despacho: <strong>{direccionCompleta || '—'}</strong></div>
        <table className="user-table" style={{marginTop:10}}>
          <thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th></tr></thead>
          <tbody>
            {groupedItems.map(it => (
              <tr key={it.codigo}><td>{it.nombre}</td><td>{it.cantidad}</td><td>{it.precio}</td><td>{fmt.format(parseCLP(it.precio)*it.cantidad)}</td></tr>
            ))}
          </tbody>
        </table>
        <div className="cart-total" style={{marginTop:12}}>
          <div className="cart-total-line"><strong>Total:</strong> {fmt.format(total)}</div>
          <div className="cart-actions">
            <button className="btn btn-secondary" onClick={()=> navigate('/carrito')}>Volver al carrito</button>
            <button className="btn btn-primary" onClick={confirmar}>Confirmar compra</button>
          </div>
        </div>
      </div>
    </main>
  );
}

