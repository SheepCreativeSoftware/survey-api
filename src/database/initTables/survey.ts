import { buntstift } from 'buntstift';
import type { Connection } from 'mariadb';

const createSurveyTable = async (conn: Connection) => {
	try {
		await conn.query(`CREATE TABLE IF NOT EXISTS survey (
			survey_id VARCHAR(36) NOT NULL DEFAULT UUID(),
			user_id VARCHAR(36) NOT NULL,
			survey_name TINYTEXT NOT NULL,
			survey_description TEXT NOT NULL,
			choices_type TINYTEXT NOT NULL,
			created DATETIME NULL DEFAULT current_timestamp(),
			end_date DATETIME NOT NULL,
			completed BOOLEAN DEFAULT false,
			PRIMARY KEY (survey_id),
			CONSTRAINT \`fkey_survey_users\`
				FOREIGN KEY (user_id)
				REFERENCES users (user_id)
				ON DELETE CASCADE
		)`);
		buntstift.success('Created survey table in DB');
	} catch (error) {
		buntstift.error('Failed to create survey table in DB');
		if (error instanceof Error) {
			buntstift.error(error.message);
		}
	}
};

export { createSurveyTable };
