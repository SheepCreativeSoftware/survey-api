import { getConnection } from '../connectDatabase.mjs';


// eslint-disable-next-line id-length
const addSurveyToDb = async ({ creationToken, creatorName, endDate, publicToken, surveyName }: {
	creationToken: string,
	creatorName: string,
	endDate: Date,
	publicToken: string,
	surveyName: string,
}) => {
	const conn = await getConnection();
	await conn.query(`INSERT INTO survey
	(creation_token, creator_name, end_date, public_token, survey_name)
	VALUES (?, ?, ?, ?, ?)`, [
		creationToken,
		creatorName,
		endDate,
		publicToken,
		surveyName,
	]);
};

export { addSurveyToDb };
