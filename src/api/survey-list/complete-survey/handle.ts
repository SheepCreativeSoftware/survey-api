import type { Handler } from 'express';
import type { UUID } from 'node:crypto';
import { RequestBodyParser } from './request';
import { restoreSurvey } from '../../../domain/survey';
import { getConnection } from '../../../database/connectDatabase';
import { tinyToBoolean } from '../../../database/typecast';
import { SelectSurveyParser } from './sqlOutputValidation';
import { buntstift } from 'buntstift';
import { statusCode } from '../../../modules/misc/statusCodes';

const completeSurveyHandler = (): Handler => {
	return async (req, res, next) => {
		try {
			if (req.user?.role === 'Answerer' || typeof req.user?.userId === 'undefined') {
				throw new Error('Unauthorized', { cause: 'User is not logged in' });
			}

			const { userId } = req.user;
			const requestBody = RequestBodyParser.parse(req.body);

			const conn = await getConnection();
			const response = await conn.query(
				{
					typeCast: tinyToBoolean,
					sql: `SELECT survey.survey_id as 'surveyId', survey_name as 'surveyName',
						survey_description as 'surveyDescription', choices_type as 'choicesType',
						created, end_date as 'endDate', completed
						FROM survey
						WHERE survey_id = ?
						AND user_id = ?`,
				},
				[requestBody.surveyId, userId],
			);

			if (response.length === 0) {
				throw new Error('Not Found');
			}

			const dataFromDb = SelectSurveyParser.safeParse(response);
			if (!dataFromDb.success) {
				buntstift.error(dataFromDb.error.message);
				throw new Error('Internal Server Error');
			}

			const { data } = dataFromDb;

			const survey = restoreSurvey({
				choicesType: data[0].choicesType,
				created: data[0].created,
				endDate: data[0].endDate,
				surveyDescription: data[0].surveyDescription,
				surveyId: data[0].surveyId as UUID,
				surveyName: data[0].surveyName,
				completed: data[0].completed,
			});

			survey.setComplete();

			conn.query(
				`UPDATE survey
				SET completed = ?
				WHERE survey_id = ?`,
				[survey.isCompleted(), survey.getSurveyId()],
			);

			res.status(statusCode.okay.statusCode).send();
		} catch (error) {
			next(error);
		}
	};
};

export { completeSurveyHandler };
