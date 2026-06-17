import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "https://rednorte-api-gateway-k27o.onrender.com/api/medico";

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${Cookies.get("token")}` }
});

const MedicoService = {
  getByHospital: async (hospitalId) => {
    try {
      const res = await axios.get(`${API_URL}/hospital/${hospitalId}`, getAuthHeader());
      return res.data;
    } catch (error) {
      console.error("Error al obtener médicos por hospital:", error);
      return [];
    }
  },
};

export default MedicoService;