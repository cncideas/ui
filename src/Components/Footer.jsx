import React from 'react';
import '../assets/styles/Home.css';

const Footer = () => {
  return (
    <footer className="footer">
    <div className="container">
      <div className="footer-columns">
        <div className="footer-column">
          <div className="footer-logo">
            <img src="/api/placeholder/150/50" alt="Logo" />
          </div>
          <p>Software de control CNC revolucionario para profesionales y empresas.</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
            <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
        
        <div className="footer-column">
          <h4>Producto</h4>
          <ul>
            <li><a href="#features">Características</a></li>
            <li><a href="#pricing">Precios</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#roadmap">Roadmap</a></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h4>Empresa</h4>
          <ul>
            <li><a href="#about">Sobre Nosotros</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#careers">Empleo</a></li>
            <li><a href="#contact">Contacto</a></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h4>Soporte</h4>
          <ul>
            <li><a href="#help">Centro de Ayuda</a></li>
            <li><a href="#docs">Documentación</a></li>
            <li><a href="#community">Comunidad</a></li>
            <li><a href="#training">Entrenamiento</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="copyright">
          &copy; 2025 Tu Empresa. Todos los derechos reservados.
        </div>
        <div className="legal-links">
          <a href="#terms">Términos de Servicio</a>
          <a href="#privacy">Política de Privacidad</a>
        </div>
      </div>
    </div>
  </footer>
  );
};

export default Footer;