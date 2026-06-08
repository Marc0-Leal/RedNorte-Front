import axios from "axios";

const API_URL = "https://rednorte-gestion-osku.onrender.com/api/pago";

const PagoService = {
  create: async ({ monto, fecha_pago, metodo_pago, estado }) => {
    try {
      const body = { monto, fecha_pago, metodo_pago, estado };
      const res = await axios.post(API_URL, body);
      return res.data;
    } catch (error) {
      console.error("Error al crear pago:", error);
      throw error;
    }
  },
};

export default PagoService;