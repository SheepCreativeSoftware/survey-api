import { z as zod } from 'zod';
import { ChoicesTypeSchema } from '../../survey-list/SurveySchema';

const SelectSurveyParser = zod.array(
	zod.object({
		choicesType: ChoicesTypeSchema,
	}),
);

export { SelectSurveyParser };
