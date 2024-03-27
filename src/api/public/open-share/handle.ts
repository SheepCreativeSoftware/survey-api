import { getSurveyFromDb, getTokenFromDb } from '../../../database/survey/surveyDb';
import { checkPublicTokenObject } from '../../../modules/protection/zodRules';
import { getAllOptionsFromDb } from '../../../database/options/optionsDb';
import { handleErrorResponse } from '../../../modules/handler/handleErrorResponse';
import type { Handler } from 'express';
import { handleSuccessResponse } from '../../../modules/handler/handleSuccessResponse';


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
