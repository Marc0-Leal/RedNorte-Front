import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "https://rednorte-api-gateway-k27o.onrender.com/api/gestion/cliente";

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${Cookies.get("token")}` }
});

const ClienteService = {
  getAll: async () => {
    try {
      const res = await axios.get(API_URL, getAuthHeader());
      return res.data;
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      throw error;
    }
  },

  getByRut: async (rut) => {
    try {
      const res = await axios.get(API_URL, getAuthHeader());
      const clientes = res.data;
      return clientes.find((c) => c.rut === rut) || null;
    } catch (error) {
      console.error("Error al buscar cliente por rut:", error);
      throw error;
    }
  },
};

export default ClienteService;