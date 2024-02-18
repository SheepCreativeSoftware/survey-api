import { getConnection } from '../connectDatabase';
import { keysToCamelCase } from '../../misc/convertToCamel';
import { z as zod } from 'zod';

const removeSessionsFromDb = async (creationToken: string) => {
	const conn = await getConnection();
	await conn.query(`DELETE FROM sessions 
	WHERE survey_id = (SELECT survey_id FROM survey
	WHERE creation_token = ?)`, [creationToken]);
};

const storeSurveyAnswerToDb = async ({ optionSelection, surveyId }: {
	optionSelection: string[],
	surveyId: number,
}) => {
	const conn = await getConnection();
	await conn.query(`INSERT INTO sessions
	(survey_id, option_selection)
	VALUES (?, ?)`, [
		surveyId,
		JSON.stringify(optionSelection),
	]);
};

const getSessionResults = zod.array(zod.object({
	optionSelection: zod.array(zod.string()),
	sessionId: zod.string(),
}));

const getSessionFromDb = async (creationToken: string) => {
	const conn = await getConnection();
	const response = await conn.query(`SELECT session_id, option_selection FROM sessions
	WHERE survey_id = (SELECT survey_id FROM survey
		WHERE creation_token = ?)`, [creationToken]);

	const converted = keysToCamelCase(response);
	const result = getSessionResults.parse(converted);
	return result;
};

export { getSessionFromDb, removeSessionsFromDb, storeSurveyAnswerToDb };
