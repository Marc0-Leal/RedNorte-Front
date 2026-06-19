import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import MedicoService from '../services/MedicoService';
import HospitalService from '../services/HospitalService';
import '../../src/styles/pages/Agendar-Cita.css';

const API = "https://rednorte-api-gateway-k27o.onrender.com/api/citaMedica";

function Reagendar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    sintomas: '',
    fecha: '',
    medicoId: '',
    especialidad: '',
    hospitalId: '',
  });
  const [fechaOriginal, setFechaOriginal] = useState('');
  const [clienteActual, setClienteActual] = useState(null);
  const [medicos, setMedicos] = useState([]);
  const [hospitales, setHospitales] = useState([]);
  const [reagendada, setReagendada] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    HospitalService.getAll().then(setHospitales).catch(console.error);
  }, []);

  useEffect(() => {
    if (formData.hospitalId) {
      MedicoService.getByHospital(Number(formData.hospitalId))
        .then(setMedicos)
        .catch(console.error);
    } else {
      setMedicos([]);
    }
  }, [formData.hospitalId]);

  useEffect(() => {
    fetch(`${API}/${id}`, {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` }
    })
      .then(res => res.json())
      .then(cita => {
        setClienteActual(cita.cliente);
        const fecha = cita.fecha?.slice(0, 10) ?? '';
        setFechaOriginal(fecha);
        setFormData({
          sintomas:     cita.sintomas ?? '',
          fecha,
          medicoId:     cita.medico?.id ?? '',
          especialidad: cita.medico?.especialidad ?? '',
          hospitalId:   cita.listaEspera?.hospital?.id ?? '',
        });
      })
      .catch(() => alert('No se pudo cargar la cita.'))
      .finally(() => setCargando(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'hospitalId') {
      setFormData(prev => ({
        ...prev,
        hospitalId: value,
        medicoId: '',
        especialidad: '',
      }));
      return;
    }

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
    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({
          fecha: formData.fecha,
          sintomas: formData.sintomas,
          medico: { id: Number(formData.medicoId) },
        }),
      });
      if (!res.ok) throw new Error();

      setReagendada(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      try {
        console.log("Enviando correo a:", clienteActual.correo);
        await fetch(
          "https://rednorte-api-gateway-k27o.onrender.com/api/notificaciones/send-email",
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
            body: JSON.stringify({
              to: clienteActual.correo,
              tipoAviso: "citaCambiada",
              fechaAnterior: fechaOriginal,
              fechaNueva: formData.fecha,
            }),
          }
        );
      } catch (err) {
        console.warn("No se pudo enviar el correo:", err);
      }

      setTimeout(() => navigate('/tus-citas'), 2000);
    } catch {
      alert('No se pudo reagendar. Intenta nuevamente.');
    }
  };

  if (cargando) return <p style={{ padding: '2rem' }}>Cargando datos de la cita...</p>;

  return (
    <div className="schedules-page">

      {reagendada && (
        <div className="schedules-alert-wrapper">
          <Alert className="schedules-alert" onClose={() => setReagendada(false)} dismissible>
            ¡Cita reagendada exitosamente!
          </Alert>
        </div>
      )}

      <div className="schedules-hero">
        <h1 className="schedules-hero-title">Reagendar Cita</h1>
        <p className="schedules-hero-sub">Modifica los datos y confirma tu nueva cita</p>
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
                      value={clienteActual ? `${clienteActual.nombre} ${clienteActual.apellido}` : ''}
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
                  <Col xs={4}><Form.Label className="schedules-label">Sintomas</Form.Label></Col>
                  <Col xs={7}>
                    <Form.Control className="schedules-input" as="textarea" rows={2}
                      name="sintomas" value={formData.sintomas} onChange={handleChange} />
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
                  <Col xs={4}><Form.Label className="schedules-label">Direccion</Form.Label></Col>
                  <Col xs={7}>
                    <Form.Control className="schedules-input" type="text"
                      value={clienteActual?.direccion ?? ''} readOnly />
                  </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                  <Col xs={4}><Form.Label className="schedules-label">Telefono</Form.Label></Col>
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
              <Col xs={2}><Form.Label className="schedules-label schedules-label-light">Centro Medico</Form.Label></Col>
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

            <Row className="mb-3 align-items-center">
              <Col xs={2}><Form.Label className="schedules-label schedules-label-light">Medico</Form.Label></Col>
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
          </div>

          <div className="schedules-btn-wrapper">
            <Button className="schedules-btn-outline" onClick={() => navigate('/tus-citas')}>Cancelar</Button>
            <Button className="schedules-btn-primary" type="submit">Confirmar Reagendado</Button>
          </div>

        </Form>
      </Container>
    </div>
  );
}

export default Reagendar;