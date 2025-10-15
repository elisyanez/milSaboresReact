import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
    const linkClass = ({ isActive }) => (isActive ? 'active' : undefined);

    const { count } = useCart();

    return (
        <header className="topbar">
            <div className="topbar-inner page-container">
                <div className="brand-wrap">
                    <Link to="/" className="brand" aria-label="Inicio">
                        <img src="/IMG/barra1.png" alt="Mil Sabores" className="brand-logo" />
                    </Link>
                </div>

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
                </nav>

                <div className="cart-wrap">
                    <Link to="/carrito" className="cart-link" aria-label={`Mi Carrito (${count})`}>
                        <svg className="cart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
                            <path d="M7 4h-2l-1 2H1v2h2l3.6 7.59-1.35 2.45A1 1 0 0 0 6 19h12v-2H7.42a.25.25 0 0 1-.23-.15L7.1 16h9.45a1 1 0 0 0 .95-.68l1.6-5A1 1 0 0 0 18.1 8H6.21l-.94-2z" />
                        </svg>
                        <span className="cart-text">Mi Carrito ({count})</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}