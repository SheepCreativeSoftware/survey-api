import express from 'express';
import { registerUserHandle } from './register-user/handle';
import { loginUserHandle } from './login-user/handle';
import { generateAnswerTokenHandler } from './generate-answer-token/handle';
import { creatorAuthorizedHandler } from '../../modules/protection/userAuthCheck';

const router = express.Router();

router.post('/register-user', registerUserHandle());
router.post('/login-user', loginUserHandle());
router.get('/generate-answer-token', creatorAuthorizedHandler(), generateAnswerTokenHandler());

export { router as securityRoutes };
