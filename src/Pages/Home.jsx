import React, { useState, useEffect } from 'react';
import '../assets/styles/Home.css';
import Navbar from '../Components/Navbar';
import Intro from '../Components/Intro';
import Productos from '../Components/Productos';

import Footer from '../Components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import WhatsAppButton from '../Components/WhatsAppButton';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
   const navigate = useNavigate();
  
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
      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>¿No sabes como ensamblar tu máquina?</h2>
            <p style={{color: "#101049"}}>Te suministramos planos, asesorias y productos CNC</p>
            <Link to={'/contactenos'}  className="btn btn-primary btn-large">Dejanos conocer tu necesidad!</Link>
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