import express from 'express';
import { registerUserHandle } from './register-user/handle';
import { loginUserHandle } from './login-user/handle';

const router = express.Router();

router.get('api/v1/security/register-user', registerUserHandle());
router.get('api/v1/security/login-user', loginUserHandle());

export { router as securityRoutes };
