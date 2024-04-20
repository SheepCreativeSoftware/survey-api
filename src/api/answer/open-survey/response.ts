import { z as zod } from 'zod';
import { OptionSchema, SurveySchema } from '../../survey-list/SurveySchema';

const ResponseBodyParser = SurveySchema.omit({ completed: true }).extend({
	options: zod.array(OptionSchema),
});

type ResponseBody = zod.infer<typeof ResponseBodyParser>;

export type { ResponseBody };
export { ResponseBodyParser };
