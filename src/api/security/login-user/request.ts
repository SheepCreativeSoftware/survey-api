import { z as zod } from 'zod';

const RequestBodyParser = zod.object({
	email: zod.string().max(50).email(),
	password: zod.string().min(8).max(50),
});

export { RequestBodyParser };
