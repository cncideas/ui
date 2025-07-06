import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import WhatsAppButton from '../Components/WhatsAppButton';
import '../assets/styles/VideoDetail.css'; // Crearemos este archivo de estilos después

const VideoDetail = () => {
  const { slug } = useParams();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // En una aplicación real, obtendrías estos datos de una API
  // Aquí simulamos la búsqueda del video basado en el slug de la URL
  useEffect(() => {
    // Simulación de carga de datos
    setLoading(true);
    
    // Datos de ejemplo (los mismos que en Blog.jsx)
    const videosData = [
      {
        id: 1,
        title: 'Armado y puesta a punto CNC Router 1325 China',
        excerpt: 'Aprende los factores clave que debes considerar al seleccionar software CNC para optimizar tu producción.',
        videoId: 'ba1NEP927SU', // ID del video de YouTube
        thumbnailUrl: 'https://img.youtube.com/vi/ba1NEP927SU/maxresdefault.jpg',
        date: '12 Mayo, 2025',
        author: 'Carlos Martínez',
        category: 'CNC Router',
        slug: 'como-elegir-software-cnc',
        description: `
          En este tutorial detallado, exploramos el proceso completo de armado y puesta a punto
          de un CNC Router 1325 importado de China. Cubrimos desde el desembalaje y verificación
          de componentes, hasta la calibración final y primeras pruebas de corte.
          
          Puntos clave del video:
          - Inspección inicial y verificación de componentes
          - Montaje del marco y sistema de guías
          - Instalación del sistema eléctrico y motores
          - Configuración del software de control
          - Calibración de ejes y herramientas
          - Pruebas de precisión y ajustes finales
        `
      },
      {
        id: 2,
        title: 'Tendencias en automatización industrial para 2025',
        excerpt: 'Descubre las últimas innovaciones en automatización industrial y cómo pueden beneficiar a tu negocio.',
        videoId: 'dQw4w9WgXcQ',
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        date: '5 Mayo, 2025',
        author: 'Laura Sánchez',
        category: 'Tendencias',
        slug: 'tendencias-automatizacion-industrial-2025',
        description: `
          Analizamos las principales tendencias que están definiendo el futuro de la automatización
          industrial en 2025, con enfoque en las tecnologías emergentes que están transformando
          los procesos de fabricación y las operaciones CNC.
          
          Temas principales:
          - Integración de IA en sistemas CNC
          - Fabricación aditiva y su convergencia con métodos sustractivos
          - Sistemas de monitoreo remoto y mantenimiento predictivo
          - Plataformas colaborativas para gestión de producción
          - Sostenibilidad y eficiencia energética en procesos CNC
        `
      },
      {
        id: 3,
        title: 'Optimización de rutas de corte: Guía completa',
        excerpt: 'Mejora la eficiencia de tus máquinas CNC aprendiendo a optimizar las rutas de corte con nuestro software.',
        videoId: 'dQw4w9WgXcQ',
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        date: '28 Abril, 2025',
        author: 'Miguel González',
        category: 'Tutoriales',
        slug: 'optimizacion-rutas-corte',
        description: `
          Aprende técnicas avanzadas para optimizar las rutas de corte en tus proyectos CNC.
          Este tutorial detallado te muestra cómo reducir tiempos de producción, minimizar
          el desgaste de herramientas y mejorar la calidad final de tus piezas.
          
          El video incluye:
          - Principios fundamentales de optimización de rutas
          - Configuración de parámetros avanzados
          - Técnicas de entrada y salida para diferentes materiales
          - Estrategias para piezas complejas
          - Ejemplos prácticos con antes y después
        `
      },
      {
        id: 4,
        title: 'Integración de sistemas CAD/CAM con software CNC',
        excerpt: 'Aprende a integrar perfectamente tus sistemas CAD/CAM con nuestro software CNC para un flujo de trabajo sin interrupciones.',
        videoId: 'dQw4w9WgXcQ',
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        date: '21 Abril, 2025',
        author: 'Ana Rodríguez',
        category: 'Integración',
        slug: 'integracion-cad-cam-cnc',
        description: `
          Este tutorial muestra cómo crear un flujo de trabajo perfecto desde el diseño hasta
          la fabricación, integrando tus herramientas CAD/CAM preferidas con nuestro software CNC.
          
          Contenido del video:
          - Configuración de exportación e importación de archivos
          - Manejo de capas y propiedades
          - Traducción de parámetros entre sistemas
          - Automatización del flujo de trabajo
          - Solución de problemas comunes
        `
      },
      {
        id: 5,
        title: 'Mantenimiento preventivo de máquinas CNC',
        excerpt: 'Guía completa sobre cómo implementar un programa de mantenimiento preventivo para extender la vida útil de tus máquinas CNC.',
        videoId: 'dQw4w9WgXcQ',
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        date: '15 Abril, 2025',
        author: 'Roberto Pérez',
        category: 'Mantenimiento',
        slug: 'mantenimiento-preventivo-cnc',
        description: `
          Implementa un programa efectivo de mantenimiento preventivo para tus máquinas CNC
          y maximiza su vida útil y precisión. Este video detalla los procedimientos esenciales
          y la frecuencia recomendada para cada tipo de mantenimiento.
          
          Cubrimos:
          - Lubricación y limpieza de componentes críticos
          - Inspección y ajuste de sistemas mecánicos
          - Mantenimiento del sistema eléctrico y electrónico
          - Documentación y seguimiento de mantenimiento
          - Herramientas y suministros recomendados
        `
      },
      {
        id: 6,
        title: 'Cómo reducir el desperdicio de material en procesos CNC',
        excerpt: 'Estrategias efectivas para minimizar el desperdicio de material y aumentar la rentabilidad en tus operaciones CNC.',
        videoId: 'dQw4w9WgXcQ',
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        date: '10 Abril, 2025',
        author: 'Carmen López',
        category: 'Eficiencia',
        slug: 'reducir-desperdicio-material-cnc',
        description: `
          Aprende estrategias prácticas para minimizar el desperdicio de material en tus
          operaciones de CNC, reduciendo costos y mejorando la sostenibilidad de tu producción.
          
          Temas del video:
          - Optimización de diseños para eficiencia de material
          - Técnicas avanzadas de anidado
          - Aprovechamiento de retales y sobrantes
          - Software de gestión de inventario de material
          - Caso de estudio: reducción del 30% en desperdicios
        `
      },
      {
        id: 7,
        title: 'Seguridad en entornos de fabricación CNC',
        excerpt: 'Mejores prácticas y protocolos de seguridad para garantizar un entorno de trabajo seguro con máquinas CNC.',
        videoId: 'dQw4w9WgXcQ',
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        date: '5 Abril, 2025',
        author: 'Javier Torres',
        category: 'Seguridad',
        slug: 'seguridad-fabricacion-cnc',
        description: `
          Este video cubre todos los aspectos de seguridad que debes considerar al operar
          máquinas CNC, desde equipos de protección personal hasta protocolos de emergencia
          y configuraciones de seguridad del software.
          
          Incluye:
          - Equipos de protección personal obligatorios
          - Configuración de parámetros de seguridad
          - Procedimientos de parada de emergencia
          - Manejo seguro de materiales y herramientas
          - Normativas y cumplimiento legal
        `
      },
      {
        id: 8,
        title: 'Industria 4.0: La revolución del CNC conectado',
        excerpt: 'Explora cómo la Industria 4.0 está transformando la fabricación CNC con soluciones conectadas e inteligentes.',
        videoId: 'dQw4w9WgXcQ',
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        date: '1 Abril, 2025',
        author: 'Elena Morales',
        category: 'Industria 4.0',
        slug: 'industria-4-0-cnc-conectado',
        description: `
          Descubre cómo la Industria 4.0 está revolucionando el mundo del CNC con sistemas
          conectados, análisis de datos en tiempo real y toma de decisiones automatizada.
          
          El video explora:
          - Implementación de IoT en máquinas CNC
          - Análisis de datos para optimización de producción
          - Mantenimiento predictivo basado en IA
          - Gemelos digitales para simulación avanzada
          - Casos de éxito en implementación de Industria 4.0
        `
      },
      {
        id: 9,
        title: 'Comparativa: Control de máquina local vs. basado en la nube',
        excerpt: 'Análisis detallado de las ventajas y desventajas de los sistemas de control CNC locales frente a las soluciones basadas en la nube.',
        videoId: 'dQw4w9WgXcQ',
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        date: '25 Marzo, 2025',
        author: 'David Fernández',
        category: 'Comparativas',
        slug: 'comparativa-control-local-vs-nube',
        description: `
          Analizamos en profundidad las diferencias entre los sistemas de control CNC
          tradicionales (locales) y las nuevas soluciones basadas en la nube, para
          ayudarte a tomar la mejor decisión para tu negocio.
          
          Comparamos:
          - Costos iniciales y operativos
          - Seguridad y fiabilidad
          - Accesibilidad y colaboración
          - Requisitos de infraestructura
          - Escalabilidad y actualizaciones
        `
      }
    ];

    // Encontrar el video que coincide con el slug de la URL
    const foundVideo = videosData.find(video => video.slug === slug);
    console.log(foundVideo)
    console.log(slug)
    // Si se encuentra el video, establecerlo como el video actual
    if (foundVideo) {
      setVideo(foundVideo);
      
      // Generar videos relacionados (excluyendo el video actual)
      const related = videosData
        .filter(v => v.id !== foundVideo.id)
        .sort(() => 0.5 - Math.random()) // Ordenar aleatoriamente
        .slice(0, 3); // Tomar solo 3 videos
      
      setRelatedVideos(related);
    }
    
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando video...</p>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="video-not-found">
        <h2>Video no encontrado</h2>
        <p>El video que estás buscando no existe o ha sido eliminado.</p>
        <Link to="/blog" className="btn-primary">Volver al blog</Link>
      </div>
    );
  }

  return (
    <div className="video-detail-page">
      {/* Header/Navbar */}
      <Navbar />
      
      {/* Video Content Section */}
      <section className="video-content-section">
        <div className="container">
          <div className="video-content-layout">
            <div className="main-content">
              <div className="video-player-container">
                <iframe 
                  src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              
              <div className="video-info">
                <h1>{video.title}</h1>
                <div className="video-meta">
                  <span className="video-author">{video.author}</span>
                  <span className="video-date">{video.date}</span>
                  <span className="video-category">{video.category}</span>
                </div>
                <div className="video-description">
                  {video.description.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                
                <div className="video-actions">
                  <button className="btn-share">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="18" cy="5" r="3"></circle>
                      <circle cx="6" cy="12" r="3"></circle>
                      <circle cx="18" cy="19" r="3"></circle>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                    Compartir
                  </button>
                  <button className="btn-download">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Descargar recursos
                  </button>
                </div>
              </div>
            </div>
            
            <div className="sidebar-content">
              <div className="related-videos">
                <h3>Videos relacionados</h3>
                {relatedVideos.map(relatedVideo => (
                  <div className="related-video-card" key={relatedVideo.id}>
                    <Link to={`/video/${relatedVideo.slug}`} className="related-video-thumbnail">
                      <img src={relatedVideo.thumbnailUrl} alt={relatedVideo.title} />
                      <div className="play-icon-small">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </div>
                    </Link>
                    <div className="related-video-info">
                      <h4><Link to={`/video/${relatedVideo.slug}`}>{relatedVideo.title}</Link></h4>
                      <span className="related-video-meta">{relatedVideo.author} • {relatedVideo.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="video-categories">
                <h3>Categorías</h3>
                <ul>
                  <li><Link to="/blog?category=Tutoriales">Tutoriales</Link></li>
                  <li><Link to="/blog?category=Software">Software</Link></li>
                  <li><Link to="/blog?category=Tendencias">Tendencias</Link></li>
                  <li><Link to="/blog?category=Mantenimiento">Mantenimiento</Link></li>
                  <li><Link to="/blog?category=Industria 4.0">Industria 4.0</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
      
      {/* WhatsApp Button */}
      <WhatsAppButton 
        phoneNumber="573194283570" 
        message="Hola, estoy viendo el video sobre CNC y me gustaría más información" 
      />
    </div>
  );
};

export default VideoDetail;