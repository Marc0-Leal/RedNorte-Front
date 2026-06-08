import axios from "axios";

const API_URL = "https://rednorte-gestion-osku.onrender.com/api/hospital";

const HospitalService = {
  getAll: async () => {
    try {
      const res = await axios.get(API_URL);
      return res.data;
    } catch (error) {
      console.error("Error al obtener hospitales:", error);
      throw error;
    }
  },
};

export default HospitalService;