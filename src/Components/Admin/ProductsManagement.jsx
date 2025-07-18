import React, { useEffect, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  fetchProducts,
  deleteProduct,
  setSearchTerm,
  setSelectedCategory,
  setCurrentPage,
  setCurrentProduct,
  selectFilteredProducts,
  selectProductsLoading,
  selectProductsError,
  selectSearchTerm,
  selectSelectedCategory,
  selectCurrentPage,
  clearError,
} from '../../store/slices/productSlice';
import {
  fetchCategories,
  selectCategories,
} from '../../store/slices/categoriesSlice';
import "../../assets/styles/Admin/ProductsManagement.css";
import ProductModal from './ProductModal';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

const ProductsManagement = () => {
  const dispatch = useAppDispatch();
  
  // Selectores de Redux
  const filteredProducts = useAppSelector(selectFilteredProducts);
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);
  const searchTerm = useAppSelector(selectSearchTerm);
  const selectedCategory = useAppSelector(selectSelectedCategory);
  const currentPage = useAppSelector(selectCurrentPage);
  const categories = useAppSelector(selectCategories);

  // Estados locales para modales
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showViewModal, setShowViewModal] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Paginación calculada - MEMOIZADA para evitar re-renders
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, startIndex, itemsPerPage]);

  // Función auxiliar para obtener el nombre de la categoría de forma segura
  const getCategoryName = (categoria) => {
    if (!categoria) return 'Sin categoría';
    return typeof categoria === 'object' ? categoria.nombre : categoria;
  };

  // Función auxiliar para parsear características de forma segura
  const parseCharacteristics = (caracteristicas) => {
    if (!caracteristicas || !Array.isArray(caracteristicas)) return [];
    
    try {
      return caracteristicas.map(item => {
        if (typeof item === 'string') {
          // Intenta parsear el JSON anidado
          try {
            const parsed = JSON.parse(item);
            if (Array.isArray(parsed)) {
              return parsed.map(subItem => {
                if (typeof subItem === 'string') {
                  try {
                    const subParsed = JSON.parse(subItem);
                    return Array.isArray(subParsed) ? subParsed : [subParsed];
                  } catch {
                    return subItem;
                  }
                }
                return subItem;
              }).flat();
            }
            return parsed;
          } catch {
            return item;
          }
        }
        return item;
      }).flat();
    } catch (error) {
      console.warn('Error parsing characteristics:', error);
      return [];
    }
  };

  // Función para obtener la imagen principal o la primera imagen disponible
  const getMainImage = (product) => {
    if (!product) return '/placeholder-image.jpg';
    
    // Si tiene un array de imágenes, usar la primera
    if (product.imagenes && Array.isArray(product.imagenes) && product.imagenes.length > 0) {
      return product.imagenes[0];
    }
    
    // Si tiene una imagen única (retrocompatibilidad)
    if (product.imagen) {
      return product.imagen;
    }
    
    return '/placeholder-image.jpg';
  };

  // Función para obtener todas las imágenes del producto
  const getAllImages = (product) => {
    if (!product) return [];
    
    const images = [];
    
    // Si tiene un array de imágenes
    if (product.imagenes && Array.isArray(product.imagenes)) {
      images.push(...product.imagenes);
    }
    
    // Si tiene una imagen única (retrocompatibilidad)
    if (product.imagen && !images.includes(product.imagen)) {
      images.push(product.imagen);
    }
    
    return images.length > 0 ? images : ['/placeholder-image.jpg'];
  };

  // Handlers
  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleCategoryChange = (e) => {
    dispatch(setSelectedCategory(e.target.value));
  };

  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await dispatch(deleteProduct(productId)).unwrap();
        // Recargar productos después de eliminar
        dispatch(fetchProducts());
      } catch (error) {
        console.error('Error al eliminar producto:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
    setSelectedProduct(null);
    // Limpiar errores al cerrar modal
    dispatch(clearError());
    // Recargar productos cuando se cierra el modal de agregar/editar
    if (showAddModal || showEditModal) {
      dispatch(fetchProducts());
    }
  };

  // Mostrar mensaje de error si existe
  useEffect(() => {
    if (error) {
      console.error('Error:', error);
    }
  }, [error]);

  // Componente para mostrar múltiples imágenes en la tabla
  const ProductImagePreview = ({ product }) => {
    const images = getAllImages(product);
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

    if (images.length === 1) {
      return (
        <img 
          src={images[0]} 
          alt={product.nombre}
          className="product-image"
          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
        />
      );
    }

    return (
      <div className="product-image-carousel" style={{ position: 'relative', width: '50px', height: '50px' }}>
        <img 
          src={images[currentImageIndex]} 
          alt={`${product.nombre} - ${currentImageIndex + 1}`}
          className="product-image"
          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
        />
        {images.length > 1 && (
          <>
            <button
              className="image-nav-btn prev"
              onClick={() => setCurrentImageIndex((prev) => prev === 0 ? images.length - 1 : prev - 1)}
              style={{
                position: 'absolute',
                left: '2px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                color: 'white',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ChevronLeft size={10} />
            </button>
            <button
              className="image-nav-btn next"
              onClick={() => setCurrentImageIndex((prev) => prev === images.length - 1 ? 0 : prev + 1)}
              style={{
                position: 'absolute',
                right: '2px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                color: 'white',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ChevronRight size={10} />
            </button>
            <div 
              className="image-counter"
              style={{
                position: 'absolute',
                bottom: '2px',
                right: '2px',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                fontSize: '8px',
                padding: '1px 3px',
                borderRadius: '2px'
              }}
            >
              {currentImageIndex + 1}/{images.length}
            </div>
          </>
        )}
      </div>
    );
  };

  // Componente modal para ver detalles del producto con galería de imágenes
  const ProductViewModal = ({ isOpen, onClose, product }) => {
    const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

    if (!isOpen || !product) return null;

    const characteristics = parseCharacteristics(product.caracteristicas);
    const images = getAllImages(product);

    const nextImage = () => {
      setSelectedImageIndex((prev) => prev === images.length - 1 ? 0 : prev + 1);
    };

    const prevImage = () => {
      setSelectedImageIndex((prev) => prev === 0 ? images.length - 1 : prev - 1);
    };

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content product-view-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Detalles del Producto</h2>
            <button className="close-btn" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
          
          <div className="modal-body">
            <div className="product-details">
              {/* Galería de imágenes del producto */}
              <div className="product-image-gallery">
                <div className="main-image-container" style={{ position: 'relative', marginBottom: '16px' }}>
                  <img 
                    src={images[selectedImageIndex]} 
                    alt={`${product.nombre} - ${selectedImageIndex + 1}`}
                    className="product-detail-image"
                    style={{ 
                      width: '100%', 
                      maxWidth: '400px', 
                      height: '300px', 
                      objectFit: 'cover', 
                      borderRadius: '8px'
                    }}
                  />
                  
                  {images.length > 1 && (
                    <>
                      <button
                        className="gallery-nav-btn prev"
                        onClick={prevImage}
                        style={{
                          position: 'absolute',
                          left: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'rgba(0,0,0,0.7)',
                          border: 'none',
                          color: 'white',
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        className="gallery-nav-btn next"
                        onClick={nextImage}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'rgba(0,0,0,0.7)',
                          border: 'none',
                          color: 'white',
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <ChevronRight size={20} />
                      </button>
                      
                      <div 
                        className="image-counter-large"
                        style={{
                          position: 'absolute',
                          bottom: '10px',
                          right: '10px',
                          background: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          fontSize: '12px',
                          padding: '4px 8px',
                          borderRadius: '4px'
                        }}
                      >
                        {selectedImageIndex + 1} de {images.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Miniaturas de imágenes */}
                {images.length > 1 && (
                  <div className="image-thumbnails" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${product.nombre} miniatura ${index + 1}`}
                        className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                        onClick={() => setSelectedImageIndex(index)}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          border: index === selectedImageIndex ? '2px solid #2563eb' : '2px solid transparent',
                          opacity: index === selectedImageIndex ? 1 : 0.7
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Información básica */}
              <div className="product-info-section">
                <div className="info-row">
                  <span className="info-label">Nombre:</span>
                  <span className="info-value">{product.nombre}</span>
                </div>

                <div className="info-row">
                  <span className="info-label">Descripción:</span>
                  <span className="info-value">{product.descripcion}</span>
                </div>

                <div className="info-row">
                  <span className="info-label">Precio:</span>
                  <span className="info-value price">${product.precio?.toLocaleString()}</span>
                </div>

                <div className="info-row">
                  <span className="info-label">Stock:</span>
                  <span className={`info-value stock ${
                    product.cantidad > 20 ? 'high' : 
                    product.cantidad > 5 ? 'medium' : 'low'
                  }`}>
                    {product.cantidad} unidades
                  </span>
                </div>

                <div className="info-row">
                  <span className="info-label">Categoría:</span>
                  <span className="info-value">
                    {getCategoryName(product.categoria)}
                  </span>
                </div>

                <div className="info-row">
                  <span className="info-label">Imágenes:</span>
                  <span className="info-value">{images.length} imagen{images.length !== 1 ? 'es' : ''}</span>
                </div>

                {/* Características */}
                {characteristics.length > 0 && (
                  <div className="info-row">
                    <span className="info-label">Características:</span>
                    <div className="caracteristicas-list">
                      {characteristics.map((caracteristica, index) => (
                        <span key={index} className="caracteristica-tag">
                          {caracteristica}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button className="cancel-btn" onClick={onClose}>
              Cerrar
            </button>
            <button 
              className="edit-btn"
              onClick={() => {
                onClose();
                handleEditProduct(product);
              }}
            >
              Editar Producto
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="products-management">
      {/* Header */}
      <div className="products-header">
        <h1 className="products-title">Gestión de Productos</h1>
        <button 
          className="add-product-btn"
          onClick={() => setShowAddModal(true)}
          disabled={loading}
        >
          <Plus size={20} />
          Agregar Producto
        </button>
      </div>

      {/* Filtros */}
      <div className="products-filters">
        <div className="filters-row">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <select
            className="category-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="all">Todas las categorías</option>
            {categories?.map(category => (
              <option key={category._id} value={category._id}>
                {category.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="error-banner">
          <span>Error: {error}</span>
          <button onClick={() => dispatch(clearError())}>×</button>
        </div>
      )}

      {/* Tabla de productos */}
      <div className="products-table-container">
        {loading ? (
          <div className="loading-spinner">
            <div>Cargando productos...</div>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="empty-state">
            <h3>No se encontraron productos</h3>
            <p>Intenta ajustar los filtros o agregar nuevos productos</p>
          </div>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Imágenes</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map(product => {
                const images = getAllImages(product);
                return (
                  <tr key={product._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <ProductImagePreview product={product} />
                        <div className="product-info">
                          <h4 className="product-name">{product.nombre}</h4>
                          <span className="product-category">
                            {getCategoryName(product.categoria)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="product-price">${product.precio?.toLocaleString()}</span>
                    </td>
                    <td>
                      <span className={`stock-badge ${
                        product.cantidad > 20 ? 'stock-high' : 
                        product.cantidad > 5 ? 'stock-medium' : 'stock-low'
                      }`}>
                        {product.cantidad} unidades
                      </span>
                    </td>
                    <td>
                      <span className="images-count">
                        {images.length} imagen{images.length !== 1 ? 'es' : ''}
                      </span>
                    </td>
                    
                    <td>
                      <div className="actions-container" style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="action-btn view-btn" 
                          title="Ver detalles"
                          onClick={() => handleViewProduct(product)}
                          disabled={loading}
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="action-btn edit-btn" 
                          title="Editar"
                          onClick={() => handleEditProduct(product)}
                          disabled={loading}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="action-btn delete-btn" 
                          title="Eliminar"
                          onClick={() => handleDeleteProduct(product._id)}
                          disabled={loading}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn"
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1 || loading}
          >
            Anterior
          </button>
          <span className="pagination-info">
            Página {currentPage} de {totalPages}
          </span>
          <button 
            className="pagination-btn"
            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages || loading}
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Modal para agregar producto */}
      <ProductModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        categories={categories}
      />

      {/* Modal para editar producto */}
      <ProductModal
        isOpen={showEditModal}
        onClose={handleCloseModal}
        product={selectedProduct}
        categories={categories}
      />

      {/* Modal para ver detalles del producto */}
      <ProductViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default ProductsManagement;

