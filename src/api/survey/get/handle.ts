import type { Handler } from 'express';
import { getAllOptionsFromDb } from '../../../database/options/optionsDb';
import { getSurveyFromDb } from '../../../database/survey/surveyDb';
import { handleErrorResponse } from '../../../modules/handler/handleErrorResponse';
import { handleSuccessResponse } from '../../../modules/handler/handleSuccessResponse';
import { checkCreationTokenObject } from '../../../modules/protection/zodRules';

/**
 * Gets the survey from DB
 */

const getSurvey = (): Handler => {
	return async (req, res) => {
		try {
			const { creationToken } = checkCreationTokenObject.parse(req.query);

			const survey = await getSurveyFromDb(creationToken);
			const options = await getAllOptionsFromDb(creationToken);
			handleSuccessResponse(req, res, survey, { options });
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	};
};

export { getSurvey };
