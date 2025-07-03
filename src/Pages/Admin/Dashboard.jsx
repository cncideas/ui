import React, { useState, useEffect } from 'react';
import '../../assets/styles/Admin/Dashboard.css';
import Sidebar from '../../Components/Admin/Sidebar';
import ProductsManagement from '../../Components/Admin/ProductsManagement';
import CategoryManagement from '../../Components/Admin/CategoryManagement';
import PlanosManagement from '../../Components/Admin/PlanosManagement';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      // Cerrar sidebar en móvil cuando se cambia el tamaño
      if (window.innerWidth <= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Cerrar sidebar móvil cuando se selecciona una sección
  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [activeSection, isMobile]);

  // Cerrar sidebar móvil al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isMobileMenuOpen) {
        const sidebar = document.querySelector('.dashboard-sidebar');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (sidebar && !sidebar.contains(event.target) && 
            mobileMenuBtn && !mobileMenuBtn.contains(event.target)) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isMobileMenuOpen]);

  const renderContent = () => {
    switch(activeSection) {
      case 'overview':
        return (
          <div className="dashboard-overview">
            <h2>Panel de Control</h2>
            <p>Bienvenido al sistema de administración. Desde aquí puedes gestionar todos los aspectos de tu aplicación de manera eficiente y organizada.</p>
          </div>
        );
      case 'products':
        return (
          <div className="dashboard-section">
            <ProductsManagement/>
          </div>
        );
      case 'blog':
        return (
          <div className="dashboard-section">
            <h2>Gestión de Blog</h2>
            <p>Aquí podrás crear, editar y gestionar todas las publicaciones del blog de tu aplicación.</p>
          </div>
        );
      case 'categorias':
        return (
          <div className="dashboard-section">
          <CategoryManagement/>
          </div>
        );
      case 'planos':
        return (
          <div className="dashboard-section">
           <PlanosManagement/>
          </div>
        );
      case 'settings':
        return (
          <div className="dashboard-section">
            <h2>Configuración</h2>
            <p>Ajusta los parámetros generales del sistema y personaliza la experiencia de usuario.</p>
          </div>
        );
      default:
        return (
          <div className="dashboard-overview">
            <h2>Panel de Control</h2>
            <p>Bienvenido al sistema de administración. Desde aquí puedes gestionar todos los aspectos de tu aplicación de manera eficiente y organizada.</p>
          </div>
        );
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Overlay para móvil */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="mobile-overlay" 
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
        />
      )}

      {/* Sidebar Component */}
      <Sidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
        className={`dashboard-sidebar ${
          isMobile ? (isMobileMenuOpen ? 'mobile-open' : 'mobile-hidden') : ''
        }`}
      />

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* TopBar mejorado */}
        <header className="dashboard-topbar">
          <div className="topbar-content">
            <div className="topbar-left">
              <button 
                className="mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Abrir menú"
                title="Abrir menú de navegación"
              >
                <span style={{
                  display: 'block',
                  width: '18px',
                  height: '2px',
                  background: 'currentColor',
                  margin: '3px 0',
                  transition: '0.3s',
                  transform: isMobileMenuOpen ? 'rotate(-45deg) translate(-5px, 6px)' : 'none'
                }}></span>
                <span style={{
                  display: 'block',
                  width: '18px',
                  height: '2px',
                  background: 'currentColor',
                  margin: '3px 0',
                  transition: '0.3s',
                  opacity: isMobileMenuOpen ? '0' : '1'
                }}></span>
                <span style={{
                  display: 'block',
                  width: '18px',
                  height: '2px',
                  background: 'currentColor',
                  margin: '3px 0',
                  transition: '0.3s',
                  transform: isMobileMenuOpen ? 'rotate(45deg) translate(-5px, -6px)' : 'none'
                }}></span>
              </button>
              <h1>Sistema de Administración</h1>
            </div>
            <div className="topbar-actions">
              <button 
                className="notification-btn" 
                title="Notificaciones"
                aria-label="Ver notificaciones"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
              </button>
              <div className="admin-user">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <span>Administrador</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="dashboard-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;