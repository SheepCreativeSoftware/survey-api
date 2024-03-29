import type { Handler } from 'express';
import { removeOptionsFromDb } from '../../../database/options/optionsDb';
import { removeSessionsFromDb } from '../../../database/sessions/sessionsDb';
import { removeSurveyFromDb } from '../../../database/survey/surveyDb';
import { handleErrorResponse } from '../../../modules/handler/handleErrorResponse';
import { handleSuccessResponse } from '../../../modules/handler/handleSuccessResponse';
import { checkCreationTokenObject } from '../../../modules/protection/zodRules';

/**
 * Removes a existing survey from the database
 */

const removeSurvey = async (creationToken: string) => {
	await removeSessionsFromDb(creationToken);
	await removeOptionsFromDb(creationToken);
	await removeSurveyFromDb(creationToken);
};

const removeHandle = (): Handler => {
	return async (req, res) => {
		try {
			const { creationToken } = checkCreationTokenObject.parse(req.body);
			await removeSurvey(creationToken);
			handleSuccessResponse(req, res, {});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	};
};

export { removeHandle };
