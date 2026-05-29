import { useEffect, useState } from 'react';
import '../styles/pages/Citas.css';
 
{/* Funcion para pasar las fechas de calendario a String*/ }
function fmtFecha(f) {
  if (!f) return '—';
  const [y, m, d] = f.split('-');
  const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${parseInt(d)} ${meses[parseInt(m) - 1]} ${y}`;
}
{/* Funcion para pasar el precio a String*/ }
function fmtPeso(v) {
  const n = Number(v);
  if (isNaN(n)) return '—';
  return '$' + n.toString();
}
 
export default function TusCitas() {
  const [citas, setCitas] = useState([]);
  const [openId, setOpenId] = useState(null);
 
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("citas")) || [];
    setCitas(stored);
  }, []);
 
  const cancelarCita = (id) => {
    const updated = citas.map((cita) =>
      cita.id === id
        ? { ...cita, estado: 'Expirada', activa: false }
        : cita
    );
    setCitas(updated);
    localStorage.setItem("citas", JSON.stringify(updated));
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

            return (
              <div
                className={`card ${isOpen ? 'card--open' : ''}`}
                key={cita.id}
              >
                
                <div
                  className="card-summary" onClick={() => toggleOpen(cita.id)} role="button" aria-expanded={isOpen} tabIndex={0}  onKeyDown={(e) => e.key === 'Enter' && toggleOpen(cita.id)}>
                  <div className="col fecha">{fmtFecha(cita.fecha)}</div>

                  <div className={`col estado ${cita.activa ? 'activa' : 'expirada'}`}>
                    {cita.estado}
                  </div>

                  <div className="col acciones" onClick={(e) => e.stopPropagation()}>
                    <button className={`btn ${cita.activa ? 'btn-verde' : 'btn-deshabilitado'}`} disabled={!cita.activa}> Reagendar </button>

                    <button className={`btn ${cita.activa ? 'btn-rojo' : 'btn-deshabilitado'}`} disabled={!cita.activa} onClick={() => cancelarCita(cita.id)}> Cancelar </button>
                  </div>
 
                  <span className={`chevron ${isOpen ? 'chevron--up' : ''}`}>▾</span>
                </div>
 
                {/*Datos de la cita que se expande */}
                {isOpen && (
                  <div className="card-detail">
                    <div className="detail-section-title">Datos del paciente</div>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Paciente</span>
                        <span className="detail-value">{cita.paciente || '—'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">RUT</span>
                        <span className="detail-value">{cita.rut || '—'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Teléfono</span>
                        <span className="detail-value">{cita.telefono || '—'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Dirección</span>
                        <span className="detail-value">{cita.direccion || '—'}</span>
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
                        <span className="detail-value">{cita.medico || '—'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Especialidad</span>
                        <span className="detail-value">{cita.especialidad || '—'}</span>
                      </div>
                      <div className="detail-item detail-item--full">
                        <span className="detail-label">Centro médico</span>
                        <span className="detail-value">{cita.centroMedico || '—'}</span>
                      </div>
                    </div>
 
                    <div className="detail-grid" style={{ marginTop: '10px' }}>
                      <div className="detail-item">
                        <span className="detail-label">Precio</span>
                        <span className="detail-value">{fmtPeso(cita.precio)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Total</span>
                        <span className="detail-value">{fmtPeso(cita.total)}</span>
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