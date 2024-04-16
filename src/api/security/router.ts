import express from 'express';
import { registerUserHandle } from './register-user/handle';
import { loginUserHandle } from './login-user/handle';

const router = express.Router();

router.post('/register-user', registerUserHandle());
router.post('/login-user', loginUserHandle());

export { router as securityRoutes };
