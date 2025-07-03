import React, { useState, useEffect } from 'react';
import "../assets/styles/Checkout.css"
import Navbar from '../Components/Navbar';

const Checkout = () => {
  const [carrito, setCarrito] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [descuentoAplicado, setDescuentoAplicado] = useState(null);
  
  // Estados para formularios
  const [datosFacturacion, setDatosFacturacion] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    pais: 'Colombia'
  });
  
  const [datosEnvio, setDatosEnvio] = useState({
    mismoQueFacturacion: true,
    nombre: '',
    apellido: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    pais: 'Colombia'
  });
  
  const [metodoPago, setMetodoPago] = useState('');
  const [notas, setNotas] = useState('');

  // Cargar carrito de datos simulados
  useEffect(() => {
    // Datos simulados para demostración
    const carritoSimulado = [
      { id: 1, nombre: 'Producto CNC 1', precio: 150, cantidad: 2, imagen: '/api/placeholder/60/60' },
      { id: 2, nombre: 'Herramienta Corte', precio: 75, cantidad: 1, imagen: '/api/placeholder/60/60' }
    ];
    
    setCarrito(carritoSimulado);
    // Simular descuento aplicado
    setDescuentoAplicado({ codigo: 'DESCUENTO10', porcentaje: 0.10 });
  }, []);

  // Calcular totales
  const subtotal = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  const descuento = descuentoAplicado ? subtotal * descuentoAplicado.porcentaje : 0;
  const envio = subtotal > 200 ? 0 : 25;
  const impuestos = (subtotal - descuento + envio) * 0.19;
  const total = subtotal - descuento + envio + impuestos;

  const steps = [
    { id: 1, title: 'Información', icon: '👤' },
    { id: 2, title: 'Envío', icon: '🚚' },
    { id: 3, title: 'Pago', icon: '💳' },
    { id: 4, title: 'Confirmar', icon: '✓' }
  ];

  const handleInputChange = (section, field, value) => {
    if (section === 'facturacion') {
      setDatosFacturacion(prev => ({ ...prev, [field]: value }));
    } else if (section === 'envio') {
      setDatosEnvio(prev => ({ ...prev, [field]: value }));
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return datosFacturacion.nombre && datosFacturacion.apellido && 
               datosFacturacion.email && datosFacturacion.telefono && 
               datosFacturacion.direccion && datosFacturacion.ciudad;
      case 2:
        if (datosEnvio.mismoQueFacturacion) return true;
        return datosEnvio.nombre && datosEnvio.apellido && 
               datosEnvio.direccion && datosEnvio.ciudad;
      case 3:
        return metodoPago !== '';
      default:
        return true;
    }
  };

  const procesarPedido = async () => {
    setLoading(true);
    
    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const pedido = {
      productos: carrito,
      datosFacturacion,
      datosEnvio: datosEnvio.mismoQueFacturacion ? datosFacturacion : datosEnvio,
      metodoPago,
      notas,
      subtotal,
      descuento,
      envio,
      impuestos,
      total,
      fecha: new Date().toISOString()
    };
    
    console.log('Pedido procesado:', pedido);
    
    // Limpiar carrito
    localStorage.removeItem('carrito');
    localStorage.removeItem('descuentoAplicado');
    
    setLoading(false);
    alert('¡Pedido realizado con éxito! Te contactaremos pronto.');
    // Simular navegación de vuelta
    window.location.href = '/';
  };

  return (
    <div className="checkout-page">
        <Navbar/>
      <div className="checkout-container">
        {/* Progress Steps */}
        <div className="progress-steps">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className={`step ${currentStep >= step.id ? 'active' : ''} ${currentStep === step.id ? 'current' : ''}`}
            >
              <div className="step-icon">{step.icon}</div>
              <div className="step-title">{step.title}</div>
            </div>
          ))}
        </div>

        <div className="checkout-content">
          {/* Main Content */}
          <div className="checkout-main">
            {/* Step 1: Información de Facturación */}
            {currentStep === 1 && (
              <div className="step-content">
                <h3>Información de Facturación</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nombre *</label>
                    <input
                      type="text"
                      value={datosFacturacion.nombre}
                      onChange={(e) => handleInputChange('facturacion', 'nombre', e.target.value)}
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div className="form-group">
                    <label>Apellido *</label>
                    <input
                      type="text"
                      value={datosFacturacion.apellido}
                      onChange={(e) => handleInputChange('facturacion', 'apellido', e.target.value)}
                      placeholder="Tu apellido"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={datosFacturacion.email}
                      onChange={(e) => handleInputChange('facturacion', 'email', e.target.value)}
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Teléfono *</label>
                    <input
                      type="tel"
                      value={datosFacturacion.telefono}
                      onChange={(e) => handleInputChange('facturacion', 'telefono', e.target.value)}
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                  <div className="form-group">
                    <label>País *</label>
                    <select
                      value={datosFacturacion.pais}
                      onChange={(e) => handleInputChange('facturacion', 'pais', e.target.value)}
                    >
                      <option value="Colombia">Colombia</option>
                      <option value="Mexico">México</option>
                      <option value="Argentina">Argentina</option>
                      <option value="Chile">Chile</option>
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>Dirección *</label>
                    <input
                      type="text"
                      value={datosFacturacion.direccion}
                      onChange={(e) => handleInputChange('facturacion', 'direccion', e.target.value)}
                      placeholder="Calle 123 #45-67"
                    />
                  </div>
                  <div className="form-group">
                    <label>Ciudad *</label>
                    <input
                      type="text"
                      value={datosFacturacion.ciudad}
                      onChange={(e) => handleInputChange('facturacion', 'ciudad', e.target.value)}
                      placeholder="Bogotá"
                    />
                  </div>
                  <div className="form-group">
                    <label>Código Postal</label>
                    <input
                      type="text"
                      value={datosFacturacion.codigoPostal}
                      onChange={(e) => handleInputChange('facturacion', 'codigoPostal', e.target.value)}
                      placeholder="110111"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Información de Envío */}
            {currentStep === 2 && (
              <div className="step-content">
                <h3>Información de Envío</h3>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={datosEnvio.mismoQueFacturacion}
                      onChange={(e) => setDatosEnvio(prev => ({ ...prev, mismoQueFacturacion: e.target.checked }))}
                    />
                    <span>Usar la misma dirección de facturación</span>
                  </label>
                </div>
                
                {!datosEnvio.mismoQueFacturacion && (
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nombre *</label>
                      <input
                        type="text"
                        value={datosEnvio.nombre}
                        onChange={(e) => handleInputChange('envio', 'nombre', e.target.value)}
                        placeholder="Nombre del destinatario"
                      />
                    </div>
                    <div className="form-group">
                      <label>Apellido *</label>
                      <input
                        type="text"
                        value={datosEnvio.apellido}
                        onChange={(e) => handleInputChange('envio', 'apellido', e.target.value)}
                        placeholder="Apellido del destinatario"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Dirección *</label>
                      <input
                        type="text"
                        value={datosEnvio.direccion}
                        onChange={(e) => handleInputChange('envio', 'direccion', e.target.value)}
                        placeholder="Dirección de entrega"
                      />
                    </div>
                    <div className="form-group">
                      <label>Ciudad *</label>
                      <input
                        type="text"
                        value={datosEnvio.ciudad}
                        onChange={(e) => handleInputChange('envio', 'ciudad', e.target.value)}
                        placeholder="Ciudad"
                      />
                    </div>
                    <div className="form-group">
                      <label>Código Postal</label>
                      <input
                        type="text"
                        value={datosEnvio.codigoPostal}
                        onChange={(e) => handleInputChange('envio', 'codigoPostal', e.target.value)}
                        placeholder="Código postal"
                      />
                    </div>
                    <div className="form-group">
                      <label>País *</label>
                      <select
                        value={datosEnvio.pais}
                        onChange={(e) => handleInputChange('envio', 'pais', e.target.value)}
                      >
                        <option value="Colombia">Colombia</option>
                        <option value="Mexico">México</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Chile">Chile</option>
                      </select>
                    </div>
                  </div>
                )}
                
                <div className="shipping-options">
                  <h4>Opciones de Envío</h4>
                  <div className="shipping-option">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="envio"
                        value="estandar"
                        defaultChecked
                      />
                      <div className="option-content">
                        <span className="option-title">Envío Estándar</span>
                        <span className="option-time">5-7 días hábiles</span>
                        <span className="option-price">{envio === 0 ? 'Gratis' : `$${envio}`}</span>
                      </div>
                    </label>
                  </div>
                  <div className="shipping-option">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="envio"
                        value="express"
                      />
                      <div className="option-content">
                        <span className="option-title">Envío Express</span>
                        <span className="option-time">2-3 días hábiles</span>
                        <span className="option-price">$45</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="step-navigation">
              {currentStep > 1 && (
                <button 
                  className="btn btn-secondary"
                  onClick={prevStep}
                >
                  ← Anterior
                </button>
              )}
              
              {currentStep < 4 ? (
                <button 
                  className="btn btn-primary"
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                >
                  Siguiente →
                </button>
              ) : (
                <button 
                  className="btn btn-success btn-large"
                  onClick={procesarPedido}
                  disabled={loading}
                >
                  {loading ? 'Procesando...' : 'Confirmar Pedido'}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="order-summary-sidebar">
            <div className="summary-card">
              <h3>Resumen del Pedido</h3>
              
              <div className="productos-resumen">
                {carrito.map(producto => (
                  <div key={producto.id} className="producto-resumen">
                    <div className="producto-imagen-small">
                      <img src={producto.imagen} alt={producto.nombre} />
                      <span className="cantidad-badge">{producto.cantidad}</span>
                    </div>
                    <div className="producto-info-small">
                      <h4>{producto.nombre}</h4>
                      <p>${(producto.precio * producto.cantidad).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="resumen-totales">
                <div className="resumen-linea">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                {descuentoAplicado && (
                  <div className="resumen-linea descuento">
                    <span>Descuento ({descuentoAplicado.codigo}):</span>
                    <span>-${descuento.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="resumen-linea">
                  <span>Envío:</span>
                  <span>{envio === 0 ? 'Gratis' : `$${envio.toFixed(2)}`}</span>
                </div>
                
                <div className="resumen-linea">
                  <span>Impuestos (19%):</span>
                  <span>${impuestos.toFixed(2)}</span>
                </div>
                
                <div className="resumen-linea total">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;