import { z as zod } from 'zod';

const token = zod.string().regex(/^[A-Za-z0-9+/]*/);

const checkCreationTokenObject = zod.object({
	creationToken: token,
});

const checkPublicTokenObject = zod.object({
	publicToken: token,
});

const checkAllTokens = zod.object({
	creationToken: zod.string(),
	publicToken: zod.string(),
});

const checkSurveyIdObject = zod.object({
	surveyId: zod.number(),
});

const ChoicesTypeSchema = zod.union([zod.literal('single'), zod.literal('multiple')]);

const checkSurveyObject = zod.object({
	choicesType: ChoicesTypeSchema,
	creatorName: zod.string(),
	endDate: zod.date(),
	surveyDescription: zod.string(),
	surveyId: zod.number(),
	surveyName: zod.string(),
});

const checkOptionsObject = zod.array(
	zod.object({
		content: zod.string(),
		optionId: zod.string().uuid().optional(),
		optionName: zod.string(),
	}),
);

const checkSurveySubmitObject = zod.object({
	choicesType: ChoicesTypeSchema,
	creatorName: zod.string(),
	endDate: zod.string().datetime(),
	options: checkOptionsObject,
	surveyDescription: zod.string(),
	surveyName: zod.string(),
});

const checkSurveyModifyObject = zod.object({
	choicesType: ChoicesTypeSchema,
	creationToken: token,
	creatorName: zod.string(),
	endDate: zod.string().datetime(),
	options: checkOptionsObject,
	surveyDescription: zod.string(),
	surveyName: zod.string(),
});

const checkAnswerSurveyObject = zod.object({
	optionSelection: zod.array(zod.string()),
	publicToken: zod.string().regex(/^[A-Za-z0-9+/]*/),
});

const checkResultsObject = zod.array(
	zod.object({
		optionSelection: zod.array(zod.string()),
		sessionId: zod.string(),
	}),
);

export {
	checkAllTokens,
	checkAnswerSurveyObject,
	checkCreationTokenObject,
	checkOptionsObject,
	checkPublicTokenObject,
	checkResultsObject,
	checkSurveyIdObject,
	checkSurveyModifyObject,
	checkSurveyObject,
	checkSurveySubmitObject,
};
