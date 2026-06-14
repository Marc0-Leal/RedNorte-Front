import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "https://rednorte-api-gateway-k27o.onrender.com/api/hospital/pago";

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${Cookies.get("token")}` }
});

const PagoService = {
  create: async ({ monto, metodo_pago, estado }) => {
    try {
      const today = new Date();
      const fecha_pago = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      const body = {
        monto,
        fecha_pago,
        metodo_pago,
        estado,
      };
      console.log("Pago body enviado:", JSON.stringify(body, null, 2));
      const res = await axios.post(API_URL, body, getAuthHeader());
      return res.data;
    } catch (error) {
      if (error.response) {
        console.error("Pago backend error:", JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  },
};

export default PagoService;