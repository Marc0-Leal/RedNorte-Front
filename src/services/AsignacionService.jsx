import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "https://rednorte-api-gateway-k27o.onrender.com/api/optimizacion/asignacion";

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${Cookies.get("token")}` }
});

const AsignacionService = {
  create: async ({ listaEsperaId, prioridad, medicoDisponible, mismaRegion, medicoId, hospitalId }) => {
    try {
      const res = await axios.post(API_URL, null, {
        params: {
          listaEsperaId,
          prioridad,
          medicoDisponible,
          mismaRegion,
          medicoId,
          hospitalId,
        },
      }, getAuthHeader());
      return res.data;
    } catch (error) {
      if (error.response) {
        console.error("Asignacion backend error:", JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  },

  getAll: async () => {
    try {
      const res = await axios.get(API_URL, getAuthHeader);
      return res.data;
    } catch (error) {
      console.error("Error al obtener asignaciones:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`, getAuthHeader());
      return res.data;
    } catch (error) {
      console.error(`Error al obtener asignacion ${id}:`, error);
      throw error;
    }
  },

  actualizarEstado: async (id, nuevoEstado) => {
    try {
      const res = await axios.patch(`${API_URL}/${id}/estado`, null, {
        params: { nuevoEstado },
      }, getAuthHeader());
      return res.data;
    } catch (error) {
      console.error(`Error al actualizar estado asignacion ${id}:`, error);
      throw error;
    }
  },
};

export default AsignacionService;