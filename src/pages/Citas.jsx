import { useEffect, useState } from 'react';
import '../styles/pages/Citas.css';

function fmtFecha(f) {
  if (!f) return '—';
  const date = new Date(f);
  const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${date.getDate()} ${meses[date.getMonth()]} ${date.getFullYear()}`;
}

export default function TusCitas() {
  const [citas, setCitas] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    fetch("https://rednorte-gestion-osku.onrender.com/api/citaMedica")
      .then(res => res.json())
      .then(data => setCitas(data))
      .catch(() => setCitas([]));
  }, []);

  const cancelarCita = (id) => {
    const updated = citas.map((cita) =>
      cita.id === id ? { ...cita, estado: 'Expirada' } : cita
    );
    setCitas(updated);
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
                    <button className={`btn ${activa ? 'btn-verde' : 'btn-deshabilitado'}`} disabled={!activa}>Reagendar</button>
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
                        <span className="detail-value">Sin síntomas registrados</span>
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
                        <span className="detail-value">—</span>
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