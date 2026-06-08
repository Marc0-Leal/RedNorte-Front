import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import CitaService from '../services/CitaService';
import ListaEsperaService from '../services/ListaEsperaService';
import MedicoService from '../services/MedicoService';
import HospitalService from '../services/HospitalService';
import '../../src/styles/pages/Agendar-Cita.css';

function Agendar() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    numeroCita: '',
    paciente: '',
    rut: '',
    sintomas: '',
    fecha: '',
    direccion: '',
    telefono: '',
    medicoId: '',
    especialidad: '',
    hospitalId: '',
  });
  const [medicos, setMedicos] = useState([]);
  const [hospitales, setHospitales] = useState([]);
  const [agendada, setAgendada] = useState(false);

  useEffect(() => {
    MedicoService.getAll().then(setMedicos).catch(console.error);
    HospitalService.getAll().then(setHospitales).catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // When medico changes, auto-fill especialidad
    if (name === 'medicoId') {
      const selected = medicos.find(m => m.id === Number(value));
      setFormData((prev) => ({
        ...prev,
        medicoId: value,
        especialidad: selected ? selected.especialidad : '',
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const listaEspera = await ListaEsperaService.create({
        fecha_solitud: formData.fecha,
        prioridad: "Normal",
        hospital: { id: Number(formData.hospitalId) },
      });

      await CitaService.create({
        fecha: formData.fecha,
        hora: 0,
        estado: "Activa",
        medico: { id: Number(formData.medicoId) },
        cliente: { id: Number(formData.paciente) },
        pago: {
          monto: 0,
          fecha_pago: new Date().toISOString(),
          metodo_pago: "efectivo",
          estado: "pendiente"
        },
        listaEspera: { id: listaEspera.id },
      });

      setAgendada(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => navigate('/tus-citas'), 2000);
    } catch (err) {
      alert('Error al agendar la cita');
    }
  };

  const blockNegativeKeys = (e) => {
    if (e.key === '-' || e.key === 'e' || e.key === '+') {
      e.preventDefault();
    }
  };

  const forcePositive = (e) => {
    if (e.target.value < 0) e.target.value = 0;
  };

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
        <p className="schedules-hero-sub">Completa el formulario para reservar tu atención médica</p>
      </div>

      <Container className="schedules-container">
        <Form noValidate onSubmit={handleSubmit}>

          {/* Sección datos del paciente */}
          <div className="schedules-card">
            <h2 className="schedules-section-title">Datos del Paciente</h2>

            <Row>
              <Col md={6}>

                <Row className="mb-3 align-items-center">
                  <Col xs={4}>
                    <Form.Label className="schedules-label">Numero de Cita</Form.Label>
                  </Col>
                  <Col xs={5}>
                    <Form.Control
                      className="schedules-input"
                      type="number"
                      name="numeroCita"
                      min={0}
                      value={formData.numeroCita}
                      onKeyDown={blockNegativeKeys}
                      onInput={forcePositive}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                  <Col xs={4}>
                    <Form.Label className="schedules-label">Paciente</Form.Label>
                  </Col>
                  <Col xs={7}>
                    <Form.Control
                      className="schedules-input"
                      type="text"
                      name="paciente"
                      value={formData.paciente}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                  <Col xs={4}>
                    <Form.Label className="schedules-label">Rut</Form.Label>
                  </Col>
                  <Col xs={7}>
                    <Form.Control
                      className="schedules-input"
                      type="text"
                      name="rut"
                      placeholder="12345678-9"
                      value={formData.rut}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                  <Col xs={4}>
                    <Form.Label className="schedules-label">Sintomas</Form.Label>
                  </Col>
                  <Col xs={7}>
                    <Form.Control
                      className="schedules-input"
                      as="textarea"
                      name="sintomas"
                      rows={2}
                      value={formData.sintomas}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>
              </Col>

              <Col md={6}>
                <Row className="mb-3 align-items-center">
                  <Col xs={4}>
                    <Form.Label className="schedules-label">Fecha</Form.Label>
                  </Col>
                  <Col xs={7}>
                    <Form.Control
                      className="schedules-input"
                      type="date"
                      name="fecha"
                      value={formData.fecha}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                  <Col xs={4}>
                    <Form.Label className="schedules-label">Direccion</Form.Label>
                  </Col>
                  <Col xs={7}>
                    <Form.Control
                      className="schedules-input"
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                  <Col xs={4}>
                    <Form.Label className="schedules-label">Telefono</Form.Label>
                  </Col>
                  <Col xs={7}>
                    <Form.Control
                      className="schedules-input"
                      type="tel"
                      name="telefono"
                      placeholder="+56912345678"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>

          {/* Sección médico */}
          <div className="schedules-card schedules-card-dark">
            <h2 className="schedules-section-title schedules-section-title-light">Datos Médicos</h2>

            <Row className="mb-3 align-items-center">
              <Col xs={2}>
                <Form.Label className="schedules-label schedules-label-light">Medico</Form.Label>
              </Col>
              <Col xs={4}>
                <Form.Select
                  className="schedules-input"
                  name="medicoId"
                  value={formData.medicoId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar médico...</option>
                  {medicos.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre} {m.apellido}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col xs={2}>
                <Form.Label className="schedules-label schedules-label-light">Especialidad</Form.Label>
              </Col>
              <Col xs={4}>
                <Form.Control
                  className="schedules-input"
                  type="text"
                  name="especialidad"
                  value={formData.especialidad}
                  readOnly
                />
              </Col>
            </Row>

            <Row className="align-items-center">
              <Col xs={2}>
                <Form.Label className="schedules-label schedules-label-light">Centro Medico</Form.Label>
              </Col>
              <Col xs={4}>
                <Form.Select
                  className="schedules-input"
                  name="hospitalId"
                  value={formData.hospitalId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar hospital...</option>
                  {hospitales.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          </div>

          {/* Botón */}
          <div className="schedules-btn-wrapper">
            <Button className="schedules-btn-outline" href="/">Cancelar</Button>
            <Button className="schedules-btn-primary" type="submit">Agendar Cita</Button>
          </div>

        </Form>
      </Container>
    </div>
  );
}

export default Agendar;