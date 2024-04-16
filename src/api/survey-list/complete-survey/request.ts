import { z as zod } from 'zod';

const RequestBodyParser = zod.object({
	surveyId: zod.string().uuid(),
});

export { RequestBodyParser };
