import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, X, Filter, Download, Upload } from 'lucide-react';
import {
  fetchPlanos,
  fetchPlanosPreview,
  createPlano,
  updatePlano,
  deletePlano,
  searchPlanosWithFilters,
  clearError,
  clearSelectedPlano,
  setFilters,
  clearFilters,
  clearSearchResults,
  selectPlanos,
  selectPlanosPreview,
  selectSelectedPlano,
  selectSearchResults,
  selectPlanosLoading,
  selectPlanosPreviewLoading,
  selectPlanosSearchLoading,
  selectPlanosError,
  selectPlanosCreating,
  selectPlanosUpdating,
  selectPlanosDeleting,
  selectCurrentPage,
  selectTotalPages,
  selectTotalItems,
  selectPlanosFilters,
  selectHasActiveFilters,
} from '../../store/slices/planosSlice';
import { fetchCategories } from '../../store/slices/categoriesSlice';
import "../../assets/styles/Admin/PlanosManagement.css";
import { useAppDispatch, useAppSelector } from '../../store/hooks';

const PlanosManagement = () => {
  const dispatch = useAppDispatch();

  // Selectores de Redux
  const planos = useAppSelector(selectPlanos);
  const previewPlanos = useAppSelector(selectPlanosPreview);
  const selectedPlano = useAppSelector(selectSelectedPlano);
  const searchResults = useAppSelector(selectSearchResults);
  const loading = useAppSelector(selectPlanosLoading);
  const previewLoading = useAppSelector(selectPlanosPreviewLoading);
  const searchLoading = useAppSelector(selectPlanosSearchLoading);
  const creating = useAppSelector(selectPlanosCreating);
  const updating = useAppSelector(selectPlanosUpdating);
  const deleting = useAppSelector(selectPlanosDeleting);
  const error = useAppSelector(selectPlanosError);
  const currentPage = useAppSelector(selectCurrentPage);
  const totalPages = useAppSelector(selectTotalPages);
  const totalItems = useAppSelector(selectTotalItems);
  const filters = useAppSelector(selectPlanosFilters);
  const hasActiveFilters = useAppSelector(selectHasActiveFilters);

  // Categorías para el formulario (solo como referencia, la categoría será texto libre)
  const categories = useAppSelector((state) => state.categories.items);

  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('preview'); // 'all' | 'preview'
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPlanoLocal, setSelectedPlanoLocal] = useState(null);

  // Estados para el formulario - CAMPOS CORREGIDOS
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    descripcion_preview: '', // CAMPO REQUERIDO AGREGADO
    categoria: '', // Texto libre, no select
    tipo_maquina: '',
    precio: 0,
    autor: '', // CAMPO REQUERIDO AGREGADO
    total_paginas: 1, // CAMPO REQUERIDO AGREGADO
    archivo: null
  });

  // Cargar datos iniciales
  useEffect(() => {
    dispatch(fetchCategories());
    if (viewMode === 'preview') {
      dispatch(fetchPlanosPreview({ page: currentPage, limit: 10 }));
    } else {
      dispatch(fetchPlanos());
    }
  }, [dispatch, viewMode, currentPage]);

  // Datos a mostrar según el modo y filtros
  const displayData = useMemo(() => {
    if (hasActiveFilters || searchTerm) {
      return searchResults;
    }
    return viewMode === 'preview' ? previewPlanos : planos;
  }, [hasActiveFilters, searchTerm, searchResults, viewMode, previewPlanos, planos]);

  // Filtrado local por término de búsqueda
  const filteredPlanos = useMemo(() => {
    if (!searchTerm) return displayData;

    return displayData.filter(plano =>
      plano && (
        (plano.titulo && plano.titulo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (plano.descripcion && plano.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (plano.categoria && plano.categoria.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (plano.tipo_maquina && plano.tipo_maquina.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (plano.autor && plano.autor.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  }, [displayData, searchTerm]);

  // Paginación local (cuando no hay paginación del servidor)
  const itemsPerPage = 10;
  const shouldPaginate = !hasActiveFilters && viewMode !== 'preview';
  const localTotalPages = shouldPaginate ? Math.ceil(filteredPlanos.length / itemsPerPage) : totalPages;
  const localCurrentPage = shouldPaginate ? 1 : currentPage;

  const paginatedPlanos = useMemo(() => {
    if (shouldPaginate) {
      const startIndex = (localCurrentPage - 1) * itemsPerPage;
      return filteredPlanos.slice(startIndex, startIndex + itemsPerPage);
    }
    return filteredPlanos;
  }, [filteredPlanos, shouldPaginate, localCurrentPage, itemsPerPage]);

  // Handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    dispatch(setFilters(newFilters));

    // Aplicar filtros si hay alguno activo
    const hasFilters = Object.values(newFilters).some(val => val !== '');
    if (hasFilters) {
      dispatch(searchPlanosWithFilters(newFilters));
    } else {
      dispatch(clearSearchResults());
    }
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(clearSearchResults());
    setSearchTerm('');
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    dispatch(clearSearchResults());
    setSearchTerm('');
  };

  const handleAddPlano = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      descripcion_preview: '',
      categoria: '',
      tipo_maquina: '',
      precio: 0,
      autor: '',
      total_paginas: 1,
      archivo: null
    });
    setSelectedPlanoLocal(null);
    setShowAddModal(true);
  };

  const handleEditPlano = (plano) => {
    setSelectedPlanoLocal(plano);
    setFormData({
      titulo: plano.titulo || '',
      descripcion: plano.descripcion || '',
      descripcion_preview: plano.descripcion_preview || '',
      categoria: plano.categoria || '',
      tipo_maquina: plano.tipo_maquina || '',
      precio: plano.precio || 0,
      autor: plano.autor || '',
      total_paginas: plano.total_paginas || 1,
      archivo: null // No prellenar archivo para edición
    });
    setShowEditModal(true);
  };

  const handleViewPlano = (plano) => {
    setSelectedPlanoLocal(plano);
    setShowViewModal(true);
  };

  const handleDeletePlano = async (planoId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este plano?')) {
      try {
        await dispatch(deletePlano(planoId)).unwrap();
        // Recargar datos según el modo actual
        if (viewMode === 'preview') {
          dispatch(fetchPlanosPreview({ page: currentPage, limit: 10 }));
        } else {
          dispatch(fetchPlanos());
        }
      } catch (error) {
        console.error('Error al eliminar plano:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
    setSelectedPlanoLocal(null);
    setFormData({
      titulo: '',
      descripcion: '',
      descripcion_preview: '',
      categoria: '',
      tipo_maquina: '',
      precio: 0,
      autor: '',
      total_paginas: 1,
      archivo: null
    });
    dispatch(clearError());
  };

  const isLoading = loading || previewLoading || searchLoading || creating || updating || deleting;

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Componente de formulario de plano - FORMULARIO CORREGIDO
  const PlanoFormModal = ({ isOpen, onClose, title, isEditing }) => {
    const [localFormData, setLocalFormData] = useState({
      titulo: '',
      descripcion: '',
      descripcion_preview: '',
      categoria: '',
      tipo_maquina: '',
      precio: 0,
      autor: '',
      total_paginas: 1,
      archivo: null
    });

    useEffect(() => {
      if (isOpen) {
        setLocalFormData(formData);
      }
    }, [isOpen, formData]);

    const handleInputChange = (e) => {
      const { name, value, type, files } = e.target;
      setLocalFormData(prev => ({
        ...prev,
        [name]: type === 'file' ? files[0] : value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      // Validaciones
      if (!localFormData.titulo.trim()) {
        alert('Por favor ingresa un título para el plano');
        return;
      }

      if (!localFormData.autor.trim()) {
        alert('Por favor ingresa el autor del plano');
        return;
      }

      if (!localFormData.descripcion_preview.trim()) {
        alert('Por favor ingresa una descripción preview');
        return;
      }

      if (localFormData.total_paginas < 1) {
        alert('El total de páginas debe ser mayor a 0');
        return;
      }

      try {
        if (isEditing && selectedPlanoLocal) {
          await dispatch(updatePlano({
            id: selectedPlanoLocal._id,
            planoData: localFormData
          })).unwrap();
        } else {
          await dispatch(createPlano(localFormData)).unwrap();
        }

        onClose();
        // Recargar datos
        if (viewMode === 'preview') {
          dispatch(fetchPlanosPreview({ page: currentPage, limit: 10 }));
        } else {
          dispatch(fetchPlanos());
        }
      } catch (error) {
        console.error('Error al guardar plano:', error);
        alert('Error al guardar el plano: ' + (error.message || 'Error desconocido'));
      }
    };

    if (!isOpen) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content plano-form-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            <button className="close-btn" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="titulo" className="form-label">
                  Título *
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={localFormData.titulo}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Título del plano"
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="autor" className="form-label">
                  Autor *
                </label>
                <input
                  type="text"
                  id="autor"
                  name="autor"
                  value={localFormData.autor}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Nombre del autor"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="precio" className="form-label">
                  Precio (COP) *
                </label>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  value={localFormData.precio}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                  step="100"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="total_paginas" className="form-label">
                  Total de Páginas *
                </label>
                <input
                  type="number"
                  id="total_paginas"
                  name="total_paginas"
                  value={localFormData.total_paginas}
                  onChange={handleInputChange}
                  className="form-input"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="descripcion_preview" className="form-label">
                Descripción Preview *
              </label>
              <textarea
                id="descripcion_preview"
                name="descripcion_preview"
                value={localFormData.descripcion_preview}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Descripción corta que se mostrará en la vista previa"
                rows="2"
                required
              />
              <small className="form-help">
                Esta descripción se mostrará en las tarjetas de vista previa
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="descripcion" className="form-label">
                Descripción Completa
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={localFormData.descripcion}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Descripción detallada del plano"
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="categoria" className="form-label">
                  Categoría
                </label>
                <input
                  type="text"
                  id="categoria"
                  name="categoria"
                  value={localFormData.categoria}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Ej: CNC, Láser, 3D, Router..."
                  list="categorias-sugeridas"
                />
                <datalist id="categorias-sugeridas">
                  {categories.map(cat => (
                    <option key={cat._id} value={cat.nombre} />
                  ))}
                </datalist>
                <small className="form-help">
                  Puedes escribir una categoría personalizada o seleccionar una sugerida
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="tipo_maquina" className="form-label">
                  Tipo de Máquina
                </label>
                <input
                  type="text"
                  id="tipo_maquina"
                  name="tipo_maquina"
                  value={localFormData.tipo_maquina}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Ej: CNC, Láser, 3D, Router..."
                />
              </div>
            </div>

            <div className="form-row">


              <div className="form-group">
                <label htmlFor="archivo" className="form-label">
                  Archivo {!isEditing && '*'}
                </label>
                <input
                  type="file"
                  id="archivo"
                  name="archivo"
                  onChange={handleInputChange}
                  className="form-input"
                  accept=".dwg,.dxf,.pdf,.zip,.rar"
                  required={!isEditing}
                />
                <small className="form-help">
                  Formatos: DWG, DXF, PDF, ZIP, RAR
                </small>
              </div>
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

  // Modal para ver detalles del plano - ACTUALIZADO CON NUEVOS CAMPOS
  const PlanoViewModal = ({ isOpen, onClose, plano }) => {
    if (!isOpen || !plano) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content plano-view-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Detalles del Plano</h2>
            <button className="close-btn" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <div className="modal-body">
            <div className="plano-details">
              <div className="info-row">
                <span className="info-label">ID:</span>
                <span className="info-value">{plano._id}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Título:</span>
                <span className="info-value">{plano.titulo}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Autor:</span>
                <span className="info-value">{plano.autor}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Precio:</span>
                <span className="info-value price">{formatPrice(plano.precio)}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Total de Páginas:</span>
                <span className="info-value">{plano.total_paginas}</span>
              </div>

              {plano.descripcion_preview && (
                <div className="info-row">
                  <span className="info-label">Descripción Preview:</span>
                  <span className="info-value">{plano.descripcion_preview}</span>
                </div>
              )}

              {plano.descripcion && (
                <div className="info-row">
                  <span className="info-label">Descripción Completa:</span>
                  <span className="info-value">{plano.descripcion}</span>
                </div>
              )}

              {plano.categoria && (
                <div className="info-row">
                  <span className="info-label">Categoría:</span>
                  <span className="info-value">{plano.categoria}</span>
                </div>
              )}

              {plano.tipo_maquina && (
                <div className="info-row">
                  <span className="info-label">Tipo de Máquina:</span>
                  <span className="info-value">{plano.tipo_maquina}</span>
                </div>
              )}



              {plano.archivo && (
                <div className="info-row">
                  <span className="info-label">Archivo:</span>
                  <span className="info-value">
                    <a
                      href={plano.archivo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="file-link"
                    >
                      <Download size={16} />
                      Descargar archivo
                    </a>
                  </span>
                </div>
              )}

              {plano.createdAt && (
                <div className="info-row">
                  <span className="info-label">Fecha de creación:</span>
                  <span className="info-value">
                    {new Date(plano.createdAt).toLocaleDateString('es-ES', {
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
                handleEditPlano(plano);
              }}
            >
              Editar Plano
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="planos-management">
      {/* Header */}
      <div className="planos-header">
        <h1 className="planos-title">Gestión de Planos</h1>
        <div className="header-actions">
          <div className="view-mode-toggle">
            <button
              className={`toggle-btn ${viewMode === 'preview' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('preview')}
            >
              Vista Previa
            </button>
            <button
              className={`toggle-btn ${viewMode === 'all' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('all')}
            >
              Todos
            </button>
          </div>
          <button
            className="add-plano-btn"
            onClick={handleAddPlano}
            disabled={isLoading}
          >
            <Plus size={20} />
            Agregar Plano
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="planos-filters">
        <div className="filters-row">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Buscar planos..."
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <button
            className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            Filtros
          </button>

          {hasActiveFilters && (
            <button
              className="clear-filters-btn"
              onClick={handleClearFilters}
            >
              Limpiar Filtros
            </button>
          )}
        </div>

        {showFilters && (
          <div className="filters-expanded">


            <div className="filter-group">
              <label className="filter-label">Tipo de Máquina</label>
              <input
                type="text"
                value={filters.tipo_maquina}
                onChange={(e) => handleFilterChange('tipo_maquina', e.target.value)}
                className="filter-input"
                placeholder="Ej: CNC, Láser..."
              />
            </div>



            <div className="filter-group">
              <label className="filter-label">Precio Mínimo</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="filter-input"
                placeholder="0"
                min="0"
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Precio Máximo</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="filter-input"
                placeholder="Sin límite"
                min="0"
              />
            </div>
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="planos-stats">
        <div className="stat-card">
          <span className="stat-label">Total de Planos</span>
          <span className="stat-value">{totalItems || filteredPlanos.length}</span>
        </div>
        {hasActiveFilters && (
          <div className="stat-card">
            <span className="stat-label">Resultados Filtrados</span>
            <span className="stat-value">{filteredPlanos.length}</span>
          </div>
        )}
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="error-banner">
          <span>Error: {error}</span>
          <button onClick={() => dispatch(clearError())}>×</button>
        </div>
      )}

      {/* Tabla de planos */}
      <div className="planos-table-container">
        {isLoading ? (
          <div className="loading-spinner">
            <div>Cargando planos...</div>
          </div>
        ) : paginatedPlanos.length === 0 ? (
          <div className="empty-state">
            <h3>No se encontraron planos</h3>
            <p>Intenta ajustar los filtros o agregar nuevos planos</p>
          </div>
        ) : (
          <table className="planos-table">
            <thead>
              <tr>
                <th>Plano</th>
                <th>Categoría</th>
                <th>Tipo</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPlanos.map(plano => (
                <tr key={plano._id}>
                  <td>
                    <div className="plano-info">
                      <h4 className="plano-title">{plano.titulo}</h4>
                      {plano.descripcion && (
                        <p className="plano-description">
                          {plano.descripcion.length > 100
                            ? `${plano.descripcion.substring(0, 100)}...`
                            : plano.descripcion
                          }
                        </p>
                      )}
                      <span className="plano-id">ID: {plano._id}</span>
                    </div>
                  </td>
                  <td>
                    <span className="category-tag">
                      {plano.categoria || 'Sin categoría'}
                    </span>
                  </td>
                  <td>
                    <span className="machine-type">
                      {plano.tipo_maquina || 'No especificado'}
                    </span>
                  </td>

                  <td>
                    <span className="price-tag">
                      {formatPrice(plano.precio)}
                    </span>
                  </td>
                  <td>
                    <div className="actions-container">
                      <button
                        className="action-btn view-btn"
                        title="Ver detalles"
                        onClick={() => handleViewPlano(plano)}
                        disabled={isLoading}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="action-btn edit-btn"
                        title="Editar"
                        onClick={() => handleEditPlano(plano)}
                        disabled={isLoading}
                      >
                        <Edit size={16} />
                      </button>
                      {plano.archivo && (
                        <a
                          href={plano.archivo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-btn download-btn"
                          title="Descargar archivo"
                        >
                          <Download size={16} />
                        </a>
                      )}
                      <button
                        className="action-btn delete-btn"
                        title="Eliminar"
                        onClick={() => handleDeletePlano(plano._id)}
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
      {localTotalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => {
              if (shouldPaginate) {
                // Paginación local - implementar lógica si es necesario
              } else {
                dispatch(fetchPlanosPreview({ page: currentPage - 1, limit: 10 }));
              }
            }}
            disabled={currentPage === 1 || isLoading}
          >
            Anterior
          </button>
          <span className="pagination-info">
            Página {currentPage} de {localTotalPages}
          </span>
          <button
            className="pagination-btn"
            onClick={() => {
              if (shouldPaginate) {
                // Paginación local - implementar lógica si es necesario
              } else {
                dispatch(fetchPlanosPreview({ page: currentPage + 1, limit: 10 }));
              }
            }}
            disabled={currentPage === localTotalPages || isLoading}
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Modales */}
      <PlanoFormModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        title="Agregar Nuevo Plano"
        isEditing={false}
      />

      <PlanoFormModal
        isOpen={showEditModal}
        onClose={handleCloseModal}
        title="Editar Plano"
        isEditing={true}
      />

      <PlanoViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        plano={selectedPlanoLocal}
      />
    </div>
  );
};

export default PlanosManagement;