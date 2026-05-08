import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function CreateUser() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");      
  const [success, setSuccess] = useState("");  

  const handleCreateUser = async () => {
    setError("");
    setSuccess("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setSuccess("Usuario creado con éxito: " + userCredential.user.email);
    } catch (error) {
      if (error.code === "auth/weak-password") {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else if (error.code === "auth/email-already-in-use") {
        setError("Este correo ya está registrado.");
      } else if (error.code === "auth/invalid-email") {
        setError("El correo no es válido.");
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f0f2f5",
    }}>
      <div style={{
        backgroundColor: "#ffffff",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "420px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}>
        <h2 style={{
          margin: 0,
          textAlign: "center",
          fontSize: "24px",
          color: "#1a1a2e",
        }}>
          Crear usuario
        </h2>

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Contraseña (mínimo 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        {error && (
          <p style={{
            margin: 0,
            color: "#e53e3e",
            backgroundColor: "#fff5f5",
            border: "1px solid #fed7d7",
            borderRadius: "8px",
            padding: "10px 14px",
            fontSize: "14px",
          }}>
            {error}
          </p>
        )}

        {success && (
          <p style={{
            margin: 0,
            color: "#276749",
            backgroundColor: "#f0fff4",
            border: "1px solid #c6f6d5",
            borderRadius: "8px",
            padding: "10px 14px",
            fontSize: "14px",
          }}>
            {success}
          </p>
        )}

        <button
          onClick={handleCreateUser}
          style={{
            backgroundColor: "#ee5d69",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            padding: "12px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            marginTop: "4px",
          }}
        >
          Crear usuario
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  color: "#374151",
};