import type { Handler } from 'express';
import { getSessionFromDb } from '../../../database/sessions/sessionsDb';
import { handleSuccessResponse } from '../../../modules/handler/handleSuccessResponse';
import { checkCreationTokenObject } from '../../../modules/protection/zodRules';

const getHandle = (): Handler => {
	return async (req, res, next) => {
		try {
			const { creationToken } = checkCreationTokenObject.parse(req.query);

			const surveyResults = await getSessionFromDb(creationToken);

			handleSuccessResponse(req, res, { surveyResults });
		} catch (error) {
			next(error);
		}
	};
};

export { getHandle };
