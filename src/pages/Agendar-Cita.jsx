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

  const [formData, setFormData] = useState({
    hospitalId: '',
    medicoId: '',
    fecha: '',
    sintomas: ''
  });

  // 1. Cargar datos iniciales
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      alert('Debes iniciar sesión para agendar una cita.');
      navigate('/login');
      return;
    }

    axios.get('https://rednorte-api-gateway-k27o.onrender.com/api/cliente/perfil', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      if (Array.isArray(res.data)) {
        setClienteActual(res.data[0]); 
      } else {
        setClienteActual(res.data);
      }
    })
    .catch(err => console.error('Error obteniendo perfil:', err));

    axios.get('https://rednorte-api-gateway-k27o.onrender.com/api/hospital', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setHospitales(res.data))
    .catch(err => console.error('Error cargando centros médicos:', err));
  }, [navigate]);

  // 2. Cargar médicos según el hospital seleccionado
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

  // 3. Envío del Formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clienteActual) {
      alert('No se pudo identificar tu perfil de cliente.');
      return;
    }
    
    try {
      const token = Cookies.get('token');

      // PASO A: Crear el pago puente
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

      // PASO B: Crear la Cita
      console.log("Enviando cita médica al backend...");
      await CitaService.create({
        fecha: formData.fecha,
        hora: 9, 
        estado: "Activa",
        medico: { id: Number(formData.medicoId) },
        cliente: { id: Number(clienteActual.id) },
        sintomas: formData.sintomas,
        pago: { id: Number(nuevoPagoId) }, 
        listaEspera: null
      });

      // PASO C: Intento de envío de correo electrónico
      try {
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
        console.warn("No se pudo enviar el correo de aviso:", err);
      }

      alert('¡Cita agendada con éxito!');
      navigate('/tus-citas');

    } catch (err) {
      console.error("Error detallado al agendar:", err);
      alert('Error al agendar la cita. Revisa la consola.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f4f4f9', padding: '20px' }}>
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Agendar Cita</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Centro Médico:</label>
            <select
              name="hospitalId"
              value={formData.hospitalId}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">Seleccione un Centro Médico</option>
              {hospitales.map(h => (
                <option key={h.id} value={h.id}>{h.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Médico:</label>
            <select
              name="medicoId"
              value={formData.medicoId}
              onChange={handleChange}
              required
              disabled={!formData.hospitalId}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">Seleccione un Médico</option>
              {medicos.map(m => (
                <option key={m.id} value={m.id}>{m.nombre} {m.apellido}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Fecha:</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Síntomas:</label>
            <textarea
              name="sintomas"
              value={formData.sintomas}
              onChange={handleChange}
              required
              rows="4"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', resize: 'none' }}
            />
          </div>

          <button
            type="submit"
            style={{ width: '100%', padding: '12px', border: 'none', borderRadius: '4px', backgroundColor: '#007bff', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
          >
            Agendar Cita
          </button>
        </form>
      </div>
    </div>
  );
}