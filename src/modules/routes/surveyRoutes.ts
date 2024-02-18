import { addSurveyToDb, removeSurveyFromDb } from '../database/survey/surveyDb';
import { handleCreationResponse, handleSuccessResponse } from '../handler/handleSuccessResponse';
import express from 'express';
import { getToken } from '../misc/createToken';
import { handleErrorResponse } from '../handler/handleErrorResponse';
import { removeOptionsFromDb } from '../database/options/optionsDb';
import { removeSessionsFromDb } from '../database/sessions/sessionsDb';
import { z as zod } from 'zod';

// eslint-disable-next-line new-cap
const router = express.Router();

/**
 * Creates a new Survey which can be referenced to for options etc.
 */

const ChoicesTypeSchema = zod.union([
	zod.literal('single'),
	zod.literal('multiple'),
]);

const createSurveyRequest = zod.object({
	choicesType: ChoicesTypeSchema,
	creatorName: zod.string(),
	endDate: zod.string().datetime(),
	surveyDescription: zod.string(),
	surveyName: zod.string(),
});

type CreateSurvey = zod.infer<typeof createSurveyRequest>;

const createNewSurvey = async (response: CreateSurvey) => {
	const creationToken = getToken();
	await addSurveyToDb({
		choicesType: response.choicesType,
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
		handleCreationResponse(req, res, { creationToken });
	} catch (error) {
		handleErrorResponse(req, res, error);
	}
});

/**
 * Removes a existing survey from the database
 */

const removeSurveyRequest = zod.object({
	creationToken: zod.string().regex(/^[A-Za-z0-9+/]*/),
});

const removeSurvey = async (creationToken: string) => {
	await removeSessionsFromDb(creationToken);
	await removeOptionsFromDb(creationToken);
	await removeSurveyFromDb(creationToken);
};

router.post('/removeSurvey', async (req, res) => {
	try {
		const { creationToken } = removeSurveyRequest.parse(req.body);
		await removeSurvey(creationToken);
		handleSuccessResponse(req, res, {});
	} catch (error) {
		handleErrorResponse(req, res, error);
	}
});

export { router as surveyRoutes };
