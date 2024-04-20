import { z as zod } from 'zod';

const OptionSchema = zod.object({
	optionId: zod.string().uuid(),
});

const RequestBodyParser = zod.union([zod.array(OptionSchema), OptionSchema]);

type RequestBody = zod.infer<typeof RequestBodyParser>;

export type { RequestBody };
export { RequestBodyParser };
