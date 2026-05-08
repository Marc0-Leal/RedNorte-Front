import { useState } from 'react';
import '../styles/pages/Citas.css';

export default function Citas() {
  const [citas, setCitas] = useState([
    { id: 1, fecha: '25/07', estado: 'Activa', activa: true },
    { id: 2, fecha: '25/06', estado: 'Expirada', activa: false },
  ]);

  const cancelarCita = (id) => {
    setCitas((prev) =>
      prev.map((cita) =>
        cita.id === id
          ? { ...cita, estado: 'Expirada', activa: false }
          : cita
      )
    );
  };

  return (
    <div className="pagina">
      <div className="contenedor">
        <h3 className="titulo">Tus citas</h3>
        {citas.map((cita) => (
          <div className="card">
            <div className="col fecha">{cita.fecha}</div>
            <div className={`col estado ${cita.activa ? 'activa' : 'expirada'}`}>
                {cita.estado}
            </div>
            <div className="col acciones">
                <button
                className={`btn ${cita.activa ? 'btn-verde' : 'btn-deshabilitado'}`}
                disabled={!cita.activa}>
                Reagendar
                </button>
                <button
                className={`btn ${cita.activa ? 'btn-rojo' : 'btn-deshabilitado'}`}
                disabled={!cita.activa}
                onClick={() => cancelarCita(cita.id)}>
                Cancelar
                </button>
            </div>
            </div>
        ))}
      </div>
    </div>
  );
}