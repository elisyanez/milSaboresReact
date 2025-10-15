import React from 'react';

export default function Home() {
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
            <a href="Usuario.html" className="btn-primary">
              Gestión de Usuario
            </a>
            <a href="Catalogo.html" className="btn-primary">
              Catálogo de productos
            </a>
            <a href="Pedido.html" className="btn-primary">
              Tu Pedido
            </a>
            <a href="Noticias.html" className="btn-primary">
              Noticias
            </a>
            <a href="Beneficios.html" className="btn-primary">
              Promociones
            </a>
            <a href="Consejos.html" className="btn-primary">
              Consejos
            </a>
          </div>
        </section>


        <section className="container">
          <h3>ÚLTIMAS NOTICIAS</h3>
          {/* Placeholder for news image or cards */}
        </section>
      </section>
    </main>
  );
}
