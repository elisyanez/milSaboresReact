import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Home() {
  const { currentUser } = useUser();
  return (
    <main className="page-container">
      <section>
        <section className="hero-main container">
          <div className="hero-copy">
            <h1>
              Bienvenido a <span className="accent">Pastelería Mil Sabores</span>
            </h1>

            <p>
              En nuestra pastelería online encontrarás una amplia variedad de productos de repostería elaborados con
              ingredientes frescos y de la más alta calidad.
            </p>

            <p>
              Desde tortas clásicas y pasteles personalizados hasta galletas y cupcakes, todo pensado para endulzar tus
              momentos más especiales.
            </p>

            <h3>Personaliza tu pedido</h3>
            <p>
              Elige el diseño, el sabor y los detalles que prefieras para que tu pastel o postre sea único y perfecto para
              cualquier ocasión.
            </p>

            <h3>Compra fácil y rápida</h3>
            <p>
              Explora nuestro catálogo, agrega tus productos favoritos al carrito y recibe tu pedido en la comodidad de tu
              hogar.
            </p>

            <h2 className="hero-tagline">Cada bocado debe ser una experiencia única.</h2>
          </div>

          <div className="hero-media">
            <img src="/IMG/Logo1.png" alt="Mil Sabores" className="home-logo" />
          </div>
        </section>

        <section className="container actions">
          <h2>¿Qué deseas hacer hoy?</h2>
          <div className="action-grid">
            {currentUser?.role === 'admin' && (
              <NavLink
                to="/usuario"
                className={({ isActive }) => (isActive ? 'btn-primary active' : 'btn-primary')}
              >
                Gestión de Usuario
              </NavLink>
            )}
            <NavLink
              to="/catalogo"
              className={({ isActive }) => (isActive ? 'btn-primary active' : 'btn-primary')}
            >
              Catálogo de productos
            </NavLink>
            <NavLink
              to="/pedido"
              className={({ isActive }) => (isActive ? 'btn-primary active' : 'btn-primary')}
            >
              Tu Pedido
            </NavLink>
            <NavLink
              to="/blogs"
              className={({ isActive }) => (isActive ? 'btn-primary active' : 'btn-primary')}
            >
              Noticias
            </NavLink>
            <NavLink
              to="/beneficios"
              className={({ isActive }) => (isActive ? 'btn-primary active' : 'btn-primary')}
            >
              Promociones
            </NavLink>
            <NavLink
              to="/consejos"
              className={({ isActive }) => (isActive ? 'btn-primary active' : 'btn-primary')}
            >
              Consejos
            </NavLink>
          </div>
        </section>
      </section>
    </main>
  );
}

