import { Router } from 'express';
import authController from './src/controllers/auth_controller.js'
import homeController from './src/controllers/home_controller.js'
import auth from './src/middlewares/auth.js'

const router = Router();

router.post('/auth/register', authController.singUp);
router.post('/auth/login', authController.authLogin);
router.get('/', authController.auth);
router.get('/register', authController.authRegister);

router.get('/home',auth,  homeController.home)

export default router