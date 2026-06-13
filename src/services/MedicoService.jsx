import axios from "axios";

const API_URL = "https://rednorte-gestion-osku.onrender.com/api/medico";

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${Cookies.get("token")}` }
});

const MedicoService = {
  getAll: async () => {
    try {
      const res = await axios.get(API_URL, getAuthHeader());
      return res.data;
    } catch (error) {
      console.error("Error al obtener médicos:", error);
      throw error;
    }
  },
};

export default MedicoService;