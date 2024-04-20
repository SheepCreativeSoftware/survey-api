import express from 'express';
import { openResultHandler } from './open-result/handle';

const router = express.Router();

router.get('/open-result', openResultHandler());

export { router as surveyResultRoutes };
