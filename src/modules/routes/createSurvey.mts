import { addSurveyToDb } from '../database/survey/addSurveyToDb.mjs';
import { buntstift } from 'buntstift';
import express from 'express';
import { expressLogger } from '../misc/expressLogger.mjs';
import { getToken } from '../misc/createToken.mjs';
import { handleErrorResponse } from '../misc/handleErrorResponse.mjs';
import { handleSuccessResponse } from '../misc/handleSuccessResponse.mjs';
import { z as zod } from 'zod';


// eslint-disable-next-line new-cap
const router = express.Router();

const createSurveyRequest = zod.object({
	creatorName: zod.string(),
	endDate: zod.string().datetime(),
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
		surveyName: response.surveyName,
	});
	return creationToken;
};



router.post('/createNew', async (req, res) => {
	try {
		const response = createSurveyRequest.parse(req.body);
		buntstift.verbose(JSON.stringify(response));
		const creationToken = await createNewSurvey(response);
		handleSuccessResponse({ creationToken }, res);
		expressLogger('success', req, res);
	} catch (error) {
		handleErrorResponse(error, res);
	}
});

// URL curl http://localhost:3000/api/v1/createNew -X POST -H "Content-Type: application/json" -d'{ "creatorName": "Marina", "surveyName": "The Survey", "endDate": "2020-01-01T00:00:00Z" }'

export { router as createSurvey };
