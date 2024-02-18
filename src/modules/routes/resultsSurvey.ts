import express from 'express';
import { getAllOptionFromDb } from '../database/options/optionsDb';
import { getSessionFromDb } from '../database/sessions/sessionsDb';
import { handleErrorResponse } from '../handler/handleErrorResponse';
import { handleSuccessResponse } from '../handler/handleSuccessResponse';
import { z as zod } from 'zod';


// eslint-disable-next-line new-cap
const router = express.Router();

/**
 * Opens a existing Survey
 */

const openFullSurveyParams = zod.object({
	creationToken: zod.string().regex(/^[A-Za-z0-9+/]*/),
});

router.get('/getResults', async (req, res) => {
	try {
		const { creationToken } = openFullSurveyParams.parse(req.query);

		const fullSurveyDeatils = await getSessionFromDb(creationToken);
		const options = await getAllOptionFromDb(creationToken);
		const response = Object.assign({}, fullSurveyDeatils, { options });
		handleSuccessResponse(req, res, response);
	} catch (error) {
		handleErrorResponse(req, res, error);
	}
});


export { router as resultsSurveyRoutes };
