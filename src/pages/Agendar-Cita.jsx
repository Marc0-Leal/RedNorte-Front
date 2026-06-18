import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import CitaService from '../services/CitaService';

export default function AgendarCita() {
  const navigate = useNavigate();
  const [hospitales, setHospitales] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [clienteActual, setClienteActual] = useState(null);
  const [agendada, setAgendada] = useState(false);

  const [formData, setFormData] = useState({
    hospitalId: '',
    medicoId: '',
    fecha: '',
    sintomas: ''
  });

  // 1. Cargar datos iniciales (Cliente logueado y Hospitales)
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      alert('Debes iniciar sesión para agendar una cita.');
      navigate('/login');
      return;
    }

    // Obtener los datos del cliente actual usando el token
    axios.get('https://rednorte-api-gateway-k27o.onrender.com/api/cliente/perfil', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      // Si la API retorna una lista, buscamos el cliente. Si retorna el objeto directo, lo asignamos.
      if (Array.isArray(res.data)) {
        setClienteActual(res.data[0]); 
      } else {
        setClienteActual(res.data);
      }
    })
    .catch(err => console.error('Error obteniendo perfil del cliente:', err));

    // Cargar la lista de centros médicos (hospitales)
    axios.get('https://rednorte-api-gateway-k27o.onrender.com/api/hospital', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setHospitales(res.data))
    .catch(err => console.error('Error cargando centros médicos:', err));
  }, [navigate]);

  // 2. Cargar médicos cuando se seleccione un hospital
  useEffect(() => {
    if (!formData.hospitalId) {
      setMedicos([]);
      return;
    }
    const token = Cookies.get('token');
    axios.get(`https://rednorte-api-gateway-k27o.onrender.com/api/medico/hospital/${formData.hospitalId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setMedicos(res.data))
    .catch(err => console.error('Error cargando médicos:', err));
  }, [formData.hospitalId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 3. Envío del Formulario con la solución para los campos estrictos de la Base de Datos
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clienteActual) {
      alert('No se pudo identificar tu perfil de cliente de forma correcta.');
      return;
    }
    
    try {
      const token = Cookies.get('token');

      // PASO A: Creamos el pago puente de $0 para evadir la restricción 'NOT NULL' en Render
      console.log("Creando pago puente para la base de datos...");
      const pagoRes = await axios.post(
        "https://rednorte-api-gateway-k27o.onrender.com/api/pago",
        {
          monto: 0,
          fecha_pago: formData.fecha || new Date().toISOString().split('T')[0],
          metodo_pago: "efectivo",
          estado: "pendiente"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const nuevoPagoId = pagoRes.data.id;
      console.log("Pago puente creado con éxito. ID:", nuevoPagoId);

      // PASO B: Enviamos la Cita Médica completa cumpliendo todas las restricciones SQL
      console.log("Enviando cita médica al backend...");
      await CitaService.create({
        fecha: formData.fecha,
        hora: 9, // Hora fija (9:00 AM) para cumplir con el 'hora NOT NULL' en la BD
        estado: "Activa",
        medico: { id: Number(formData.medicoId) },
        cliente: { id: Number(clienteActual.id) },
        sintomas: formData.sintomas,
        pago: { id: Number(nuevoPagoId) }, // Vinculamos el pago que acabamos de crear
        listaEspera: null // Se deja null ya que los logs confirmaron que sí acepta nulos
      });

      // PASO C: Envío opcional de notificación por correo electrónico
      try {
        console.log("Enviando correo de confirmación a:", clienteActual.correo);
        await axios.post(
          "https://rednorte-api-gateway-k27o.onrender.com/api/notificaciones/send-email",
          {
            to: clienteActual.correo,
            tipoAviso: "citaConfirmada",
            fecha: formData.fecha,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.warn("No se pudo procesar el envío del correo electrónico:", err);
      }

      // Todo salió correcto
      setAgendada(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Redirección tras 2 segundos de éxito
      setTimeout(() => navigate('/tus-citas'), 2000);

    } catch (err) {
      console.error("Error detallado al agendar:", err);
      alert('Ocurrió un error al intentar agendar la cita. Revisa los detalles en la consola del navegador.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {agendada && (
        <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '15px', borderRadius: '5px', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>
          ¡Cita agendada con éxito! Redireccionando a tus citas...
        </div>
      )}

      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>Agendar Cita Médica</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Campo Datos Personales (Lectura) */}
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Tus Datos Personales:</label>
          <input 
            type="text" 
            value={clienteActual ? `${clienteActual.nombre} ${clienteActual.apellido || ''} (RUT: ${clienteActual.rut || 'No Registrado'})` : 'Cargando tus datos...'} 
            disabled 
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}
          />
        </div>

        {/* Selector de Centro Médico */}
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Centro Médico:</label>
          <select 
            name="hospitalId" 
            value={formData.hospitalId} 
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">Selecciona un centro médico</option>
            {hospitales.map(h => (
              <option key={h.id} value={h.id}>{h.nombre}</option>
            ))}
          </select>
        </div>

        {/* Selector de Médico Especialista */}
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Médico Especialista:</label>
          <select 
            name="medicoId" 
            value={formData.medicoId} 
            onChange={handleChange}
            required
            disabled={!formData.hospitalId}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">{formData.hospitalId ? "Selecciona un médico" : "Primero elige un centro médico"}</option>
            {medicos.map(m => (
              <option key={m.id} value={m.id}>{m.nombre} {m.apellido} ({m.especialidad || 'General'})</option>
            ))}
          </select>
        </div>

        {/* Selector de Fecha */}
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Fecha de la Cita:</label>
          <input 
            type="date" 
            name="fecha" 
            value={formData.fecha} 
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]} // Evita elegir fechas del pasado
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Área de Síntomas */}
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Síntomas o Motivo de Consulta:</label>
          <textarea 
            name="sintomas" 
            value={formData.sintomas} 
            onChange={handleChange}
            required
            placeholder="Describe brevemente cómo te sientes..."
            rows="4"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
          />
        </div>

        {/* Botón de Envío */}
        <button 
          type="submit" 
          disabled={agendada || !clienteActual}
          style={{ width: '100%', padding: '12px', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          {agendada ? 'Procesando...' : 'Agendar Cita'}
        </button>
      </form>
    </div>
  );
}