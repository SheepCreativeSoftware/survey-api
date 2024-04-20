import { z as zod } from 'zod';

const SqlResponseParser = zod.array(
	zod.object({
		surveyId: zod.string().uuid(),
		resultCount: zod.bigint(),
		optionId: zod.string().uuid(),
		submited: zod.date(),
	}),
);

export { SqlResponseParser };
