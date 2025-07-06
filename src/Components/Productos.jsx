import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, selectProducts, selectProductsLoading, selectProductsError } from '../store/slices/productSlice';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/styles/Productos.css'; // Importar estilos específicos

function Productos() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  const navigate = useNavigate();
  
  const [randomProducts, setRandomProducts] = useState([]);
  
  // Número de productos a mostrar
  const PRODUCTS_TO_SHOW = 3;

  useEffect(() => {
    // Obtener productos del backend
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products && products.length > 0) {
      // Obtener productos aleatorios
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      setRandomProducts(shuffled.slice(0, Math.min(PRODUCTS_TO_SHOW, shuffled.length)));
    }
  }, [products]);

  useEffect(() => {
    // Cambiar productos mostrados cada 10 segundos (opcional)
    if (products && products.length > PRODUCTS_TO_SHOW) {
      const interval = setInterval(() => {
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        setRandomProducts(shuffled.slice(0, PRODUCTS_TO_SHOW));
      }, 10000); // 10 segundos

      return () => clearInterval(interval);
    }
  }, [products]);



  // Función para truncar texto
  const truncateText = (text, maxLength = 100) => {
    if (!text) return 'Sin descripción disponible';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Función para formatear precio
  const formatPrice = (price) => {
    if (!price || price === 0) return 'Consultar precio';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Función para obtener el nombre de la categoría
  const getCategoryName = (categoria) => {
    if (!categoria) return 'Sin categoría';
    return typeof categoria === 'object' ? categoria.nombre : categoria;
  };

  // Función para obtener el estado del stock
  const getStockStatus = (stock) => {
    if (stock === undefined || stock === null) return { text: 'Consultar', className: 'stock-unknown' };
    if (stock === 0) return { text: 'Agotado', className: 'stock-out' };
    if (stock <= 5) return { text: `${stock} disponibles`, className: 'stock-low' };
    return { text: `${stock} disponibles`, className: 'stock-available' };
  };

  if (loading) {
    return (
      <section className="features-section" id="productos">
        <div className="container">
          <div className="section-header">
            <h2>Algunos de Nuestros Productos</h2>
            <p>Descubre por qué nuestra tienda es la elección preferida por profesionales</p>
          </div>
          <div className="products-grid">
            {[1, 2, 3].map((item) => (
              <div key={item} className="product-card loading">
                <div className="product-image-container">
                  <div className="loading-skeleton image-skeleton"></div>
                </div>
                <div className="product-content">
                  <div className="loading-skeleton title-skeleton"></div>
                  <div className="loading-skeleton description-skeleton"></div>
                  <div className="loading-skeleton price-skeleton"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="features-section" id="productos">
        <div className="container">
          <div className="section-header">
            <h2>Algunos de Nuestros Productos</h2>
            <p>Descubre por qué nuestra tienda es la elección preferida por profesionales</p>
          </div>
          <div className="error-message">
            <div className="error-content">
              <h3>Error al cargar productos</h3>
              <p>{error}</p>
              <button onClick={() => dispatch(fetchProducts())} className="btn btn-secondary">
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="features-section" id="productos">
      <div className="container">
        <div className="section-header">
          <h2>Algunos de Nuestros Productos</h2>
          <p>Descubre por qué nuestra tienda es la elección preferida por profesionales</p>
        </div>

        <div className="products-grid">
          {randomProducts.length > 0 ? (
            randomProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              
              return (
                <div key={product.id || product._id} className="product-card">
                  {/* Imagen del producto */}
                  <div className="product-image-container">
                    <img 
                      src={product.imagen}
                      alt={product.nombre || 'Producto'}
                      className="producto-image"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.png';
                      }}
                    />
                    
                    {/* Badge de categoría */}
                    <div className="product-category-badge">
                      {getCategoryName(product.categoria)}
                    </div>
                    
                  </div>

                  {/* Contenido del producto */}
                  <div className="product-content">
                    <h3 className="product-title">
                      {product.nombre || 'Producto sin nombre'}
                    </h3>
                    
                    <p className="product-description">
                      {truncateText(product.descripcion)}
                    </p>
                    
                    {/* Precio */}
                    <div className="product-price">
                      {formatPrice(product.precio)}
                    </div>
                    
                    {/* Información adicional */}
                    <div className="product-meta">
                      {product.marca && (
                        <span className="product-brand">
                          Marca: {product.marca}
                        </span>
                      )}
                      {product.modelo && (
                        <span className="product-model">
                          Modelo: {product.modelo}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Acciones del producto */}
                  <div className="product-actions">
                    <Link 
                      to={`/producto/${product._id || product.id}`} 
                      className="btn btn-primary product-btn"
                    >
                      Ver Detalles
                    </Link>
                    
                    {product.stock > 0 && (
                      <button 
                        className="btn btn-secondary product-btn"
                        onClick={() => {
                          // Aquí puedes agregar la funcionalidad de agregar al carrito
                          console.log('Agregar al carrito:', product);
                        }}
                      >
                        Consultar
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            // Mensaje cuando no hay productos
            <div className="no-products-message">
              <h3>No hay productos disponibles</h3>
              <p>Estamos trabajando para agregar más productos a nuestro catálogo.</p>
            </div>
          )}
        </div>

        {/* Botón para ver más productos */}
        {products && products.length > PRODUCTS_TO_SHOW && (
          <div className="section-cta">
            <button 
              className="btn btn-outline btn-large"
              onClick={() => {
                navigate('/tienda');
              }}
            >
              Ver Todos los Productos ({products.length})
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Productos;