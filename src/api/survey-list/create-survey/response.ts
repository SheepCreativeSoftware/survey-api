import { z as zod } from 'zod';

const ResponseBodyParser = zod.object({
	surveyId: zod.string().uuid(),
	options: zod.array(zod.object({ optionId: zod.string().uuid() })),
});

type ResponseBody = zod.infer<typeof ResponseBodyParser>;

export type { ResponseBody };
export { ResponseBodyParser };
