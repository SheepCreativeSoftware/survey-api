
// eslint-disable-next-line no-shadow
import crypto from 'crypto';
import { getConnection } from '../connectDatabase';
import { getSurveyIdFromDb } from '../survey/surveyDb';
import { keysToCamelCase } from '../../misc/convertToCamel';
import { z as zod } from 'zod';


const getOption = zod.object({
	content: zod.string(),
	optionId: zod.string().uuid(),
	optionName: zod.string(),
});

const addOptionToDb = async (creationToken: string, optionName: string, content: string) => {
	const conn = await getConnection();
	const optionId = crypto.randomUUID();
	const surveyId = getSurveyIdFromDb(creationToken);
	await conn.query(`INSERT INTO options
	(survey_id, option_name, content, option_id)
	VALUES (?, ?, ?, ?, ?, ?)`, [
		surveyId,
		optionName,
		content,
		optionId,
	]);
	return optionId;
};

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
	const converted = keysToCamelCase(response[0]);
	const validated = getOption.parse(converted);
	return validated;
};

const removeOptionsFromDb = async (creationToken: string) => {
	const conn = await getConnection();
	await conn.query(`DELETE FROM options 
	WHERE survey_id = (SELECT survey_id FROM survey
	WHERE creation_token = ?)`, [creationToken]);
};

export { addOptionToDb, getOptionFromDb, removeOptionsFromDb };
