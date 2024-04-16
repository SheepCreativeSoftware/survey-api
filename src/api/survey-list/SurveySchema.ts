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

const OptionSchema = zod.object({
	optionId: zod.string().uuid(),
	optionName: zod.string(),
	content: zod.string(),
});

type SurveyChoicesType = zod.infer<typeof ChoicesTypeSchema>;
type Survey = zod.infer<typeof SurveySchema>;
type Option = zod.infer<typeof OptionSchema>;

export type { Option, Survey, SurveyChoicesType };
export { ChoicesTypeSchema, OptionSchema, SurveySchema };
