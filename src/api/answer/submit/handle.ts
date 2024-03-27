import { checkAnswerSurveyObject } from '../../../modules/protection/zodRules';
import { getSurveyIdFromDb } from '../../../database/survey/surveyDb';
import { handleCreationResponse } from '../../../modules/handler/handleSuccessResponse';
import { handleErrorResponse } from '../../../modules/handler/handleErrorResponse';
import type { Handler } from 'express';
import { storeSurveyAnswerToDb } from '../../../database/sessions/sessionsDb';


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
