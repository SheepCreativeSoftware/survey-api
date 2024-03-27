import crypto from 'node:crypto';
import { keysToCamelCase } from '../../modules/misc/convertToCamel';
import { checkOptionsObject } from '../../modules/protection/zodRules';
import { getConnection } from '../connectDatabase';
import { getSurveyIdFromDb } from '../survey/surveyDb';

/** Adds a new option to the survey into the DB */
const addOptionToDb = async (creationToken: string, optionName: string, content: string) => {
	const conn = await getConnection();
	const optionId = crypto.randomUUID();
	const surveyId = await getSurveyIdFromDb({ creationToken });
	await conn.query(
		`INSERT INTO options
	(survey_id, option_name, content, option_id)
	VALUES (?, ?, ?, ?)`,
		[surveyId, optionName, content, optionId],
	);

	return optionId;
};

/** Updates a option to the survey into the DB */
const updateOptionToDb = async (
	creationToken: string,
	optionId: string,
	optionName: string,
	content: string,
) => {
	const conn = await getConnection();
	const surveyId = await getSurveyIdFromDb({ creationToken });
	await conn.query(
		`UPDATE options SET option_name = ?, content = ?
	WHERE survey_id=? AND option_id=?`,
		[optionName, content, surveyId, optionId],
	);
};

/** Returns all option from the survey in the DB */
const getAllOptionsFromDb = async (creationToken: string) => {
	const conn = await getConnection();
	const response = await conn.query(
		`SELECT option_id, option_name, content
	FROM options
	JOIN survey ON options.survey_id = survey.survey_id
	WHERE creation_token = ?`,
		[creationToken],
	);

	const converted = keysToCamelCase(response);
	const validated = checkOptionsObject.parse(converted);
	return validated;
};

/** Removes all options from the survey in the DB */
const removeOptionsFromDb = async (creationToken: string) => {
	const conn = await getConnection();
	await conn.query(
		`DELETE FROM options 
	WHERE survey_id = (SELECT survey_id FROM survey
	WHERE creation_token = ?)`,
		[creationToken],
	);
};

export { addOptionToDb, getAllOptionsFromDb, removeOptionsFromDb, updateOptionToDb };
