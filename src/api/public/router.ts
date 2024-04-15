import express from 'express';
import { openShareHandle } from './open-share/handle';

const router = express.Router();

router.get('/open-share', openShareHandle());

export { router as publicRoutes };
