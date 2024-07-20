import { Router } from 'express';
import userRouter from './routes/user_router.js'

const router = Router();

router.use(('/', userRouter))

export default router