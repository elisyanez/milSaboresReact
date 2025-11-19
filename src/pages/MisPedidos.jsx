import React from 'react';
import { useUser } from '../context/UserContext';
import { OrdersService } from '../services/OrdersService';
import { Link, Navigate } from 'react-router-dom';

export default function MisPedidos(){
  const { currentUser } = useUser();
  if (!currentUser) return <Navigate to="/login" replace />;
  const list = OrdersService.listMine(currentUser.run);
  return (
    <main className="page-container">
      <h2 className="page-title">Mis Pedidos</h2>
      {list.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-emoji">🧁</div>
          <div className="empty-title">Aún no tienes pedidos</div>
          <Link to="/catalogo" className="btn btn-primary">Ir al catálogo</Link>
        </div>
      ) : (
        <div className="form-card" style={{overflowX:'auto'}}>
          <table className="user-table">
            <thead><tr><th>#</th><th>Fecha</th><th>Estado</th><th>Dirección</th><th>Total</th><th>Acciones</th></tr></thead>
            <tbody>
              {list.map(o => (
                <tr key={o.id}>
                  <td>{o.numero}</td>
                  <td>{new Date(o.fecha).toLocaleString()}</td>
                  <td><span className="meta-chip">{o.estado}</span></td>
                  <td>{o.direccion}</td>
                  <td>{new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP'}).format(o.total)}</td>
                  <td><Link className="btn btn-secondary btn-xs" to={`/comprobante/${o.id}`}>Ver</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

