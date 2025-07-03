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
import WhatsAppButton from '../Components/WhatsappButton';
import Footer from '../Components/Footer';

const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const producto = useSelector(selectCurrentProduct);
  const cargando = useSelector(selectProductsLoading);
  const [cantidad, setCantidad] = useState(1);

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
    alert(`${producto.nombre} agregado al carrito`);
  };

  const irAlCarrito = () => {
    agregarAlCarrito();
    navigate('/carrito');
  };

  if (cargando || !producto) {
    return (
      <div className="producto-detalle-page">
        <Navbar />
        <div className="cargando-detalle"><p>Cargando producto...</p></div>
      </div>
    );
  }

  return (
    <div className="producto-detalle-page">
      <Navbar />
      <section className="breadcrumb">
        <div className="container">
          <nav>
            <span onClick={() => navigate('/')} className="breadcrumb-link">Inicio</span>
            <span className="breadcrumb-separator">{">"}</span>
            <span onClick={() => navigate('/tienda')} className="breadcrumb-link">Tienda</span>
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
                      e.target.src = '/placeholder-image.jpg'; // Imagen de respaldo
                    }}
                  />
                ) : (
                  <div className="imagen-placeholder">
                    <p>Sin imagen disponible</p>
                  </div>
                )}
              </div>
            </div>
            <div className="producto-info-detalle">
              <h1>{producto.nombre}</h1>
              <div className="producto-categoria">
                <span className="categoria-badge">{producto.categoria?.nombre || 'Sin categoría'}</span>
              </div>
              <div className="producto-precio-detalle">
                <span className="precio-actual">${producto.precio}</span>
              </div>
              <div className="producto-descripcion">
                <p>{producto.descripcion}</p>
              </div>

              <div className="cantidad-control">
                <label>Cantidad:</label>
                <div className="cantidad-selector">
                  <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} className="cantidad-btn">-</button>
                  <span className="cantidad-display">{cantidad}</span>
                  <button onClick={() => setCantidad(cantidad + 1)} className="cantidad-btn">+</button>
                </div>
              </div>

              <div className="producto-acciones-detalle">
                <button className="btn btn-primary btn-large" onClick={agregarAlCarrito}>Agregar al carrito</button>
                <button className="btn btn-secondary btn-large" onClick={irAlCarrito}>Comprar ahora</button>
              </div>
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