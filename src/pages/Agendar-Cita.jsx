import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import MedicoService from '../services/MedicoService';
import HospitalService from '../services/HospitalService';
import CitaService from '../services/CitaService';
import '../../src/styles/pages/Agendar-Cita.css';

function AgendarCita() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    sintomas: '',
    fecha: '',
    medicoId: '',
    especialidad: '',
    hospitalId: '',
  });
  const [clienteActual, setClienteActual] = useState(null);
  const [medicos, setMedicos] = useState([]);
  const [hospitales, setHospitales] = useState([]);
  const [agendada, setAgendada] = useState(false);
  const [cargando, setCargando] = useState(true);

  // Cargar médicos, hospitales y perfil del cliente actual al iniciar
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      alert('Debes iniciar sesión para agendar una cita.');
      navigate('/login');
      return;
    }

    // Cargar Catálogos
    MedicoService.getAll().then(setMedicos).catch(console.error);
    HospitalService.getAll().then(setHospitales).catch(console.error);

    // Cargar Perfil del Cliente logueado
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
    .catch(err => console.error('Error obteniendo perfil del cliente:', err))
    .finally(() => setCargando(false));
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'medicoId') {
      const selected = medicos.find(m => m.id === Number(value));
      setFormData(prev => ({
        ...prev,
        medicoId: value,
        especialidad: selected ? selected.especialidad : '',
      }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clienteActual) {
      alert('No se pudo identificar tu perfil de cliente.');
      return;
    }

    try {
      const token = Cookies.get("token");

      // PASO A: Crear el pago puente de $0 para evadir la restricción NOT NULL de Render
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

      // PASO B: Guardar la Cita enlazando el pago generado y la hora simulada fija
      console.log("Enviando cita médica al backend...");
      await CitaService.create({
        fecha: formData.fecha,
        hora: 9, // Entero fijo para satisfacer la columna 'hora NOT NULL' en la BD
        estado: "Activa",
        medico: { id: Number(formData.medicoId) },
        cliente: { id: Number(clienteActual.id) },
        sintomas: formData.sintomas,
        pago: { id: Number(nuevoPagoId) }, // Enlazamos el ID obtenido en el Paso A
        listaEspera: null
      });

      // PASO C: Intento de notificación por correo electrónico
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

      setAgendada(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => navigate('/tus-citas'), 2000);
    } catch (err) {
      console.error("Error detallado al agendar:", err);
      alert('No se pudo agendar la cita. Intenta nuevamente.');
    }
  };

  if (cargando) return <p style={{ padding: '2rem' }}>Cargando datos del formulario...</p>;

  return (
    <div className="schedules-page">

      {agendada && (
        <div className="schedules-alert-wrapper">
          <Alert className="schedules-alert" onClose={() => setAgendada(false)} dismissible>
            ¡Cita agendada exitosamente!
          </Alert>
        </div>
      )}

      <div className="schedules-hero">
        <h1 className="schedules-hero-title">Agendar Cita</h1>
        <p className="schedules-hero-sub">Selecciona los datos y confirma tu nueva cita médica</p>
      </div>

      <Container className="schedules-container">
        <Form noValidate onSubmit={handleSubmit}>

          {/* Datos del paciente */}
          <div className="schedules-card">
            <h2 className="schedules-section-title">Datos del Paciente</h2>
            <Row>
              <Col md={6}>
                <Row className="mb-3 align-items-center">
                  <Col xs={4}><Form.Label className="schedules-label">Paciente</Form.Label></Col>
                  <Col xs={7}>
                    <Form.Control className="schedules-input" type="text"
                      value={clienteActual ? `${clienteActual.nombre} ${clienteActual.apellido || ''}` : ''}
                      readOnly />
                  </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                  <Col xs={4}><Form.Label className="schedules-label">Rut</Form.Label></Col>
                  <Col xs={7}>
                    <Form.Control className="schedules-input" type="text"
                      value={clienteActual?.rut ?? ''} readOnly />
                  </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                  <Col xs={4}><Form.Label className="schedules-label">Síntomas</Form.Label></Col>
                  <Col xs={7}>
                    <Form.Control className="schedules-input" as="textarea" rows={2}
                      name="sintomas" value={formData.sintomas} onChange={handleChange} required />
                  </Col>
                </Row>
              </Col>

              <Col md={6}>
                <Row className="mb-3 align-items-center">
                  <Col xs={4}><Form.Label className="schedules-label">Fecha</Form.Label></Col>
                  <Col xs={7}>
                    <Form.Control className="schedules-input" type="date"
                      name="fecha" value={formData.fecha} onChange={handleChange} required />
                  </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                  <Col xs={4}><Form.Label className="schedules-label">Dirección</Form.Label></Col>
                  <Col xs={7}>
                    <Form.Control className="schedules-input" type="text"
                      value={clienteActual?.direccion ?? ''} readOnly />
                  </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                  <Col xs={4}><Form.Label className="schedules-label">Teléfono</Form.Label></Col>
                  <Col xs={7}>
                    <Form.Control className="schedules-input" type="tel"
                      value={clienteActual?.telefono ?? ''} readOnly />
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>

          {/* Datos médicos */}
          <div className="schedules-card schedules-card-dark">
            <h2 className="schedules-section-title schedules-section-title-light">Datos Médicos</h2>

            <Row className="mb-3 align-items-center">
              <Col xs={2}><Form.Label className="schedules-label schedules-label-light">Médico</Form.Label></Col>
              <Col xs={4}>
                <Form.Select className="schedules-input" name="medicoId"
                  value={formData.medicoId} onChange={handleChange} required>
                  <option value="">Seleccionar médico...</option>
                  {medicos.map(m => (
                    <option key={m.id} value={m.id}>{m.nombre} {m.apellido}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col xs={2}><Form.Label className="schedules-label schedules-label-light">Especialidad</Form.Label></Col>
              <Col xs={4}>
                <Form.Control className="schedules-input" type="text"
                  value={formData.especialidad} readOnly />
              </Col>
            </Row>

            <Row className="align-items-center">
              <Col xs={2}><Form.Label className="schedules-label schedules-label-light">Centro Médico</Form.Label></Col>
              <Col xs={4}>
                <Form.Select className="schedules-input" name="hospitalId"
                  value={formData.hospitalId} onChange={handleChange} required>
                  <option value="">Seleccionar hospital...</option>
                  {hospitales.map(h => (
                    <option key={h.id} value={h.id}>{h.nombre}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          </div>

          <div className="schedules-btn-wrapper">
            <Button className="schedules-btn-outline" onClick={() => navigate('/tus-citas')}>Cancelar</Button>
            <Button className="schedules-btn-primary" type="submit">Confirmar Cita</Button>
          </div>

        </Form>
      </Container>
    </div>
  );
}

export default AgendarCita;