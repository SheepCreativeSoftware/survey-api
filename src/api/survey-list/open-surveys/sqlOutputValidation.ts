import { z as zod } from 'zod';
import { SurveySchema, OptionSchema } from '../SurveySchema';

const SelectSurveyParser = zod.array(
	zod.object({
		survey: SurveySchema.omit({ completed: true }),
		options: OptionSchema,
	}),
);

export { SelectSurveyParser };
