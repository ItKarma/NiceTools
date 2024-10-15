// src/controllers/gates_controllers.js
import gateway1 from '../utils/gateway1.js';
import geradas_pagarme from '../utils/geradas_pagarme.js';

class GatesController {
  async gateway11(gg) {
    try {
      const response = await gateway1(gg);
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

  async checkSubscriptionTime(user) {
    // Verifica se o usuário tem uma assinatura ativa
    if (!user || user.subscriptionStatus !== 'active' || !user.subscriptionEnd) {
      return 0; // Retorna 0 se não houver assinatura ou se estiver inativa
    }

    const now = new Date();
    const subscriptionEnd = new Date(user.subscriptionEnd);

    // Calcula a diferença de tempo entre agora e o fim da assinatura
    const timeLeft = subscriptionEnd - now;

    if (timeLeft <= 0) {
      return 0; // Retorna 0 se a assinatura já expirou
    }

    const timeLeftInHours = (timeLeft / 1000 / 60 / 60).toFixed(2);

    return `${timeLeftInHours} TEMPO`;
  }
}

export default new GatesController();