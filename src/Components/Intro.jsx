import React from 'react'

function Intro() {
  return (
    <section className="hero-section" id='features'>
    <div className="container">
      <div className="hero-content">
        <h1>CNC IDEAS </h1>
        <p>Adquiere todos los productos relacionados con cnc aqui!!!</p>
        <div className="hero-buttons">
          <a href="#demo" className="btn btn-primary">Ir a Tienda</a>
          <a href="#learn-more" className="btn btn-secondary">Contactanos</a>
        </div>
      </div>
      <div className="hero-image">
        <img src="/logo.png" alt="Software CNC en acción" />
      </div>
    </div>
  </section>
  )
}

export default Intro