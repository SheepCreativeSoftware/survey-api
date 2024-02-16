import { getConnection } from '../connectDatabase.mjs';


// eslint-disable-next-line id-length
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

export { addSurveyToDb };
