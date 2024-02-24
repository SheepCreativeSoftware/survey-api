import { checkCreationTokenObject } from '../protection/zodRules';
import express from 'express';
import { getSessionFromDb } from '../database/sessions/sessionsDb';
import { handleErrorResponse } from '../handler/handleErrorResponse';
import { handleSuccessResponse } from '../handler/handleSuccessResponse';



// eslint-disable-next-line new-cap
const router = express.Router();

/**
 * Opens a existing Survey
 */

router.get('/get', async (req, res) => {
	try {
		const { creationToken } = checkCreationTokenObject.parse(req.query);

		const surveyResults = await getSessionFromDb(creationToken);

		handleSuccessResponse(req, res, { surveyResults });
	} catch (error) {
		handleErrorResponse(req, res, error);
	}
});


export { router as resultsRoutes };
