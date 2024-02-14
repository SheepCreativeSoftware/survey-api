import { buntstift } from 'buntstift';
import { connectDb } from './connectDatabase.mjs';
import { randomUUID } from 'crypto';

const zero = 0;

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
		await conn.query(`CREATE TABLE IF NOT EXISTS users (
			id VARCHAR(36) NOT NULL DEFAULT UUID(),
			name TINYTEXT NOT NULL,
			email TINYTEXT NOT NULL,
			role TINYTEXT NOT NULL
		)`);
		buntstift.success('Created users table in DB');
	} catch (error) {
		buntstift.error('Failed to create users table in DB');
		if(error instanceof Error) buntstift.error(error.message);
	}

	try {
		const result = await conn.query('SELECT email FROM users WHERE email = (?)', [process.env.SMTP_ADMIN_EMAIL]);
		if(result.length === zero) {
			await conn.query('INSERT INTO users (id, name, email, role) VALUES (?, ?, ?, ?)', [
				randomUUID(),
				'Admin',
				process.env.SMTP_ADMIN_EMAIL,
				'admin',
			]);
			buntstift.success('Created Admin user in DB');
		}
	} catch (error) {
		buntstift.error('Failed to create admin user in DB');
		if(error instanceof Error) buntstift.error(error.message);
	}

	try {
		await conn.query(`CREATE TABLE IF NOT EXISTS meta (
			id VARCHAR(36) NOT NULL DEFAULT UUID(),
			page TEXT NOT NULL,
			title TEXT NULL DEFAULT NULL,
			keywords TEXT NULL DEFAULT NULL,
			description TEXT NULL DEFAULT NULL
		)`);
		buntstift.success('Created meta data table in DB');
	} catch (error) {
		buntstift.error('Failed to create meta data table in DB');
		if(error instanceof Error) buntstift.error(error.message);
	}

	try {
		await conn.query(`CREATE TABLE IF NOT EXISTS content (
			id VARCHAR(36) NOT NULL DEFAULT UUID(),
			page TEXT NOT NULL,
			type TINYTEXT NOT NULL,
			content TEXT NOT NULL,
			created DATETIME NULL DEFAULT current_timestamp(),
			updated DATETIME NULL DEFAULT NULL ON UPDATE current_timestamp()
		)`);
		buntstift.success('Created meta data table in DB');
	} catch (error) {
		buntstift.error('Failed to create meta data table in DB');
		if(error instanceof Error) buntstift.error(error.message);
	}

	await conn.end();
};

export { initDatabase };
