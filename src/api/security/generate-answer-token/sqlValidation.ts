import { z as zod } from 'zod';

const SelectSurveyParser = zod.array(
	zod.object({
		surveyId: zod.string().uuid(),
		endDate: zod.date(),
	}),
);

export { SelectSurveyParser };
