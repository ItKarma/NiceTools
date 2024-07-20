import { Router } from 'express';
import authController from './src/controllers/auth_controller.js'

const router = Router();

router.get('/auth', authController.register)

export default router