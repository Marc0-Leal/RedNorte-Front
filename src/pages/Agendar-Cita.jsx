import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import '../../src/styles/pages/Agendar-Cita.css';
 
function Agendar() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [agendada, setAgendada] = useState(false);
 
  const onSubmit = (data) => {
    const nuevaCita = {
      id: Date.now(),                  
      fecha: data.fecha,
      paciente: data.paciente,
      rut: data.rut,
      sintomas: data.sintomas || '',
      direccion: data.direccion,
      telefono: data.telefono,
      medico: data.medico,
      especialidad: data.especialidad,
      centroMedico: data.centroMedico,
      precio: data.precio || 0,
      total: data.total || 0,
      estado: 'Activa',
      activa: true,
    };
 
    const stored = JSON.parse(localStorage.getItem("citas")) || [];
    stored.push(nuevaCita);
    localStorage.setItem("citas", JSON.stringify(stored));
 
    setAgendada(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
 
    setTimeout(() => {
      navigate("/tus-citas");
    }, 1000);
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
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
 
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
                      defaultValue={0}
                      {...register('numeroCita')}
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
                      isInvalid={!!errors.paciente}
                      {...register('paciente', { required: 'Campo requerido' })}
                    />
                    <Form.Control.Feedback type="invalid">{errors.paciente?.message}</Form.Control.Feedback>
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
                      placeholder="12345678-9"
                      isInvalid={!!errors.rut}
                      {...register('rut', { required: 'Campo requerido' })}
                    />
                    <Form.Control.Feedback type="invalid">{errors.rut?.message}</Form.Control.Feedback>
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
                      rows={2}
                      {...register('sintomas')}
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
                      isInvalid={!!errors.fecha}
                      {...register('fecha', { required: 'Campo requerido' })}
                    />
                    <Form.Control.Feedback type="invalid">{errors.fecha?.message}</Form.Control.Feedback>
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
                      isInvalid={!!errors.direccion}
                      {...register('direccion', { required: 'Campo requerido' })}
                    />
                    <Form.Control.Feedback type="invalid">{errors.direccion?.message}</Form.Control.Feedback>
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
                      placeholder="+56912345678"
                      isInvalid={!!errors.telefono}
                      {...register('telefono', { required: 'Campo requerido' })}
                    />
                    <Form.Control.Feedback type="invalid">{errors.telefono?.message}</Form.Control.Feedback>
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
    <Form.Label className="schedules-label schedules-label-light">
      Médico
    </Form.Label>
  </Col>

  <Col xs={4}>
    <Form.Select
      className="schedules-input"
      isInvalid={!!errors.medico}
      {...register('medico', { required: 'Seleccione un médico' })}
    >
      <option value="">Seleccione un médico</option>
      <option value="Dr. Juan Pérez">Dr. Juan Pérez</option>
      <option value="Dra. María González">Dra. María González</option>
      <option value="Dr. Pedro Soto">Dr. Pedro Soto</option>
    </Form.Select>

    <Form.Control.Feedback type="invalid">
      {errors.medico?.message}
    </Form.Control.Feedback>
  </Col>

  <Col xs={2}>
    <Form.Label className="schedules-label schedules-label-light">
      Especialidad
    </Form.Label>
  </Col>

  <Col xs={4}>
    <Form.Control
      className="schedules-input"
      type="text"
      isInvalid={!!errors.especialidad}
      {...register('especialidad', { required: 'Campo requerido' })}
    />
    <Form.Control.Feedback type="invalid">
      {errors.especialidad?.message}
    </Form.Control.Feedback>
  </Col>
</Row>
 
            <Row className="align-items-center">
              <Col xs={2}>
                <Form.Label className="schedules-label schedules-label-light">Centro Medico</Form.Label>
              </Col>
              <Col xs={4}>
                <Form.Control
                  className="schedules-input"
                  type="text"
                  isInvalid={!!errors.centroMedico}
                  {...register('centroMedico', { required: 'Campo requerido' })}
                />
                <Form.Control.Feedback type="invalid">{errors.centroMedico?.message}</Form.Control.Feedback>
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