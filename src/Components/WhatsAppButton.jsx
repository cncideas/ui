import React from 'react';
import '../assets/styles/WhatsAppButton.css';

const WhatsAppButton = ({ phoneNumber, message }) => {
  // Formato para el enlace de WhatsApp
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  
  return (
    <a 
      href={whatsappUrl} 
      className="whatsapp-button"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatea con nosotros por WhatsApp"
    >
      <div className="whatsapp-icon">
        {/* SVG del ícono de WhatsApp */}
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M17.6 6.32A8.39 8.39 0 0 0 12.01 4A8.48 8.48 0 0 0 3.53 12.5a8.5 8.5 0 0 0 1.19 4.28L3.5 21l4.36-1.23a8.5 8.5 0 0 0 4.14 1.06 8.49 8.49 0 0 0 8.47-8.47c0-2.28-.88-4.41-2.47-6.04zm-5.59 13.01h-.01a7.02 7.02 0 0 1-3.64-1l-.26-.15-2.7.76.76-2.8-.17-.27a7.07 7.07 0 0 1-1.07-3.71 7.02 7.02 0 0 1 7.01-7.01c1.87 0 3.63.73 4.95 2.05a6.96 6.96 0 0 1 2.04 4.95 7.02 7.02 0 0 1-7.01 6.99zm3.85-5.24c-.21-.11-1.25-.62-1.45-.69-.19-.07-.33-.1-.47.11-.14.21-.54.69-.66.83-.12.14-.24.15-.45.05-.21-.11-.89-.33-1.69-1.05-.62-.56-1.05-1.25-1.17-1.46-.12-.21-.01-.33.09-.43.09-.1.21-.26.31-.39.1-.13.14-.22.21-.37.07-.15.03-.28-.02-.39-.05-.11-.47-1.13-.64-1.55-.17-.41-.34-.36-.47-.36-.12 0-.26-.01-.4-.01-.14 0-.37.05-.56.27-.19.21-.72.71-.72 1.73s.74 2.01.84 2.15c.1.13 1.47 2.24 3.56 3.14.5.21.89.34 1.19.44.5.16.96.14 1.32.08.4-.06 1.25-.51 1.42-1.01.18-.49.18-.92.13-1.01-.05-.08-.19-.14-.4-.25z"/>
        </svg>
      </div>
      <span>Chatea con nosotros</span>
    </a>
  );
};

export default WhatsAppButton;