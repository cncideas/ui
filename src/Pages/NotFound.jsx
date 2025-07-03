import { Link } from 'react-router-dom';
import '../assets/styles/Home.css';

export default function NotFound() {
  return (
    <section className="hero-section" style={{ textAlign: 'center', paddingTop: '200px', paddingBottom: '100px' }}>
      <div className="container">
        <div className="hero-content" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '72px', marginBottom: '20px', color: '#0f172a' }}>404</h1>
          <p style={{ fontSize: '20px', color: '#64748b', marginBottom: '32px' }}>
            La página que estás buscando no existe o fue movida.
          </p>
          <div className="hero-buttons" style={{ justifyContent: 'center' }}>
            <Link to="/" className="btn btn-primary btn-large">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
