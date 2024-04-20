import { z as zod } from 'zod';
import { OptionSchema, SurveySchema } from '../../survey-list/SurveySchema';

const SelectSurveyParser = zod.array(
	zod.object({
		survey: SurveySchema.omit({ completed: true }),
		options: OptionSchema,
	}),
);

export { SelectSurveyParser };
