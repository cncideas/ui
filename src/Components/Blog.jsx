import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import WhatsAppButton from '../Components/WhatsappButton';
import '../assets/styles/Blog.css';

const Blog = () => {  const [currentPage, setCurrentPage] = useState(1);
    const videosPerPage = 6;
  
    // Datos de ejemplo para los videos del blog
    // En un caso real, esto vendría de tu backend
    const videosPosts = [
      {
        id: 1,
        title: 'Armado y puesta a punto CNC Router 1325 China',
        excerpt: 'Aprende los factores clave que debes considerar al seleccionar software CNC para optimizar tu producción.',
        videoId: 'ba1NEP927SU', // ID del video de YouTube
        thumbnailUrl: 'https://img.youtube.com/vi/ba1NEP927SU/maxresdefault.jpg', // Miniatura del video
        date: '12 Mayo, 2025',
        author: 'Carlos Martínez',
        category: 'CNC Router',
        slug: 'como-elegir-software-cnc'
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
        slug: 'tendencias-automatizacion-industrial-2025'
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
        slug: 'optimizacion-rutas-corte'
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
        slug: 'integracion-cad-cam-cnc'
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
        slug: 'mantenimiento-preventivo-cnc'
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
        slug: 'reducir-desperdicio-material-cnc'
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
        slug: 'seguridad-fabricacion-cnc'
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
        slug: 'industria-4-0-cnc-conectado'
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
        slug: 'comparativa-control-local-vs-nube'
      }
    ];
  
    // Cálculo para la paginación
    const indexOfLastPost = currentPage * videosPerPage;
    const indexOfFirstPost = indexOfLastPost - videosPerPage;
    const currentVideos = videosPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(videosPosts.length / videosPerPage);
  
    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
    // Funciones para navegación entre páginas
    const goToPreviousPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };
  
    const goToNextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    };
  
    return (
      <div className="blog-page video-blog">
        {/* Header/Navbar */}
        <Navbar />
        
        {/* Blog Hero Section */}
        <section className="blog-hero-section">
          <div className="container">
            <div className="blog-hero-content">
              <h1>Nuestros Videos</h1>
              <p>Tutoriales, demostraciones y tendencias en software CNC</p>
            </div>
          </div>
        </section>
        
        {/* Blog Filters Section */}
        <section className="blog-filters">
          <div className="container">
            <div className="filters-container">
              <div className="categories-filter">
                <span>Categorías:</span>
                <ul className="category-list">
                  <li className="active"><a href="#">Todos</a></li>
                  <li><a href="#">Software</a></li>
                  <li><a href="#">Tutoriales</a></li>
                  <li><a href="#">Tendencias</a></li>
                  <li><a href="#">Industria 4.0</a></li>
                </ul>
              </div>
              <div className="search-filter">
                <input type="text" placeholder="Buscar videos..." />
                <button className="search-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Video Posts Grid */}
        <section className="blog-posts-section">
          <div className="container">
            <div className="blog-posts-grid">
              {currentVideos.map(post => (
                <div className="blog-post-card video-card" key={post.id}>
                  <div className="post-image video-thumbnail">
                    <Link to={`/video/${post.slug}`}>
                      {/* Miniatura del video de YouTube */}
                      <img src={post.thumbnailUrl} alt={post.title} />
                      {/* Overlay de play */}
                      <div className="video-play-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </div>
                    </Link>
                    <div className="post-category">{post.category}</div>
                  </div>
                  <div className="post-content">
                    <h3 className="post-title">
                      <Link to={`/video/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="post-excerpt">{post.excerpt}</p>
                    <div className="post-meta">
                      <div className="post-author">{post.author}</div>
                      <div className="post-date">{post.date}</div>
                    </div>
                    <Link to={`/video/${post.slug}`} className="read-more">
                      Ver video
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={goToPreviousPage} 
                  className={`pagination-arrow ${currentPage === 1 ? 'disabled' : ''}`}
                  disabled={currentPage === 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                
                <div className="pagination-numbers">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => paginate(index + 1)}
                      className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={goToNextPage} 
                  className={`pagination-arrow ${currentPage === totalPages ? 'disabled' : ''}`}
                  disabled={currentPage === totalPages}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </section>
        
        {/* Newsletter Section */}
        <section className="newsletter-section">
          <div className="container">
            <div className="newsletter-container">
              <div className="newsletter-content">
                <h2>Suscríbete a nuestro canal</h2>
                <p>Recibe notificaciones sobre nuestros nuevos videos y tutoriales directamente en tu correo.</p>
              </div>
              <div className="newsletter-form">
                <input type="email" placeholder="Tu correo electrónico" />
                <button className="btn btn-primary">Suscribirse</button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <Footer />
  
        {/* WhatsApp Button */}
        <WhatsAppButton 
          phoneNumber="573194283570" 
          message="Hola, estoy interesado en conocer más sobre tus productos de software CNC" 
        />
      </div>
    );
  };

export default Blog;