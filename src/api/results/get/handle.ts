import { checkCreationTokenObject } from '../../../modules/protection/zodRules';
import { getSessionFromDb } from '../../../database/sessions/sessionsDb';
import { handleErrorResponse } from '../../../modules/handler/handleErrorResponse';
import type { Handler } from 'express';
import { handleSuccessResponse } from '../../../modules/handler/handleSuccessResponse';


const getHandle = (): Handler => {
	return async (req, res) => {
		try {
			const { creationToken } = checkCreationTokenObject.parse(req.query);

			const surveyResults = await getSessionFromDb(creationToken);

			handleSuccessResponse(req, res, { surveyResults });
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	};
};

export { getHandle };
