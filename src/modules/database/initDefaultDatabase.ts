import { buntstift } from 'buntstift';
import { connectDb } from './connectDatabase';

const initDatabase = async function() {
	buntstift.info('Initialize DB');
	const conn = await connectDb({

		database: process.env.DATABASE_NAME,
		host: process.env.DATABASE_HOST,
		password: process.env.DATABASE_PASSWORD,
		port: Number(process.env.DATABASE_PORT),
		user: process.env.DATABASE_USER,
	});

	try {
		await conn.query(`CREATE TABLE IF NOT EXISTS survey (
			survey_id INT NOT NULL primary key AUTO_INCREMENT,
			survey_name TINYTEXT NOT NULL,
			survey_description TEXT NOT NULL,
			creator_name TINYTEXT NOT NULL,
			created DATETIME NULL DEFAULT current_timestamp(),
			end_date DATETIME NOT NULL,
			creation_token TINYTEXT NOT NULL,
			public_token TINYTEXT NOT NULL
		)`);
		buntstift.success('Created survey table in DB');
	} catch (error) {
		buntstift.error('Failed to create survey table in DB');
		if(error instanceof Error) buntstift.error(error.message);
	}

	try {
		await conn.query(`CREATE TABLE IF NOT EXISTS options (
			survey_id INT NOT NULL,
			option_id VARCHAR(36) NOT NULL DEFAULT UUID(),
			option_name TINYTEXT NOT NULL,
			content TEXT NOT NULL
		)`);
		buntstift.success('Created options data table in DB');
	} catch (error) {
		buntstift.error('Failed to create options data table in DB');
		if(error instanceof Error) buntstift.error(error.message);
	}

	try {
		await conn.query(`CREATE TABLE IF NOT EXISTS sessions (
			survey_id INT NOT NULL,
			session_id VARCHAR(36) NOT NULL DEFAULT UUID(),
			option_id_selected VARCHAR(36) NOT NULL,
			ip_address TINYTEXT NOT NULL,
			submited DATETIME NULL DEFAULT current_timestamp()
		)`);
		buntstift.success('Created sessions data table in DB');
	} catch (error) {
		buntstift.error('Failed to create sessions data table in DB');
		if(error instanceof Error) buntstift.error(error.message);
	}

	await conn.end();
};

export { initDatabase };
