import axios from "axios";

const API_URL = "https://rednorte-gestion-osku.onrender.com/api/listaEspera";

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const ListaEsperaService = {
  create: async ({ fecha_solitud, prioridad, hospital }) => {
    try {
      const body = {
        fecha_solitud: formatDate(fecha_solitud),
        prioridad,
        hospital,
      };
      console.log("ListaEspera body enviado:", JSON.stringify(body, null, 2));
      const res = await axios.post(API_URL, body);
      return res.data;
    } catch (error) {
      if (error.response) {
        console.error("ListaEspera backend error:", JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  },
};

export default ListaEsperaService;