import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { productos as productosDB, descripciones as descripcionesDB, readProducts } from '../data/db';
import { sanitizeCantidad, buildDescripcion } from '../utils/catalogo.logic';
import { parseCLP, formatCLP } from '../utils/money.logic';

const descripciones = descripcionesDB;

// Fallback image (SVG) for missing product images
const PLACEHOLDER_IMG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="220"><rect width="100%25" height="100%25" fill="%23FFF5E1"/><text x="50%25" y="44%25" dominant-baseline="middle" text-anchor="middle" fill="%235D4037" font-size="16" font-family="Lato, Arial">Imagen no disponible</text><text x="50%25" y="60%25" dominant-baseline="middle" text-anchor="middle" fill="%23E58A2E" font-size="14" font-family="Lato, Arial">Dulce por venir</text></svg>';

const productos = (typeof window !== 'undefined' ? readProducts() : productosDB).filter(p => p.visible !== false);

export default function Catalogo() {
  const { addItem } = useCart();
  const [seleccionado, setSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [filtroTorta, setFiltroTorta] = useState('todas'); // 'todas' | 'cuadrada' | 'circular'
  const [mensaje, setMensaje] = useState('');

  const MAX_MSG = 60;
  const EXTRA_PERSONALIZACION = 3000; // CLP

  const lista = productos.filter((p) => {
    if (filtroTorta === 'todas') return true;
    if (filtroTorta === 'cuadrada') return p.categoria && /Cuadradas/i.test(p.categoria);
    if (filtroTorta === 'circular') return p.categoria && /Circulares/i.test(p.categoria);
    return true;
  });

  const abrir = (prod) => {
    setSeleccionado(prod);
    setCantidad(1);
    setMensaje('');
  };

  const cerrar = () => setSeleccionado(null);

  const agregar = () => {
    if (!seleccionado) return;
    const base = parseCLP(seleccionado.precio);
    const hasMsg = mensaje.trim().length > 0;
    const total = base + (hasMsg ? EXTRA_PERSONALIZACION : 0);
    const precioConExtra = formatCLP(total);
    const item = {
      codigo: seleccionado.codigo,
      nombre: seleccionado.nombre,
      precio: precioConExtra,
      img: seleccionado.img,
      cantidad: hasMsg ? 1 : cantidad,
    };
    if (hasMsg) {
      item.personalizacion = { mensaje: mensaje.trim(), extra: formatCLP(EXTRA_PERSONALIZACION) };
      item.groupKey = `${seleccionado.codigo}|msg:${mensaje.trim()}|${Date.now()}`;
    }
    addItem(item);
    cerrar();
  };
  return (
    <main className="page-container">
  <h2 className="page-title">Catálogo de productos</h2>
      <div className="form-card" style={{ maxWidth: 1100 }}>
        <div className="form-actions" style={{ justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
          <button type="button" className={`btn ${filtroTorta==='todas'?'btn-primary':'btn-outline-secondary'}`} onClick={()=> setFiltroTorta('todas')}>Todas</button>
          <button type="button" className={`btn ${filtroTorta==='cuadrada'?'btn-primary':'btn-outline-secondary'}`} onClick={()=> setFiltroTorta('cuadrada')}>Tortas cuadradas</button>
          <button type="button" className={`btn ${filtroTorta==='circular'?'btn-primary':'btn-outline-secondary'}`} onClick={()=> setFiltroTorta('circular')}>Tortas circulares</button>
        </div>
      </div>
      <div className="productos-grid">
        {lista.map((prod) => (
          <div className="producto-card" key={prod.codigo} onClick={() => abrir(prod)} role="button" tabIndex={0} onKeyDown={(e)=> (e.key==='Enter'||e.key===' ') && abrir(prod)}>
            <div className="producto-img-wrap">
              <img src={prod.img} alt={prod.nombre} className="producto-img" onError={(e)=>{ e.currentTarget.onerror=null; e.currentTarget.src=PLACEHOLDER_IMG; }} />
              <div className="producto-desc">{buildDescripcion(prod.codigo, prod.categoria, descripciones)}</div>
            </div>
            <div className="producto-nombre">{prod.nombre}</div>
            <div className="producto-precio">{prod.precio}</div>
          </div>
        ))}
      </div>
      {seleccionado && (
        <div className="modal-overlay" onClick={cerrar}>
          <div className="modal-card" onClick={(e)=> e.stopPropagation()}>
            <div className="modal-header"><h3>{seleccionado.nombre}</h3></div>
            <div className="modal-body">
              <img src={seleccionado.img} alt={seleccionado.nombre} className="modal-img" onError={(e)=>{ e.currentTarget.onerror=null; e.currentTarget.src=PLACEHOLDER_IMG; }} />
              <p className="modal-desc">{buildDescripcion(seleccionado.codigo, seleccionado.categoria, descripciones)}</p>
              <div className="modal-precio">{formatCLP(parseCLP(seleccionado.precio) + (mensaje.trim().length>0 ? EXTRA_PERSONALIZACION : 0))}</div>
              <label className="modal-qty" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
                Mensaje en la torta (opcional)
                <textarea
                  rows={3}
                  maxLength={MAX_MSG}
                  placeholder={`Feliz Cumple, máx ${MAX_MSG} caracteres`}
                  value={mensaje}
                  onChange={(e)=> setMensaje(e.target.value)}
                  style={{ width: '100%', minHeight: 72, resize: 'vertical' }}
                />
              </label>
              <label className="modal-qty">Cantidad
                <input type="number" min="1" value={cantidad} onChange={(e)=> setCantidad(sanitizeCantidad(e.target.value))} />
              </label>
              {mensaje.trim().length>0 && (
                <div style={{ gridColumn: '2 / 3', color: 'rgba(93,64,55,0.85)', fontSize: 13 }}>
                  Se agregará costo extra de personalización: {formatCLP(EXTRA_PERSONALIZACION)}
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={cerrar}>Cancelar</button>
              <button className="btn btn-primary" onClick={agregar}>Agregar al carrito</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

