import { z as zod } from 'zod';
import { OptionSchema, SurveySchema } from '../SurveySchema';

const SelectSurveyParser = zod.array(
	zod.object({
		survey: SurveySchema,
		options: OptionSchema,
	}),
);

export { SelectSurveyParser };
