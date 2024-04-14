import { z as zod } from 'zod';

const RequestBodyParser = zod.object({
	firstName: zod.string().min(1).max(50),
	lastName: zod.string().min(1).max(50),
	email: zod.string().max(50).email(),
	password: zod.string().min(8).max(50),
});

export { RequestBodyParser };
