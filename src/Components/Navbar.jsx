import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../assets/styles/Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [carritoCount, setCarritoCount] = useState(0);
  const location = useLocation();

  // Actualizar contador del carrito
  useEffect(() => {
    const actualizarContador = () => {
      const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
      const totalProductos = carrito.reduce((total, item) => total + item.cantidad, 0);
      setCarritoCount(totalProductos);
    };

    // Actualizar al cargar el componente
    actualizarContador();

    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      actualizarContador();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // También escuchar cuando se modifica el carrito en la misma pestaña
    const interval = setInterval(actualizarContador, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Función para determinar si una ruta está activa
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Logo */}
          <div className="navbar-logo">
            <Link to="/" onClick={closeMenu}>
              <img src="/logotipo.png" alt="RollCNC" className="logo-img" />
              <span className="logo-text">CNC Ideas</span>
            </Link>
          </div>

          {/* Menu de navegación desktop */}
          <div className="navbar-menu">
            <Link 
              to="/" 
              className={`nav-link ${isActiveRoute('/') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Inicio
            </Link>
         
             {/* <Link 
              to="/blog" 
              className={`mobile-nav-link ${isActiveRoute('/servicios') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Videos
            </Link>*/}
            <Link 
              to="/planos" 
              className={`mobile-nav-link ${isActiveRoute('/planos') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Planos
            </Link>
            <Link 
              to="/tienda" 
              className={`nav-link ${isActiveRoute('/tienda') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Tienda
            </Link>
            <Link 
              to="/contactenos" 
              className={`nav-link ${isActiveRoute('/contactenos') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Contacto
            </Link>
          </div>

          {/* Carrito y botón de menú móvil */}
          <div className="navbar-actions">
            {/* Icono del carrito */}
            <Link to="/carrito" className="carrito-link" onClick={closeMenu}>
              <div className="carrito-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 16.1 19 15 19H9C7.9 19 7 18.1 7 17V13M15 21C15.6 21 16 20.6 16 20S15.6 19 15 19 14 19.4 14 20 14.6 21 15 21ZM9 21C9.6 21 10 20.6 10 20S9.6 19 9 19 8 19.4 8 20 8.6 21 9 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {carritoCount > 0 && (
                  <span className="carrito-badge">{carritoCount}</span>
                )}
              </div>
            </Link>

            {/* Botón de menú móvil */}
            <button 
              className={`mobile-menu-btn ${isMenuOpen ? 'active' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* Menu móvil */}
        <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="mobile-menu-content">
            <Link 
              to="/" 
              className={`mobile-nav-link ${isActiveRoute('/') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Inicio
            </Link>
            <Link 
              to="/nosotros" 
              className={`mobile-nav-link ${isActiveRoute('/nosotros') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Nosotros
            </Link>
            {/*<Link 
              to="/blog" 
              className={`mobile-nav-link ${isActiveRoute('/servicios') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Videos
            </Link>*/}
            <Link 
              to="/planos" 
              className={`mobile-nav-link ${isActiveRoute('/servicios') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Planos
            </Link>
            <Link 
              to="/tienda" 
              className={`mobile-nav-link ${isActiveRoute('/tienda') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Tienda
            </Link>
            <Link 
              to="/contactenos" 
              className={`mobile-nav-link ${isActiveRoute('/contactenos') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Contacto
            </Link>
            <div className="mobile-menu-divider"></div>
            <Link 
              to="/carrito" 
              className="mobile-carrito-link"
              onClick={closeMenu}
            >
              <span>Carrito</span>
              {carritoCount > 0 && (
                <span className="mobile-carrito-count">({carritoCount})</span>
              )}
            </Link>
          </div>
        </div>

        {/* Overlay para cerrar menú móvil */}
        {isMenuOpen && (
          <div className="mobile-menu-overlay" onClick={closeMenu}></div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;