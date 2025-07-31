import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProductById,
  selectCurrentProduct,
  selectProductsLoading
} from '../store/slices/productSlice';
import '../assets/styles/ProductoDetalle.css';
import Navbar from '../Components/Navbar';
import WhatsAppButton from '../Components/WhatsAppButton';
import Footer from '../Components/Footer';

const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const producto = useSelector(selectCurrentProduct);
  const cargando = useSelector(selectProductsLoading);
  const [cantidad, setCantidad] = useState(1);
  const [tabActiva, setTabActiva] = useState('descripcion');
  const [imagenPrincipal, setImagenPrincipal] = useState(0);
  const [mostrarModalImagen, setMostrarModalImagen] = useState(false);
  const [imagenModal, setImagenModal] = useState(0);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  // Reset imagen principal cuando cambie el producto
  useEffect(() => {
    if (producto && producto.imagenes && producto.imagenes.length > 0) {
      setImagenPrincipal(0);
      setImagenModal(0);
    }
  }, [producto]);

  // Manejo de navegación con teclado en el modal
  useEffect(() => {
    const manejarTecla = (e) => {
      if (!mostrarModalImagen) return;
      
      switch(e.key) {
        case 'Escape':
          cerrarModalImagen();
          break;
        case 'ArrowLeft':
          navegarModalImagen('prev');
          break;
        case 'ArrowRight':
          navegarModalImagen('next');
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', manejarTecla);
    return () => document.removeEventListener('keydown', manejarTecla);
  }, [mostrarModalImagen, imagenModal, producto]);

  const agregarAlCarrito = () => {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    const existente = carrito.find(item => item._id === producto._id);

    if (existente) {
      existente.cantidad += cantidad;
    } else {
      carrito.push({
        _id: producto._id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes[0] : null,
        cantidad
      });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Notificación moderna
    mostrarNotificacion(`✅ ${producto.nombre} agregado al carrito`);
  };

  const mostrarNotificacion = (mensaje) => {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      color: white;
      padding: 15px 25px;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      z-index: 10000;
      font-weight: 600;
      animation: slideIn 0.5s ease-out;
      max-width: 300px;
    `;
    notification.innerHTML = mensaje;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const irAlCarrito = () => {
    agregarAlCarrito();
    setTimeout(() => navigate('/carrito'), 500);
  };

  const compartirProducto = async () => {
    const url = window.location.href;
    const texto = `¡Mira este producto! ${producto.nombre} - $${producto.precio?.toLocaleString()}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: producto.nombre,
          text: texto,
          url: url,
        });
      } catch (error) {
        console.log('Error al compartir:', error);
      }
    } else {
      // Fallback para navegadores que no soportan Web Share API
      try {
        await navigator.clipboard.writeText(`${texto} ${url}`);
        mostrarNotificacion('📋 Enlace copiado al portapapeles');
      } catch (error) {
        console.log('Error al copiar:', error);
        mostrarNotificacion('❌ Error al copiar enlace');
      }
    }
  };

  const cambiarImagenPrincipal = (indice) => {
    setImagenPrincipal(indice);
  };

  const navegarImagen = (direccion) => {
    if (!producto.imagenes || producto.imagenes.length <= 1) return;
    
    if (direccion === 'next') {
      setImagenPrincipal((prev) => 
        prev === producto.imagenes.length - 1 ? 0 : prev + 1
      );
    } else {
      setImagenPrincipal((prev) => 
        prev === 0 ? producto.imagenes.length - 1 : prev - 1
      );
    }
  };

  const abrirModalImagen = (indice = imagenPrincipal) => {
    setImagenModal(indice);
    setMostrarModalImagen(true);
    document.body.style.overflow = 'hidden'; // Prevenir scroll
  };

  const cerrarModalImagen = () => {
    setMostrarModalImagen(false);
    document.body.style.overflow = 'auto';
  };

  const navegarModalImagen = (direccion) => {
    if (!producto.imagenes || producto.imagenes.length <= 1) return;
    
    if (direccion === 'next') {
      setImagenModal((prev) => 
        prev === producto.imagenes.length - 1 ? 0 : prev + 1
      );
    } else {
      setImagenModal((prev) => 
        prev === 0 ? producto.imagenes.length - 1 : prev - 1
      );
    }
  };

  if (cargando) {
    return (
      <div className="producto-detalle-page">
        <Navbar />
        <div className="cargando-detalle">
          <div className="spinner-container">
            <div className="spinner"></div>
            <p>Cargando producto...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="producto-detalle-page">
        <Navbar />
        <div className="producto-no-encontrado">
          <h2>Producto no encontrado</h2>
          <p>Lo sentimos, el producto que buscas no existe o ha sido eliminado.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/tienda')}
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  const imagenes = producto.imagenes || [];
  const tieneImagenes = imagenes.length > 0;

  return (
    <div className="producto-detalle-page">
      <Navbar />
      
      <section className="breadcrumb">
        <div className="container">
          <nav>
            <span onClick={() => navigate('/')} className="breadcrumb-link">
              🏠 Inicio
            </span>
            <span className="breadcrumb-separator">{">"}</span>
            <span onClick={() => navigate('/tienda')} className="breadcrumb-link">
              🛍️ Tienda
            </span>
            <span className="breadcrumb-separator">{">"}</span>
            <span className="breadcrumb-current">{producto.nombre}</span>
          </nav>
        </div>
      </section>

      <section className="producto-detalle-main">
        <div className="container">
          <div className="producto-detalle-grid">
            
            {/* GALERÍA DE IMÁGENES */}
            <div className="producto-galeria">
              {tieneImagenes ? (
                <>
                  {/* Imagen principal */}
                  <div className="imagen-principal-container">
                    <div className="imagen-principal" onClick={() => abrirModalImagen(imagenPrincipal)}>
                      <img 
                        src={imagenes[imagenPrincipal]} 
                        alt={`${producto.nombre} - Imagen ${imagenPrincipal + 1}`}
                        onError={(e) => {
                          console.error('Error cargando imagen:', e);
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="imagen-placeholder" style={{ display: 'none' }}>
                        <div>
                          <p>📦</p>
                          <p>Error al cargar imagen</p>
                        </div>
                      </div>
                      
                      {/* Botón de zoom */}
                      <div className="zoom-btn">
                        <span>🔍</span>
                      </div>
                      
                    </div>
                    
                    {/* Controles de navegación */}
                    {imagenes.length > 1 && (
                      <>
                        <button 
                          className="nav-btn nav-btn-prev" 
                          onClick={() => navegarImagen('prev')}
                          aria-label="Imagen anterior"
                        >
                          ‹
                        </button>
                        <button 
                          className="nav-btn nav-btn-next" 
                          onClick={() => navegarImagen('next')}
                          aria-label="Siguiente imagen"
                        >
                          ›
                        </button>
                      </>
                    )}
                  </div>

                  {/* Miniaturas */}
                  {imagenes.length > 1 && (
                    <div className="imagenes-miniatura">
                      {imagenes.map((imagen, indice) => (
                        <div
                          key={indice}
                          className={`miniatura ${indice === imagenPrincipal ? 'activa' : ''}`}
                          onClick={() => cambiarImagenPrincipal(indice)}
                        >
                          <img 
                            src={imagen} 
                            alt={`${producto.nombre} - Miniatura ${indice + 1}`}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="miniatura-placeholder" style={{ display: 'none' }}>
                            <span>📷</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="imagen-principal-container">
                  <div className="imagen-placeholder-principal">
                    <div>
                      <p>📦</p>
                      <p>Sin imágenes disponibles</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* INFORMACIÓN DEL PRODUCTO */}
            <div className="producto-info-detalle">
              <h1>{producto.nombre}</h1>
              
              <div className="producto-categoria">
                <span className="categoria-badge">
                  {producto.categoria?.nombre || 'Sin categoría'}
                </span>
              </div>

              <div className="producto-precio-detalle">
                <span className="precio-actual">{producto.precio?.toLocaleString()}</span>
              </div>

              <div className="producto-descripcion">
                <p>{producto.descripcion || 'Sin descripción disponible'}</p>
              </div>

              <div className="cantidad-control">
                <label>Cantidad:</label>
                <div className="cantidad-selector">
                  <button 
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))} 
                    className="cantidad-btn"
                    disabled={cantidad <= 1}
                  >
                    -
                  </button>
                  <span className="cantidad-display">{cantidad}</span>
                  <button 
                    onClick={() => setCantidad(cantidad + 1)} 
                    className="cantidad-btn"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="producto-acciones-detalle">
                <button 
                  className="btn btn-primary btn-large" 
                  onClick={agregarAlCarrito}
                >
                  Agregar al carrito
                </button>
                <button 
                  className="btn btn-success btn-large" 
                  onClick={irAlCarrito}
                >
                  Comprar Ahora
                </button>
              </div>

              <div className="producto-acciones-detalle">
                <button 
                  className="btn btn-secondary btn-large" 
                  onClick={compartirProducto}
                  style={{
                    background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  📤 Compartir
                </button>
              </div>
            </div>
          </div>

          {/* TABS DE INFORMACIÓN ADICIONAL */}
          <div className="producto-tabs">
            <div className="tabs-nav">
              <button 
                className={`tab-btn ${tabActiva === 'descripcion' ? 'active' : ''}`}
                onClick={() => setTabActiva('descripcion')}
              >
                📝 Descripción
              </button>{/*}
              <button 
                className={`tab-btn ${tabActiva === 'especificaciones' ? 'active' : ''}`}
                onClick={() => setTabActiva('especificaciones')}
              >
                ⚙️ Especificaciones
              </button>*/}
           
            </div>

            <div className={`tab-content ${tabActiva === 'descripcion' ? 'active' : ''}`}>
              <h3>Descripción del Producto</h3>
              <p>{producto.descripcion || 'Descripción detallada del producto no disponible.'}</p>
              <ul>
                <li>Producto de alta calidad</li>
                <li>Diseño moderno y funcional</li>
                <li>Fácil instalación y uso</li>
                <li>Materiales duraderos</li>
              </ul>
            </div>

            <div className={`tab-content ${tabActiva === 'especificaciones' ? 'active' : ''}`}>
              <h3>Especificaciones Técnicas</h3>
              <div className="requisitos-grid">
                <div className="requisito-item">
                  <strong>Categoría:</strong>
                  <span>{producto.categoria?.nombre || 'No especificada'}</span>
                </div>
                <div className="requisito-item">
                  <strong>Código:</strong>
                  <span>{producto._id}</span>
                </div>
                <div className="requisito-item">
                  <strong>Precio:</strong>
                  <span>${producto.precio?.toLocaleString()}</span>
                </div>
                <div className="requisito-item">
                  <strong>Disponibilidad:</strong>
                  <span>En stock</span>
                </div>
                <div className="requisito-item">
                  <strong>Imágenes:</strong>
                  <span>{imagenes.length} foto{imagenes.length !== 1 ? 's' : ''}</span>
                </div>

                <div className="requisito-item">
                  <strong>Vídeo:</strong>
                  <span>{producto.caracteristicas}</span>
                </div>
              </div>
              
            </div>

            <div className={`tab-content ${tabActiva === 'garantia' ? 'active' : ''}`}>
              <h3>Revisa Video ...</h3>
              <ul>
                <li>{producto.caracteristicas}</li>
                
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL DE IMAGEN */}
      {mostrarModalImagen && (
        <div className="modal-imagen-overlay" onClick={cerrarModalImagen}>
          <div className="modal-imagen-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarModalImagen}>
              ✕
            </button>
            
            <div className="modal-imagen-content">
              <img 
                src={imagenes[imagenModal]} 
                alt={`${producto.nombre} - Imagen ${imagenModal + 1}`}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="modal-imagen-placeholder" style={{ display: 'none' }}>
                <div>
                  <p>📦</p>
                  <p>Error al cargar imagen</p>
                </div>
              </div>
            </div>
            
            {imagenes.length > 1 && (
              <>
                <button 
                  className="modal-nav-btn modal-nav-prev" 
                  onClick={() => navegarModalImagen('prev')}
                  aria-label="Imagen anterior"
                >
                  ‹
                </button>
                <button 
                  className="modal-nav-btn modal-nav-next" 
                  onClick={() => navegarModalImagen('next')}
                  aria-label="Siguiente imagen"
                >
                  ›
                </button>
                
                <div className="modal-contador">
                  <span>{imagenModal + 1} / {imagenes.length}</span>
                </div>
              </>
            )}
            
            {/* Miniaturas en el modal */}
            {imagenes.length > 1 && (
              <div className="modal-miniaturas">
                {imagenes.map((imagen, indice) => (
                  <div
                    key={indice}
                    className={`modal-miniatura ${indice === imagenModal ? 'activa' : ''}`}
                    onClick={() => setImagenModal(indice)}
                  >
                    <img 
                      src={imagen} 
                      alt={`Miniatura ${indice + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
      <WhatsAppButton
        phoneNumber="573194283570"
        message={`Hola, estoy interesado en ${producto.nombre}`}
      />
    </div>
  );
};

export default ProductoDetalle;