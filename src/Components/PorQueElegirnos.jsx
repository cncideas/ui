import React from 'react'

function PorQueElegirnos() {
  return (
    <section className="how-it-works-section" id="por-que-elegirnos">
        <div className="container">
          <div className="section-header">
            <h2>🔧 ¿Por qué elegirnos?</h2>
            <p>En solo 3 pasos entenderás por qué CNC IDEAS es tu mejor aliado CNC</p>
          </div>
          
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>🚀 Tecnología que impulsa tu precisión</h3>
                <p>Nuestras máquinas CNC están diseñadas para maximizar la eficiencia, la exactitud y la durabilidad. No solo vendemos equipos, vendemos evolución para tus proyectos.</p>
              </div>
              <div className="step-image">
                <img src="/1.png" alt="Proceso de diseño" />
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>🤝 Asesoría experta desde el primer clic</h3>
                <p>Te acompañamos desde el momento en que visitas nuestra web hasta la puesta en marcha de tu equipo. No eres un número, eres parte de nuestra comunidad CNC.</p>
              </div>
              <div className="step-image">
                <img src="/2.png" alt="Proceso de configuración" />
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>🛠️ Repuestos, soporte y todo lo que necesitas</h3>
                <p>Accede a productos de calidad, repuestos originales y soporte técnico en tiempo récord. Aquí no solo compras, aquí construyes sin pausas.</p>
              </div>
              <div className="step-image">
                <img src="/3.png" alt="Proceso de producción" />
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default PorQueElegirnos