import { z as zod } from 'zod';

const RequestQueryParser = zod.object({
	surveyId: zod.string().uuid(),
});

export { RequestQueryParser };
