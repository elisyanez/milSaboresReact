import React, { useEffect, useMemo, useState } from 'react';
import { useUser } from '../context/UserContext';
import { getPedidos, updateEstadoPedido } from '../services/pedidoService';
import { Navigate } from 'react-router-dom';

const ESTADOS = ['pendiente','preparando','enviado','entregado','cancelado'];

export default function AdminPedidos(){
  const { currentUser } = useUser();
  const [estado, setEstado] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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
  }, []);

  const list = useMemo(()=> {
    let arr = pedidos;
    if (estado) arr = arr.filter(o => o.estado === estado);
    if (desde) arr = arr.filter(o => (o.fecha||'') >= new Date(desde).toISOString());
    if (hasta) arr = arr.filter(o => (o.fecha||'') <= new Date(hasta+'T23:59:59').toISOString());
    return arr;
  }, [estado, desde, hasta, pedidos]);

  if (!currentUser || !['admin','vendedor'].includes(currentUser.role)) return <Navigate to="/login" replace />;

  const changeEstado = async (id, e) => {
    const nuevo = e.target.value;
    try {
      await updateEstadoPedido(id, nuevo);
      setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado: nuevo } : p));
    } catch (err) {
      alert(err?.response?.data?.message || err.message || 'No se pudo actualizar el estado');
    }
  };

  return (
    <main className="page-container">
      <h2 className="page-title">Pedidos (Admin/Vendedor)</h2>
      {error && <div className="form-error" style={{ marginBottom: 12 }}>{error}</div>}
      {loading && <p>Cargando pedidos...</p>}
      <div className="form-card">
        <div className="form-grid">
          <label>Estado
            <select value={estado} onChange={(e)=> setEstado(e.target.value)}>
              <option value="">Todos</option>
              {ESTADOS.map(s=> <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label>Desde
            <input type="date" value={desde} onChange={(e)=> setDesde(e.target.value)} />
          </label>
          <label>Hasta
            <input type="date" value={hasta} onChange={(e)=> setHasta(e.target.value)} />
          </label>
        </div>
      </div>

      <div className="form-card" style={{overflowX:'auto', marginTop: 12}}>
        <table className="user-table">
          <thead><tr><th>#</th><th>Fecha</th><th>Cliente</th><th>Direcci?n</th><th>Total</th><th>Estado</th></tr></thead>
          <tbody>
            {list.map(o => (
              <tr key={o.id}>
                <td>{o.numero}</td>
                <td>{new Date(o.fecha).toLocaleString()}</td>
                <td>{o.usuarioNombre} ({o.usuarioRun})</td>
                <td>{o.direccion}</td>
                <td>{new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP'}).format(o.total)}</td>
                <td>
                  <select className="btn-xs" value={o.estado} onChange={(e)=> changeEstado(o.id, e)}>
                    {ESTADOS.map(s=> <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
