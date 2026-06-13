import React, { useState } from 'react';
import { Container } from 'react-bootstrap';

import axios from "axios";

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
    const [errors, setErrors] = useState({});  

    const navigate = useNavigate();

    // 👇 Validación de campos
    const validate = () => {
        const newErrors = {};
        if (!rut.trim())      newErrors.rut      = 'Campo requerido';
        if (!password.trim()) newErrors.password = 'Campo requerido';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogIn = async () => {

        if (!validate()) return; 

        try {
            const querySnapshot = await getDocs(collection(db, "usuarios"));

            let usuarioEncontrado = null;

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.rut === rut) {
                    usuarioEncontrado = data;
                }
            });

            if (!usuarioEncontrado) {
                alert("Usuario no encontrado");
                return;
            }

            await signInWithEmailAndPassword(
                auth,
                usuarioEncontrado.email,
                password
            );

            // Obtener token JWT del gateway
            const tokenRes = await axios.post("https://rednorte-api-gateway-k27o.onrender.com/auth/token", {
                subject: usuarioEncontrado.rut,
                roles: [usuarioEncontrado.rol],
                expiresInSeconds: 3600
            });
            Cookies.set("token", tokenRes.data.accessToken);

            Cookies.set("rol", usuarioEncontrado.rol);
            Cookies.set("rut", usuarioEncontrado.rut);

            if (usuarioEncontrado.rol === "admin") {
                alert("Bienvenido administrador");
                navigate("/admin");
                return;
            }

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
            style={{ backgroundColor: '#ffffff' }}
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
                        style={{ color: '#ee5d69', fontWeight: 'bold' }}
                    >
                        Hospital Red Norte
                    </Text>
                    <Text
                        variant="p"
                        style={{ color: '#ee5d69' }}
                    >
                        Inicio de Sesión
                    </Text>
                </div>

                {/*  */}
                <Input
                    type="text"
                    label="RUT"
                    placeholder="Ingrese su rut"
                    value={rut}
                    onChange={(e) => {
                        setRut(e.target.value);
                        if (errors.rut) setErrors(prev => ({ ...prev, rut: '' }));
                    }}
                    error={errors.rut}
                />

                <Input
                    type="password"
                    label="Contraseña"
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                    }}
                    error={errors.password}
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