import type { SurveyCreationOptions, SurveyOptions } from '../../../domain/survey';
import { getConnection } from '../../../database/connectDatabase';
import { restoreSurvey } from '../../../domain/survey';

const updateSurvey = async (surveyData: SurveyCreationOptions, newData: SurveyOptions) => {
	const survey = restoreSurvey(surveyData);
	survey.change(newData);

	const conn = await getConnection();
	conn.query(
		`UPDATE survey
		SET survey_name = ?, survey_description = ?, choices_type = ?, end_date = ?
		WHERE survey_id = ?`,
		[
			survey.getSurveyName(),
			survey.getSurveyDescription(),
			survey.getChoicesType(),
			survey.getEndDate(),
			survey.getSurveyId(),
		],
	);
};

export { updateSurvey };
