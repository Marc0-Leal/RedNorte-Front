import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const API_URL = "http://localhost:8080/api/atenciones";

export default function GraficoAtenciones() {
  const [datos, setDatos] = useState([]);
  const [resumen, setResumen] = useState({});
  const [modo, setModo] = useState("diario");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
    cargarResumen();
  }, [modo]);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      let url;
      if (modo === "diario") {
        const hasta = new Date().toISOString().split("T")[0];
        const desde = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];
        url = `${API_URL}/grafico/diario?desde=${desde}&hasta=${hasta}`;
      } else {
        const anio = new Date().getFullYear();
        url = `${API_URL}/grafico/mensual?anio=${anio}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      const formateado = data.etiquetas.map((etiqueta, i) => ({
        nombre: etiqueta,
        atenciones: data.valores[i],
      }));

      setDatos(formateado);
    } catch (error) {
      console.error("Error al cargar gráfico:", error);
    } finally {
      setCargando(false);
    }
  };

  const cargarResumen = async () => {
    try {
      const res = await fetch(`${API_URL}/resumen`);
      const data = await res.json();
      setResumen(data);
    } catch (error) {
      console.error("Error al cargar resumen:", error);
    }
  };

  return (
    <div className="grafico-section">
      <div className="grafico-header">
        <h2>Personas Atendidas</h2>
        <div className="grafico-tabs">
          <button
            className={`tab-btn ${modo === "diario" ? "active" : ""}`}
            onClick={() => setModo("diario")}
          >
            Por día
          </button>
          <button
            className={`tab-btn ${modo === "mensual" ? "active" : ""}`}
            onClick={() => setModo("mensual")}
          >
            Por mes
          </button>
        </div>
      </div>

      <div className="grafico-stats">
        <span>Total: <strong>{resumen.totalAtenciones ?? 0}</strong></span>
        <span>Completadas: <strong>{resumen.completadas ?? 0}</strong></span>
        <span>Pendientes: <strong>{resumen.pendientes ?? 0}</strong></span>
      </div>

      {cargando ? (
        <p className="grafico-cargando">Cargando gráfico...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datos} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="nombre" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="atenciones" fill="#e8365d" radius={[6, 6, 0, 0]} name="Personas atendidas" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}