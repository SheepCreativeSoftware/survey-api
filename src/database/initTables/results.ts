import { buntstift } from 'buntstift';
import type { Connection } from 'mariadb';

const createResultsTable = async (conn: Connection) => {
	try {
		await conn.query(`CREATE TABLE IF NOT EXISTS results (
			result_id VARCHAR(36) PRIMARY KEY NOT NULL DEFAULT UUID(),
			survey_id VARCHAR(36) NOT NULL,
			option_selection JSON NOT NULL,
			submited DATETIME NULL DEFAULT current_timestamp(),
			CONSTRAINT fkey_results_survey
				FOREIGN KEY (survey_id)
				REFERENCES survey(survey_id)
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
