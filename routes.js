// src/routes.js
import { Router } from 'express';
import authController from './src/controllers/auth_controller.js';
import homeController from './src/controllers/home_controller.js';
import auth from './src/middlewares/auth.js';

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




export default router;
