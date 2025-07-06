import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, X, Download } from 'lucide-react';
import {
  fetchPlanos,
  createPlano,
  updatePlano,
  deletePlano,
  searchPlanos,
  clearError,
  clearSelectedPlano,
  clearSearchResults,
  selectPlanos,
  selectSelectedPlano,
  selectSearchResults,
  selectPlanosLoading,
  selectSearchLoading,
  selectPlanosError,
  selectPlanosCreating,
  selectPlanosUpdating,
  selectPlanosDeleting,
  selectCurrentPage,
  selectTotalPages,
  selectTotalItems,
  selectSearchCurrentPage,
  selectSearchTotalPages,
  selectSearchTotalItems,
  selectLastSearchQuery,
  selectHasSearchResults,
  setCurrentPage,
  setSearchCurrentPage,
  setLastSearchQuery,
} from '../../store/slices/planosSlice';
import { fetchCategories } from '../../store/slices/categoriesSlice';
import "../../assets/styles/Admin/PlanosManagement.css";
import { useAppDispatch, useAppSelector } from '../../store/hooks';

// Enum para dificultad
const DIFICULTAD_OPTIONS = [
  { value: 'BASICO', label: 'Básico' },
  { value: 'INTERMEDIO', label: 'Intermedio' },
  { value: 'AVANZADO', label: 'Avanzado' }
];

