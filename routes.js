// src/routes.js
import { Router } from 'express';
import authController from './src/controllers/auth_controller.js';
import homeController from './src/controllers/home_controller.js';
import gatesController from './src/controllers/gates_controllers.js';
import auth from './src/middlewares/auth.js';
import Login from "./src/models/user_model.js";

const router = Router();

// Rotas de autenticação
router.post('/auth/register', authController.singUp);
router.post('/auth/login', authController.authLogin);
router.get('/', authController.auth);
router.get('/register', authController.authRegister);

// Rotas protegidas por autenticação
router.get('/home', auth, homeController.home);
router.get('/allbins', auth, homeController.allbins);
router.get('/geradas', auth, homeController.geradas);
router.get('/debitando', auth, homeController.debitando);
router.get('/contato', auth, homeController.contato);
router.get('/about', auth, homeController.about);

router.get('/gateway/allbins1', auth, async (req, res) => {
  try {
    const gg = req.query.gg;
    const userId = req.user.id;
    const user = await new Login().findUserById(userId); // Busca o usuário no banco
    console.log(user, userId, gg)

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    let userInfo = { status: 'active', balance: user.balance };

    if (user.balance === 0) {
      userInfo.status = 'inactive';
      return res.json(userInfo);
    }
    if (user.balance < 1.5) {
      return res.status(400).json({ error: 'Saldo insuficiente' });
    }

    const response = await gatesController.gateway11(gg);
 //   console.log(response)

    // Usa a função deductBalance para reduzir o saldo do usuário baseado na resposta
    if (response.includes('Aprovada')){
      const reduceBalance = await new Login().deductBalance(1.5, userId);
      console.log('Saldo reduzido em 1.5:', reduceBalance);
    }

    return res.json({ response });
  } catch (error) {
    console.error('Erro na rota /gateway/allbins1:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});



export default router;
