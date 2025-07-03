import React, { useEffect } from 'react';
import '../assets/styles/Planos.css';
import Navbar from '../Components/Navbar';
import WhatsAppButton from '../Components/WhatsappButton';
import Footer from '../Components/Footer';
import { Link } from 'react-router-dom';

// Redux Toolkit
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPlanosPreview,
  selectPlanosPreview,
  selectPlanosPreviewLoading,
  setFilters,
  selectPlanosFilters,
  clearFilters,
  searchPlanosWithFilters
} from '../store/slices/planosSlice';

const Planos = () => {
  const dispatch = useDispatch();

  // Selectores
  const planos = useSelector(selectPlanosPreview);
  const cargando = useSelector(selectPlanosPreviewLoading);
  const filtros = useSelector(selectPlanosFilters);

  // Fetch planos al cargar
  useEffect(() => {
    dispatch(fetchPlanosPreview({ page: 1, limit: 12 }));
  }, [dispatch]);

  // Aplicar filtros
  const aplicarFiltros = () => {
    const filtrosActivos = Object.fromEntries(
      Object.entries(filtros).filter(([_, value]) => value !== '')
    );
    
    if (Object.keys(filtrosActivos).length > 0) {
      dispatch(searchPlanosWithFilters(filtrosActivos));
    } else {
      dispatch(fetchPlanosPreview({ page: 1, limit: 12 }));
    }
  };

  // Manejar cambio de filtros
  const manejarCambioFiltro = (campo, valor) => {
    dispatch(setFilters({ [campo]: valor }));
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    dispatch(clearFilters());
    dispatch(fetchPlanosPreview({ page: 1, limit: 12 }));
  };

  // Formatear dificultad
  const formatearDificultad = (dificultad) => {
    const niveles = {
      'principiante': 'Principiante',
      'intermedio': 'Intermedio',
      'avanzado': 'Avanzado'
    };
    return niveles[dificultad] || dificultad;
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
            <h3>Filtrar planos</h3>
            <div className="filtros-grid">
              <div className="filtro-grupo">
                <label>Categoría:</label>
                <select
                  value={filtros.categoria}
                  onChange={(e) => manejarCambioFiltro('categoria', e.target.value)}
                >
                  <option value="">Todas las categorías</option>
                  <option value="herramientas">Herramientas</option>
                  <option value="piezas">Piezas</option>
                  <option value="accesorios">Accesorios</option>
                  <option value="prototipos">Prototipos</option>
                </select>
              </div>

              <div className="filtro-grupo">
                <label>Tipo de máquina:</label>
                <select
                  value={filtros.tipo_maquina}
                  onChange={(e) => manejarCambioFiltro('tipo_maquina', e.target.value)}
                >
                  <option value="">Todos los tipos</option>
                  <option value="fresadora">Fresadora</option>
                  <option value="torno">Torno</option>
                  <option value="router">Router CNC</option>
                  <option value="plasma">Plasma</option>
                  <option value="laser">Láser</option>
                </select>
              </div>

              <div className="filtro-grupo">
                <label>Dificultad:</label>
                <select
                  value={filtros.dificultad}
                  onChange={(e) => manejarCambioFiltro('dificultad', e.target.value)}
                >
                  <option value="">Todas las dificultades</option>
                  <option value="principiante">Principiante</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>

              <div className="filtro-grupo">
                <label>Precio mín:</label>
                <input
                  type="number"
                  placeholder="$0"
                  value={filtros.minPrice}
                  onChange={(e) => manejarCambioFiltro('minPrice', e.target.value)}
                />
              </div>

              <div className="filtro-grupo">
                <label>Precio máx:</label>
                <input
                  type="number"
                  placeholder="$999"
                  value={filtros.maxPrice}
                  onChange={(e) => manejarCambioFiltro('maxPrice', e.target.value)}
                />
              </div>
            </div>

            <div className="filtros-acciones">
              <button className="btn btn-primary" onClick={aplicarFiltros}>
                Aplicar filtros
              </button>
              <button className="btn btn-secondary" onClick={limpiarFiltros}>
                Limpiar filtros
              </button>
            </div>
          </div>

          {/* Grid de planos */}
          <div className="planos-grid">
            {cargando ? (
              <div className="cargando-planos">
                <p>Cargando planos...</p>
              </div>
            ) : planos.length > 0 ? (
              planos.map((plano) => (
                <div className="plano-card" key={plano._id}>
                  <div className="plano-preview">
                    {plano.preview_imagen ? (
                      <img src={plano.preview_imagen} alt={plano.titulo} />
                    ) : (
                      <div className="preview-placeholder">
                        <i className="fas fa-file-pdf"></i>
                        <span>PDF</span>
                      </div>
                    )}
                    <div className="plano-dificultad">
                      <span className={`dificultad-badge ${plano.dificultad}`}>
                        {formatearDificultad(plano.dificultad)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="plano-info">
                    <h3>{plano.titulo}</h3>
                    <p className="plano-categoria">{plano.categoria}</p>
                    <p className="plano-descripcion">{plano.descripcion}</p>
                    
                    <div className="plano-meta">
                      <span className="plano-tipo">
                        <i className="fas fa-cog"></i>
                        {plano.tipo_maquina}
                      </span>
                      <span className="plano-paginas">
                        <i className="fas fa-file"></i>
                        {plano.total_paginas || 1} págs
                      </span>
                    </div>
                    
                    <div className="plano-precio">${plano.precio}</div>
                    
                    <div className="plano-acciones">
                      <Link 
                        to={`/plano/${plano._id}`} 
                        className="btn btn-primary"
                      >
                        <i className="fas fa-eye"></i>
                        Visualizar
                      </Link>
                      <button className="btn btn-secondary">
                        <i className="fas fa-shopping-cart"></i>
                        Comprar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-planos">
                <i className="fas fa-search"></i>
                <p>No se encontraron planos con los filtros aplicados.</p>
                <button className="btn btn-primary" onClick={limpiarFiltros}>
                  Ver todos los planos
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="planos-cta">
        <div className="container">
          <div className="cta-content">
            <h2>¿Necesitas un plano personalizado?</h2>
            <p>Nuestro equipo de ingenieros puede crear planos técnicos adaptados a tus necesidades específicas</p>
            <button className="btn btn-primary btn-large">Solicitar plano personalizado</button>
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