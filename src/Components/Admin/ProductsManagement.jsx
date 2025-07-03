import React, { useEffect, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, Eye, X } from 'lucide-react';
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

  // Paginación calculada
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, startIndex, itemsPerPage]);

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

  // Componente modal para ver detalles del producto
  const ProductViewModal = ({ isOpen, onClose, product }) => {
    if (!isOpen || !product) return null;

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
              {/* Imagen del producto */}
              <div className="product-image-section">
                <img 
                  src={product.imagen} 
                  alt={product.nombre}
                  className="product-detail-image"
                  style={{ 
                    width: '100%', 
                    maxWidth: '300px', 
                    height: '250px', 
                    objectFit: 'cover', 
                    borderRadius: '8px',
                    marginBottom: '20px'
                  }}
                />
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
                  <span className="info-value price">${product.precio}</span>
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
                    {typeof product.categoria === 'object' ? product.categoria.nombre : product.categoria}
                  </span>
                </div>

                {/* Características */}
                {product.caracteristicas && product.caracteristicas.length > 0 && (
                  <div className="info-row">
                    <span className="info-label">Características:</span>
                    <div className="caracteristicas-list">
                      {product.caracteristicas.map((caracteristica, index) => (
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
            {categories.map(category => (
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
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map(product => (
                <tr key={product._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img 
                        src={product.imagen} 
                        alt={product.nombre}
                        className="product-image"
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                      <div className="product-info">
                        <h4 className="product-name">{product.nombre}</h4>
                        <span className="product-category">
                          {typeof product.categoria === 'object' ? product.categoria.nombre : product.categoria}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="product-price">${product.precio}</span>
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
              ))}
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