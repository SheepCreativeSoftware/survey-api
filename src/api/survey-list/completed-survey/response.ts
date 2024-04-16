import { z as zod } from 'zod';
import { OptionsSchema, SurveySchema } from './sqlOutputValidation';

const ResponseBodyParser = zod.array(
	SurveySchema.extend({
		options: zod.array(OptionsSchema),
	}),
);

type ResponseBody = zod.infer<typeof ResponseBodyParser>;

export type { ResponseBody };
export { ResponseBodyParser };
