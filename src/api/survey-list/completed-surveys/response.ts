import { z as zod } from 'zod';
import { OptionSchema, SurveySchema } from '../SurveySchema';

const ResponseBodyParser = zod.array(
	SurveySchema.omit({ completed: true }).extend({
		options: zod.array(OptionSchema),
	}),
);

type ResponseBody = zod.infer<typeof ResponseBodyParser>;

export type { ResponseBody };
export { ResponseBodyParser };
