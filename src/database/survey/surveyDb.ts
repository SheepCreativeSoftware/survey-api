import { checkAllTokens, checkSurveyIdObject, checkSurveyObject } from '../../modules/protection/zodRules';
import { getConnection } from '../connectDatabase';
import { keysToCamelCase } from '../../modules/misc/convertToCamel';

/** Adds a new survey to DB */
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

/** Updates a existing survey in DB */
const updateSurveyInDb = async ({ choicesType, creationToken, creatorName, endDate, surveyName, surveyDescription }: {
	choicesType: string,
	creationToken: string,
	creatorName: string,
	endDate: Date,
	publicToken: string,
	surveyName: string,
	surveyDescription: string,
}) => {
	const conn = await getConnection();
	await conn.query(`UPDATE survey
	SET choices_type = ?, creator_name = ?, end_date = ?, survey_name = ?, survey_description = ?
	WHERE creation_token = ?`, [
		choicesType,
		creatorName,
		endDate,
		surveyName,
		surveyDescription,
		creationToken,
	]);
};

/** Returns the ID from a exisitng survey from DB */
const getSurveyIdFromDb = async ({ publicToken, creationToken }: {
	publicToken?: string,
	creationToken?: string,
}) => {
	const conn = await getConnection();
	const response = await conn.query('SELECT survey_id FROM survey WHERE creation_token = ? OR public_token = ?', [creationToken, publicToken]);
	const converted = keysToCamelCase(response[0]);
	const { surveyId } = checkSurveyIdObject.parse(converted);
	return surveyId;
};

/** Returns either the public or creation token from a exisiting survey */
const getTokenFromDb = async ({ publicToken, creationToken }: {
	publicToken?: string,
	creationToken?: string,
}) => {
	let tokenType = '';
	let token = '';
	if(typeof publicToken === 'string') {
		tokenType = 'public_token';
		token = publicToken;
	} else if(typeof creationToken === 'string') {
		tokenType = 'creation_token';
		token = creationToken;
	} else {
		throw new Error('Missing Token');
	}

	const conn = await getConnection();
	const response = await conn.query(`SELECT creation_token, public_token FROM survey WHERE ${tokenType} = ?`, [token]);
	const converted = keysToCamelCase(response[0]);
	return checkAllTokens.parse(converted);
};

/** Returns a exisitng survey from DB */
const getSurveyFromDb = async (creationToken: string) => {
	const conn = await getConnection();
	const response = await conn.query(`SELECT survey_id, choices_type, creator_name, end_date, survey_name, survey_description
	FROM survey 
	WHERE creation_token = ?`, [creationToken]);

	const converted = keysToCamelCase(response[0]);
	return checkSurveyObject.parse(converted);
};

/** Removes a exisitng survey from DB */
const removeSurveyFromDb = async (creationToken: string) => {
	const conn = await getConnection();
	await conn.query('DELETE FROM survey WHERE creation_token=?', [creationToken]);
};

export { addSurveyToDb, getTokenFromDb, getSurveyFromDb, getSurveyIdFromDb, removeSurveyFromDb, updateSurveyInDb };
