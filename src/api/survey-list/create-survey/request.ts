import { z as zod } from 'zod';
import { OptionSchema, SurveySchema } from '../SurveySchema';

const RequestBodyParser = SurveySchema.omit({
	surveyId: true,
	created: true,
	endDate: true,
	completed: true,
}).extend({
	endDate: zod.string().datetime(),
	options: zod.array(OptionSchema.omit({ optionId: true })),
});

export { RequestBodyParser };
