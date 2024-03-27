import express from 'express';
import { openShareHandle } from './open-share/handle';
import { startSessionHandle } from './start-session/handle';


// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/start-session', startSessionHandle());


router.get('/open-share', openShareHandle());

export { router as publicRoutes };
