import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

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
        imagen: producto.imagen,
        cantidad
      });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Notificación moderna
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
    `;
    notification.innerHTML = `✅ ${producto.nombre} agregado al carrito`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const irAlCarrito = () => {
    agregarAlCarrito();
    setTimeout(() => navigate('/carrito'), 500);
  };

  const compartirProducto = () => {
    const url = window.location.href;
    const texto = `¡Mira este producto! ${producto.nombre} - $${producto.precio}`;
    
    if (navigator.share) {
      navigator.share({
        title: producto.nombre,
        text: texto,
        url: url,
      });
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(`${texto} ${url}`);
      alert('Enlace copiado al portapapeles');
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
            <div className="producto-galeria">
              <div className="imagen-principal">
                {producto.imagen ? (
                  <img 
                    src={producto.imagen} 
                    alt={producto.nombre}
                    onError={(e) => {
                      console.error('Error cargando imagen:', e);
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="imagen-placeholder" style={{ display: producto.imagen ? 'none' : 'flex' }}>
                  <div>
                    <p>📦</p>
                    <p>Sin imagen disponible</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="producto-info-detalle">
              <h1>{producto.nombre}</h1>
              
              <div className="producto-categoria">
                <span className="categoria-badge">
                  {producto.categoria?.nombre || 'Sin categoría'}
                </span>
              </div>

              <div className="producto-precio-detalle">
                <span className="precio-actual">${producto.precio?.toLocaleString()}</span>
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

          {/* Tabs de información adicional */}
          <div className="producto-tabs">
            <div className="tabs-nav">
              <button 
                className={`tab-btn ${tabActiva === 'descripcion' ? 'active' : ''}`}
                onClick={() => setTabActiva('descripcion')}
              >
                📝 Descripción
              </button>
              <button 
                className={`tab-btn ${tabActiva === 'especificaciones' ? 'active' : ''}`}
                onClick={() => setTabActiva('especificaciones')}
              >
                ⚙️ Especificaciones
              </button>
              <button 
                className={`tab-btn ${tabActiva === 'garantia' ? 'active' : ''}`}
                onClick={() => setTabActiva('garantia')}
              >
                🛡️ Garantía
              </button>
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
              </div>
            </div>

            <div className={`tab-content ${tabActiva === 'garantia' ? 'active' : ''}`}>
              <h3>Garantía y Servicio</h3>
              <ul>
                <li>Garantía de 12 meses contra defectos de fabricación</li>
                <li>Servicio técnico especializado</li>
                <li>Soporte telefónico y por chat</li>
                <li>Cambios y devoluciones dentro de los 30 días</li>
                <li>Envío gratuito en compras superiores a $100.000</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton
        phoneNumber="573194283570"
        message={`Hola, estoy interesado en ${producto.nombre}`}
      />
    </div>
  );
};

export default ProductoDetalle;