import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/Carrito.css';
import Navbar from '../Components/Navbar';
import WhatsAppButton from '../Components/WhatsappButton';
import Footer from '../Components/Footer';

const Carrito = () => {
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [codigoDescuento, setCodigoDescuento] = useState('');
  const [descuentoAplicado, setDescuentoAplicado] = useState(null);

  // Cargar carrito del localStorage
  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito') || '[]');
    setCarrito(carritoGuardado);
    setCargando(false);
  }, []);

  // Actualizar localStorage cuando cambie el carrito
  useEffect(() => {
    if (!cargando) {
      localStorage.setItem('carrito', JSON.stringify(carrito));
      
      // Disparar evento personalizado para notificar cambios
      window.dispatchEvent(new Event('carritoActualizado'));
    }
  }, [carrito, cargando]);

  // Actualizar cantidad de un producto
  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      eliminarProducto(id);
      return;
    }
    
    const carritoActualizado = carrito.map(item => 
      item.id === id ? { ...item, cantidad: nuevaCantidad } : item
    );
    
    setCarrito(carritoActualizado);
  };

  // Eliminar producto del carrito
  const eliminarProducto = (id) => {
    const carritoActualizado = carrito.filter(item => item.id !== id);
    setCarrito(carritoActualizado);
  };

  // Limpiar carrito completo
  const limpiarCarrito = () => {
    setCarrito([]);
    setDescuentoAplicado(null);
  };

  // Aplicar código de descuento
  const aplicarDescuento = () => {
    const codigosValidos = {
      'DESCUENTO10': 0.10,
      'PRIMERA20': 0.20,
      'ESTUDIANTE15': 0.15
    };

    if (codigosValidos[codigoDescuento.toUpperCase()]) {
      setDescuentoAplicado({
        codigo: codigoDescuento.toUpperCase(),
        porcentaje: codigosValidos[codigoDescuento.toUpperCase()]
      });
      setCodigoDescuento('');
    } else {
      alert('Código de descuento no válido');
    }
  };

  // Remover descuento
  const removerDescuento = () => {
    setDescuentoAplicado(null);
  };

  // Calcular totales
  const subtotal = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  const descuento = descuentoAplicado ? subtotal * descuentoAplicado.porcentaje : 0;
  const total = subtotal - descuento;

  // Proceder al checkout
  const procederCheckout = () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    
    // Aquí implementarías la lógica de checkout real
    // Por ahora, simularemos el proceso
    const pedido = {
      productos: carrito,
      subtotal,
      descuento,
      total,
      fecha: new Date().toISOString()
    };
    
    console.log('Procesando pedido:', pedido);
    alert('¡Gracias por tu compra! Te contactaremos pronto para confirmar tu pedido.');
    limpiarCarrito();
  };

  if (cargando) {
    return (
      <div className="carrito-page">
        <Navbar />
        <div className="cargando-carrito">
          <p>Cargando carrito...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="carrito-page">
      <Navbar />
      
      {/* Hero section */}
      <section className="carrito-hero">
        <div className="container">
          <h1>Carrito de Compras</h1>
          <p>Revisa y confirma tu pedido antes de proceder</p>
        </div>
      </section>

      {/* Contenido principal */}
      <section className="carrito-main">
        <div className="container">
          {carrito.length === 0 ? (
            // Carrito vacío
            <div className="carrito-vacio">
              <div className="carrito-vacio-content">
                <div className="carrito-vacio-icon">🛒</div>
                <h2>Tu carrito está vacío</h2>
                <p>¡Explora nuestra tienda y encuentra productos increíbles!</p>
                <button 
                  className="btn btn-primary btn-large"
                  onClick={() => navigate('/tienda')}
                >
                  Ir a la tienda
                </button>
              </div>
            </div>
          ) : (
            // Carrito con productos
            <div className="carrito-content">
              <div className="carrito-grid">
                {/* Lista de productos */}
                <div className="carrito-productos">
                  <div className="carrito-header">
                    <h2>Productos ({carrito.length})</h2>
                    <button 
                      className="btn-limpiar"
                      onClick={limpiarCarrito}
                    >
                      Limpiar carrito
                    </button>
                  </div>

                  <div className="productos-lista">
                    {carrito.map(producto => (
                      <div key={producto.id} className="producto-carrito">
                        <div className="producto-imagen">
                          <img src={producto.imagen} alt={producto.nombre} />
                        </div>
                        
                        <div className="producto-info">
                          <h3>{producto.nombre}</h3>
                          <p className="producto-precio">${producto.precio}</p>
                        </div>
                        
                        <div className="producto-cantidad">
                          <button 
                            className="cantidad-btn"
                            onClick={() => actualizarCantidad(producto.id, producto.cantidad - 1)}
                          >
                            -
                          </button>
                          <span className="cantidad-display">{producto.cantidad}</span>
                          <button 
                            className="cantidad-btn"
                            onClick={() => actualizarCantidad(producto.id, producto.cantidad + 1)}
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="producto-total">
                          ${(producto.precio * producto.cantidad).toFixed(2)}
                        </div>
                        
                        <button 
                          className="btn-eliminar"
                          onClick={() => eliminarProducto(producto.id)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resumen del pedido */}
                <div className="carrito-resumen">
                  <div className="resumen-card">
                    <h3>Resumen del pedido</h3>
                    
                    <div className="resumen-linea">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    
                    {descuentoAplicado && (
                      <div className="resumen-linea descuento">
                        <span>Descuento ({descuentoAplicado.codigo}):</span>
                        <span>-${descuento.toFixed(2)}</span>
                        <button 
                          className="btn-remover-descuento"
                          onClick={removerDescuento}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    
                    <div className="resumen-linea total">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    
                    {/* Código de descuento */}
                    <div className="codigo-descuento">
                      <h4>¿Tienes un código de descuento?</h4>
                      <div className="descuento-input">
                        <input
                          type="text"
                          placeholder="Código de descuento"
                          value={codigoDescuento}
                          onChange={(e) => setCodigoDescuento(e.target.value)}
                        />
                        <button 
                          className="btn btn-secondary"
                          onClick={aplicarDescuento}
                        >
                          Aplicar
                        </button>
                      </div>
                      <div className="codigos-ejemplo">
                        <small>Códigos disponibles: DESCUENTO10, PRIMERA20, ESTUDIANTE15</small>
                      </div>
                    </div>
                    
                    {/* Botón de checkout */}
                    <button 
                      className="btn btn-primary btn-large btn-checkout"
                      onClick={procederCheckout}
                    >
                      Proceder al pago
                    </button>
                    
                    {/* Botón continuar comprando */}
                    <button 
                      className="btn btn-outline btn-large"
                      onClick={() => navigate('/tienda')}
                    >
                      Continuar comprando
                    </button>
                  </div>
                  
                  {/* Información adicional */}
                  <div className="info-adicional">
                    <div className="info-item">
                      <div className="info-icon">🚚</div>
                      <div className="info-text">
                        <strong>Envío gratuito</strong>
                        <p>En pedidos superiores a $200</p>
                      </div>
                    </div>
                    
                    <div className="info-item">
                      <div className="info-icon">🔒</div>
                      <div className="info-text">
                        <strong>Pago seguro</strong>
                        <p>Transacciones protegidas</p>
                      </div>
                    </div>
                    
                    <div className="info-item">
                      <div className="info-icon">📞</div>
                      <div className="info-text">
                        <strong>Soporte 24/7</strong>
                        <p>Estamos aquí para ayudarte</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton 
        phoneNumber="573194283570" 
        message="Hola, necesito ayuda con mi carrito de compras" 
      />
    </div>
  );
};

export default Carrito;