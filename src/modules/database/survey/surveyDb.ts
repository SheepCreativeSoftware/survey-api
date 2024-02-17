import { getConnection } from '../connectDatabase';
import { keysToCamelCase } from '../../misc/convertToCamel';
import { z as zod } from 'zod';

const addSurveyToDb = async ({ creationToken, creatorName, endDate, publicToken, surveyName, surveyDescription }: {
	creationToken: string,
	creatorName: string,
	endDate: Date,
	publicToken: string,
	surveyName: string,
	surveyDescription: string,
}) => {
	const conn = await getConnection();
	await conn.query(`INSERT INTO survey
	(creation_token, creator_name, end_date, public_token, survey_name, survey_description)
	VALUES (?, ?, ?, ?, ?, ?)`, [
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

const removeSurveyFromDb = async (creationToken: string) => {
	const conn = await getConnection();
	await conn.query('DELETE FROM survey WHERE creation_token=?', [creationToken]);
};

export { addSurveyToDb, getPublicTokenFromDb, getSurveyIdFromDb, removeSurveyFromDb };
