import React from 'react'
import ProductZoom from './ProductZoom'

function Productos() {
  return (
    <section className="features-section" id="productos">
    <div className="container">
      <div className="section-header">
        <h2>Algunos de Nuestros Productos</h2>
        <p>Descubre por qué nuestra tienda  es la elección preferida por profesionales</p>
      </div>

      <div className="features-grid">
  <div className="feature-card">
    <ProductZoom 
      smallImageSrc="/TTS-55.png"
      largeImageSrc="/TTS-55.png"
      alt="Alta Precisión" 
    />
   <h3>TTS-55 PRO 40W</h3>
          <p>TTS-55 PRO 40W máquina de grabado láser cortador láser herramienta de grabado de corte por láser para madera metal aluminio vidrio cuero.</p>
       </div>
  
  <div className="feature-card">
    <ProductZoom 
      smallImageSrc="/CNCTOPBAOS.png"
      largeImageSrc="/CNCTOPBAOS.png"
      alt="Interfaz Intuitiva" 
    />
 <h3>CNCTOPBAOS CNC 3018-PRO</h3>
          <p>Versión 2023 TTC3018 Pro Twotrees original, con board mother de 32 bites y drivers silenciosos, equipo pre ensamblado con caja protectora para la tarjeta en metal y ventilador en tarjeta, diseño para protección de cortos, es la mejor versión disponible en el mercado</p>
        </div>
  
  <div className="feature-card">
    <ProductZoom 
      smallImageSrc="/RATTMMOTOR.png" 
      largeImageSrc="/RATTMMOTOR.png"
      alt="Procesamiento Rápido" 
    />
     <h3>
          RATTMMOTOR 800W Water Cooled Spindle Kit</h3>
          <p>Motor de husillo refrigerado por agua de 2,2 KW ER20 110 V, inversor HY de 2,2 KW VFD 110 V</p>
        </div>
  

</div>


      {/**  
      
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">
            <img src="/TTS-55.png" alt="Icono de precisión" />
          </div>
          <h3>TTS-55 PRO 40W</h3>
          <p>TTS-55 PRO 40W máquina de grabado láser cortador láser herramienta de grabado de corte por láser para madera metal aluminio vidrio cuero.</p>
        </div>
        
        
        
        <div className="feature-card">
          <div className="feature-icon">
            <img src="/CNCTOPBAOS.png" alt="Icono de velocidad" />
          </div>
          <h3>CNCTOPBAOS CNC 3018-PRO</h3>
          <p>Versión 2023 TTC3018 Pro Twotrees original, con board mother de 32 bites y drivers silenciosos, equipo pre ensamblado con caja protectora para la tarjeta en metal y ventilador en tarjeta, diseño para protección de cortos, es la mejor versión disponible en el mercado</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">
            <img src="/RATTMMOTOR.png" alt="Icono de compatibilidad" />
          </div>
          <h3>
          RATTMMOTOR 800W Water Cooled Spindle Kit</h3>
          <p>Motor de husillo refrigerado por agua de 2,2 KW ER20 110 V, inversor HY de 2,2 KW VFD 110 V</p>
        </div>
      </div>*/}
    </div>
  </section>
  )
}

export default Productos