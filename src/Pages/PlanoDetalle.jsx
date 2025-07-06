import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPlanoById,
  fetchPlanoPreview,
  selectSelectedPlano,
  selectPlanosLoading,
  selectPreviewLoading,
  selectPreviewData,
  clearPreviewData
} from '../store/slices/planosSlice';
import '../assets/styles/PlanoDetalle.css';
import Navbar from '../Components/Navbar';
import WhatsAppButton from '../Components/WhatsAppButton';
import Footer from '../Components/Footer';

const PlanoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const plano = useSelector(selectSelectedPlano);
  const cargando = useSelector(selectPlanosLoading);
  const previewLoading = useSelector(selectPreviewLoading);
  const previewData = useSelector(state => selectPreviewData(state, id));
  
  const [intentosPreview, setIntentosPreview] = useState(0);
  const [errorPreview, setErrorPreview] = useState(null);
  const [tabActiva, setTabActiva] = useState('descripcion');
  const [paginaActual, setPaginaActual] = useState(1);

  // Calcular si tiene archivo de forma estable
  const tieneArchivo = useMemo(() => {
    return plano && (
      plano.archivo || 
      plano.tieneArchivo || 
      plano.archivo === 'archivo-disponible' ||
      (plano.total_paginas && plano.total_paginas > 0)
    );
  }, [plano]);

  // Cargar plano inicial
  useEffect(() => {
    dispatch(fetchPlanoById(id));
    dispatch(clearPreviewData(id));
  }, [dispatch, id]);

  // Cargar preview cuando sea necesario
  useEffect(() => {
    if (tieneArchivo && !previewData && !previewLoading && intentosPreview < 3) {
      setIntentosPreview(prev => prev + 1);
      dispatch(fetchPlanoPreview(id))
        .unwrap()
        .then(() => {
          setErrorPreview(null);
        })
        .catch((error) => {
          setErrorPreview(error.message || 'Error al cargar preview');
        });
    }
  }, [dispatch, id, tieneArchivo, previewData, previewLoading, intentosPreview]);

  const reintentarPreview = () => {
    setIntentosPreview(0);
    setErrorPreview(null);
    dispatch(clearPreviewData(id));
    
    setTimeout(() => {
      if (tieneArchivo) {
        dispatch(fetchPlanoPreview(id))
          .unwrap()
          .then(() => {
            setErrorPreview(null);
          })
          .catch((error) => {
            setErrorPreview(error.message || 'Error al cargar preview');
          });
      }
    }, 100);
  };

