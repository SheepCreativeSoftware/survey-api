import express from 'express';
import { adjustSurveyHandler } from './adjust-survey/handle';
import { completedSurveysHandler } from './completed-surveys/handle';
import { completeSurveyHandler } from './complete-survey/handle';
import { createSurveyHandler } from './create-survey/handle';
import { openSurveysHandler } from './open-surveys/handle';

const router = express.Router();

router.post('/create-survey', createSurveyHandler());
router.post('/complete-survey', completeSurveyHandler());
router.post('/adjust-survey', adjustSurveyHandler());

router.get('/open-surveys', openSurveysHandler());
router.get('/completed-surveys', completedSurveysHandler());

export { router as surveyListRouter };
