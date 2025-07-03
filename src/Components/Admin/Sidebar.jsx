import React, { useState } from 'react';
import '../../assets/styles/Admin/Sidebar.css';

const Sidebar = ({ activeSection, setActiveSection, isMobileOpen, setIsMobileOpen }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [

    {
      id: 'categorias',
      label: 'Categorias',
      icon: '📁',
      description: 'Gestionar categorias CNC',
      badge: null
    },

    {
      id: 'products',
      label: 'Productos',
      icon: '📦',
      description: 'Gestionar productos CNC',
      badge: null
    },
    
    {
      id: 'blog',
      label: 'Blog',
      icon: '📝',
      description: 'Artículos y noticias'
    },
    {
      id: 'planos',
      label: 'Planos',
      icon: '📐',
      description: 'Descargas y documentos técnicos'
    },
   
   
  ];

  const handleItemClick = (itemId) => {
    setActiveSection(itemId);
    // Cerrar sidebar en móvil después de seleccionar
    if (window.innerWidth <= 768) {
      setIsMobileOpen(false);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Overlay para móviles */}
      {isMobileOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`dashboard-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Header del Sidebar */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            {!isCollapsed && (
              <>
                <div className="logo-icon">
                  <img src='/logotipo.png'></img>
                </div>
                <div className="logo-text">
                  <h3>CNC-IDEAS</h3>
                  <span>Admin Panel</span>
                </div>
              </>
            )}
            {isCollapsed && <div className="logo-icon-collapsed">🏭</div>}
          </div>
          
          {/* Botón de colapso - solo en desktop */}
          <button 
            className="collapse-btn desktop-only"
            onClick={toggleCollapse}
            title={isCollapsed ? 'Expandir sidebar' : 'Contraer sidebar'}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Navegación */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.id} className="nav-item-container">
                <button
                  className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => handleItemClick(item.id)}
                  title={isCollapsed ? item.label : ''}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!isCollapsed && (
                    <>
                      <span className="nav-label">{item.label}</span>
                      {item.badge && (
                        <span className="nav-badge">{item.badge}</span>
                      )}
                    </>
                  )}
                </button>
                
                {/* Tooltip para sidebar colapsado */}
                {isCollapsed && (
                  <div className="nav-tooltip">
                    <div className="tooltip-content">
                      <strong>{item.label}</strong>
                      
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer del Sidebar */}
        
      </aside>
    </>
  );
};

export default Sidebar;