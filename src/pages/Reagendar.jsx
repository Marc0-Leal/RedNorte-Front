import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import '../../src/styles/pages/Agendar-Cita.css';

const API = "https://rednorte-api-gateway-k27o.onrender.com/api/clinica/citaMedica";

function Reagendar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [reagendada, setReagendada] = useState(false);
  const [cargando, setCargando] = useState(true);

  // Precargar datos de la cita
  useEffect(() => {
    fetch(`${API}/${id}`)
      .then(res => res.json())
      .then(cita => {
        reset({
          numeroCita:   cita.numeroCita ?? 0,
          paciente:     cita.cliente ? `${cita.cliente.nombre} ${cita.cliente.apellido}` : '',
          rut:          cita.cliente?.rut ?? '',
          sintomas:     cita.sintomas ?? '',
          fecha:        cita.fecha?.slice(0, 10) ?? '',
          direccion:    cita.cliente?.direccion ?? '',
          telefono:     cita.cliente?.telefono ?? '',
          medico:       cita.medico ? `${cita.medico.nombre} ${cita.medico.apellido}` : '',
          especialidad: cita.medico?.especialidad ?? '',
          centroMedico: cita.centroMedico ?? '',
          precio:       cita.precio ?? 0,
          total:        cita.total ?? 0,
        });
      })
      .catch(() => alert('No se pudo cargar la cita.'))
      .finally(() => setCargando(false));
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setReagendada(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>

          <div className="schedules-card">
            <h2 className="schedules-section-title">Datos del Paciente</h2>
            <Row>
              <Col md={6}>
                <Row className="mb-3 align-items-center">
                  <Col xs={4}><Form.Label className="schedules-label">Numero de Cita</Form.Label></Col>
                  <Col xs={5}>
                    <Form.Control className="schedules-input" type="number" {...register('numeroCita')} />
                  </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                  <Col xs={4}><Form.Label className="schedules-label">Paciente</Form.Label></Col>
                  <Col xs={7}>
                    <Form.Control className="schedules-input" type="text" isInvalid={!!errors.paciente}
                      {...register('paciente', { required: 'Campo requerido' })} />
                    <Form.Control.Feedback type="invalid">{errors.paciente?.message}</Form.Control.Feedback>
                  </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                  <Col xs={4}><Form.Label className="schedules-label">Rut</Form.Label></Col>
                  <Col xs={7}>
                    <Form.Control className="schedules-input" type="text" isInvalid={!!errors.rut}
                      {...register('rut', { required: 'Campo requerido' })} />
                    <Form.Control.Feedback type="invalid">{errors.rut?.message}</Form.Control.Feedback>
                  </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                  <Col xs={4}><Form.Label className="schedules-label">Sintomas</Form.Label></Col>
                  <Col xs={7}>
                    <Form.Control className="schedules-input" as="textarea" rows={2} {...register('sintomas')} />
                  </Col>
                </Row>
              </Col>

              <Col md={6}>
                <Row className="mb-3 align-items-center">
                  <Col xs={4}><Form.Label className="schedules-label">Fecha</Form.Label></Col>
                  <Col xs={7}>
                    <Form.Control className="schedules-input" type="date" isInvalid={!!errors.fecha}
                      {...register('fecha', { required: 'Campo requerido' })} />
                    <Form.Control.Feedback type="invalid">{errors.fecha?.message}</Form.Control.Feedback>
                  </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                  <Col xs={4}><Form.Label className="schedules-label">Direccion</Form.Label></Col>
                  <Col xs={7}>
                    <Form.Control className="schedules-input" type="text" isInvalid={!!errors.direccion}
                      {...register('direccion', { required: 'Campo requerido' })} />
                    <Form.Control.Feedback type="invalid">{errors.direccion?.message}</Form.Control.Feedback>
                  </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                  <Col xs={4}><Form.Label className="schedules-label">Telefono</Form.Label></Col>
                  <Col xs={7}>
                    <Form.Control className="schedules-input" type="tel" isInvalid={!!errors.telefono}
                      {...register('telefono', { required: 'Campo requerido' })} />
                    <Form.Control.Feedback type="invalid">{errors.telefono?.message}</Form.Control.Feedback>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>

          <div className="schedules-card schedules-card-dark">
            <h2 className="schedules-section-title schedules-section-title-light">Datos Médicos</h2>
            <Row className="mb-3 align-items-center">
              <Col xs={2}><Form.Label className="schedules-label schedules-label-light">Medico</Form.Label></Col>
              <Col xs={4}>
                <Form.Control className="schedules-input" type="text" isInvalid={!!errors.medico}
                  {...register('medico', { required: 'Campo requerido' })} />
                <Form.Control.Feedback type="invalid">{errors.medico?.message}</Form.Control.Feedback>
              </Col>
              <Col xs={2}><Form.Label className="schedules-label schedules-label-light">Especialidad</Form.Label></Col>
              <Col xs={4}>
                <Form.Control className="schedules-input" type="text" isInvalid={!!errors.especialidad}
                  {...register('especialidad', { required: 'Campo requerido' })} />
                <Form.Control.Feedback type="invalid">{errors.especialidad?.message}</Form.Control.Feedback>
              </Col>
            </Row>

            <Row className="align-items-center">
              <Col xs={2}><Form.Label className="schedules-label schedules-label-light">Centro Medico</Form.Label></Col>
              <Col xs={4}>
                <Form.Control className="schedules-input" type="text" isInvalid={!!errors.centroMedico}
                  {...register('centroMedico', { required: 'Campo requerido' })} />
                <Form.Control.Feedback type="invalid">{errors.centroMedico?.message}</Form.Control.Feedback>
              </Col>
            </Row>
          </div>

          <div className="schedules-card schedules-price-row">
            <Row className="justify-content-end align-items-center">
              <Col xs="auto"><Form.Label className="schedules-label mb-0">Precio</Form.Label></Col>
              <Col xs={3}>
                <Form.Control className="schedules-input" type="number" min={0}
                  isInvalid={!!errors.precio}
                  {...register('precio', { min: { value: 0, message: 'El precio no puede ser negativo' } })} />
                <Form.Control.Feedback type="invalid">{errors.precio?.message}</Form.Control.Feedback>
              </Col>
              <Col xs="auto"><Form.Label className="schedules-label mb-0">Total:</Form.Label></Col>
              <Col xs={3}>
                <Form.Control className="schedules-input" type="number" min={0} readOnly {...register('total')} />
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