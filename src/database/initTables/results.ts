import { buntstift } from 'buntstift';
import type { Connection } from 'mariadb';

const createResultsTable = async (conn: Connection) => {
	try {
		await conn.query(`CREATE TABLE IF NOT EXISTS results (
			result_id VARCHAR(36) NOT NULL DEFAULT UUID(),
			option_id VARCHAR(36) NOT NULL,
			answerer_id VARCHAR(36) NOT NULL,
			submited DATETIME NULL DEFAULT current_timestamp(),
			UNIQUE no_duplicate (option_id, answerer_id),
			PRIMARY KEY (result_id),
			FOREIGN KEY fkey_results_survey (option_id)
				REFERENCES options(option_id)
				ON DELETE CASCADE
		)`);
		buntstift.success('Created results data table in DB');
	} catch (error) {
		buntstift.error('Failed to create results data table in DB');
		if (error instanceof Error) {
			buntstift.error(error.message);
		}
	}
};

export { createResultsTable };
