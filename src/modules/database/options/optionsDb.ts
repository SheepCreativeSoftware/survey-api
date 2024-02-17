
// eslint-disable-next-line no-shadow
import crypto from 'crypto';
import { getConnection } from '../connectDatabase';
import { getSurveyIdFromDb } from '../survey/surveyDb';
import { keysToCamelCase } from '../../misc/convertToCamel';
import { z as zod } from 'zod';

/** Adds a new option to the survey into the DB */
const addOptionToDb = async (creationToken: string, optionName: string, content: string) => {
	const conn = await getConnection();
	const optionId = crypto.randomUUID();
	const surveyId = await getSurveyIdFromDb(creationToken);
	await conn.query(`INSERT INTO options
	(survey_id, option_name, content, option_id)
	VALUES (?, ?, ?, ?)`, [
		surveyId,
		optionName,
		content,
		optionId,
	]);

	return optionId;
};

/** Updates a option to the survey into the DB */
const updateOptionToDb = async(creationToken: string, optionId: string, optionName: string, content: string) => {
	const conn = await getConnection();
	const surveyId = await getSurveyIdFromDb(creationToken);
	await conn.query(`UPDATE options SET option_name = ?, content = ?
	WHERE survey_id=? AND option_id=?`, [
		optionName,
		content,
		surveyId,
		optionId,
	]);
};

const getOption = zod.array(zod.object({
	content: zod.string(),
	optionId: zod.string().uuid(),
	optionName: zod.string(),
}));

/** Returns a option from the survey in the DB */
const getOptionFromDb = async (creationToken: string, optionId: string) => {
	const conn = await getConnection();
	const response = await conn.query(`SELECT option_id, option_name, content
	FROM options
	JOIN survey ON options.survey_id = survey.survey_id
	WHERE creation_token = ?
	AND option_id = ?`, [
		creationToken,
		optionId,
	]);

	const converted = keysToCamelCase(response);
	const validated = getOption.parse(converted);
	return validated[0];
};

/** Returns all option from the survey in the DB */
const getAllOptionFromDb = async(creationToken: string) => {
	const conn = await getConnection();
	const response = await conn.query(`SELECT option_id, option_name, content
	FROM options
	JOIN survey ON options.survey_id = survey.survey_id
	WHERE creation_token = ?`, [creationToken]);

	const converted = keysToCamelCase(response);
	const validated = getOption.parse(converted);
	return validated;
};

/** Removes all options from the survey in the DB */
const removeOptionsFromDb = async (creationToken: string) => {
	const conn = await getConnection();
	await conn.query(`DELETE FROM options 
	WHERE survey_id = (SELECT survey_id FROM survey
	WHERE creation_token = ?)`, [creationToken]);
};

/** Removes a option from the survey in the DB */
const removeOptionFromDb = async (creationToken: string, optionId: string) => {
	const conn = await getConnection();
	await conn.query(`DELETE FROM options 
	WHERE option_id = ?
	AND survey_id = (SELECT survey_id FROM survey
	WHERE creation_token = ?)`, [
		optionId,
		creationToken,
	]);
};

export {
	addOptionToDb,
	getAllOptionFromDb,
	getOptionFromDb,
	removeOptionFromDb,
	removeOptionsFromDb,
	updateOptionToDb,
};
