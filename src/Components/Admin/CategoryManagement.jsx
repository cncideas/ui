import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  clearError,
} from '../../store/slices/categoriesSlice';
import "../../assets/styles/Admin/CategoriesManagement.css";

const CategoriesManagement = () => {
  const dispatch = useAppDispatch();
  
  // Selectores de Redux
  const categories = useAppSelector((state) => state.categories.items);
  const loading = useAppSelector((state) => state.categories.loading);
  const creating = useAppSelector((state) => state.categories.creating);
  const updating = useAppSelector((state) => state.categories.updating);
  const deleting = useAppSelector((state) => state.categories.deleting);
  const error = useAppSelector((state) => state.categories.error);

  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Estados para el formulario - Separados del modal para evitar titilación
  const [formData, setFormData] = useState({
    nombre: ''
  });

  // Efecto para cargar datos iniciales
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

 // Filtrado y paginación
const filteredCategories = useMemo(() => {
  return categories.filter(category => 
    // Verificar que category existe y tiene la propiedad nombre
    category && 
    category.nombre && 
    typeof category.nombre === 'string' &&
    category.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [categories, searchTerm]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = useMemo(() => {
    return filteredCategories.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCategories, startIndex, itemsPerPage]);

  // Handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleAddCategory = () => {
    setFormData({ nombre: '' });
    setSelectedCategory(null);
    setShowAddModal(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setFormData({ nombre: category.nombre });
    setShowEditModal(true);
  };

  const handleViewCategory = (category) => {
    setSelectedCategory(category);
    setShowViewModal(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      try {
        await dispatch(deleteCategory(categoryId)).unwrap();
        // Solo recargar si la eliminación fue exitosa
        dispatch(fetchCategories());
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
      }
    }
  };

  // Cerrar modales y limpiar estados
  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
    setSelectedCategory(null);
    setFormData({ nombre: '' });
    dispatch(clearError());
  };

  // Mostrar mensaje de error si existe
  useEffect(() => {
    if (error) {
      console.error('Error:', error);
    }
  }, [error]);

  const isLoading = loading || creating || updating || deleting;

  // Componente modal para formulario - Optimizado para evitar re-renders
  const CategoryFormModal = ({ isOpen, onClose, title, isEditing }) => {
    // Estados locales del modal para evitar titilación
    const [localFormData, setLocalFormData] = useState({ nombre: '' });

    // Inicializar datos del modal cuando se abre
    useEffect(() => {
      if (isOpen) {
        setLocalFormData(formData);
      }
    }, [isOpen, formData]);

    const handleLocalInputChange = (e) => {
      const { name, value } = e.target;
      setLocalFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleLocalSubmit = async (e) => {
      e.preventDefault();
      
      if (!localFormData.nombre.trim()) {
        alert('Por favor ingresa un nombre para la categoría');
        return;
      }

      try {
        if (isEditing && selectedCategory) {
          await dispatch(updateCategory({ 
            id: selectedCategory._id, 
            categoryData: localFormData 
          })).unwrap();
        } else {
          await dispatch(createCategory(localFormData)).unwrap();
        }
        
        // Cerrar modal y recargar datos solo al finalizar exitosamente
        onClose();
        dispatch(fetchCategories());
      } catch (error) {
        console.error('Error al guardar categoría:', error);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            <button className="close-btn" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleLocalSubmit} className="modal-body">
            <div className="form-group">
              <label htmlFor="nombre" className="form-label">
                Nombre de la categoría *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={localFormData.nombre}
                onChange={handleLocalInputChange}
                className="form-input"
                placeholder="Ingresa el nombre de la categoría"
                required
                autoFocus
              />
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={onClose}
                disabled={creating || updating}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={creating || updating}
              >
                {creating || updating ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Componente modal para ver detalles
  const CategoryViewModal = ({ isOpen, onClose, category }) => {
    if (!isOpen || !category) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content category-view-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Detalles de la Categoría</h2>
            <button className="close-btn" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
          
          <div className="modal-body">
            <div className="category-details">
              <div className="info-row">
                <span className="info-label">ID:</span>
                <span className="info-value">{category._id}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Nombre:</span>
                <span className="info-value">{category.nombre}</span>
              </div>

              {category.createdAt && (
                <div className="info-row">
                  <span className="info-label">Fecha de creación:</span>
                  <span className="info-value">
                    {new Date(category.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}

              {category.updatedAt && (
                <div className="info-row">
                  <span className="info-label">Última actualización:</span>
                  <span className="info-value">
                    {new Date(category.updatedAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
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
                handleEditCategory(category);
              }}
            >
              Editar Categoría
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="categories-management">
      {/* Header */}
      <div className="categories-header">
        <h1 className="categories-title">Gestión de Categorías</h1>
        <button 
          className="add-category-btn"
          onClick={handleAddCategory}
          disabled={isLoading}
        >
          <Plus size={20} />
          Agregar Categoría
        </button>
      </div>

      {/* Filtros */}
      <div className="categories-filters">
        <div className="filters-row">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Buscar categorías..."
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="error-banner">
          <span>Error: {error}</span>
          <button onClick={() => dispatch(clearError())}>×</button>
        </div>
      )}

      {/* Tabla de categorías */}
      <div className="categories-table-container">
        {loading ? (
          <div className="loading-spinner">
            <div>Cargando categorías...</div>
          </div>
        ) : paginatedCategories.length === 0 ? (
          <div className="empty-state">
            <h3>No se encontraron categorías</h3>
            <p>Intenta ajustar los filtros o agregar nuevas categorías</p>
          </div>
        ) : (
          <table className="categories-table">
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCategories.map(category => (
                <tr key={category._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="category-info">
                        <h4 className="category-name">{category.nombre}</h4>
                        <span className="category-details">
                          ID: {category._id}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="actions-container" style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="action-btn view-btn" 
                        title="Ver detalles"
                        onClick={() => handleViewCategory(category)}
                        disabled={isLoading}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="action-btn edit-btn" 
                        title="Editar"
                        onClick={() => handleEditCategory(category)}
                        disabled={isLoading}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="action-btn delete-btn" 
                        title="Eliminar"
                        onClick={() => handleDeleteCategory(category._id)}
                        disabled={isLoading}
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
            disabled={currentPage === 1 || isLoading}
          >
            Anterior
          </button>
          <span className="pagination-info">
            Página {currentPage} de {totalPages}
          </span>
          <button 
            className="pagination-btn"
            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages || isLoading}
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Modal para agregar categoría */}
      <CategoryFormModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        title="Agregar Nueva Categoría"
        isEditing={false}
      />

      {/* Modal para editar categoría */}
      <CategoryFormModal
        isOpen={showEditModal}
        onClose={handleCloseModal}
        title="Editar Categoría"
        isEditing={true}
      />

      {/* Modal para ver detalles de la categoría */}
      <CategoryViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        category={selectedCategory}
      />
    </div>
  );
};

export default CategoriesManagement;