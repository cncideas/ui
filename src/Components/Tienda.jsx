import React, { useEffect } from 'react';
import '../assets/styles/Tienda.css';
import Navbar from '../Components/Navbar';
import WhatsAppButton from '../Components/WhatsappButton';
import Footer from '../Components/Footer';
import { Link } from 'react-router-dom';

// Redux Toolkit
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  selectFilteredProducts,
  selectProductsLoading,
  setSelectedCategory,
  selectSelectedCategory
} from '../store/slices/productSlice';

import {
  fetchCategories,
  selectCategories
} from '../store/slices/categoriesSlice';

const Tienda = () => {
  const dispatch = useDispatch();

  // Selectores
  const productos = useSelector(selectFilteredProducts);
  const categorias = useSelector(selectCategories);
  const cargando = useSelector(selectProductsLoading);
  const categoriaSeleccionada = useSelector(selectSelectedCategory);

  // Fetch productos y categorías al cargar
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Cambio de categoría
  const cambiarCategoria = (categoria) => {
    dispatch(setSelectedCategory(categoria === 'todas' ? 'all' : categoria));
  };

  return (
    <div className="tienda-page">
      <Navbar />

      <section className="tienda-hero">
        <div className="container">
          <h1>Nuestra Tienda</h1>
          <p>Descubre  productos CNC ... siempre a los mejores precios!!!</p>
        </div>
      </section>

      <section className="tienda-main">
        <div className="container">
          {/* Filtros de categoría */}
          <div className="categorias-filtro">
            <h3>Categorías</h3>
            <div className="categorias-botones">
              <button
                className={`categoria-btn ${categoriaSeleccionada === 'all' ? 'active' : ''}`}
                onClick={() => cambiarCategoria('todas')}
              >
                Todas
              </button>
              {categorias.map((categoria) => (
                <button
                  key={categoria._id}
                  className={`categoria-btn ${categoriaSeleccionada === categoria._id ? 'active' : ''}`}
                  onClick={() => cambiarCategoria(categoria._id)}
                >
                  {categoria.nombre}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de productos */}
          <div className="productos-grid">
            {cargando ? (
              <div className="cargando-productos">
                <p>Cargando productos...</p>
              </div>
            ) : productos.length > 0 ? (
              productos.map((producto) => (
                <div className="producto-card" key={producto.id || producto._id}>
                  <div className="producto-imagen">
                    <img src={producto.imagen} alt={producto.nombre} />
                  </div>
                  <div className="producto-info">
                    <h3>{producto.nombre}</h3>
                    <p>{producto.descripcion}</p>
                    <div className="producto-precio">${producto.precio}</div>
                    <div className="producto-acciones">
                      
                      <Link to={`/producto/${producto._id || producto.id}`} className="btn btn-secondary">
                        Ver detalles
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-productos">
                <p>No se encontraron productos en esta categoría.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="tienda-cta">
        <div className="container">
          <div className="cta-content">
            <h2>¿Necesitas un producto y no lo ves?</h2>
            <p>Nuestro equipo está listo para ayudarte a encontrar la combinación perfecta para tus necesidades</p>
            <button className="btn btn-primary btn-large">Contactar a un asesor</button>
          </div>
        </div>
      </section>

      <Footer />

      <WhatsAppButton
        phoneNumber="573194283570"
        message="Hola, estoy interesado en un producto de la tienda"
      />
    </div>
  );
};

export default Tienda;
