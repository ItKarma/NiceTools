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

router.get('/gateway/gg', auth, async (req, res) => {
  try {
    const gg = req.query.gg;

    const userId = req.user.id;
    const user = await new Login().findUserById(userId);
    let users = await new Login().allFindUsers();
  //  console.log(users.length)

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const timeLeft = await gatesController.checkSubscriptionTime(user);
    let userInfo = { status: 'active', timeLeft };

    if (timeLeft === 0) {
      userInfo.status = 'inactive';
      return res.json(userInfo);
    }


    const response = await gatesController.gatewayGeradas(gg);
    //console.log(response);

    if (response.error) {
      return res.status(400).json({ error: response.error });
    }

    return res.json({ response });
  } catch (error) {
    console.error('Erro na rota /gateway/allbins2:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/gateway/allbins1', auth, async (req, res) => {
  try {
    const gg = req.query.gg;

    const userId = req.user.id;
    const user = await new Login().findUserById(userId);
    let users = await new Login().allFindUsers();
    //   console.log(users.length)

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const timeLeft = await gatesController.checkSubscriptionTime(user);
    let userInfo = { status: 'active', timeLeft };

    if (timeLeft === 0) {
      userInfo.status = 'inactive';
      return res.json(userInfo);
    }


    const response = await gatesController.gateway11(gg);
    //console.log(response);

    if (response.error) {
      return res.status(400).json({ error: response.error });
    }

    return res.json({ response });
  } catch (error) {
    console.error('Erro na rota /gateway/allbins2:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/gateway/debi', auth, async (req, res) => {
  try {
    const gg = req.query.gg;

    const userId = req.user.id;
    const user = await new Login().findUserById(userId);
    let users = await new Login().allFindUsers();
    //   console.log(users.length)

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const timeLeft = await gatesController.checkSubscriptionTime(user);
    let userInfo = { status: 'active', timeLeft };

    if (timeLeft === 0) {
      userInfo.status = 'inactive';
      return res.json(userInfo);
    }


    const response = await gatesController.gateway11(gg);
    //console.log(response);

    if (response.error) {
      return res.status(400).json({ error: response.error });
    }

    return res.json({ response });
  } catch (error) {
    console.error('Erro na rota /gateway/allbins2:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default router;
