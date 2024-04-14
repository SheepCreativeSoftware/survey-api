import { buntstift } from 'buntstift';
import type { Connection } from 'mariadb';

const createOptionsTable = async (conn: Connection) => {
	try {
		await conn.query(`CREATE TABLE IF NOT EXISTS options (
			option_id INT PRIMARY KEY AUTO_INCREMENT,
			survey_id INT NOT NULL,
			option_name TINYTEXT NOT NULL,
			content TEXT NOT NULL,
			FOREIGN KEY (survey_id)
				REFERENCES survey(survey_id)
				ON DELETE CASCADE
		)`);
		buntstift.success('Created options data table in DB');
	} catch (error) {
		buntstift.error('Failed to create options data table in DB');
		if (error instanceof Error) {
			buntstift.error(error.message);
		}
	}
};

export { createOptionsTable };
