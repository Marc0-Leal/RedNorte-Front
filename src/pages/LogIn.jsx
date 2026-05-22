import React, { useState } from 'react';
import { Container, Navbar } from 'react-bootstrap';

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";

import { collection, getDocs } from "firebase/firestore";

import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

import NavBar from '../components/organism/Navbar';
import Text from '../components/atoms/Text';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';

function LogIn() {

    const [rut, setRut] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogIn = async () => {

        if (!rut || !password) {
            alert('Complete los campos');
            return;
        }

        try {

            // Buscar usuario por RUT en Firestore
            const querySnapshot = await getDocs(collection(db, "usuarios"));

            let usuarioEncontrado = null;

            querySnapshot.forEach((doc) => {

                const data = doc.data();

                if (data.rut === rut) {
                    usuarioEncontrado = data;
                }
            });

            // Si no existe
            if (!usuarioEncontrado) {
                alert("Usuario no encontrado");
                return;
            }

            // Login Firebase usando email encontrado
            await signInWithEmailAndPassword(
                auth,
                usuarioEncontrado.email,
                password
            );

            // Guardar rol
            Cookies.set("rol", usuarioEncontrado.rol);

            // ADMIN
            if (usuarioEncontrado.rol === "admin") {

                alert("Bienvenido administrador");

                navigate("/admin");

                return;
            }

            // USUARIO NORMAL
            alert("Inicio de sesión");

            navigate("/");

        } catch (error) {

            alert("Credenciales incorrectas");
        }
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