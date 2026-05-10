import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import "./../styles/pages/Admin.css";

export default function AdminDashboard() {
  const rol = Cookies.get("rol");

  // Protección de ruta
  if (rol !== "admin") {
    return <Navigate to="/" />;
  }

  return (
    <div className="admin">
      
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">Red Norte</h2>

        <nav className="menu">
          <a href="#">Citas</a>
          <a href="#">Usuarios</a>
        </nav>
      </aside>

      {/* CONTENIDO */}
      <main className="main-content">

        {/* NAVBAR */}
        <header className="topbar">
          <h1>Panel Administrador</h1>

          <div className="admin-user">
            <span>Administrador</span>
          </div>
        </header>

        {/* CARDS */}
        <section className="cards">

          <div className="card">
            <h3>Pacientes</h3>
            <p>0</p>
          </div>

          <div className="card">
            <h3>Doctores</h3>
            <p>0</p>
          </div>

          <div className="card">
            <h3>Citas Hoy</h3>
            <p>0</p>
          </div>

          <div className="card">
            <h3>Usuarios</h3>
            <p>0</p>
          </div>

        </section>

        {/* TABLA */}
        <section className="table-section">

          <h2>Últimas citas</h2>

          <table>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Doctor</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Juan Pérez</td>
                <td>Dr. Soto</td>
                <td>12/10/2025</td>
                <td>Confirmada</td>
              </tr>

              <tr>
                <td>María Díaz</td>
                <td>Dra. Rojas</td>
                <td>12/10/2025</td>
                <td>Pendiente</td>
              </tr>

              <tr>
                <td>Carlos Gómez</td>
                <td>Dr. Silva</td>
                <td>13/10/2025</td>
                <td>Completada</td>
              </tr>
            </tbody>
          </table>

        </section>

      </main>
    </div>
  );
}