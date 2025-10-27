import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { productos as productosDB, descripciones as descripcionesDB } from '../data/db';
import { sanitizeCantidad, buildDescripcion } from '../utils/catalogo.logic';

const descripciones = descripcionesDB;

// Fallback image (SVG) for missing product images
const PLACEHOLDER_IMG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="220"><rect width="100%25" height="100%25" fill="%23FFF5E1"/><text x="50%25" y="44%25" dominant-baseline="middle" text-anchor="middle" fill="%235D4037" font-size="16" font-family="Lato, Arial">Imagen no disponible</text><text x="50%25" y="60%25" dominant-baseline="middle" text-anchor="middle" fill="%23E58A2E" font-size="14" font-family="Lato, Arial">Dulce por venir</text></svg>';

const productos = productosDB;

export default function Catalogo() {
  const { addItem } = useCart();
  const [seleccionado, setSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  const abrir = (prod) => {
    setSeleccionado(prod);
    setCantidad(1);
  };

  const cerrar = () => setSeleccionado(null);

  const agregar = () => {
    if (!seleccionado) return;
    addItem({ codigo: seleccionado.codigo, nombre: seleccionado.nombre, precio: seleccionado.precio, img: seleccionado.img, cantidad });
    cerrar();
  };
  return (
    <main className="page-container">
  <h2 className="page-title">Catálogo de productos</h2>
      <div className="productos-grid">
        {productos.map((prod) => (
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
              <div className="modal-precio">{seleccionado.precio}</div>
              <label className="modal-qty">Cantidad
                <input type="number" min="1" value={cantidad} onChange={(e)=> setCantidad(sanitizeCantidad(e.target.value))} />
              </label>
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

