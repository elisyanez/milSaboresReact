import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getPedidoById } from '../services/pedidoService';

export default function ComprobantePago(){
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fmt = useMemo(()=> new Intl.NumberFormat('es-CL', { style:'currency', currency:'CLP'}), []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getPedidoById(id);
        setPedido(data || null);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'No se pudo cargar el pedido');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (!id) return <Navigate to="/" replace />;
  if (loading) return <main className="page-container"><p>Cargando pedido...</p></main>;
  if (error || !pedido) return <Navigate to="/" replace />;

  return (
    <main className="page-container">
      <h2 className="page-title">Boleta #{pedido.numero}</h2>
      <div className="form-card">
        <div>Fecha: <strong>{new Date(pedido.fecha).toLocaleString()}</strong></div>
        <div>Cliente: <strong>{pedido.usuarioNombre}</strong> (RUN: {pedido.usuarioRun})</div>
        <div>Direcci?n: <strong>{pedido.direccion || 'N/D'}</strong></div>
        <table className="user-table" style={{marginTop:10}}>
          <thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th></tr></thead>
          <tbody>
            {(pedido.productos||[]).map((p,i)=> (
              <tr key={i}><td>{p.nombre}</td><td>{p.cantidad}</td><td>{fmt.format(p.precio||0)}</td><td>{fmt.format(p.subtotal||0)}</td></tr>
            ))}
          </tbody>
        </table>
        <div className="cart-total" style={{marginTop:12}}>
          <div className="cart-total-line"><strong>Total:</strong> {fmt.format(pedido.total)}</div>
          <div className="cart-actions">
            <Link to="/catalogo" className="btn btn-primary">Seguir comprando</Link>
            <Link to="/mis-pedidos" className="btn btn-secondary">Ver mis pedidos</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
