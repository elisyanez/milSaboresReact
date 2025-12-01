import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { getPedidos } from '../services/pedidoService';
import { Link, Navigate } from 'react-router-dom';

export default function MisPedidos(){
  const { currentUser } = useUser();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) return;
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getPedidos();
        setPedidos(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Error cargando pedidos');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentUser]);

  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== 'admin') return <Navigate to="/" replace />;

  return (
    <main className="page-container">
      <h2 className="page-title">Todos los pedidos</h2>
      {error && <div className="form-error" style={{ marginBottom: 12 }}>{error}</div>}
      {loading && <p>Cargando pedidos...</p>}
      {pedidos.length === 0 && !loading ? (
        <div className="empty-cart">
          <div className="empty-emoji">??</div>
          <div className="empty-title">No hay pedidos registrados</div>
          <Link to="/catalogo" className="btn btn-primary">Ir al cat?logo</Link>
        </div>
      ) : (
        <div className="form-card" style={{overflowX:'auto'}}>
          <table className="user-table">
            <thead><tr><th>#</th><th>Fecha</th><th>Cliente</th><th>Estado</th><th>Direcci?n</th><th>Total</th><th>Acciones</th></tr></thead>
            <tbody>
              {pedidos.map(o => (
                <tr key={o.id}>
                  <td>{o.numero}</td>
                  <td>{new Date(o.fecha).toLocaleString()}</td>
                  <td>{o.usuarioNombre} ({o.usuarioRun})</td>
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
