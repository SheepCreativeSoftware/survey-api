import express from 'express';
import { openSurveysHandler } from './open-surveys/handle';
import { completedSurveysHandler } from './completed-survey/handle';

const router = express.Router();

router.get('/api/v1/survey-list/open-surveys', openSurveysHandler());
router.get('/api/v1/survey-list/completed-surveys', completedSurveysHandler());

export { router as surveyListRoutes };
