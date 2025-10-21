import React from 'react';

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
  return (
    <main className="page-container">
  <h2 className="page-title">Catálogo de productos</h2>
      <div className="productos-grid">
        {productos.map((prod) => (
          <div className="producto-card" key={prod.codigo}>
            <div className="producto-img-wrap">
              <img src={prod.img} alt={prod.nombre} className="producto-img" />
            </div>
            <div className="producto-nombre">{prod.nombre}</div>
            <div className="producto-precio">{prod.precio}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
