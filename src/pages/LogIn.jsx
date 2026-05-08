import React, { useState } from 'react';
import { Container, Navbar } from 'react-bootstrap';

import NavBar from '../components/organism/Navbar';
import Text from '../components/atoms/Text';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';

function LogIn() {

    const [rut, setRut] = useState('');
    const [password, setPassword] = useState('');

    const handleLogIn = () => {

        if (!rut || !password) {
            alert('Complete los campos');
            return;
        }

        alert('Inicio de sesión');
    };

    return (
        <Container
            fluid
            className="d-flex justify-content-center align-items-center vh-100"
            style={{
                backgroundColor: '#ffffff',
            }}
        >

            <div
                className="p-5 shadow"
                style={{
                    width: '400px',
                    backgroundColor: '#ffffff',
                    border: '2px solid #ee5d69',
                    borderRadius: '20px',
                }}
            >

                <div className="text-center mb-4">

                    <Text
                        variant="h1"
                        style={{
                            color: '#bee5d69',
                            fontWeight: 'bold',
                        }}
                    >
                        Hospital Red Norte
                    </Text>

                    <Text
                        variant="p"
                        style={{
                            color: '#ee5d69',
                        }}
                    >
                        Inicio de Sesión
                    </Text>

                </div>

                <Input
                    type="text"
                    label="RUT"
                    placeholder="Ingrese su rut"
                    value={rut}
                    onChange={(e) => setRut(e.target.value)}
                />

                <Input
                    type="password"
                    label="Contraseña"
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="mt-4 d-flex justify-content-center">

                    <Button
                        onClick={handleLogIn}
                        style={{
                            backgroundColor: '#ee5d69',
                            border: 'none',
                            width: '200px',
                        }}
                    >
                        Ingresar
                    </Button>

                </div>

            </div>

        </Container>
    );
}

export default LogIn;