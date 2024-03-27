import { checkSurveyModifyObject } from '../../../modules/protection/zodRules';
import { getToken } from '../../../modules/misc/createToken';
import { handleErrorResponse } from '../../../modules/handler/handleErrorResponse';
import type { Handler } from 'express';
import { handleSuccessResponse } from '../../../modules/handler/handleSuccessResponse';
import { updateOptionToDb } from '../../../database/options/optionsDb';
import { updateSurveyInDb } from '../../../database/survey/surveyDb';
import { z as zod } from 'zod';

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

const updateHandle = (): Handler => {
	return async (req, res) => {
		try {
			const response = checkSurveyModifyObject.parse(req.body);
			await updateSurvey(response);
			handleSuccessResponse(req, res, { });
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	};
};

export { updateHandle };
