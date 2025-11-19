import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { OrdersService } from '../services/OrdersService';

export default function ComprobantePago(){
  const { id } = useParams();
  const order = OrdersService.getById(id);
  const fmt = useMemo(()=> new Intl.NumberFormat('es-CL', { style:'currency', currency:'CLP'}), []);
  if (!order) return <Navigate to="/" replace />;
  return (
    <main className="page-container">
      <h2 className="page-title">Boleta #{order.numero}</h2>
      <div className="form-card">
        <div>Fecha: <strong>{new Date(order.fecha).toLocaleString()}</strong></div>
        <div>Cliente: <strong>{order.usuarioNombre}</strong> (RUN: {order.usuarioRun})</div>
        <div>Dirección: <strong>{order.direccion || '—'}</strong></div>
        <table className="user-table" style={{marginTop:10}}>
          <thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th></tr></thead>
          <tbody>
            {(order.productos||[]).map((p,i)=> (
              <tr key={i}><td>{p.nombre}</td><td>{p.cantidad}</td><td>{p.precio}</td><td>{fmt.format(p.subtotal||0)}</td></tr>
            ))}
          </tbody>
        </table>
        <div className="cart-total" style={{marginTop:12}}>
          <div className="cart-total-line"><strong>Total:</strong> {fmt.format(order.total)}</div>
          <div className="cart-actions">
            <Link to="/catalogo" className="btn btn-primary">Seguir comprando</Link>
            <Link to="/mis-pedidos" className="btn btn-secondary">Ver mis pedidos</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

