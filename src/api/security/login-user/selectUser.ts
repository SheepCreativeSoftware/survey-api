import { z as zod } from 'zod';

const SelectUserParser = zod.object({
	// biome-ignore lint/style/useNamingConvention: Keys are defined by the database
	user_id: zod.string().uuid(),
	email: zod.string(),
	password: zod.string(),
	active: zod.number().min(0).max(1),
});

type SelectUser = zod.infer<typeof SelectUserParser>;

export type { SelectUser };
export { SelectUserParser };
