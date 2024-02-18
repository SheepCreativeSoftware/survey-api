import express from 'express';
import { handleErrorResponse } from '../handler/handleErrorResponse';
import { handleSuccessResponse } from '../handler/handleSuccessResponse';
import { storeSurveyAnswerToDb } from '../database/sessions/sessionsDb';
import { z as zod } from 'zod';

// eslint-disable-next-line new-cap
const router = express.Router();

/**
 * Creates a new Survey which can be referenced to for options etc.
 */

const finishSurveyRequest = zod.object({
	optionSelection: zod.array(zod.string()),
	sessionId: zod.number(),
});

router.post('/finishSurvey', async (req, res) => {
	try {
		const response = finishSurveyRequest.parse(req.body);

		await storeSurveyAnswerToDb(response);
		handleSuccessResponse(req, res, {});
	} catch (error) {
		handleErrorResponse(req, res, error);
	}
});

export { router as answerRoutes };
