import React, { useState, useRef } from 'react';
import '../assets/styles/ProductZoom.css';

const ProductZoom = ({ smallImageSrc, largeImageSrc, alt }) => {
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseEnter = () => {
    setShowZoom(true);
  };

  const handleMouseLeave = () => {
    setShowZoom(false);
  };

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      
      // Calcular posición relativa del cursor dentro del contenedor (0-1)
      const relativeX = Math.max(0, Math.min(1, (e.clientX - left) / width));
      const relativeY = Math.max(0, Math.min(1, (e.clientY - top) / height));
      
      setZoomPosition({ x: relativeX, y: relativeY });
    }
  };

  return (
    <div className="product-zoom-container">
      <div 
        ref={containerRef}
        className="product-image-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <img 
          src={smallImageSrc} 
          alt={alt} 
          className="product-image"
        />
        {showZoom && (
          <div className="lens-indicator"></div>
        )}
      </div>
      
      {showZoom && (
        <div className="zoom-view">
          <div 
            className="zoomed-image" 
            style={{
              backgroundImage: `url(${largeImageSrc || smallImageSrc})`,
              backgroundPosition: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ProductZoom;