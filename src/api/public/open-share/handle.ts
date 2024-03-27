import type { Handler } from 'express';
import { getAllOptionsFromDb } from '../../../database/options/optionsDb';
import { getSurveyFromDb, getTokenFromDb } from '../../../database/survey/surveyDb';
import { handleErrorResponse } from '../../../modules/handler/handleErrorResponse';
import { handleSuccessResponse } from '../../../modules/handler/handleSuccessResponse';
import { checkPublicTokenObject } from '../../../modules/protection/zodRules';

const openShareHandle = (): Handler => {
	return async (req, res) => {
		try {
			const { publicToken } = checkPublicTokenObject.parse(req.query);
			const { creationToken } = await getTokenFromDb({ publicToken });

			const fullSurveyDeatils = await getSurveyFromDb(creationToken);
			const options = await getAllOptionsFromDb(creationToken);

			handleSuccessResponse(req, res, fullSurveyDeatils, { options });
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	};
};

export { openShareHandle };
