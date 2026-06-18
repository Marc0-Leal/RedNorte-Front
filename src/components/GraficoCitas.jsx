import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CitaService from "../services/CitaService";

// Colores simples por estado (ajusta los nombres de estado si los tuyos son distintos)
const ESTADO_COLOR = {
  pendiente: "#f5a623",
  confirmada: "#3b82f6",
  completada: "#22c55e",
  cancelada: "#ef4444",
};

export default function GraficoCitas() {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarCitas = async () => {
      try {
        const data = await CitaService.getAll();

        // La API puede devolver el array directo, o envuelto en { data: [...] }
        const lista = Array.isArray(data) ? data : data?.data || [];

        setCitas(lista);

        // Log temporal para que revises la forma real de "medico" y "cliente"
        if (lista.length > 0) {
          console.log("Ejemplo de cita recibida:", lista[0]);
        }
      } catch (err) {
        console.error("Error al cargar citas para el gráfico:", err);
        setError("No se pudieron cargar los datos de citas.");
      } finally {
        setCargando(false);
      }
    };

    cargarCitas();
  }, []);

  // --- Procesamiento: citas agrupadas por estado ---
  const citasPorEstado = citas.reduce((acc, cita) => {
    const estado = (cita.estado || "sin_estado").toLowerCase();
    acc[estado] = (acc[estado] || 0) + 1;
    return acc;
  }, {});

  const dataEstado = Object.entries(citasPorEstado).map(([estado, cantidad]) => ({
    estado: estado.charAt(0).toUpperCase() + estado.slice(1),
    cantidad,
    color: ESTADO_COLOR[estado] || "#94a3b8",
  }));

  // --- Procesamiento: citas agrupadas por fecha ---
  const citasPorFecha = citas.reduce((acc, cita) => {
    const fecha = cita.fecha || "Sin fecha";
    acc[fecha] = (acc[fecha] || 0) + 1;
    return acc;
  }, {});

  const dataFecha = Object.entries(citasPorFecha)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([fecha, cantidad]) => ({ fecha, cantidad }));

  if (cargando) {
    return <p>Cargando gráfico de citas...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (citas.length === 0) {
    return <p>Aún no hay citas registradas.</p>;
  }

  return (
    <section className="table-section">
      <h2>Citas por estado</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dataEstado}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="estado" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="cantidad" name="N° de citas" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>

      <h2 style={{ marginTop: "2rem" }}>Citas por fecha</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dataFecha}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="cantidad" name="N° de citas" stroke="#22c55e" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}