import { z as zod } from 'zod';

const ResultSchema = zod.object({
	resultCount: zod.number(),
	optionId: zod.string().uuid(),
});

const ResponseBodyParser = zod.object({
	surveyId: zod.string().uuid(),
	totalCount: zod.number(),
	results: zod.array(ResultSchema),
});

type ResponseBody = zod.infer<typeof ResponseBodyParser>;

export type { ResponseBody };
export { ResponseBodyParser };