const PlanosManagement = () => {
  const dispatch = useAppDispatch();

  // Selectores de Redux
  const planos = useAppSelector(selectPlanos);
  const selectedPlano = useAppSelector(selectSelectedPlano);
  const searchResults = useAppSelector(selectSearchResults);
  const loading = useAppSelector(selectPlanosLoading);
  const searchLoading = useAppSelector(selectSearchLoading);
  const creating = useAppSelector(selectPlanosCreating);
  const updating = useAppSelector(selectPlanosUpdating);
  const deleting = useAppSelector(selectPlanosDeleting);
  const error = useAppSelector(selectPlanosError);
  const currentPage = useAppSelector(selectCurrentPage);
  const totalPages = useAppSelector(selectTotalPages);
  const totalItems = useAppSelector(selectTotalItems);
  const searchCurrentPage = useAppSelector(selectSearchCurrentPage);
  const searchTotalPages = useAppSelector(selectSearchTotalPages);
  const searchTotalItems = useAppSelector(selectSearchTotalItems);
  const lastSearchQuery = useAppSelector(selectLastSearchQuery);
  const hasSearchResults = useAppSelector(selectHasSearchResults);

  // Categorías para el datalist
  const categories = useAppSelector((state) => state.categories.items);

  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPlanoLocal, setSelectedPlanoLocal] = useState(null);

  // Estados para el formulario - SIN CAMPO PREVIEW
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    tipo_maquina: '',
    dificultad: '',
    archivo: null,
    total_paginas: 1,
    precio: 0,
    descripcion_preview: '',
    autor: '',
    version: '1.0'
  });

  // Cargar datos iniciales
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchPlanos({ page: 1, limit: 20 }));
  }, [dispatch]);

  // Datos a mostrar según si hay búsqueda activa
  const displayData = useMemo(() => {
    return hasSearchResults ? searchResults : planos;
  }, [hasSearchResults, searchResults, planos]);

  // Paginación actual
  const currentDisplayPage = hasSearchResults ? searchCurrentPage : currentPage;
  const currentDisplayTotalPages = hasSearchResults ? searchTotalPages : totalPages;
  const currentDisplayTotalItems = hasSearchResults ? searchTotalItems : totalItems;

  // Handlers
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Realizar búsqueda con debounce
    if (value.trim()) {
      dispatch(setLastSearchQuery(value));
      dispatch(searchPlanos({ query: value, page: 1, limit: 12 }));
    } else {
      dispatch(clearSearchResults());
    }
  };

  const handlePageChange = (newPage) => {
    if (hasSearchResults) {
      dispatch(setSearchCurrentPage(newPage));
      dispatch(searchPlanos({ query: lastSearchQuery, page: newPage, limit: 12 }));
    } else {
      dispatch(setCurrentPage(newPage));
      dispatch(fetchPlanos({ page: newPage, limit: 12 }));
    }
  };

  const handleAddPlano = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      categoria: '',
      tipo_maquina: '',
      dificultad: '',
      archivo: null,
      total_paginas: 1,
      precio: 0,
      descripcion_preview: '',
      autor: '',
      version: '1.0'
    });
    setSelectedPlanoLocal(null);
    setShowAddModal(true);
  };

  const handleEditPlano = (plano) => {
    setSelectedPlanoLocal(plano);
    setFormData({
      titulo: plano.titulo || '',
      descripcion: plano.descripcion || '',
      categoria: plano.categoria || '',
      tipo_maquina: plano.tipo_maquina || '',
      dificultad: plano.dificultad || '',
      archivo: null, // No prellenar archivo para edición
      total_paginas: plano.total_paginas || 1,
      precio: plano.precio || 0,
      descripcion_preview: plano.descripcion_preview || '',
      autor: plano.autor || '',
      version: plano.version || '1.0'
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
        // Recargar datos
        if (hasSearchResults) {
          dispatch(searchPlanos({ query: lastSearchQuery, page: searchCurrentPage, limit: 12 }));
        } else {
          dispatch(fetchPlanos({ page: currentPage, limit: 12 }));
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
      categoria: '',
      tipo_maquina: '',
      dificultad: '',
      archivo: null,
      total_paginas: 1,
      precio: 0,
      descripcion_preview: '',
      autor: '',
      version: '1.0'
    });
    dispatch(clearError());
  };

  const isLoading = loading || searchLoading || creating || updating || deleting;

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Formatear dificultad
  const formatDificultad = (dificultad) => {
    const option = DIFICULTAD_OPTIONS.find(opt => opt.value === dificultad);
    return option ? option.label : dificultad;
  };

  // Componente de formulario de plano - SIN CAMPO PREVIEW
  const PlanoFormModal = ({ isOpen, onClose, title, isEditing }) => {
    const [localFormData, setLocalFormData] = useState(formData);

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

      if (!isEditing && !localFormData.archivo) {
        alert('Por favor selecciona un archivo');
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
        if (hasSearchResults) {
          dispatch(searchPlanos({ query: lastSearchQuery, page: searchCurrentPage, limit: 12 }));
        } else {
          dispatch(fetchPlanos({ page: currentPage, limit: 12 }));
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
                <label htmlFor="version" className="form-label">
                  Versión *
                </label>
                <input
                  type="text"
                  id="version"
                  name="version"
                  value={localFormData.version}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="1.0"
                  required
                />
              </div>
            </div>

            <div className="form-row">
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

              <div className="form-group">
                <label htmlFor="dificultad" className="form-label">
                  Dificultad *
                </label>
                <select
                  id="dificultad"
                  name="dificultad"
                  value={localFormData.dificultad}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  {DIFICULTAD_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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

  // Modal para ver detalles del plano - SIN CAMPO PREVIEW
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
                <span className="info-label">Versión:</span>
                <span className="info-value">{plano.version}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Precio:</span>
                <span className="info-value price">{formatPrice(plano.precio)}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Dificultad:</span>
                <span className="info-value">{formatDificultad(plano.dificultad)}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Total de Páginas:</span>
                <span className="info-value">{plano.total_paginas}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Descripción Preview:</span>
                <span className="info-value">{plano.descripcion_preview}</span>
              </div>

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

              {plano.creado && (
                <div className="info-row">
                  <span className="info-label">Fecha de creación:</span>
                  <span className="info-value">
                    {new Date(plano.creado).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}

              {plano.actualizado && (
                <div className="info-row">
                  <span className="info-label">Última actualización:</span>
                  <span className="info-value">
                    {new Date(plano.actualizado).toLocaleDateString('es-ES', {
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

      {/* Búsqueda simple */}
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
          {hasSearchResults && (
            <button
              className="clear-filters-btn"
              onClick={() => {
                setSearchTerm('');
                dispatch(clearSearchResults());
              }}
            >
              Limpiar Búsqueda
            </button>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="planos-stats">
        <div className="stat-card">
          <span className="stat-label">Total de Planos</span>
          <span className="stat-value">{currentDisplayTotalItems}</span>
        </div>
        {hasSearchResults && (
          <div className="stat-card">
            <span className="stat-label">Mostrando</span>
            <span className="stat-value">{displayData.length}</span>
          </div>
        )}
      </div>

      {/* Error banner */}
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
        ) : displayData.length === 0 ? (
          <div className="empty-state">
            <h3>No se encontraron planos</h3>
            <p>{hasSearchResults ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando nuevos planos'}</p>
          </div>
        ) : (
          <table className="planos-table">
            <thead>
              <tr>
                <th>Plano</th>
                <th>Categoría</th>
                <th>Dificultad</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map(plano => (
                <tr key={plano._id}>
                  <td>
                    <div className="plano-info">
                      <h4 className="plano-title">{plano.titulo}</h4>
                      <p className="plano-author">Por: {plano.autor}</p>
                      {plano.descripcion_preview && (
                        <p className="plano-description">
                          {plano.descripcion_preview.length > 100
                            ? `${plano.descripcion_preview.substring(0, 100)}...`
                            : plano.descripcion_preview
                          }
                        </p>
                      )}
                      <div className="plano-meta">
                        <span className="plano-version">v{plano.version}</span>
                        <span className="plano-pages">{plano.total_paginas} páginas</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="category-tag">
                      {plano.categoria || 'Sin categoría'}
                    </span>
                    {plano.tipo_maquina && (
                      <div className="machine-type">
                        {plano.tipo_maquina}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`difficulty-tag difficulty-${plano.dificultad?.toLowerCase()}`}>
                      {formatDificultad(plano.dificultad)}
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
      {currentDisplayTotalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentDisplayPage - 1)}
            disabled={currentDisplayPage === 1 || isLoading}
          >
            Anterior
          </button>
          
          <div className="pagination-info">
            <span>
              Página {currentDisplayPage} de {currentDisplayTotalPages}
            </span>
            <span>
              ({currentDisplayTotalItems} total)
            </span>
          </div>

          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentDisplayPage + 1)}
            disabled={currentDisplayPage >= currentDisplayTotalPages || isLoading}
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
        onClose={handleCloseModal}
        plano={selectedPlanoLocal}
      />
    </div>
  );
};

export default PlanosManagement;