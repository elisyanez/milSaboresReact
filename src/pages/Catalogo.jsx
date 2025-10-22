import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const descripciones = {
  TC001: 'Bizcocho de cacao húmedo con capas de ganache de chocolate.',
  TC002: 'Bizcocho suave con frutas de temporada y crema pastelera ligera.',
  TT001: 'Bizcocho de vainilla esponjoso con buttercream de vainilla.',
  TT002: 'Bizcocho de vainilla relleno y cubierto con manjar.',
  PI001: 'Postre individual de mousse aireado de chocolate semiamargo.',
  PI002: 'Clásico italiano con queso mascarpone, café y cacao.',
  PSA001: 'Versión sin azúcar con jugo y ralladura de naranja.',
  PSA002: 'Cheesecake cremoso endulzado sin azúcar, sobre base crocante.',
  PT001: 'Clásica empanada dulce rellena de manzana especiada.',
  PT002: 'Tarta tradicional de almendra con cobertura de azúcar glas.',
  PG001: 'Brownie intenso y húmedo, libre de gluten.',
  PG002: 'Pan casero suave, elaborado sin gluten.',
  PV001: 'Torta vegana de cacao intenso, sin lácteos ni huevos.',
  PV002: 'Galletas crujientes de avena con chips de chocolate.',
  TE001: 'Torta personalizada para cumpleaños, sabores y decoración a elección.',
  TE002: 'Elegante torta nupcial por pisos, diseño a medida.'
};

const productos = [
  { codigo: 'TC001', categoria: 'Tortas Cuadradas', nombre: 'Torta Cuadrada de Chocolate', precio: '$45.000 CLP', img: '/IMG/torta-chocolate.jpg' },
  { codigo: 'TC002', categoria: 'Tortas Cuadradas', nombre: 'Torta Cuadrada de Frutas', precio: '$50.000 CLP', img: '/IMG/torta-frutas.jpg' },
  { codigo: 'TT001', categoria: 'Tortas Circulares', nombre: 'Torta Circular de Vainilla', precio: '$40.000 CLP', img: '/IMG/torta-vainilla.jpg' },
  { codigo: 'TT002', categoria: 'Tortas Circulares', nombre: 'Torta Circular de Manjar', precio: '$42.000 CLP', img: '/IMG/torta-manjar.png' },
  { codigo: 'PI001', categoria: 'Postres Individuales', nombre: 'Mousse de Chocolate', precio: '$5.000 CLP', img: '/IMG/mousse-chocolate.png' },
  { codigo: 'PI002', categoria: 'Postres Individuales', nombre: 'Tiramisú Clásico', precio: '$5.500 CLP', img: '/IMG/tiramisu.png' },
  { codigo: 'PSA001', categoria: 'Productos Sin Azúcar', nombre: 'Torta Sin Azúcar de Naranja', precio: '$48.000 CLP', img: '/IMG/torta-naranja-sin-azucar.png' },
  { codigo: 'PSA002', categoria: 'Productos Sin Azúcar', nombre: 'Cheesecake Sin Azúcar', precio: '$47.000 CLP', img: '/IMG/cheesecake-sin-azucar.png' },
  { codigo: 'PT001', categoria: 'Pastelería Tradicional', nombre: 'Empanada de Manzana', precio: '$3.000 CLP', img: '/IMG/empanada-manzana.png' },
  { codigo: 'PT002', categoria: 'Pastelería Tradicional', nombre: 'Tarta de Santiago', precio: '$6.000 CLP', img: '/IMG/tarta-santiago.png' },
  { codigo: 'PG001', categoria: 'Productos Sin Gluten', nombre: 'Brownie Sin Gluten', precio: '$4.000 CLP', img: '/IMG/brownie-sin-gluten.png' },
  { codigo: 'PG002', categoria: 'Productos Sin Gluten', nombre: 'Pan Sin Gluten', precio: '$3.500 CLP', img: '/IMG/pan-sin-gluten.png' },
  { codigo: 'PV001', categoria: 'Productos Veganos', nombre: 'Torta Vegana de Chocolate', precio: '$50.000 CLP', img: '/IMG/torta-vegana-chocolate.png' },
  { codigo: 'PV002', categoria: 'Productos Veganos', nombre: 'Galletas Veganas de Avena', precio: '$4.500 CLP', img: '/IMG/galletas-vegana-avena.png' },
  { codigo: 'TE001', categoria: 'Tortas Especiales', nombre: 'Torta Especial de Cumpleaños', precio: '$55.000 CLP', img: '/IMG/torta-cumpleanos.png' },
  { codigo: 'TE002', categoria: 'Tortas Especiales', nombre: 'Torta Especial de Boda', precio: '$60.000 CLP', img: '/IMG/torta-boda.png' },
];

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
              <img src={prod.img} alt={prod.nombre} className="producto-img" />
              <div className="producto-desc">{descripciones[prod.codigo] ?? prod.categoria}</div>
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
              <img src={seleccionado.img} alt={seleccionado.nombre} className="modal-img" />
              <p className="modal-desc">{descripciones[seleccionado.codigo] ?? seleccionado.categoria}</p>
              <div className="modal-precio">{seleccionado.precio}</div>
              <label className="modal-qty">Cantidad
                <input type="number" min="1" value={cantidad} onChange={(e)=> setCantidad(Math.max(1, Number(e.target.value)||1))} />
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
