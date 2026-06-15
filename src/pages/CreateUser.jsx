import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function CreateUser() {
  const navigate = useNavigate();
  const [rut, setRut] = useState("");
  const [rol, setRol] = useState("usuario");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!rut.trim())       newErrors.rut       = 'Campo requerido';
    if (!nombre.trim())    newErrors.nombre    = 'Campo requerido';
    if (!apellido.trim())  newErrors.apellido  = 'Campo requerido';
    if (!email.trim())     newErrors.email     = 'Campo requerido';
    if (!password.trim())  newErrors.password  = 'Campo requerido';
    if (!telefono.trim())  newErrors.telefono  = 'Campo requerido';
    if (!direccion.trim()) newErrors.direccion = 'Campo requerido';
    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearFieldError = (field) => {
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validarRut = (rut) => /^[0-9]{7,8}-[0-9kK]{1}$/.test(rut);
  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleCreateUser = async () => {
    setError("");
    setSuccess("");
    if (!validate()) return;
    if (!validarRut(rut)) { setError("El RUT no tiene un formato válido."); return; }
    if (nombre.length < 2) { setError("El nombre debe tener al menos 2 caracteres."); return; }
    if (apellido.length < 2) { setError("El apellido debe tener al menos 2 caracteres."); return; }
    if (!validarEmail(email)) { setError("El correo no es válido."); return; }
    if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres."); return; }
    if (!/^\d+$/.test(telefono)) { setError("El teléfono debe contener solo números."); return; }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "usuarios", userCredential.user.uid), {
        nombre, apellido, rut, email, rol,
      });
      await axios.post("https://rednorte-api-gateway-k27o.onrender.com/api/cliente", {
        nombre,
        apellido,
        rut,
        telefono: parseInt(telefono),
        correo: email,
        direccion: direccion,
      });
      setSuccess("Usuario creado con éxito: " + userCredential.user.email);
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      if (error.code === "auth/weak-password") setError("La contraseña debe tener al menos 6 caracteres.");
      else if (error.code === "auth/email-already-in-use") setError("Este correo ya está registrado.");
      else if (error.code === "auth/invalid-email") setError("El correo no es válido.");
      else setError(error.message);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f0f2f5" }}>
      <div style={{ backgroundColor: "#ffffff", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", width: "100%", maxWidth: "420px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <h2 style={{ margin: 0, textAlign: "center", fontSize: "24px", color: "#1a1a2e" }}>Crear usuario</h2>

        {/* RUT */}
        <div style={wrapperStyle}>
          <input type="text" placeholder="RUT (ej: 12345678-9)" value={rut}
            onChange={(e) => { setRut(e.target.value); clearFieldError('rut'); }}
            style={{ ...inputStyle, ...(fieldErrors.rut ? errorBorderStyle : {}) }} />
          {fieldErrors.rut && <span style={errorTextStyle}>{fieldErrors.rut}</span>}
        </div>

        {/* NOMBRE */}
        <div style={wrapperStyle}>
          <input type="text" placeholder="Nombre" value={nombre}
            onChange={(e) => { setNombre(e.target.value); clearFieldError('nombre'); }}
            style={{ ...inputStyle, ...(fieldErrors.nombre ? errorBorderStyle : {}) }} />
          {fieldErrors.nombre && <span style={errorTextStyle}>{fieldErrors.nombre}</span>}
        </div>

        {/* APELLIDO */}
        <div style={wrapperStyle}>
          <input type="text" placeholder="Apellido" value={apellido}
            onChange={(e) => { setApellido(e.target.value); clearFieldError('apellido'); }}
            style={{ ...inputStyle, ...(fieldErrors.apellido ? errorBorderStyle : {}) }} />
          {fieldErrors.apellido && <span style={errorTextStyle}>{fieldErrors.apellido}</span>}
        </div>

        {/* EMAIL */}
        <div style={wrapperStyle}>
          <input type="email" placeholder="Correo" value={email}
            onChange={(e) => { setEmail(e.target.value); clearFieldError('email'); }}
            style={{ ...inputStyle, ...(fieldErrors.email ? errorBorderStyle : {}) }} />
          {fieldErrors.email && <span style={errorTextStyle}>{fieldErrors.email}</span>}
        </div>

        {/* CONTRASEÑA */}
        <div style={wrapperStyle}>
          <input type="password" placeholder="Contraseña (mínimo 6 caracteres)" value={password}
            onChange={(e) => { setPassword(e.target.value); clearFieldError('password'); }}
            style={{ ...inputStyle, ...(fieldErrors.password ? errorBorderStyle : {}) }} />
          {fieldErrors.password && <span style={errorTextStyle}>{fieldErrors.password}</span>}
        </div>

        {/* TELÉFONO */}
        <div style={wrapperStyle}>
          <input type="text" placeholder="Teléfono (ej: 912345678)" value={telefono}
            onChange={(e) => { setTelefono(e.target.value); clearFieldError('telefono'); }}
            style={{ ...inputStyle, ...(fieldErrors.telefono ? errorBorderStyle : {}) }} />
          {fieldErrors.telefono && <span style={errorTextStyle}>{fieldErrors.telefono}</span>}
        </div>

        {/* DIRECCIÓN */}
        <div style={wrapperStyle}>
          <input type="text" placeholder="Dirección (ej: Av. Siempre Viva 123)" value={direccion}
            onChange={(e) => { setDireccion(e.target.value); clearFieldError('direccion'); }}
            style={{ ...inputStyle, ...(fieldErrors.direccion ? errorBorderStyle : {}) }} />
          {fieldErrors.direccion && <span style={errorTextStyle}>{fieldErrors.direccion}</span>}
        </div>

        {/* ROL */}
        <select value={rol} onChange={(e) => setRol(e.target.value)} style={inputStyle}>
          <option value="usuario">Usuario</option>
          <option value="admin">Administrador</option>
        </select>

        {error && <p style={{ margin: 0, color: "#e53e3e", backgroundColor: "#fff5f5", border: "1px solid #fed7d7", borderRadius: "8px", padding: "10px 14px", fontSize: "14px" }}>{error}</p>}
        {success && <p style={{ margin: 0, color: "#276749", backgroundColor: "#f0fff4", border: "1px solid #c6f6d5", borderRadius: "8px", padding: "10px 14px", fontSize: "14px" }}>{success}</p>}

        <button onClick={handleCreateUser} style={{ backgroundColor: "#ee5d69", color: "#ffffff", border: "none", borderRadius: "8px", padding: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginTop: "4px" }}>
          Crear usuario
        </button>
      </div>
    </div>
  );
}

const wrapperStyle = { display: "flex", flexDirection: "column", width: "100%" };
const inputStyle = { padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "15px", outline: "none", width: "100%", boxSizing: "border-box", color: "#374151" };
const errorBorderStyle = { border: "1.5px solid #e53e3e" };
const errorTextStyle = { color: "#e53e3e", fontSize: "12px", marginTop: "4px", marginLeft: "2px" };