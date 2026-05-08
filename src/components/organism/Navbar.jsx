import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Image from '../atoms/Image';
import '../../styles/global.css';
import Here2 from "../../assets/test1.png"
import '../../styles/components/organism/Navbar.css'


function NavBar() {
  return (
    <Navbar expand="lg" className="navbar">
      <Container>
        <Navbar.Brand href="/">RedNorte Salud</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto gap-3">
              <Nav.Link href="/">Inicio</Nav.Link>
            <Nav.Link href="/Agendar-cita"> Agendar cita</Nav.Link>
            <Nav.Link href="/tus-citas">Tus Citas</Nav.Link>
            <Nav.Link href="/LogIn"> Iniciar Session</Nav.Link>
            <Nav.Link href="/CreateUser"> Crear Usuario</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
