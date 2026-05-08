import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Image from '../atoms/Image';
import '../../styles/global.css';
import Here2 from "../../assets/test1.png"
import '../../styles/components/organism/Navbar.css'

function NavBar() {
  return (
    <Navbar id="navbar" bg= "dark" variant="dark" expand="lg" >
      <Container>
        <Image src={Here2} className="round-tiny-img" />
        <Navbar.Brand href="/">RedNorte</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Inicio</Nav.Link>
            <Nav.Link href="/CreateUser"> Crear Usuario</Nav.Link>
            <Nav.Link href="/Agendar-cita"> Agendar cita</Nav.Link>
            <Nav.Link href="/LogIn"> Iniciar Session</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
