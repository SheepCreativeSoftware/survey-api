import { addOptionToDb, getAllOptionsFromDb, removeOptionsFromDb, updateOptionToDb } from '../database/options/optionsDb';
import { addSurveyToDb, getSurveyFromDb, getTokenFromDb, removeSurveyFromDb, updateSurveyInDb } from '../database/survey/surveyDb';
import { checkCreationTokenObject, checkSurveyModifyObject, checkSurveySubmitObject } from '../protection/zodRules';
import { handleCreationResponse, handleSuccessResponse } from '../handler/handleSuccessResponse';
import express from 'express';
import { getToken } from '../misc/createToken';
import { handleErrorResponse } from '../handler/handleErrorResponse';
import { removeSessionsFromDb } from '../database/sessions/sessionsDb';
import { UUID } from 'crypto';
import { z as zod } from 'zod';


// eslint-disable-next-line new-cap
const router = express.Router();

/**
 * Gets the survey from DB
 */

router.get('/get', async (req, res) => {
	try {
		const { creationToken } = checkCreationTokenObject.parse(req.query);

		const survey = await getSurveyFromDb(creationToken);
		const options = await getAllOptionsFromDb(creationToken);
		handleSuccessResponse(req, res, survey, { options });
	} catch (error) {
		handleErrorResponse(req, res, error);
	}
});


/**
 * Gets share link for this survey
 */

router.get('/share-link', async (req, res) => {
	try {
		const { creationToken } = checkCreationTokenObject.parse(req.query);
		const { publicToken } = await getTokenFromDb({ creationToken });
		if(typeof process.env.URL === 'undefined') throw new Error('Missing URL enviroment param');
		const shareUrl = new URL(process.env.URL);
		shareUrl.searchParams.set('shareToken', publicToken);
		handleSuccessResponse(req, res, { shareLink: shareUrl.toString() });
	} catch (error) {
		handleErrorResponse(req, res, error);
	}
});


/**
 * Creates a new Survey which can be referenced to for options etc.
 */

type CreateSurvey = zod.infer<typeof checkSurveySubmitObject>;

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

	const optionIds = [] as UUID[];
	for(const option of response.options) {
		const optionId = await addOptionToDb(creationToken, option.optionName, option.content);
		optionIds.push(optionId);
	}

	return { creationToken, optionIds };
};

router.post('/submit', async (req, res) => {
	try {
		const response = checkSurveySubmitObject.parse(req.body);
		const { creationToken, optionIds } = await createNewSurvey(response);
		handleCreationResponse(req, res, { creationToken, optionIds });
	} catch (error) {
		handleErrorResponse(req, res, error);
	}
});


/**
 * Updates a existing Survey
 */

type UpdateSurvey = zod.infer<typeof checkSurveyModifyObject>;

const updateSurvey = async (response: UpdateSurvey) => {
	await updateSurveyInDb({
		choicesType: response.choicesType,
		creationToken: response.creationToken,
		creatorName: response.creatorName,
		endDate: new Date(response.endDate),
		publicToken: getToken(),
		surveyDescription: response.surveyDescription,
		surveyName: response.surveyName,
	});

	for(const option of response.options) {
		if(typeof option.optionId === 'undefined') throw new Error('Missing option ID');
		await updateOptionToDb(response.creationToken, option.optionId, option.optionName, option.content);
	}
};

router.post('/update', async (req, res) => {
	try {
		const response = checkSurveyModifyObject.parse(req.body);
		await updateSurvey(response);
		handleSuccessResponse(req, res, { });
	} catch (error) {
		handleErrorResponse(req, res, error);
	}
});


/**
 * Removes a existing survey from the database
 */

const removeSurvey = async (creationToken: string) => {
	await removeSessionsFromDb(creationToken);
	await removeOptionsFromDb(creationToken);
	await removeSurveyFromDb(creationToken);
};

router.post('/remove', async (req, res) => {
	try {
		const { creationToken } = checkCreationTokenObject.parse(req.body);
		await removeSurvey(creationToken);
		handleSuccessResponse(req, res, {});
	} catch (error) {
		handleErrorResponse(req, res, error);
	}
});

export { router as surveyRoutes };
