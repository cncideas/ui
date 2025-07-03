import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPlanoById,
  selectSelectedPlano,
  selectPlanosLoading
} from '../store/slices/planosSlice';
import '../assets/styles/PlanoDetalle.css';
import Navbar from '../Components/Navbar';
import WhatsAppButton from '../Components/WhatsappButton';
import Footer from '../Components/Footer';

const PlanoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const plano = useSelector(selectSelectedPlano);
  const cargando = useSelector(selectPlanosLoading);
  const [tabActiva, setTabActiva] = useState('descripcion');
  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    dispatch(fetchPlanoById(id));
  }, [dispatch, id]);

  const agregarAlCarrito = () => {
    const carrito = JSON.parse(localStorage.getItem('carrito_planos') || '[]');
    const existente = carrito.find(item => item._id === plano._id);

    if (existente) {
      alert('Este plano ya está en tu carrito');
      return;
    }

    carrito.push({
      _id: plano._id,
      titulo: plano.titulo,
      precio: plano.precio,
      preview_imagen: plano.preview_imagen,
      tipo: 'plano'
    });

    localStorage.setItem('carrito_planos', JSON.stringify(carrito));
    alert(`${plano.titulo} agregado al carrito`);
  };

  const comprarAhora = () => {
    agregarAlCarrito();
    navigate('/checkout');
  };

  const formatearDificultad = (dificultad) => {
    const niveles = {
      'principiante': 'Principiante',
      'intermedio': 'Intermedio',
      'avanzado': 'Avanzado'
    };
    return niveles[dificultad] || dificultad;
  };

  const renderizarPreviewPDF = () => {
    if (!plano.archivo) {
      return (
        <div className="pdf-no-disponible">
          <i className="fas fa-file-pdf"></i>
          <p>Vista previa no disponible</p>
        </div>
      );
    }

    // Simulamos páginas de preview (normalmente sería del backend)
    const paginasPreview = Math.min(3, plano.total_paginas || 1);
    
    return (
      <div className="pdf-preview-container">
        <div className="pdf-controls">
          <button 
            onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
            disabled={paginaActual === 1}
            className="btn btn-sm"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="pagina-info">
            Página {paginaActual} de {paginasPreview} (Vista previa)
          </span>
          <button 
            onClick={() => setPaginaActual(Math.min(paginasPreview, paginaActual + 1))}
            disabled={paginaActual === paginasPreview}
            className="btn btn-sm"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        
        <div className="pdf-viewer">
          {plano.preview_imagen ? (
            <img 
              src={`${plano.preview_imagen}?page=${paginaActual}`} 
              alt={`${plano.titulo} - Página ${paginaActual}`}
              className="pdf-page"
            />
          ) : (
            <div className="pdf-placeholder">
              <i className="fas fa-file-pdf"></i>
              <p>Vista previa - Página {paginaActual}</p>
              <small>Compra el plano para ver el contenido completo</small>
            </div>
          )}
        </div>
        
        <div className="pdf-watermark">
          <p>Vista previa limitada - {paginasPreview} de {plano.total_paginas || 1} páginas</p>
        </div>
      </div>
    );
  };

  if (cargando || !plano) {
    return (
      <div className="plano-detalle-page">
        <Navbar />
        <div className="cargando-detalle">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Cargando plano...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="plano-detalle-page">
      <Navbar />
      
      <section className="breadcrumb">
        <div className="container">
          <nav>
            <span onClick={() => navigate('/')} className="breadcrumb-link">Inicio</span>
            <span className="breadcrumb-separator">{">"}</span>
            <span onClick={() => navigate('/planos')} className="breadcrumb-link">Planos</span>
            <span className="breadcrumb-separator">{">"}</span>
            <span className="breadcrumb-current">{plano.titulo}</span>
          </nav>
        </div>
      </section>

      <section className="plano-detalle-main">
        <div className="container">
          <div className="plano-detalle-grid">
            {/* Columna del visor PDF */}
            <div className="plano-preview-section">
              <h2>Vista Previa</h2>
              {renderizarPreviewPDF()}
            </div>

            {/* Columna de información */}
            <div className="plano-info-detalle">
              <div className="plano-header">
                <h1>{plano.titulo}</h1>
                <div className="plano-badges">
                  <span className="categoria-badge">{plano.categoria}</span>
                  <span className={`dificultad-badge ${plano.dificultad}`}>
                    {formatearDificultad(plano.dificultad)}
                  </span>
                </div>
              </div>

              <div className="plano-precio-detalle">
                <span className="precio-actual">${plano.precio}</span>
              </div>

              <div className="plano-meta-info">
                <div className="meta-item">
                  <i className="fas fa-cog"></i>
                  <span><strong>Tipo de máquina:</strong> {plano.tipo_maquina}</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-file"></i>
                  <span><strong>Total de páginas:</strong> {plano.total_paginas || 1}</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-clock"></i>
                  <span><strong>Tiempo estimado:</strong> {plano.tiempo_estimado || 'Variable'}</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-tools"></i>
                  <span><strong>Herramientas req.:</strong> {plano.herramientas_requeridas || 'Básicas'}</span>
                </div>
              </div>

              <div className="plano-descripcion">
                <p>{plano.descripcion}</p>
              </div>

              <div className="plano-acciones-detalle">
                <button className="btn btn-primary btn-large" onClick={agregarAlCarrito}>
                  <i className="fas fa-shopping-cart"></i>
                  Agregar al carrito
                </button>
                <button className="btn btn-success btn-large" onClick={comprarAhora}>
                  <i className="fas fa-credit-card"></i>
                  Comprar ahora
                </button>
              </div>

              <div className="plano-garantia">
                <div className="garantia-item">
                  <i className="fas fa-shield-alt"></i>
                  <span>Descarga inmediata después del pago</span>
                </div>
                <div className="garantia-item">
                  <i className="fas fa-redo"></i>
                  <span>Reemplazo gratuito si hay problemas</span>
                </div>
                <div className="garantia-item">
                  <i className="fas fa-headset"></i>
                  <span>Soporte técnico incluido</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs de información adicional */}
          <div className="plano-tabs">
            <div className="tabs-nav">
              <button
                className={`tab-btn ${tabActiva === 'descripcion' ? 'active' : ''}`}
                onClick={() => setTabActiva('descripcion')}
              >
                Descripción Detallada
              </button>
              <button
                className={`tab-btn ${tabActiva === 'especificaciones' ? 'active' : ''}`}
                onClick={() => setTabActiva('especificaciones')}
              >
                Especificaciones
              </button>
              <button
                className={`tab-btn ${tabActiva === 'requisitos' ? 'active' : ''}`}
                onClick={() => setTabActiva('requisitos')}
              >
                Requisitos
              </button>
              <button
                className={`tab-btn ${tabActiva === 'contenido' ? 'active' : ''}`}
                onClick={() => setTabActiva('contenido')}
              >
                Contenido del Paquete
              </button>
            </div>

            <div className="tab-content active">
              {tabActiva === 'descripcion' && (
                <div>
                  <h3>Descripción Detallada</h3>
                  <p>{plano.descripcion_detallada || plano.descripcion}</p>
                  <p>Este plano ha sido diseñado con precisión para garantizar resultados óptimos en tu proyecto de mecanizado CNC.</p>
                </div>
              )}

              {tabActiva === 'especificaciones' && (
                <div>
                  <h3>Especificaciones Técnicas</h3>
                  <div className="especificaciones-grid">
                    <div className="spec-item">
                      <strong>Dimensiones:</strong>
                      <span>{plano.dimensiones || 'Según diseño'}</span>
                    </div>
                    <div className="spec-item">
                      <strong>Material recomendado:</strong>
                      <span>{plano.material_recomendado || 'Aluminio, Acero'}</span>
                    </div>
                    <div className="spec-item">
                      <strong>Tolerancias:</strong>
                      <span>{plano.tolerancias || '±0.1mm'}</span>
                    </div>
                    <div className="spec-item">
                      <strong>Acabado superficial:</strong>
                      <span>{plano.acabado_superficial || 'Ra 3.2'}</span>
                    </div>
                  </div>
                </div>
              )}

              {tabActiva === 'requisitos' && (
                <div>
                  <h3>Requisitos del Sistema</h3>
                  <ul>
                    <li>Máquina CNC tipo {plano.tipo_maquina}</li>
                    <li>Software CAM compatible</li>
                    <li>Herramientas: {plano.herramientas_requeridas || 'Fresas estándar'}</li>
                    <li>Experiencia: Nivel {formatearDificultad(plano.dificultad)}</li>
                    <li>Tiempo estimado: {plano.tiempo_estimado || '2-4 horas'}</li>
                  </ul>
                </div>
              )}

              {tabActiva === 'contenido' && (
                <div>
                  <h3>Contenido del Paquete</h3>
                  <ul>
                    <li>Archivo PDF con planos técnicos ({plano.total_paginas || 1} páginas)</li>
                    <li>Código G optimizado (si aplica)</li>
                    <li>Lista de herramientas requeridas</li>
                    <li>Instrucciones de mecanizado paso a paso</li>
                    <li>Notas técnicas y recomendaciones</li>
                    <li>Soporte técnico por 30 días</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      <WhatsAppButton
        phoneNumber="573194283570"
        message={`Hola, estoy interesado en el plano: ${plano.titulo}`}
      />
    </div>
  );
};

export default PlanoDetalle;