import axios from "axios";

const API_URL = "https://rednorte-gestion-osku.onrender.com/api/listaEspera";

const ListaEsperaService = {
  create: async ({ fecha_solitud, prioridad, hospital }) => {
    try {
      const body = {
        fecha_solitud,
        prioridad,
        hospital: { id: hospital.id },
      };
      const res = await axios.post(API_URL, body);
      return res.data;
    } catch (error) {
      if (error.response) {
        console.error("Respuesta del backend:", JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  },
};

export default ListaEsperaService;