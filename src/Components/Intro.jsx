import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

function Intro() {
  return (
    <section className="hero-section" id='features'>
    <div className="container">
      <div className="hero-content">
        <h1>CNC IDEAS </h1>
        <p>Adquiere todos los productos relacionados con cnc aqui!!!</p>
        <div className="hero-buttons">
          <Link to={"/tienda"} className="btn btn-primary">Ir a Tienda</Link>
          <Link to={"/contactenos"} className="btn btn-secondary">Contactanos</Link>
      
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