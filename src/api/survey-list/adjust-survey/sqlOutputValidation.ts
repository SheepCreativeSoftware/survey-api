import { OptionSchema, SurveySchema } from '../SurveySchema';
import { z as zod } from 'zod';

const SelectSurveyParser = zod.array(
	zod.object({
		survey: SurveySchema,
		options: OptionSchema,
	}),
);

type SelectSurvey = zod.infer<typeof SelectSurveyParser>;

export type { SelectSurvey };
export { SelectSurveyParser };
