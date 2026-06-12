import axios from "axios";

const API_URL = "https://rednorte-api-gateway-k27o.onrender.com/api/gestion/pago";

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
      const res = await axios.post(API_URL, body);
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