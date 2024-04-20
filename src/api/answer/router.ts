import express from 'express';
import { openSurveyHandler } from './open-survey/handle';
import { answerSurveyHandler } from './answer-survey/handle';

const router = express.Router();

router.post('/answer-survey', answerSurveyHandler());
router.get('/open-survey', openSurveyHandler());

export { router as answerSurveyRoutes };
