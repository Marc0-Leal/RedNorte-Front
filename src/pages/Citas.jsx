import { useEffect, useState } from 'react';
import '../styles/pages/Citas.css';
import Cookies from 'js-cookie';
import CitaService from '../services/CitaService';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

function fmtFecha(f) {
  if (!f) return '—';
  const [year, month, day] = f.split('T')[0].split('-');
  const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${parseInt(day)} ${meses[parseInt(month) - 1]} ${year}`;
}

export default function TusCitas() {
  const [citas, setCitas] = useState([]);
  const [openId, setOpenId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    CitaService.getAll()
      .then(data => setCitas(Array.isArray(data) ? data : []))
      .catch(() => setCitas([]));
  }, []);

  const cancelarCita = async (id) => {
    const confirmar = window.confirm('¿Deseas cancelar esta cita?');
    if (!confirmar) return;
    try {
      const cita = citas.find((c) => c.id === id);
      await CitaService.delete(id);
      setCitas((prev) => prev.filter((c) => c.id !== id));
      try {
        await axios.post(
          "https://rednorte-api-gateway-k27o.onrender.com/api/notificaciones/send-email",
          {
            to: cita.cliente.correo,
            tipoAviso: "citaEliminada",
            fecha: cita.fecha,
          },
          { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
        );
      } catch (emailErr) {
        console.warn("No se pudo enviar el correo de cancelación:", emailErr);
      }
    } catch (err) {
      alert('Error al cancelar la cita. Intenta de nuevo.');
    }
  };

  const toggleOpen = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="pagina">
      <div className="contenedor">
        <h3 className="titulo">Tus citas</h3>

        {citas.length === 0 ? (
          <p>No tienes citas agendadas</p>
        ) : (
          citas.map((cita) => {
            const isOpen = openId === cita.id;
            const activa = cita.estado === 'Activa';

            return (
              <div className={`card ${isOpen ? 'card--open' : ''}`} key={cita.id}>
                <div
                  className="card-summary"
                  onClick={() => toggleOpen(cita.id)}
                  role="button"
                  aria-expanded={isOpen}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && toggleOpen(cita.id)}
                >
                  <div className="col fecha">{fmtFecha(cita.fecha)}</div>

                  <div className={`col estado ${activa ? 'activa' : 'expirada'}`}>
                    {cita.estado}
                  </div>

                  <div className="col acciones" onClick={(e) => e.stopPropagation()}>
                    <button className={`btn ${activa ? 'btn-verde' : 'btn-deshabilitado'}`} disabled={!activa} onClick={() => navigate(`/reagendar/${cita.id}`)}>Reagendar</button>
                    <button className={`btn ${activa ? 'btn-rojo' : 'btn-deshabilitado'}`} disabled={!activa} onClick={() => cancelarCita(cita.id)}>Cancelar</button>
                  </div>

                  <span className={`chevron ${isOpen ? 'chevron--up' : ''}`}>▾</span>
                </div>

                {isOpen && (
                  <div className="card-detail">
                    <div className="detail-section-title">Datos del paciente</div>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Paciente</span>
                        <span className="detail-value">{cita.cliente ? `${cita.cliente.nombre} ${cita.cliente.apellido}` : '—'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">RUT</span>
                        <span className="detail-value">{cita.cliente?.rut || '—'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Teléfono</span>
                        <span className="detail-value">{cita.cliente?.telefono || '—'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Dirección</span>
                        <span className="detail-value">{cita.cliente?.direccion || '—'}</span>
                      </div>
                      <div className="detail-item detail-item--full">
                        <span className="detail-label">Síntomas</span>
                        <span className="detail-value">{cita.sintomas || 'Sin síntomas registrados'}</span>
                      </div>
                    </div>

                    <div className="detail-section-title">Datos médicos</div>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Médico</span>
                        <span className="detail-value">{cita.medico ? `${cita.medico.nombre} ${cita.medico.apellido}` : '—'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Especialidad</span>
                        <span className="detail-value">{cita.medico?.especialidad || '—'}</span>
                      </div>
                      <div className="detail-item detail-item--full">
                        <span className="detail-label">Centro médico</span>
                        <span className="detail-value">{cita.listaEspera?.hospital?.nombre || '—'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}