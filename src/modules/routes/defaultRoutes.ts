import { addSurveyToDb } from '../database/survey/addSurveyToDb';
import express from 'express';
import { getToken } from '../misc/createToken';
import { handleErrorResponse } from '../handler/handleErrorResponse';
import { handleSuccessResponse } from '../handler/handleSuccessResponse';
import { z as zod } from 'zod';


// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/startSession', (req, res) => {
	try {
		let CSRFToken = '';
		if(typeof req.csrfToken === 'function') CSRFToken = req.csrfToken();
		else throw new Error('Failed to generate CSRF Token');
		handleSuccessResponse(req, res, { CSRFToken });
	} catch (error) {
		handleErrorResponse(req, res, error);
	}
});


const createSurveyRequest = zod.object({
	creatorName: zod.string(),
	endDate: zod.string().datetime(),
	surveyDescription: zod.string(),
	surveyName: zod.string(),
});

type CreateSurvey = zod.infer<typeof createSurveyRequest>;

const createNewSurvey = async (response: CreateSurvey) => {
	const creationToken = getToken();
	await addSurveyToDb({
		creationToken,
		creatorName: response.creatorName,
		endDate: new Date(response.endDate),
		publicToken: getToken(),
		surveyDescription: response.surveyDescription,
		surveyName: response.surveyName,
	});
	return creationToken;
};


router.post('/createNew', async (req, res) => {
	try {
		const response = createSurveyRequest.parse(req.body);
		const creationToken = await createNewSurvey(response);
		handleSuccessResponse(req, res, { creationToken });
	} catch (error) {
		handleErrorResponse(req, res, error);
	}
});

// URL curl http://localhost:3000/api/v1/createNew -X POST -H "Content-Type: application/json" -d'{ "creatorName": "Marina", "surveyName": "The Survey", "endDate": "2020-01-01T00:00:00Z" }'

export { router as defaultRoutes };
