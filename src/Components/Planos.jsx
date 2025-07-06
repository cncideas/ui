import React, { useEffect, useState } from 'react';
import '../assets/styles/Planos.css';
import Navbar from '../Components/Navbar';
import WhatsAppButton from '../Components/WhatsAppButton';
import Footer from '../Components/Footer';
import { Link } from 'react-router-dom';

// Redux Toolkit
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPlanos,
  searchPlanos,
  selectPlanos,
  selectPlanosLoading,
  selectPlanosError,
  selectSearchResults,
  selectSearchLoading,
  selectHasSearchResults,
  selectCurrentPage,
  selectTotalPages,
  selectTotalItems,
  clearSearchResults,
  clearError,
  setCurrentPage
} from '../store/slices/planosSlice';

const Planos = () => {
  const dispatch = useDispatch();

  // Estado local para filtros
  const [filtros, setFiltros] = useState({
    busqueda: '',
    categoria: ''
  });

  // Estado para debounce de búsqueda
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Selectores Redux
  const planos = useSelector(selectPlanos);
  const searchResults = useSelector(selectSearchResults);
  const loading = useSelector(selectPlanosLoading);
  const searchLoading = useSelector(selectSearchLoading);
  const error = useSelector(selectPlanosError);
  const hasSearchResults = useSelector(selectHasSearchResults);
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  const totalItems = useSelector(selectTotalItems);

  // Determinar qué datos mostrar
  const planosAMostrar = hasSearchResults ? searchResults : planos;
  const cargando = hasSearchResults ? searchLoading : loading;

  // Fetch inicial de planos
  useEffect(() => {
    dispatch(fetchPlanos({ page: 1, limit: 12 }));
  }, [dispatch]);

  // Limpiar errores al desmontar
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Manejar cambio de búsqueda con debounce
  const manejarCambioBusqueda = (valor) => {
    setFiltros(prev => ({ ...prev, busqueda: valor }));

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const nuevoTimeout = setTimeout(() => {
      realizarBusqueda(valor, filtros.categoria);
    }, 500);

    setSearchTimeout(nuevoTimeout);
  };

  // Manejar cambio de categoría
  const manejarCambioCategoria = (categoria) => {
    setFiltros(prev => ({ ...prev, categoria }));
    realizarBusqueda(filtros.busqueda, categoria);
  };

  // Función para realizar búsqueda
  const realizarBusqueda = (busqueda, categoria) => {
    let query = '';
    if (busqueda.trim()) {
      query += busqueda.trim();
    }
    if (categoria && categoria !== '') {
      query += (query ? ' ' : '') + categoria;
    }

    if (query.trim()) {
      dispatch(searchPlanos({ query: query.trim(), page: 1, limit: 12 }));
    } else {
      dispatch(clearSearchResults());
      dispatch(fetchPlanos({ page: 1, limit: 12 }));
    }
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({ busqueda: '', categoria: '' });
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    dispatch(clearSearchResults());
    dispatch(fetchPlanos({ page: 1, limit: 12 }));
  };

  // Manejar cambio de página
  const cambiarPagina = (nuevaPagina) => {
    if (hasSearchResults) {
      const { busqueda, categoria } = filtros;
      let query = '';
      if (busqueda.trim()) {
        query += busqueda.trim();
      }
      if (categoria && categoria !== '') {
        query += (query ? ' ' : '') + categoria;
      }
      
      if (query.trim()) {
        dispatch(searchPlanos({ query: query.trim(), page: nuevaPagina, limit: 12 }));
      }
    } else {
      dispatch(setCurrentPage(nuevaPagina));
      dispatch(fetchPlanos({ page: nuevaPagina, limit: 12 }));
    }
  };

  // Formatear precio
  const formatearPrecio = (precio) => {
    if (typeof precio === 'number') {
      return precio.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
    }
    return `$${precio}`;
  };

  return (
    <div className="planos-page">
      <Navbar />

      <section className="planos-hero">
        <div className="container">
          <h1>Biblioteca de Planos CNC</h1>
          <p>Descubre nuestra colección de planos técnicos para optimizar tus proyectos de mecanizado CNC</p>
        </div>
      </section>

      <section className="planos-main">
        <div className="container">
          {/* Filtros */}
          <div className="planos-filtros">
            <h3>Buscar planos</h3>
            <div className="filtros-grid">
              <div className="filtro-grupo">
                <label>Buscar:</label>
                <input
                  type="text"
                  placeholder="Buscar por nombre o descripción..."
                  value={filtros.busqueda}
                  onChange={(e) => manejarCambioBusqueda(e.target.value)}
                  className="filtro-input"
                />
              </div>

              <div className="filtro-grupo">
                <label>Categoría:</label>
                <select
                  value={filtros.categoria}
                  onChange={(e) => manejarCambioCategoria(e.target.value)}
                  className="filtro-select"
                >
                  <option value="">Todas las categorías</option>
                  <option value="herramientas">Herramientas</option>
                  <option value="piezas">Piezas</option>
                  <option value="accesorios">Accesorios</option>
                  <option value="prototipos">Prototipos</option>
                  <option value="maquinaria">Maquinaria</option>
                  <option value="moldes">Moldes</option>
                </select>
              </div>
            </div>

            <div className="filtros-acciones">
              <button 
                className="btn btn-secondary" 
                onClick={limpiarFiltros}
                disabled={cargando}
              >
                <i className="fas fa-times"></i>
                Limpiar filtros
              </button>
              {cargando && (
                <div className="filtro-loading">
                  <i className="fas fa-spinner fa-spin"></i>
                  Buscando...
                </div>
              )}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="error-message">
              <div className="error-content">
                <i className="fas fa-exclamation-triangle"></i>
                <span>Error: {error}</span>
                <button 
                  className="btn btn-sm btn-secondary" 
                  onClick={() => dispatch(clearError())}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )}

          {/* Información de resultados */}
          {!cargando && planosAMostrar.length > 0 && (
            <div className="resultados-info">
              <div className="resultados-texto">
                <p>
                  {hasSearchResults ? (
                    <>
                      <i className="fas fa-search"></i>
                      Resultados de búsqueda: <strong>{totalItems} planos encontrados</strong>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-th-large"></i>
                      Catálogo completo: <strong>{totalItems} planos disponibles</strong>
                    </>
                  )}
                </p>
              </div>
              <div className="resultados-paginacion">
                <span>Página {currentPage} de {totalPages}</span>
              </div>
            </div>
          )}

          {/* Grid de planos */}
          <div className="planos-grid">
            {cargando ? (
              <div className="cargando-planos">
                <div className="spinner-container">
                  <div className="spinner"></div>
                  <p>Cargando planos...</p>
                </div>
              </div>
            ) : planosAMostrar.length > 0 ? (
              planosAMostrar.map((plano) => (
                <div className="plano-card" key={plano._id}>
                  {/* Icono PDF */}
                  <div className="plano-icon">
                    <i className="fas fa-file-pdf"></i>
                  </div>
                  
                  <div className="plano-content">
                    {/* Título centrado */}
                    <h3 className="plano-titulo">{plano.titulo}</h3>
                    
                    {/* Categoría */}
                    <p className="plano-categoria">
                      <i className="fas fa-tag"></i>
                      {plano.categoria}
                    </p>
                    
                    {/* Precio */}
                    <div className="plano-precio">
                      {formatearPrecio(plano.precio)}
                    </div>
                    
                    {/* Descripción */}
                    <p className="plano-descripcion">
                      {plano.descripcion && plano.descripcion.length > 80 
                        ? `${plano.descripcion.substring(0, 80)}...` 
                        : plano.descripcion || 'Sin descripción disponible'}
                    </p>
                    
                    {/* Meta información */}
                    <div className="plano-meta">
                      <div className="meta-item">
                        <i className="fas fa-file-alt"></i>
                        <span>{plano.total_paginas || 1} pág.</span>
                      </div>
                      {plano.fecha_creacion && (
                        <div className="meta-item">
                          <i className="fas fa-calendar"></i>
                          <span>{new Date(plano.fecha_creacion).toLocaleDateString('es-CO')}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Acciones */}
                    <div className="plano-acciones">
                      <Link 
                        to={`/plano/${plano._id}`} 
                        className="btn btn-primary"
                      >
                        <i className="fas fa-eye"></i>
                        Ver detalles
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-planos">
                <div className="no-planos-content">
                  <i className="fas fa-search"></i>
                  <h3>No se encontraron planos</h3>
                  <p>
                    {hasSearchResults 
                      ? 'No hay planos que coincidan con tu búsqueda. Intenta con otros términos.' 
                      : 'No hay planos disponibles en este momento.'}
                  </p>
                  {hasSearchResults && (
                    <button className="btn btn-primary" onClick={limpiarFiltros}>
                      <i className="fas fa-th-large"></i>
                      Ver todos los planos
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Paginación */}
          {!cargando && totalPages > 1 && (
            <div className="paginacion">
              <button 
                className="btn btn-paginacion"
                onClick={() => cambiarPagina(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i>
                Anterior
              </button>
              
              <div className="paginas">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pagina;
                  if (totalPages <= 5) {
                    pagina = i + 1;
                  } else if (currentPage <= 3) {
                    pagina = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pagina = totalPages - 4 + i;
                  } else {
                    pagina = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pagina}
                      className={`btn btn-pagina ${pagina === currentPage ? 'active' : ''}`}
                      onClick={() => cambiarPagina(pagina)}
                    >
                      {pagina}
                    </button>
                  );
                })}
              </div>
              
              <button 
                className="btn btn-paginacion"
                onClick={() => cambiarPagina(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Siguiente
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="planos-cta">
        <div className="container">
          <div className="cta-content">
            <h2>¿Necesitas un plano personalizado?</h2>
            <p>Nuestro equipo de ingenieros puede crear planos técnicos adaptados a tus necesidades específicas</p>
            <button className="btn btn-primary btn-large">
              <i className="fas fa-drafting-compass"></i>
              Solicitar plano personalizado
            </button>
          </div>
        </div>
      </section>

      <Footer />

      <WhatsAppButton
        phoneNumber="573194283570"
        message="Hola, estoy interesado en los planos CNC disponibles"
      />
    </div>
  );
};

export default Planos;