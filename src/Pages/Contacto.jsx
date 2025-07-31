import React, { useState } from 'react';
import '../assets/styles/Contacto.css';
import Navbar from '../Components/Navbar';

const Contacto = () => {

  const API_BASE_URL = 'http://localhost:3000';

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/contacto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMensaje({ 
          tipo: 'success', 
          texto: '¡Mensaje enviado exitosamente! Te responderemos pronto.' 
        });
        setFormData({ nombre: '', email: '', telefono: '', mensaje: '' });
      } else {
        throw new Error('Error al enviar el mensaje');
      }
    } catch (error) {
      setMensaje({ 
        tipo: 'error', 
        texto: 'Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            <p><strong>Teléfono:</strong> <a href="tel:+573001234567">+57 3194283570</a></p>
            <p><strong>Email:</strong> <a href="mailto:info@cncideas.com">tiendacncideas@gmail.com</a></p>
            <p><strong>Ubicación:</strong> Manizales, Caldas - Colombia</p>
          </div>

          {/* Formulario */}
          <form className="contacto-form" onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="nombre"
              placeholder="Nombre completo" 
              value={formData.nombre}
              onChange={handleChange}
              required 
            />
            <input 
              type="email" 
              name="email"
              placeholder="Correo electrónico" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
            <input 
              type="tel" 
              name="telefono"
              placeholder="Número de teléfono" 
              value={formData.telefono}
              onChange={handleChange}
              required 
            />
            <textarea 
              name="mensaje"
              placeholder="Tu mensaje" 
              rows="4" 
              value={formData.mensaje}
              onChange={handleChange}
              required
            ></textarea>
            
            {mensaje.texto && (
              <div className={`mensaje ${mensaje.tipo}`}>
                {mensaje.texto}
              </div>
            )}
            
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contacto;