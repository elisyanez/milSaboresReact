import React from 'react';
import { Link } from 'react-router-dom';

export default function Nosotros() {
  return (
    <main className="page-container about-page">
      <h2 className="page-title">Nosotros</h2>

      <section className="about-hero">
        <div className="about-content">
          <div className="about-text">
            <p>
              En Mil Sabores convertimos lo cotidiano en momentos memorables. Cada
              pastel, galleta y postre nace de recetas artesanales, ingredientes
              seleccionados y una pasión por el detalle que se nota en cada bocado.
            </p>

            <p>
              Nuestra pastelería es un refugio de aromas cálidos y texturas suaves
              donde celebramos sabores tradicionales con toques modernos. Ven a
              probar nuestras creaciones: desde clásicos reconfortantes hasta
              novedades de temporada hechas con amor.
            </p>
          </div>

          <div className="about-cta">
            <Link to="/catalogo" className="btn primary-cta">Ver catálogo</Link>
            <Link to="/contacto" className="btn outline-cta">Encargar ahora</Link>
          </div>
        </div>

        <div className="about-image" aria-hidden>
          <div className="about-gallery" aria-hidden>
            <img src="/IMG/torta-chocolate.jpg" alt="Torta de chocolate" className="about-thumb" />
            <img src="/IMG/torta-frutas.jpg" alt="Torta de frutas" className="about-thumb" />
            <img src="/IMG/mousse-chocolate.png" alt="Mousse de chocolate" className="about-thumb" />
            <img src="/IMG/tiramisu.png" alt="Tiramisú" className="about-thumb" />
          </div>
        </div>
      </section>

      <section className="about-stats">
        <div className="stat-card">
          <strong>+10</strong>
          <span>Años de experiencia</span>
        </div>
        <div className="stat-card">
          <strong>100+</strong>
          <span>Recetas artesanales</span>
        </div>
        <div className="stat-card">
          <strong>⭐ 4.9</strong>
          <span>Clientes satisfechos</span>
        </div>
      </section>
    </main>
  );
}
