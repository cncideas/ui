import React from 'react';
import '../assets/styles/Contacto.css';
import Navbar from '../Components/Navbar';

const Contacto = () => {
  return (
    <section className="contacto-section">
        <Navbar/>
      <div className="container">
        <div className="section-header">
          <h2>Contáctanos</h2>
          <p>
            Estamos aquí para resolver tus dudas, brindarte asesoría y ayudarte a llevar tus ideas CNC al siguiente nivel.
          </p>
        </div>

        <div className="contacto-grid">
          {/* Información de contacto */}
          <div className="contacto-info">
            <h3>Información de contacto</h3>
            <p><strong>Teléfono:</strong> <a href="tel:+573001234567">+57 300 123 4567</a></p>
            <p><strong>Email:</strong> <a href="mailto:info@cncideas.com">info@cncideas.com</a></p>
            <p><strong>Ubicación:</strong> Manizales, Caldas - Colombia</p>
          </div>

          {/* Formulario */}
          <form className="contacto-form">
            <input type="text" placeholder="Nombre completo" required />
            <input type="email" placeholder="Correo electrónico" required />
            <textarea placeholder="Tu mensaje" rows="6" required></textarea>
            <button type="submit" className="btn btn-primary">Enviar mensaje</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contacto;

