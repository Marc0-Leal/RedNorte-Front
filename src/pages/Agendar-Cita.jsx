import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import CitaService from '../services/CitaService';
import ListaEsperaService from '../services/ListaEsperaService';
import MedicoService from '../services/MedicoService';
import HospitalService from '../services/HospitalService';
import ClienteService from '../services/ClienteService';
import PagoService from '../services/PagoService';
import '../../src/styles/pages/Agendar-Cita.css';


function Agendar() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sintomas: '',
    fecha: '',
    medicoId: '',
    especialidad: '',
    hospitalId: '',
  });
  const [medicos, setMedicos] = useState([]);
  const [hospitales, setHospitales] = useState([]);
  const [agendada, setAgendada] = useState(false);
  const [clienteActual, setClienteActual] = useState(null);
  const [loadingCliente, setLoadingCliente] = useState(true);

  // Cargar hospitales al montar
  useEffect(() => {
    HospitalService.getAll().then(setHospitales).catch(console.error);
  }, []);

  // Cargar médicos cuando cambia el hospital
  useEffect(() => {
    if (formData.hospitalId) {
      MedicoService.getByHospital(Number(formData.hospitalId))
        .then(setMedicos)
        .catch(console.error);
    } else {
      setMedicos([]);
    }
  }, [formData.hospitalId]);

  // Cargar cliente actual
  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const rutUsuario = Cookies.get("rut");
        if (!rutUsuario) {
          alert('Debes iniciar sesión para agendar una cita');
          navigate('/LogIn');
          return;
        }

        const cliente = await ClienteService.getByRut(rutUsuario);
        if (!cliente) {
          alert('No se encontró tu perfil de cliente. Contacta al administrador.');
          return;
        }

        setClienteActual(cliente);
      } catch (err) {
        console.error('Error al obtener cliente:', err);
      } finally {
        setLoadingCliente(false);
      }
    };

    fetchCliente();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Al cambiar hospital, limpiar médico y especialidad
    if (name === 'hospitalId') {
      setFormData((prev) => ({
        ...prev,
        hospitalId: value,
        medicoId: '',
        especialidad: '',
      }));
      return;
    }

    // Al cambiar médico, autocompletar especialidad
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
    let nuevoPagoId = null;
    
    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clienteActual) {
      alert('No se pudo identificar tu perfil de cliente.');
      return;

    }

    try {
      console.log("Enviando pago puente al backend...");
      const pago = await PagoService.create({
        monto: 0,
        metodo_pago: "efectivo",
        estado: "pendiente",
      });


      if (pago && pago.id) {
        nuevoPagoId = pago.id;
      }
      await ListaEsperaService.create({
        fecha_solitud: formData.fecha,
        prioridad: "Normal",
        hospital: hospital,
      });


// CORRECCIÓN 2: Enlazar los datos enviando IDs planos según requiere Spring Boot
      console.log("Enviando cita médica al backend con Pago ID:", nuevoPagoId);
      await CitaService.create({
        fecha: formData.fecha,
        hora: 9, 
        estado: "Activa",
        medico: Number(formData.medicoId),  // ID directo como número
        cliente: Number(clienteActual.id),  // ID directo como número
        sintomas: formData.sintomas,
        pago: nuevoPagoId ? Number(nuevoPagoId) : null, // ID mapeado sin romper el scope
        listaEspera: null
      });

// Bloque de notificaciones por correo
      try {
        console.log("Enviando correo a:", clienteActual.correo);
        const emailRes = await axios.post(
          "https://rednorte-api-gateway-k27o.onrender.com/api/notificaciones/send-email",
          {
            to: clienteActual.correo,
            tipoAviso: "citaConfirmada",
            fecha: formData.fecha,
          },
          { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
        );
        console.log("Respuesta correo:", emailRes.data);
      } catch (err) {
        console.warn("No se pudo enviar el correo:", err);
      }

      setAgendada(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => navigate('/tus-citas'), 2000);
    } catch (err) {
      console.error(err);
      alert('Error al agendar la cita');
    }
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

            {loadingCliente ? (
              <p className="schedules-label">Cargando datos del paciente...</p>
            ) : clienteActual ? (
              <Row>
                <Col md={6}>
                  <Row className="mb-3 align-items-center">
                    <Col xs={4}>
                      <Form.Label className="schedules-label">Paciente</Form.Label>
                    </Col>
                    <Col xs={7}>
                      <Form.Control
                        className="schedules-input"
                        type="text"
                        value={`${clienteActual.nombre} ${clienteActual.apellido}`}
                        readOnly
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
                        value={clienteActual.rut}
                        readOnly
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
                        value={clienteActual.direccion}
                        readOnly
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
                        value={clienteActual.telefono}
                        readOnly
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            ) : (
              <p className="schedules-label" style={{ color: 'red' }}>
                No se encontró tu perfil de cliente. Contacta al administrador.
              </p>
            )}
          </div>

          {/* Sección médico */}
          <div className="schedules-card schedules-card-dark">
            <h2 className="schedules-section-title schedules-section-title-light">Datos Médicos</h2>

            <Row className="mb-3 align-items-center">
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
                  disabled={!formData.hospitalId}
                >
                  <option value="">
                    {formData.hospitalId ? 'Seleccionar médico...' : 'Primero selecciona un hospital'}
                  </option>
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
                  value={formData.especialidad}
                  readOnly
                />
              </Col>
            </Row>
          </div>

          {/* Botón */}
          <div className="schedules-btn-wrapper">
            <Button className="schedules-btn-outline" href="/">Cancelar</Button>
            <Button
              className="schedules-btn-primary"
              type="submit"
              disabled={loadingCliente || !clienteActual}
            >
              Agendar Cita
            </Button>
          </div>

        </Form>
      </Container>
    </div>
  );
}

export default Agendar;