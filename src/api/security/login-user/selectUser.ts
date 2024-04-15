import { z as zod } from 'zod';

const SelectUserParser = zod.object({
	user_id: zod.string().uuid(),
	email: zod.string(),
	password: zod.string(),
	active: zod.boolean(),
});

type SelectUser = zod.infer<typeof SelectUserParser>;

export type { SelectUser };
export { SelectUserParser };
