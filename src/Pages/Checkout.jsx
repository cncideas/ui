import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../assets/styles/Checkout.css"
import Navbar from '../Components/Navbar';

const Checkout = () => {
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  const navigate = useNavigate();
  const [carrito, setCarrito] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cargandoCarrito, setCargandoCarrito] = useState(true);
  
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

  // Cargar carrito real desde localStorage
  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito') || '[]');
    
    // Si el carrito está vacío, redirigir al carrito
    if (carritoGuardado.length === 0) {
      navigate('/carrito');
      return;
    }
    
    setCarrito(carritoGuardado);
    setCargandoCarrito(false);
  }, [navigate]);

  // Función para determinar si un producto es de planos (igual que en Carrito.jsx)
  const esProductoPlano = (producto) => {
    return producto.categoria && 
           (producto.categoria.toLowerCase().includes('plano') ||
            producto.categoria.toLowerCase().includes('pdf') ||
            producto.categoria.toLowerCase().includes('cnc') ||
            producto.categoria.toLowerCase().includes('diseño') ||
            producto.categoria.toLowerCase().includes('blueprint') ||
            producto.categoria.toLowerCase().includes('template'));
  };

  // Función para obtener la imagen del producto (igual que en Carrito.jsx)
  const obtenerImagenProducto = (producto) => {
    if (esProductoPlano(producto)) {
      return null; // No mostrar imagen, usar ícono PDF
    }
    return producto.imagen || '/default-product.jpg';
  };

  // Función para obtener el ícono según el tipo de producto
  const obtenerIconoProducto = (producto) => {
    if (esProductoPlano(producto)) {
      return '📄'; // Ícono PDF
    }
    return '📦'; // Ícono producto físico
  };

  // Calcular totales (sin descuentos)
  const subtotal = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  const envio = subtotal > 200 ? 0 : 15; // Envío gratis para pedidos > $200 (igual que en Carrito.jsx)
  const total = subtotal + envio;

  // Función para formatear precio (igual que en Carrito.jsx)
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  };

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

    // Función para enviar el pedido al backend
  const enviarPedidoAlBackend = async (pedido) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pedido`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedido),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el pedido');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error al enviar pedido:', error);
      throw error;
    }
  };

  const procesarPedido = async () => {
    setLoading(true);
    
    try {
      const pedido = {
        productos: carrito,
        datosFacturacion,
        datosEnvio: datosEnvio.mismoQueFacturacion ? datosFacturacion : datosEnvio,
        metodoPago,
        notas,
        subtotal,
        envio,
        total,
        fecha: new Date().toISOString(),
        id: Date.now()
      };
      
      console.log('Procesando pedido:', pedido);
      
      // Enviar el pedido al backend
      await enviarPedidoAlBackend(pedido);
      
      // Guardar pedido localmente como backup
      localStorage.setItem('pedidoProcesado', JSON.stringify(pedido));
      
      // Limpiar carrito
      localStorage.removeItem('carrito');
      
      // Disparar evento para actualizar navbar
      window.dispatchEvent(new Event('carritoActualizado'));
      
      setLoading(false);
      alert('¡Pedido realizado con éxito! Te contactaremos pronto para confirmar el pago y envío.');
      
      // Navegar de vuelta al inicio
      navigate('/');
      
    } catch (error) {
      setLoading(false);
      console.error('Error al procesar pedido:', error);
      alert('Hubo un error al procesar tu pedido. Por favor, intenta nuevamente o contacta directamente con nosotros.');
    }
  };
  // Mostrar loading mientras carga el carrito
  if (cargandoCarrito) {
    return (
      <div className="checkout-page">
        <Navbar/>
        <div className="checkout-container">
          <div className="cargando-checkout">
            <div className="spinner"></div>
            <p>Cargando información del pedido...</p>
          </div>
        </div>
      </div>
    );
  }

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
                        <span className="option-price">{envio === 0 ? 'Sujeto a operador ' : formatearPrecio(envio)}</span>
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
                        <span className="option-price">{envio === 0 ? 'Sujeto a operador ' : formatearPrecio(envio)}</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Método de Pago */}
            {currentStep === 3 && (
              <div className="step-content">
                <h3>Método de Pago</h3>
                <div className="payment-methods">
                  <div className="payment-option">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="metodoPago"
                        value="transferencia"
                        checked={metodoPago === 'transferencia'}
                        onChange={(e) => setMetodoPago(e.target.value)}
                      />
                      <div className="option-content">
                        <span className="option-title">💳 Transferencia Bancaria</span>
                        <span className="option-desc">Pago directo a cuenta bancaria</span>
                      </div>
                    </label>
                  </div>
                  <div className="payment-option">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="metodoPago"
                        value="efectivo"
                        checked={metodoPago === 'efectivo'}
                        onChange={(e) => setMetodoPago(e.target.value)}
                      />
                      <div className="option-content">
                        <span className="option-title">💵 Efectivo</span>
                        <span className="option-desc">Pago contra entrega</span>
                      </div>
                    </label>
                  </div>
                  <div className="payment-option">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="metodoPago"
                        value="nequi"
                        checked={metodoPago === 'nequi'}
                        onChange={(e) => setMetodoPago(e.target.value)}
                      />
                      <div className="option-content">
                        <span className="option-title">📱 Nequi</span>
                        <span className="option-desc">Pago móvil</span>
                      </div>
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Notas adicionales (opcional)</label>
                  <textarea
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Instrucciones especiales para tu pedido..."
                    rows="4"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Confirmación */}
            {currentStep === 4 && (
              <div className="step-content">
                <h3>Confirmar Pedido</h3>
                <div className="confirmation-summary">
                  <div className="confirmation-section">
                    <h4>📋 Datos de Facturación</h4>
                    <p><strong>{datosFacturacion.nombre} {datosFacturacion.apellido}</strong></p>
                    <p>{datosFacturacion.email}</p>
                    <p>{datosFacturacion.telefono}</p>
                    <p>{datosFacturacion.direccion}, {datosFacturacion.ciudad}</p>
                    <p>{datosFacturacion.pais}</p>
                  </div>
                  
                  <div className="confirmation-section">
                    <h4>🚚 Datos de Envío</h4>
                    {datosEnvio.mismoQueFacturacion ? (
                      <p><em>Misma dirección de facturación</em></p>
                    ) : (
                      <>
                        <p><strong>{datosEnvio.nombre} {datosEnvio.apellido}</strong></p>
                        <p>{datosEnvio.direccion}, {datosEnvio.ciudad}</p>
                        <p>{datosEnvio.pais}</p>
                      </>
                    )}
                  </div>
                  
                  <div className="confirmation-section">
                    <h4>💳 Método de Pago</h4>
                    <p>{metodoPago === 'transferencia' ? 'Transferencia Bancaria' : 
                        metodoPago === 'efectivo' ? 'Efectivo (Contra entrega)' : 
                        metodoPago === 'nequi' ? 'Nequi' : metodoPago}</p>
                  </div>
                  
                  {notas && (
                    <div className="confirmation-section">
                      <h4>📝 Notas</h4>
                      <p>{notas}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="step-navigation">
              {currentStep > 1 && (
                <button 
                  className="btn btn-secondary"
                  onClick={prevStep}
                  disabled={loading}
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
                      {esProductoPlano(producto) ? (
                        <div className="pdf-icon-small">
                          <span>📄</span>
                        </div>
                      ) : (
                        <img 
                          src={obtenerImagenProducto(producto)} 
                          alt={producto.nombre}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      )}
                      <span className="cantidad-badge">{producto.cantidad}</span>
                    </div>
                    <div className="producto-info-small">
                      <h4>{producto.nombre}</h4>
                      <p style={{color:"#09386b"}} className="producto-categoria-small">
                        {obtenerIconoProducto(producto)} {producto.categoria || 'Producto'}
                      </p>
                      <p style={{color:"#09386b"}} className="precio-small">{formatearPrecio(producto.precio * producto.cantidad)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="resumen-totales">
                <div className="resumen-linea">
                  <span style={{color:"#09386b"}}>Subtotal:</span>
                  <span style={{color:"#09386b"}}>{formatearPrecio(subtotal)}</span>
                </div>
                
                <div className="resumen-linea">
                  <span style={{color:"#09386b"}}>Envío:</span>
                  <span style={{color:"#09386b"}}>{envio === 0 ? 'Sujeto a operador' : formatearPrecio(envio)}</span>
                </div>
                
                <div className="resumen-linea total">
                  <span>Total:</span>
                  <span>{formatearPrecio(total)}</span>
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