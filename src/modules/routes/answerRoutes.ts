import { checkAnswerSurveyObject } from '../protection/zodRules';
import express from 'express';
import { getSurveyIdFromDb } from '../database/survey/surveyDb';
import { handleCreationResponse } from '../handler/handleSuccessResponse';
import { handleErrorResponse } from '../handler/handleErrorResponse';
import { storeSurveyAnswerToDb } from '../database/sessions/sessionsDb';


// eslint-disable-next-line new-cap
const router = express.Router();

/**
 * Creates a new Survey which can be referenced to for options etc.
 */



router.post('/submit', async (req, res) => {
	try {
		const response = checkAnswerSurveyObject.parse(req.body);
		const surveyId = await getSurveyIdFromDb({ publicToken: response.publicToken });

		await storeSurveyAnswerToDb({ optionSelection: response.optionSelection, surveyId });
		handleCreationResponse(req, res, {});
	} catch (error) {
		handleErrorResponse(req, res, error);
	}
});

export { router as answerRoutes };
