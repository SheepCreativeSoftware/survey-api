import { z as zod } from 'zod';

const ChoicesTypeSchema = zod.union([zod.literal('single'), zod.literal('multiple')]);

const SurveySchema = zod.object({
	surveyId: zod.string().uuid(),
	surveyName: zod.string(),
	surveyDescription: zod.string(),
	choicesType: ChoicesTypeSchema,
	created: zod.date(),
	endDate: zod.date(),
});

const OptionsSchema = zod.object({
	optionId: zod.string().uuid(),
	optionName: zod.string(),
	content: zod.string(),
});

const SelectSurveyParser = zod.array(
	zod.object({
		survey: SurveySchema,
		options: OptionsSchema,
	}),
);

export { SelectSurveyParser, OptionsSchema, SurveySchema };
