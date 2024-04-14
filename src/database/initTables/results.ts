import { buntstift } from 'buntstift';
import type { Connection } from 'mariadb';

const createResultsTable = async (conn: Connection) => {
	try {
		await conn.query(`CREATE TABLE IF NOT EXISTS results (
			survey_id INT NOT NULL,
			result_id INT PRIMARY KEY AUTO_INCREMENT,
			option_selection JSON NOT NULL,
			submited DATETIME NULL DEFAULT current_timestamp()
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
