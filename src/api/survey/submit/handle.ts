import type { UUID } from 'node:crypto';
import type { Handler } from 'express';
import type { z as zod } from 'zod';
import { addOptionToDb } from '../../../database/options/optionsDb';
import { addSurveyToDb } from '../../../database/survey/surveyDb';
import { handleCreationResponse } from '../../../modules/handler/handleSuccessResponse';
import { getToken } from '../../../modules/misc/createToken';
import { checkSurveySubmitObject } from '../../../modules/protection/zodRules';

/**
 * Creates a new Survey which can be referenced to for options etc.
 */

type CreateSurvey = zod.infer<typeof checkSurveySubmitObject>;

const createNewSurvey = async (response: CreateSurvey) => {
	const creationToken = getToken();
	await addSurveyToDb({
		choicesType: response.choicesType,
		creationToken,
		creatorName: response.creatorName,
		endDate: new Date(response.endDate),
		publicToken: getToken(),
		surveyDescription: response.surveyDescription,
		surveyName: response.surveyName,
	});

	const optionIds = [] as UUID[];
	for (const option of response.options) {
		const optionId = await addOptionToDb(creationToken, option.optionName, option.content);
		optionIds.push(optionId);
	}

	return { creationToken, optionIds };
};

const submitHandle = (): Handler => {
	return async (req, res, next) => {
		try {
			const response = checkSurveySubmitObject.parse(req.body);
			const { creationToken, optionIds } = await createNewSurvey(response);
			handleCreationResponse(req, res, { creationToken, optionIds });
		} catch (error) {
			next(error);
		}
	};
};

export { submitHandle };
