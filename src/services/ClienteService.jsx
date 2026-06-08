import axios from "axios";

const API_URL = "https://rednorte-gestion-osku.onrender.com/api/cliente";

const ClienteService = {
  getAll: async () => {
    try {
      const res = await axios.get(API_URL);
      return res.data;
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      throw error;
    }
  },

  getByRut: async (rut) => {
    try {
      const res = await axios.get(API_URL);
      const clientes = res.data;
      return clientes.find((c) => c.rut === rut) || null;
    } catch (error) {
      console.error("Error al buscar cliente por rut:", error);
      throw error;
    }
  },
};

export default ClienteService;