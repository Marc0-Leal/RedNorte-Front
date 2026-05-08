import { Container } from 'react-bootstrap';
import '../styles/pages/Home.css';
import Testimonios from '../components/organism/Testimonios';
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

  return (
    
    <div className="home-page">
      { }
      <section className="section-white">
        <div className="hero-container">
          <div>
            <h1 className="hero-title">
              Plataforma Inteligente de Gestión de Salud Pública
            </h1>
            <p className="hero-description">
              RedNorte optimiza la gestión de listas de espera, reasignación
              automática de citas médicas y comunicación con pacientes.
            </p>
            <div className="button-group">
              <button className="secondary-button" onClick={() => navigate("/Agendar-cita")}>Agendar Cita</button>
              <button className="outline-button" onClick={() => navigate("/tus-citas")}>Ver Tus Citas</button>
            </div>
          </div>
          <div className="image-wrapper">
            <img src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1200&auto=format&fit=crop" alt="Hospital" className="hero-image"/>
          </div>
        </div>
      </section>

      {/* Problemas Detectados */}
      <section className="section-red">
        <div className="hero-container">
          <div>
            <h1 className="hero-title">
              Nuestra misión
            </h1>
            <p className="hero-description-red-section">
              Nuestra misión como RedNorte es garantizar una atención médica oportuna, equitativa y de calidad para todas las personas del norte del país. 
              Buscamos optimizar la gestión de las listas de espera mediante soluciones tecnológicas innovadoras, promoviendo la integración entre hospitales y centros de salud, y fortaleciendo la comunicación con los pacientes.
            </p>
        </div>
        </div>
      </section>

      <Testimonios />

      {/* Estadisticas */}
      <section className="section-red">
        <div className="stats-container">
          <div className="stats-grid">
            {[
              { number: '25+', label: 'Hospitales Integrados' },
              { number: '150K+', label: 'Pacientes Registrados' },
              { number: '98%', label: 'Reasignación Exitosa' },
              { number: '24/7', label: 'Disponibilidad del Sistema' },
            ].map((item, index) => (
              <div
                key={index}
                className="stat-card"
              >
                <h3 className="stat-number">{item.number}</h3>
                <p className="stat-label">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mejorar la asistencia */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Mejora la Gestión de Atención Médica</h2>
          <p className="hero-description">
            Una plataforma diseñada para optimizar recursos, reducir tiempos de
            espera y mejorar la experiencia de los pacientes en la red pública
            de salud.
          </p>
          <button className="outline-button" onClick={() => navigate("/Agendar-cita")}>Agenda tu cita</button>
        </div>
      </section>
    
      {/* Footer */}
      <footer className="footer">
        <p>© 2026 Servicio Público de Salud RedNorte</p>
      </footer>
    </div>
  );
}

export default Home;