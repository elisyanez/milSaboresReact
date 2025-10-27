import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const linkClass = ({ isActive }) => (isActive ? 'active' : undefined);
  const { count } = useCart();
  const { currentUser, logout } = useUser();

  return (
    <header className="topbar">
      <div className="topbar-inner page-container">
        <div className="brand-wrap">
          <Link to="/" className="brand" aria-label="Inicio" onClick={() => setOpen(false)}>
            <img src="/IMG/barra1.png" alt="Mil Sabores" className="brand-logo" />
          </Link>
        </div>

        <button
          className="nav-toggle"
          aria-label="Abrir menú"
          aria-controls="mobile-menu"
          aria-expanded={open ? 'true' : 'false'}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M3 6h18M3 12h18M3 18h18" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <nav className="nav-links" aria-label="Navegación principal">
          <NavLink to="/catalogo" className={linkClass}>
            Productos
          </NavLink>
          <NavLink to="/nosotros" className={linkClass}>
            Nosotros
          </NavLink>
          <NavLink to="/blogs" className={linkClass}>
            Blogs
          </NavLink>
          <NavLink to="/contacto" className={linkClass}>
            Contacto
          </NavLink>
          {!currentUser ? (
            <>
              <NavLink to="/login" className={linkClass}>Iniciar Sesion</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/perfil" className={linkClass}>Perfil</NavLink>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  if (window.confirm('¿Seguro que quieres cerrar sesión?')) {
                    logout();
                    setOpen(false);
                  }
                }}
              >
                Salir
              </button>
            </>
          )}
        </nav>

        <div className="cart-wrap">
          <Link to="/carrito" className="cart-link" aria-label={`Mi Carrito (${count})`} onClick={() => setOpen(false)}>
            <svg className="cart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
              <path d="M7 4h-2l-1 2H1v2h2l3.6 7.59-1.35 2.45A1 1 0 0 0 6 19h12v-2H7.42a.25.25 0 0 1-.23-.15L7.1 16h9.45a1 1 0 0 0 .95-.68l1.6-5A1 1 0 0 0 18.1 8H6.21l-.94-2z" />
            </svg>
            <span className="cart-badge" aria-hidden>{count}</span>
            <span className="cart-text">Mi Carrito ({count})</span>
          </Link>
        </div>
      </div>

      <div id="mobile-menu" className={`mobile-menu ${open ? 'open' : ''}`}>
        <NavLink to="/catalogo" className={linkClass} onClick={() => setOpen(false)}>
          Productos
        </NavLink>
        <NavLink to="/nosotros" className={linkClass} onClick={() => setOpen(false)}>
          Nosotros
        </NavLink>
        <NavLink to="/blogs" className={linkClass} onClick={() => setOpen(false)}>
          Blogs
        </NavLink>
        <NavLink to="/contacto" className={linkClass} onClick={() => setOpen(false)}>
          Contacto
        </NavLink>
        {!currentUser ? (
          <>
            <NavLink to="/login" className={linkClass} onClick={() => setOpen(false)}>Iniciar Sesion</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/perfil" className={linkClass} onClick={() => setOpen(false)}>Mi Perfil</NavLink>
            <button
              className="btn btn-secondary"
              onClick={() => {
                if (window.confirm('A?Seguro que quieres cerrar sesiA3n?')) {
                  logout();
                  setOpen(false);
                }
              }}
            >
              Salir
            </button>
          </>
        )}
      </div>
    </header>
  );
}