const agregarAlCarrito = () => {
  // Usar el mismo localStorage que productos
  const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
  const existente = carrito.find(item => item._id === plano._id);

  if (existente) {
    alert('Este plano ya está en tu carrito');
    return;
  }

  carrito.push({
    _id: plano._id,
    nombre: plano.titulo, // Cambiar 'titulo' por 'nombre' para consistencia
    precio: plano.precio,
    imagen: plano.preview_imagen, // Cambiar 'preview_imagen' por 'imagen'
    cantidad: 1, // Agregar cantidad para consistencia
    tipo: 'plano' // Mantener tipo para diferenciar
  });

  localStorage.setItem('carrito', JSON.stringify(carrito));
  
  // Notificación moderna como en productos
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    font-weight: 600;
    animation: slideIn 0.5s ease-out;
  `;
  notification.innerHTML = `✅ ${plano.titulo} agregado al carrito`;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
};

const comprarAhora = () => {
  agregarAlCarrito();
  setTimeout(() => navigate('/carrito'), 500); // Agregar delay como en productos
};

  const formatearDificultad = (dificultad) => {
    const niveles = {
      'principiante': 'Principiante',
      'intermedio': 'Intermedio',
      'avanzado': 'Avanzado'
    };
    return niveles[dificultad] || dificultad;
  };

  const cambiarPagina = (nuevaPagina) => {
    if (!previewData) return;
    
    const paginasDisponibles = previewData.previewPages || [1, 2, 3];
    
    if (nuevaPagina >= 1 && nuevaPagina <= paginasDisponibles.length) {
      setPaginaActual(nuevaPagina);
    }
  };

  const renderizarPreviewPDF = () => {
    // Sin archivo disponible
    if (!plano || !tieneArchivo) {
      return (
        <div className="pdf-no-disponible">
          <i className="fas fa-file-pdf"></i>
          <p>Vista previa no disponible</p>
          <small>Este plano no tiene archivo asociado</small>
        </div>
      );
    }

    // Cargando
    if (previewLoading) {
      return (
        <div className="pdf-loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Cargando vista previa...</p>
        </div>
      );
    }

    // Error
    if (errorPreview || (intentosPreview >= 3 && !previewData)) {
      return (
        <div className="pdf-error">
          <i className="fas fa-exclamation-triangle"></i>
          <p>Error al cargar vista previa</p>
          {errorPreview && <small>{errorPreview}</small>}
          <button 
            className="btn btn-sm"
            onClick={reintentarPreview}
            disabled={previewLoading}
            style={{ marginTop: '10px' }}
          >
            Reintentar
          </button>
        </div>
      );
    }

    // Esperando datos
    if (!previewData && !previewLoading) {
      return (
        <div className="pdf-waiting">
          <i className="fas fa-clock"></i>
          <p>Preparando vista previa...</p>
          <button 
            className="btn btn-sm"
            onClick={reintentarPreview}
            style={{ marginTop: '10px' }}
          >
            Cargar Preview
          </button>
        </div>
      );
    }

    // Preview exitoso
    const paginasDisponibles = previewData.previewPages || [1, 2, 3];
    const totalPaginas = plano.total_paginas || paginasDisponibles.length;
    const paginaReal = paginasDisponibles[paginaActual - 1];
    
    return (
      <div className="pdf-preview-container">
        <div className="pdf-controls">
          <button 
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            className="btn btn-sm"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="pagina-info">
            Página {paginaReal} de {totalPaginas} (Vista previa)
          </span>
          <button 
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === paginasDisponibles.length}
            className="btn btn-sm"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        
        <div className="pdf-viewer">
          <PDFPage 
            previewData={previewData}
            paginaActual={paginaActual}
            paginaReal={paginaReal}
            planoTitulo={plano.titulo}
          />
        </div>
        
        <div className="pdf-watermark">
          <div className="watermark-content">
            <i className="fas fa-lock"></i>
            <p>Vista previa limitada - {paginasDisponibles.length} de {totalPaginas} páginas disponibles</p>
            <small>Compra el plano para desbloquear todas las páginas</small>
          </div>
        </div>
        
        <div className="pdf-navigation-dots">
          {paginasDisponibles.map((pagina, index) => (
            <button
              key={pagina}
              className={`dot ${paginaActual === index + 1 ? 'active' : ''}`}
              onClick={() => cambiarPagina(index + 1)}
              title={`Página ${pagina}`}
            />
          ))}
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
            <div className="plano-preview-section">
              <h2>Vista Previa</h2>
              {renderizarPreviewPDF()}
            </div>

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

const PDFPage = ({ previewData, paginaActual, paginaReal, planoTitulo }) => {
  if (!previewData || !previewData.previewUrl) {
    return (
      <div className="pdf-placeholder">
        <i className="fas fa-file-pdf"></i>
        <p>Página {paginaReal}</p>
        <small>Compra el plano para ver el contenido completo</small>
      </div>
    );
  }

  return (
    <div className="pdf-page-container">
      <iframe
        src={previewData.previewUrl}
        title={`${planoTitulo} - Página ${paginaReal}`}
        className="pdf-frame"
        width="100%"
        height="600px"
        style={{ border: 'none' }}
      />
    </div>
  );
};

export default PlanoDetalle;