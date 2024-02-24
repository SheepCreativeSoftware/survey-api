import { getSurveyFromDb, getTokenFromDb } from '../database/survey/surveyDb';
import { checkPublicTokenObject } from '../protection/zodRules';
import express from 'express';
import { getAllOptionsFromDb } from '../database/options/optionsDb';
import { handleErrorResponse } from '../handler/handleErrorResponse';
import { handleSuccessResponse } from '../handler/handleSuccessResponse';


// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/start-session', (req, res) => {
	try {
		let CSRFToken = '';
		if(typeof req.csrfToken === 'function') CSRFToken = req.csrfToken();
		else throw new Error('Failed to generate CSRF Token');
		handleSuccessResponse(req, res, { CSRFToken });
	} catch (error) {
		handleErrorResponse(req, res, error);
	}
});


router.get('/open-share', async (req, res) => {
	try {
		const { publicToken } = checkPublicTokenObject.parse(req.query);
		const { creationToken } = await getTokenFromDb({ publicToken });

		const fullSurveyDeatils = await getSurveyFromDb(creationToken);
		const options = await getAllOptionsFromDb(creationToken);

		handleSuccessResponse(req, res, fullSurveyDeatils, { options });
	} catch (error) {
		handleErrorResponse(req, res, error);
	}
});

export { router as publicRoutes };
