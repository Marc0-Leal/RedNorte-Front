import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "https://rednorte-api-gateway-k27o.onrender.com/api/gestion/citaMedica";

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${Cookies.get("token")}` }
});

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const CitaService = {
  create: async ({ fecha, hora, estado, medico, cliente, pago, listaEspera }) => {
    try {
      const body = {
        fecha,
        hora,
        estado,
        medico,
        cliente,
        pago,
        listaEspera,
      };
      console.log("Cita body enviado:", JSON.stringify(body, null, 2));
      const res = await axios.post(API_URL, body, getAuthHeader());
      return res.data;
    } catch (error) {
      if (error.response) {
        console.error("Cita backend error:", JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  },

  getAll: async () => {
    try {
      const res = await axios.get(API_URL, getAuthHeader());
      return res.data;
    } catch (error) {
      console.error("Error al obtener citas:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`, getAuthHeader());
      return res.data;
    } catch (error) {
      console.error(`Error al obtener cita ${id}:`, error);
      throw error;
    }
  },

  updatePartial: async (id, data) => {
    try {
      const res = await axios.patch(`${API_URL}/${id}`, data, getAuthHeader());
      return res.data;
    } catch (error) {
      console.error(`Error al actualizar cita ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error(`Error al eliminar cita ${id}:`, error);
      throw error;
    }
  },
};

export default CitaService;