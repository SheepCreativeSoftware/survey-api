import { buntstift } from 'buntstift';
import type { Connection } from 'mariadb';

const createUsersTable = async (conn: Connection) => {
	try {
		await conn.query(`CREATE TABLE IF NOT EXISTS users (
			user_id VARCHAR(36) NOT NULL DEFAULT UUID(),
			first_name VARCHAR(50) NOT NULL,
			last_name VARCHAR(50) NOT NULL,
			email VARCHAR(50) NOT NULL UNIQUE,
			password VARCHAR(200) NOT NULL,
			active BOOLEAN DEFAULT false NOT NULL,
			PRIMARY KEY (user_id)
		)`);
		buntstift.success('Created user table in DB');
	} catch (error) {
		buntstift.error('Failed to create user table in DB');
		if (error instanceof Error) {
			buntstift.error(error.message);
		}
	}
};

export { createUsersTable };
