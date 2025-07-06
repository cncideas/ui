import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/Carrito.css';
import Navbar from '../Components/Navbar';
import WhatsAppButton from '../Components/WhatsAppButton';
import Footer from '../Components/Footer';

const Carrito = () => {
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [codigoDescuento, setCodigoDescuento] = useState('');
  const [descuentoAplicado, setDescuentoAplicado] = useState(null);
  const [animacionEliminacion, setAnimacionEliminacion] = useState(null);

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

  // Función para determinar si un producto es de planos
  const esProductoPlano = (producto) => {
    return producto.categoria && 
           (producto.categoria.toLowerCase().includes('plano') ||
            producto.categoria.toLowerCase().includes('pdf') ||
            producto.categoria.toLowerCase().includes('cnc') ||
            producto.categoria.toLowerCase().includes('diseño') ||
            producto.categoria.toLowerCase().includes('blueprint') ||
            producto.categoria.toLowerCase().includes('template'));
  };

  // Función para obtener la imagen del producto
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

  // Actualizar cantidad de un producto con animación
  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      eliminarProducto(id);
      return;
    }
    
    const carritoActualizado = carrito.map(item => 
      item.id === id ? { ...item, cantidad: nuevaCantidad } : item
    );
    
    setCarrito(carritoActualizado);
    
    // Pequeña animación de feedback
    const elemento = document.querySelector(`[data-product-id="${id}"]`);
    if (elemento) {
      elemento.classList.add('cantidad-actualizada');
      setTimeout(() => {
        elemento.classList.remove('cantidad-actualizada');
      }, 300);
    }
  };

  // Eliminar producto del carrito con animación
  const eliminarProducto = (id) => {
    setAnimacionEliminacion(id);
    
    setTimeout(() => {
      const carritoActualizado = carrito.filter(item => item.id !== id);
      setCarrito(carritoActualizado);
      setAnimacionEliminacion(null);
    }, 300);
  };

  // Limpiar carrito completo con confirmación
  const limpiarCarrito = () => {
    const confirmacion = window.confirm('¿Estás seguro de que quieres limpiar el carrito?');
    if (confirmacion) {
      setCarrito([]);
      setDescuentoAplicado(null);
    }
  };

  // Aplicar código de descuento mejorado
  const aplicarDescuento = () => {
    const codigosValidos = {
      'DESCUENTO10': { porcentaje: 0.10, descripcion: '10% de descuento' },
      'PRIMERA20': { porcentaje: 0.20, descripcion: '20% primera compra' },
      'ESTUDIANTE15': { porcentaje: 0.15, descripcion: '15% estudiantes' },
      'PLANOS5': { porcentaje: 0.05, descripcion: '5% en planos' },
      'VERANO25': { porcentaje: 0.25, descripcion: '25% promoción verano' },
      'ARQUITECTO30': { porcentaje: 0.30, descripcion: '30% profesionales' }
    };

    const codigoUpper = codigoDescuento.toUpperCase();
    
    if (codigosValidos[codigoUpper]) {
      setDescuentoAplicado({
        codigo: codigoUpper,
        porcentaje: codigosValidos[codigoUpper].porcentaje,
        descripcion: codigosValidos[codigoUpper].descripcion
      });
      setCodigoDescuento('');
      
      // Mostrar mensaje de éxito
      const mensaje = document.createElement('div');
      mensaje.className = 'descuento-aplicado-mensaje';
      mensaje.textContent = `¡Descuento aplicado! ${codigosValidos[codigoUpper].descripcion}`;
      document.body.appendChild(mensaje);
      
      setTimeout(() => {
        document.body.removeChild(mensaje);
      }, 3000);
    } else {
      // Mostrar mensaje de error mejorado
      const mensaje = document.createElement('div');
      mensaje.className = 'descuento-error-mensaje';
      mensaje.textContent = 'Código de descuento no válido';
      document.body.appendChild(mensaje);
      
      setTimeout(() => {
        document.body.removeChild(mensaje);
      }, 3000);
    }
  };

  // Remover descuento
  const removerDescuento = () => {
    setDescuentoAplicado(null);
  };

  // Calcular totales
  const subtotal = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  const descuento = descuentoAplicado ? subtotal * descuentoAplicado.porcentaje : 0;
  const envio = subtotal > 200 ? 0 : 15; // Envío gratis para pedidos > $200
  const total = subtotal - descuento + envio;

  // Proceder al checkout mejorado
  const procederCheckout = () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    
    // Crear resumen del pedido
    const pedido = {
      productos: carrito,
      subtotal,
      descuento,
      envio,
      total,
      fecha: new Date().toISOString(),
      descuentoAplicado: descuentoAplicado
    };
    
    // Guardar pedido en localStorage para procesamiento
    localStorage.setItem('ultimoPedido', JSON.stringify(pedido));
    
    console.log('Procesando pedido:', pedido);
    
    // Simular procesamiento
    setCargando(true);
    setTimeout(() => {
      setCargando(false);
      
      
      navigate('/checkout'); // Redirigir a inicio
    }, 2000);
  };

  // Función para formatear precio
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  if (cargando) {
    return (
      <div className="carrito-page">
        <Navbar />
        <div className="cargando-carrito">
          <div className="spinner"></div>
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
          <p>Revisa y confirma tu pedido antes de proceder al pago</p>
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
                <div className="carrito-vacio-acciones">
                  <button 
                    className="btn btn-primary btn-large"
                    onClick={() => navigate('/tienda')}
                  >
                    Explorar tienda
                  </button>
                  <button 
                    className="btn btn-outline btn-large"
                    onClick={() => navigate('/planos')}
                  >
                    Ver planos
                  </button>
                </div>
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
                      <div 
                        key={producto.id} 
                        className={`producto-carrito ${animacionEliminacion === producto.id ? 'eliminando' : ''}`}
                        data-product-id={producto.id}
                      >
                        <div className={`producto-imagen ${esProductoPlano(producto) ? 'pdf-icon' : ''}`}>
                          {esProductoPlano(producto) ? (
                            <div className="pdf-icon-container">
                              <span className="pdf-icon-symbol">📄</span>
                              <span className="pdf-text">PDF</span>
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
                          {!esProductoPlano(producto) && (
                            <div className="imagen-placeholder" style={{display: 'none'}}>
                              <span>📦</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="producto-info">
                          <h3>{producto.nombre}</h3>
                          <div className="producto-detalles">
                            <p className="producto-precio">{formatearPrecio(producto.precio)}</p>
                            <p className="producto-categoria">
                              {obtenerIconoProducto(producto)} {producto.categoria || 'Producto'}
                            </p>
                            {esProductoPlano(producto) && (
                              <div className="producto-badge">
                                <span className="badge-digital">Digital</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="producto-cantidad">
                          <button 
                            className="cantidad-btn"
                            onClick={() => actualizarCantidad(producto.id, producto.cantidad - 1)}
                            disabled={producto.cantidad <= 1}
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
                          {formatearPrecio(producto.precio * producto.cantidad)}
                        </div>
                        
                        <button 
                          className="btn-eliminar"
                          onClick={() => eliminarProducto(producto.id)}
                          title="Eliminar producto"
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
                      <span style={{color:"blue"}}>Subtotal:</span>
                      <span style={{color:"blue"}}>{formatearPrecio(subtotal)}</span>
                    </div>
                    
                    <div className="resumen-linea">
                      <span style={{color:"blue"}}>Envío:</span>
                      <span style={{color:"blue"}}>{envio === 0 ? 'Sujeto a operador' : formatearPrecio(envio)}</span>
                    </div>
                    
                   
                    
                    <div className="resumen-linea total">
                      <span>Total:</span>
                      <span>{formatearPrecio(total)}</span>
                    </div>
                    
                    {/* Botón de checkout */}
                    <button style={{marginTop:"10px"}}
                      className="btn btn-primary btn-large btn-checkout"
                      onClick={procederCheckout}
                      disabled={carrito.length === 0}
                    >
                      Proceder al pago
                    </button>
                    
                    {/* Botón continuar comprando */}
                    <button style={{padding:"23px"}}
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
                        <p>En pedidos superiores a {formatearPrecio(200)}</p>
                      </div>
                    </div>
                    
                    <div className="info-item">
                      <div className="info-icon">🔒</div>
                      <div className="info-text">
                        <strong>Pago seguro</strong>
                        <p>Transacciones 100% protegidas</p>
                      </div>
                    </div>
                    
                    <div className="info-item">
                      <div className="info-icon">📱</div>
                      <div className="info-text">
                        <strong>Soporte 24/7</strong>
                        <p>Contáctanos por WhatsApp</p>
                      </div>
                    </div>
                    
                    <div className="info-item">
                      <div className="info-icon">⚡</div>
                      <div className="info-text">
                        <strong>Descarga inmediata</strong>
                        <p>Productos digitales al instante</p>
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

/* Estilos adicionales que debes agregar al final de tu Carrito.css */

