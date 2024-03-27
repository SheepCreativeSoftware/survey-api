import { keysToCamelCase } from '../../modules/misc/convertToCamel';
import { checkResultsObject } from '../../modules/protection/zodRules';
import { getConnection } from '../connectDatabase';

/** Removes the answers from a survey from DB */
const removeSessionsFromDb = async (creationToken: string) => {
	const conn = await getConnection();
	await conn.query(
		`DELETE FROM sessions 
	WHERE survey_id = (SELECT survey_id FROM survey
	WHERE creation_token = ?)`,
		[creationToken],
	);
};

/** Stores a answer from a survey from DB */
const storeSurveyAnswerToDb = async ({
	optionSelection,
	surveyId,
}: {
	optionSelection: string[];
	surveyId: number;
}) => {
	const conn = await getConnection();
	await conn.query(
		`INSERT INTO sessions
	(survey_id, option_selection)
	VALUES (?, ?)`,
		[surveyId, JSON.stringify(optionSelection)],
	);
};

/** Returns all answers from a survey from DB */
const getSessionFromDb = async (creationToken: string) => {
	const conn = await getConnection();
	const response = await conn.query(
		`SELECT session_id, option_selection FROM sessions
	WHERE survey_id = (SELECT survey_id FROM survey
		WHERE creation_token = ?)`,
		[creationToken],
	);

	const converted = keysToCamelCase(response);
	const result = checkResultsObject.parse(converted);
	return result;
};

export { getSessionFromDb, removeSessionsFromDb, storeSurveyAnswerToDb };
