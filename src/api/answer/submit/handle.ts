import type { Handler } from 'express';
import { storeSurveyAnswerToDb } from '../../../database/sessions/sessionsDb';
import { getSurveyIdFromDb } from '../../../database/survey/surveyDb';
import { handleErrorResponse } from '../../../modules/handler/handleErrorResponse';
import { handleCreationResponse } from '../../../modules/handler/handleSuccessResponse';
import { checkAnswerSurveyObject } from '../../../modules/protection/zodRules';

const submitHandle = (): Handler => {
	return async (req, res) => {
		try {
			const response = checkAnswerSurveyObject.parse(req.body);
			const surveyId = await getSurveyIdFromDb({ publicToken: response.publicToken });

			await storeSurveyAnswerToDb({ optionSelection: response.optionSelection, surveyId });
			handleCreationResponse(req, res, {});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	};
};

export { submitHandle };
