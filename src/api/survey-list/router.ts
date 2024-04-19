import express from 'express';
import { openSurveysHandler } from './open-surveys/handle';
import { completedSurveysHandler } from './completed-surveys/handle';
import { createSurveyHandler } from './create-survey/handle';
import { completeSurveyHandler } from './complete-survey/handle';
import { adjustSurveyHandler } from './adjust-survey/handle';

const router = express.Router();

router.post('/create-survey', createSurveyHandler());
router.post('/complete-survey', completeSurveyHandler());
router.post('/adjust-survey', adjustSurveyHandler());

router.get('/open-surveys', openSurveysHandler());
router.get('/completed-surveys', completedSurveysHandler());

export { router as surveyListRouter };
