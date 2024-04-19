import { OptionSchema, SurveySchema } from '../SurveySchema';
import { z as zod } from 'zod';

const NewOptionsSchema = OptionSchema.omit({ optionId: true }).extend({
	status: zod.literal('New'),
});

const UpdateOptionsSchema = OptionSchema.partial()
	.required({ optionId: true })
	.extend({
		status: zod.literal('Update'),
	});

const DeleteOptionsSchema = OptionSchema.partial({ content: true, optionName: true }).extend({
	status: zod.literal('Delete'),
});

const OptionsUnionSchema = zod.array(
	zod.union([NewOptionsSchema, UpdateOptionsSchema, DeleteOptionsSchema]),
);

const RequestBodyParser = SurveySchema.omit({
	created: true,
	endDate: true,
	completed: true,
}).extend({
	endDate: zod.string().datetime(),
	options: OptionsUnionSchema,
});

type RequestOptions = zod.infer<typeof OptionsUnionSchema>;

export type { RequestOptions };
export { RequestBodyParser };
