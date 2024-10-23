// src/controllers/gates_controllers.js
import gateway1 from '../utils/gateway1.js';
import geradas_pagarme from '../utils/geradas_pagarme.js';
//import ggdebitando from '../utils/fitbike.js';


class GatesController {
  async gateway11(gg) {
    try {
      const response = await geradas_pagarme(gg);
      console.log(response)
      return response 
    } catch (error) {
      console.error('Erro no controlador GatesController:', error);
      return { error: 'Internal Server Error' }; // Retorne um erro genérico
    }
  }

  async gatewayGeradas(gg) {
    try {
      const response = await geradas_pagarme(gg);
      return response 
    } catch (error) {
      console.error('Erro no controlador GatesController:', error);
      return { error: 'Internal Server Error' }; // Retorne um erro genérico
    }
  }

}

export default new GatesController();