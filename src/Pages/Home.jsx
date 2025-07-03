import React, { useState, useEffect } from 'react';
import '../assets/styles/Home.css';
import Navbar from '../Components/Navbar';
import Intro from '../Components/Intro';
import Productos from '../Components/Productos';
import PorQueElegirnos from '../Components/PorQueElegirnos';
import WhatsAppButton from '../Components/WhatsappButton';
import Footer from '../Components/Footer';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Para manejar el efecto de scroll y cambiar el estilo del navbar
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <div className="homepage">
      {/* Header/Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <Intro />
      
      {/* Productos - Resumen Section */}
      <Productos/>
      
      {/* por que elegirnos */}
      <PorQueElegirnos/>
      
      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Lo Que Dicen Nuestros Clientes</h2>
            <p>Experiencias reales de profesionales que usan nuestro software a diario</p>
          </div>
          
          <div className="testimonials-slider">
            <div className="testimonial">
              <div className="testimonial-content">
                <p>"El software ha revolucionado nuestra forma de trabajar. La precisión y velocidad son incomparables."</p>
              </div>
              <div className="testimonial-author">
                <img src="/api/placeholder/60/60" alt="Foto del cliente" className="author-image" />
                <div className="author-info">
                  <h4>Carlos Rodríguez</h4>
                  <p>Ingeniero de Producción, MecaTech</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial">
              <div className="testimonial-content">
                <p>"La facilidad de uso y la compatibilidad con nuestras máquinas existentes hizo que la transición fuera perfecta."</p>
              </div>
              <div className="testimonial-author">
                <img src="/api/placeholder/60/60" alt="Foto del cliente" className="author-image" />
                <div className="author-info">
                  <h4>Ana González</h4>
                  <p>Directora de Operaciones, InnovaCut</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="pricing-section" id="pricing">
        <div className="container">
          <div className="section-header">
            <h2>Planes y Precios</h2>
            <p>Soluciones flexibles adaptadas a tus necesidades</p>
          </div>
          
          <div className="pricing-cards">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Básico</h3>
                <div className="price">$99<span>/mes</span></div>
              </div>
              <div className="pricing-features">
                <ul>
                  <li>Control básico CNC</li>
                  <li>Soporte por email</li>
                  <li>1 usuario</li>
                  <li>Actualizaciones mensuales</li>
                </ul>
              </div>
              <div className="pricing-action">
                <a href="#signup" className="btn btn-primary">Comenzar</a>
              </div>
            </div>
            
            <div className="pricing-card featured">
              <div className="pricing-header">
                <h3>Profesional</h3>
                <div className="price">$199<span>/mes</span></div>
              </div>
              <div className="pricing-features">
                <ul>
                  <li>Control avanzado CNC</li>
                  <li>Soporte prioritario</li>
                  <li>5 usuarios</li>
                  <li>Actualizaciones semanales</li>
                  <li>Simulación 3D</li>
                </ul>
              </div>
              <div className="pricing-action">
                <a href="#signup" className="btn btn-primary">Comenzar</a>
              </div>
            </div>
            
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Empresarial</h3>
                <div className="price">Contactar</div>
              </div>
              <div className="pricing-features">
                <ul>
                  <li>Control completo personalizado</li>
                  <li>Soporte 24/7</li>
                  <li>Usuarios ilimitados</li>
                  <li>Integraciones personalizadas</li>
                  <li>Entrenamiento dedicado</li>
                </ul>
              </div>
              <div className="pricing-action">
                <a href="#contact" className="btn btn-secondary">Contactar</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>¿Listo para transformar tu producción?</h2>
            <p>Únete a miles de profesionales que ya han optimizado sus procesos CNC</p>
            <a href="#demo" className="btn btn-primary btn-large">Solicitar Demostración</a>
          </div>
        </div>
      </section>
      
      {/* Footer */}
 <Footer/>

{/* Botón de WhatsApp */}
<WhatsAppButton 
        phoneNumber="573194283570" 
        message="Hola, estoy interesado en conocer más sobre un producto de tu tienda" // Mensaje predeterminado
      />

    </div>
  );
};

export default Home;