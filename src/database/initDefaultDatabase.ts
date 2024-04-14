import { buntstift } from 'buntstift';
import { connectDb } from './connectDatabase';
import { createUsersTable } from './initTables/users';
import { createSurveyTable } from './initTables/survey';
import { createOptionsTable } from './initTables/options';
import { createResultsTable } from './initTables/results';

const initDatabase = async () => {
	buntstift.info('Initialize DB');
	const conn = await connectDb({
		database: process.env.DATABASE_NAME,
		host: process.env.DATABASE_HOST,
		password: process.env.DATABASE_PASSWORD,
		port: Number(process.env.DATABASE_PORT),
		user: process.env.DATABASE_USER,
	});

	await createUsersTable(conn);
	await createSurveyTable(conn);
	await createOptionsTable(conn);
	await createResultsTable(conn);

	await conn.end();
};

export { initDatabase };
