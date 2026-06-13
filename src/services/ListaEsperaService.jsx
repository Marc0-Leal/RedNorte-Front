import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "https://rednorte-api-gateway-k27o.onrender.com/api/gestion/listaEspera";

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${Cookies.get("token")}` }
});

const ListaEsperaService = {
  create: async ({ fecha_solitud, prioridad, hospital }) => {
    try {
      const body = {
        fecha_solitud, 
        prioridad,
        hospital,
      };
      console.log("ListaEspera body enviado:", JSON.stringify(body, null, 2));
      const res = await axios.post(API_URL, body, getAuthHeader());
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