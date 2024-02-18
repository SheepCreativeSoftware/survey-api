import { getConnection } from '../connectDatabase';
import { keysToCamelCase } from '../../misc/convertToCamel';
import { z as zod } from 'zod';

const addSurveyToDb = async ({ choicesType, creationToken, creatorName, endDate, publicToken, surveyName, surveyDescription }: {
	choicesType: string,
	creationToken: string,
	creatorName: string,
	endDate: Date,
	publicToken: string,
	surveyName: string,
	surveyDescription: string,
}) => {
	const conn = await getConnection();
	await conn.query(`INSERT INTO survey
	(choices_type, creation_token, creator_name, end_date, public_token, survey_name, survey_description)
	VALUES (?, ?, ?, ?, ?, ?, ?)`, [
		choicesType,
		creationToken,
		creatorName,
		endDate,
		publicToken,
		surveyName,
		surveyDescription,
	]);
};

const getSurveyId = zod.object({
	surveyId: zod.number(),
});

const getSurveyIdFromDb = async (creationToken: string) => {
	const conn = await getConnection();
	const response = await conn.query('SELECT survey_id FROM survey WHERE creation_token = ?', [creationToken]);
	const converted = keysToCamelCase(response[0]);
	const { surveyId } = getSurveyId.parse(converted);
	return surveyId;
};

const getCreationToken = zod.object({
	creationToken: zod.string(),
});

const getCreationTokenFromDb = async (publicToken: string) => {
	const conn = await getConnection();
	const response = await conn.query('SELECT public_token FROM survey WHERE creation_token = ?', [publicToken]);
	const converted = keysToCamelCase(response[0]);
	const { creationToken } = getCreationToken.parse(converted);
	return creationToken;
};

const getPublicToken = zod.object({
	publicToken: zod.string(),
});

const getPublicTokenFromDb = async (creationToken: string) => {
	const conn = await getConnection();
	const response = await conn.query('SELECT public_token FROM survey WHERE creation_token = ?', [creationToken]);
	const converted = keysToCamelCase(response[0]);
	const { publicToken } = getPublicToken.parse(converted);
	return publicToken;
};

const getSurveyDeatils = zod.object({
	choicesType: zod.string(),
	creatorName: zod.string(),
	endDate: zod.string(),
	surveyDescription: zod.string(),
	surveyId: zod.number(),
	surveyName: zod.string(),
});

const getSurveyFromDb = async (creationToken: string) => {
	const conn = await getConnection();
	const response = await conn.query(`SELECT survey_id, choices_type, creator_name, end_date, survey_name, survey_description
	FROM survey 
	WHERE creation_token = ?`, [creationToken]);
	const converted = keysToCamelCase(response[0]);
	return getSurveyDeatils.parse(converted);
};

const removeSurveyFromDb = async (creationToken: string) => {
	const conn = await getConnection();
	await conn.query('DELETE FROM survey WHERE creation_token=?', [creationToken]);
};

export { addSurveyToDb, getCreationTokenFromDb, getSurveyFromDb, getPublicTokenFromDb, getSurveyIdFromDb, removeSurveyFromDb };
