import type { Handler } from 'express';
import { getAllOptionsFromDb } from '../../../database/options/optionsDb';
import { getSurveyFromDb, getTokenFromDb } from '../../../database/survey/surveyDb';
import { handleSuccessResponse } from '../../../modules/handler/handleSuccessResponse';
import { checkPublicTokenObject } from '../../../modules/protection/zodRules';

const openShareHandle = (): Handler => {
	return async (req, res, next) => {
		try {
			const { publicToken } = checkPublicTokenObject.parse(req.query);
			const { creationToken } = await getTokenFromDb({ publicToken });

			const fullSurveyDeatils = await getSurveyFromDb(creationToken);
			const options = await getAllOptionsFromDb(creationToken);

			handleSuccessResponse(req, res, fullSurveyDeatils, { options });
		} catch (error) {
			next(error);
		}
	};
};

export { openShareHandle };
