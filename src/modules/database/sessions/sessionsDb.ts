import { getConnection } from '../connectDatabase';
import { keysToCamelCase } from '../../misc/convertToCamel';
import { z as zod } from 'zod';

const removeSessionsFromDb = async (creationToken: string) => {
	const conn = await getConnection();
	await conn.query(`DELETE FROM sessions 
	WHERE survey_id = (SELECT survey_id FROM survey
	WHERE creation_token = ?)`, [creationToken]);
};

const storeSurveyAnswerToDb = async ({ optionSelection, sessionId }: {
	optionSelection: string[],
	sessionId: number,
}) => {
	const conn = await getConnection();
	await conn.query(`INSERT INTO sessions
	(survey_id, option_selection)
	VALUES (?, ?)`, [
		sessionId,
		optionSelection,
	]);
};

const getSessionResults = zod.array(zod.object({
	optionSelection: zod.string(),
	surveyId: zod.array(zod.string()),
}));

const getSessionFromDb = async (creationToken: string) => {
	const conn = await getConnection();
	const response = await conn.query(`SELECT survey_id, option_selection FROM sessions
	WHERE survey_id = (SELECT survey_id FROM survey
		WHERE creation_token = ?)`, [creationToken]);

	const converted = keysToCamelCase(response);
	const result = getSessionResults.parse(converted);
	return result;
};

export { getSessionFromDb, removeSessionsFromDb, storeSurveyAnswerToDb };
