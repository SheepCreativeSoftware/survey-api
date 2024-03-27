import { getConnection } from '../src/database/connectDatabase';
import { initDatabase } from '../src/database/initDefaultDatabase';

beforeAll(async () => {
	await initDatabase();
});

test('Database survey should now have a certain structure', async () => {
	const conn = await getConnection();
	const colums = await conn.query('SHOW COLUMNS FROM survey');

	const expected =  [
		{
			Default: null,
			Extra: 'auto_increment',
			Field: 'survey_id',
			Key: 'PRI',
			Null: 'NO',
			Type: 'int(11)',
		},
		{
			Default: null,
			Extra: '',
			Field: 'survey_name',
			Key: '',
			Null: 'NO',
			Type: 'tinytext',
		},
		{
			Default: null,
			Extra: '',
			Field: 'survey_description',
			Key: '',
			Null: 'NO',
			Type: 'text',
		},
		{
			Default: null,
			Extra: '',
			Field: 'choices_type',
			Key: '',
			Null: 'NO',
			Type: 'tinytext',
		},
		{
			Default: null,
			Extra: '',
			Field: 'creator_name',
			Key: '',
			Null: 'NO',
			Type: 'tinytext',
		},
		{
			Default: 'current_timestamp()',
			Extra: '',
			Field: 'created',
			Key: '',
			Null: 'YES',
			Type: 'datetime',
		},
		{
			Default: null,
			Extra: '',
			Field: 'end_date',
			Key: '',
			Null: 'NO',
			Type: 'datetime',
		},
		{
			Default: null,
			Extra: '',
			Field: 'creation_token',
			Key: 'UNI',
			Null: 'NO',
			Type: 'tinytext',
		},
		{
			Default: null,
			Extra: '',
			Field: 'public_token',
			Key: 'UNI',
			Null: 'NO',
			Type: 'tinytext',
		},
	];
	expect(colums).toStrictEqual(expected);
});

test('Database sessions should now have a certain structure', async () => {
	const conn = await getConnection();
	const colums = await conn.query('SHOW COLUMNS FROM sessions');

	const expected = [
		{
			Default: null,
			Extra: '',
			Field: 'survey_id',
			Key: 'MUL',
			Null: 'NO',
			Type: 'int(11)',
		},
		{
			Default: 'uuid()',
			Extra: '',
			Field: 'session_id',
			Key: '',
			Null: 'NO',
			Type: 'varchar(36)',
		},
		{
			Default: null,
			Extra: '',
			Field: 'option_selection',
			Key: '',
			Null: 'NO',
			Type: 'longtext',
		},
		{
			Default: 'current_timestamp()',
			Extra: '',
			Field: 'submited',
			Key: '',
			Null: 'YES',
			Type: 'datetime',
		},
	];
	expect(colums).toStrictEqual(expected);
});

test('Database options should now have a certain structure', async () => {
	const conn = await getConnection();
	const colums = await conn.query('SHOW COLUMNS FROM options');

	const expected = [
		{
			Default: null,
			Extra: '',
			Field: 'survey_id',
			Key: 'MUL',
			Null: 'NO',
			Type: 'int(11)',
		},
		{
			Default: 'uuid()',
			Extra: '',
			Field: 'option_id',
			Key: '',
			Null: 'NO',
			Type: 'varchar(36)',
		},
		{
			Default: null,
			Extra: '',
			Field: 'option_name',
			Key: '',
			Null: 'NO',
			Type: 'tinytext',
		},
		{
			Default: null,
			Extra: '',
			Field: 'content',
			Key: '',
			Null: 'NO',
			Type: 'text',
		},
	];
	expect(colums).toStrictEqual(expected);
});

test('Database connection should fail!', async () => {
	const conn = await getConnection();
	await conn.end();
	process.env.DATABASE_PASSWORD = 'WrongPassword!';
	try {
		await initDatabase();
		expect('Should fail').toBe('Has not failed');
	} catch (error) {
		expect(error).toBeDefined();
	}
});
